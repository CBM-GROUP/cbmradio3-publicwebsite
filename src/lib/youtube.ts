const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export interface YouTubeMedia {
  videoId: string;
  watchUrl: string;
  embedUrl: string;
}

export function getYouTubeMedia(value: string | undefined): YouTubeMedia | null {
  const embedUrl = parseYouTubeEmbedUrl(value);
  if (!embedUrl) return null;
  const videoId = embedUrl.split("/").pop();
  if (!videoId) return null;
  return {
    videoId,
    watchUrl: "https://www.youtube.com/watch?v=" + videoId,
    embedUrl,
  };
}

export function getYouTubeEmbedUrl(value: string | undefined) {
  return getYouTubeMedia(value)?.embedUrl ?? null;
}

export function getStrictYouTubeEmbedUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "www.youtube.com" ||
      parts.length !== 2 ||
      parts[0] !== "embed" ||
      !YOUTUBE_ID_PATTERN.test(parts[1]) ||
      url.search ||
      url.hash
    ) return null;
    return `https://www.youtube.com/embed/${parts[1]}`;
  } catch {
    return null;
  }
}

function parseYouTubeEmbedUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId: string | null = null;

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else {
        const [kind, id] = url.pathname.split("/").filter(Boolean);
        if (["shorts", "live", "embed"].includes(kind)) videoId = id || null;
      }
    }

    if (!videoId || !YOUTUBE_ID_PATTERN.test(videoId)) return null;
    return "https://www.youtube.com/embed/" + videoId;
  } catch {
    return null;
  }
}
