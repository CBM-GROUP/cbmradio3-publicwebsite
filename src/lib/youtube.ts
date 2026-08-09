const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const ALLOWED_HOSTS = new Set(["youtube.com", "www.youtube.com"]);
const ALLOWED_QUERY = new Set(["start", "rel", "controls"]);

export interface YouTubeMedia {
  videoId: string;
  watchUrl: string;
  embedUrl: string;
}

export function getYouTubeMedia(value: string | undefined): YouTubeMedia | null {
  const embedUrl = getYouTubeEmbedUrl(value);
  if (!embedUrl) return null;
  const videoId = new URL(embedUrl).pathname.split("/").filter(Boolean)[1];
  return { videoId, watchUrl: `https://www.youtube.com/watch?v=${videoId}`, embedUrl };
}

export function getYouTubeEmbedUrl(value: string | undefined) {
  return getYouTubeMedia(value)?.embedUrl ?? null;
}

function parseYouTubeEmbedUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname.toLowerCase()) || url.username || url.password || url.port || url.hash) return null;
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length !== 2 || segments[0] !== "embed" || !YOUTUBE_ID_PATTERN.test(segments[1])) return null;
    const keys = [...url.searchParams.keys()];
    if (new Set(keys).size !== keys.length) return null;
    for (const [key, queryValue] of url.searchParams) {
      if (!ALLOWED_QUERY.has(key)) return null;
      if (key === "start" && !/^\d+$/.test(queryValue)) return null;
      if ((key === "rel" || key === "controls") && !["0", "1"].includes(queryValue)) return null;
    }
    const query = url.searchParams.toString();
    return `https://www.youtube.com/embed/${segments[1]}${query ? `?${query}` : ""}`;
  } catch {
    return null;
  }
}
