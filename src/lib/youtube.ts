const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const ALLOWED_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const ALLOWED_QUERY = new Set(["start", "rel", "controls"]);

export interface YouTubeMedia {
  videoId: string;
  watchUrl: string;
  embedUrl: string;
}

export function getYouTubeMedia(value: string | undefined): YouTubeMedia | null {
  const embedUrl = parseYouTubeEmbedUrl(value);
  if (!embedUrl) return null;
  const videoId = new URL(embedUrl).pathname.split("/").filter(Boolean)[1];
  return { videoId, watchUrl: `https://www.youtube.com/watch?v=${videoId}`, embedUrl };
}

export function getYouTubeEmbedUrl(value: string | undefined) {
  return parseYouTubeEmbedUrl(value);
}

export function getStrictYouTubeEmbedUrl(value: string | undefined) {
  return parseYouTubeEmbedUrl(value);
}

function parseYouTubeEmbedUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const trimmed = value.trim();
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    // Check youtube.com hosts
    if (ALLOWED_HOSTS.has(host)) {
      const segments = url.pathname.split("/").filter(Boolean);

      // Handle /embed/VIDEO_ID
      if (segments.length === 2 && segments[0] === "embed" && YOUTUBE_ID_PATTERN.test(segments[1])) {
        const queryParams = new URLSearchParams();
        for (const [key, queryValue] of url.searchParams) {
          if (ALLOWED_QUERY.has(key)) {
            if (key === "start" && /^\d+$/.test(queryValue)) {
              queryParams.set(key, queryValue);
            } else if ((key === "rel" || key === "controls") && ["0", "1"].includes(queryValue)) {
              queryParams.set(key, queryValue);
            }
          }
        }
        const query = queryParams.toString();
        return `https://www.youtube.com/embed/${segments[1]}${query ? `?${query}` : ""}`;
      }

      // Handle standard /watch?v=VIDEO_ID
      const videoId = url.searchParams.get("v");
      if (videoId && YOUTUBE_ID_PATTERN.test(videoId)) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Handle youtu.be shortlinks e.g. https://youtu.be/VIDEO_ID
    if (host === "youtu.be") {
      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length === 1 && YOUTUBE_ID_PATTERN.test(segments[0])) {
        return `https://www.youtube.com/embed/${segments[0]}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}
