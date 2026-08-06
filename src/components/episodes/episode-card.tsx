import { CalendarDays, Play } from "lucide-react";
import Image from "next/image";

import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import type { EpisodeSummary } from "@/types/program";
import Logo from "../../../public/cbmradio.png";

export default function EpisodeCard({
  episode,
  featured = false,
  onPlay,
}: {
  episode: EpisodeSummary;
  featured?: boolean;
  onPlay: (episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => void;
}) {
  const media = getYouTubeMedia(
    episode.youtube_embed_url || episode.youtube_link,
  );
  const published = formatEpisodeDate(episode.publish_date);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-teal-700 hover:shadow-lg hover:shadow-teal-950/30">
      <div className="relative aspect-video bg-zinc-800">
        <Image
          src={episode.cover_image || Logo}
          alt={episode.cover_image ? episode.title : "CBM Radio"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={Boolean(episode.cover_image)}
          className="object-cover"
        />
        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-teal-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-semibold text-teal-400">{episode.program_title}</p>
        <h3 className="mt-2 text-xl font-bold text-white">{episode.title}</h3>
        {published && (
          <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
            <CalendarDays size={16} aria-hidden="true" /> {published}
          </p>
        )}
        {episode.description && (
          <p className="mt-4 line-clamp-3 leading-7 text-zinc-400">
            {episode.description}
          </p>
        )}
        {media && (
          <button
            type="button"
            onClick={(event) => onPlay(episode, media, event.currentTarget)}
            className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 pt-5 font-semibold text-teal-400 outline-none hover:text-teal-300 focus-visible:ring-2 focus-visible:ring-teal-300"
            aria-label={"Play " + episode.title}
          >
            <Play size={18} aria-hidden="true" /> Play episode
          </button>
        )}
      </div>
    </article>
  );
}

function formatEpisodeDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeZone: "Africa/Kampala",
  }).format(date);
}
