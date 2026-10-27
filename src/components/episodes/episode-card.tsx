import { CalendarDays, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <article className="cbm-card flex h-full flex-col overflow-hidden rounded-xl border-2 border-black bg-black text-white shadow-xl transition-all duration-300 hover:scale-[1.01] hover:border-white">
      <div className="relative aspect-video bg-black">
        <Image
          src={episode.cover_image || Logo}
          alt={episode.cover_image ? episode.title : "CBM Radio"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={Boolean(episode.cover_image)}
          className="object-cover"
        />
        {featured && (
          <span className="absolute left-3 top-3 bg-[#04b093] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-black shadow-md">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-black uppercase tracking-wider text-[#04b093]">{episode.program_title}</p>
        <h3 className="mt-2 text-lg font-black uppercase text-white line-clamp-2">
          <Link href={`/episodes/${encodeURIComponent(episode.slug)}`} className="outline-none hover:text-[#04b093] focus-visible:ring-2 focus-visible:ring-[#04b093]">
            {episode.title}
          </Link>
        </h3>
        {published && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <CalendarDays size={14} aria-hidden="true" /> {published}
          </p>
        )}
        {episode.description && (
          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-300">
            {episode.description}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-end gap-x-5 gap-y-2 pt-5 border-t border-white/10">
          <Link href={`/episodes/${encodeURIComponent(episode.slug)}`} className="inline-flex min-h-9 items-center text-xs font-black uppercase tracking-wider text-[#04b093] outline-none hover:text-white">
            View episode
          </Link>
        {media && (
          <button
            type="button"
            onClick={(event) => onPlay(episode, media, event.currentTarget)}
            className="inline-flex min-h-9 w-fit items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white hover:text-[#04b093]"
            aria-label={"Play " + episode.title}
          >
            <Play size={14} className="text-[#04b093]" aria-hidden="true" /> Play episode
          </button>
        )}
        </div>
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
