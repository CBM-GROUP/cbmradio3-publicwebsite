const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function getYouTubeEmbedUrl(value: string | undefined) {
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
