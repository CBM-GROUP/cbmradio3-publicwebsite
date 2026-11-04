"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Copy,
  Headphones,
  Mic2,
  Pause,
  Play,
  Radio,
  Share2,
  Tv,
} from "lucide-react";
import { FaFacebook, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import type { EpisodeDetail, EpisodeSummary } from "@/types/program";
import Logo from "../../../public/cbmradio.png";

interface EpisodeActionToolbarProps {
  episode: EpisodeDetail;
  hasVideo: boolean;
}

export function EpisodeActionToolbar({ episode, hasVideo }: EpisodeActionToolbarProps) {
  const { currentEpisode, isPlaying, playEpisode, togglePlay } = useEpisodePlayerStore();
  const [copied, setCopied] = useState(false);

  const isCurrentPlaying = currentEpisode?.id === episode.id && isPlaying;

  // Convert EpisodeDetail to EpisodeSummary for the player store
  const episodeSummary: EpisodeSummary = {
    id: episode.id,
    slug: episode.slug,
    program_id: episode.program?.id ?? 0,
    program_title: episode.program?.title ?? "",
    title: episode.title,
    description: episode.description,
    cover_image: episode.cover_image,
    external_cover_image_url: episode.external_cover_image_url || "",
    youtube_link: episode.youtube_link,
    youtube_embed_url: episode.youtube_embed_url,
    publish_date: episode.publish_date,
    is_featured: episode.is_featured,
    featured_order: episode.featured_order,
    is_active: episode.is_active,
  };

  const handlePlayToggle = () => {
    if (currentEpisode?.id === episode.id) {
      togglePlay();
    } else {
      playEpisode(episodeSummary);
    }
  };

  const handleScrollToVideo = () => {
    const el = document.getElementById("episode-video-stage");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://cbmradio.com/episodes/${episode.slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => undefined);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`group inline-flex items-center gap-2.5 rounded-xl border-2 border-black px-6 py-3.5 text-xs font-black uppercase tracking-wider shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] ${
            isCurrentPlaying
              ? "bg-white text-black"
              : "bg-[#04b093] text-black hover:bg-emerald-400"
          }`}
          aria-label={isCurrentPlaying ? "Pause episode" : "Play episode in dock player"}
        >
          {isCurrentPlaying ? (
            <>
              <Pause className="h-4 w-4 fill-black" />
              <span>Playing in Dock</span>
              <span className="flex h-2.5 w-2.5 items-center justify-center">
                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-red-600" />
              </span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-black" />
              <span>Listen to Broadcast</span>
            </>
          )}
        </button>

        {hasVideo && (
          <button
            type="button"
            onClick={handleScrollToVideo}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-100 shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:border-[#04b093] hover:text-[#04b093] hover:shadow-[2px_2px_0_0_#000]"
          >
            <Tv className="h-4 w-4 text-[#04b093]" />
            <span>Watch Video</span>
          </button>
        )}
      </div>

      {/* Social Sharing Strip */}
      <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800/80 pt-4">
        <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-400">
          <Share2 className="h-3.5 w-3.5 text-[#04b093]" />
          Share:
        </span>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Listen to "${episode.title}" on CBM Radio: ${currentUrl}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 transition-colors hover:bg-emerald-500/20"
          title="Share via WhatsApp"
        >
          <FaWhatsapp className="h-3.5 w-3.5" />
          <span>WhatsApp</span>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Listen to "${episode.title}" from ${episode.program?.title || "CBM Radio"}`
          )}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:bg-zinc-800"
          title="Share on X"
        >
          <FaXTwitter className="h-3.5 w-3.5" />
          <span>Post</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#04b093]/40 bg-[#04b093]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#04b093] transition-colors hover:bg-[#04b093]/20"
          title="Share on Facebook"
        >
          <FaFacebook className="h-3.5 w-3.5" />
          <span>Share</span>
        </a>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:bg-zinc-800"
          title="Copy direct episode link"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function RelatedEpisodeCard({ episode }: { episode: EpisodeSummary }) {
  const { currentEpisode, isPlaying, playEpisode, togglePlay } = useEpisodePlayerStore();
  const isCurrentPlaying = currentEpisode?.id === episode.id && isPlaying;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentEpisode?.id === episode.id) {
      togglePlay();
    } else {
      playEpisode(episode);
    }
  };

  const published = formatEpisodeDate(episode.publish_date);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
      {/* Thumbnail Stage */}
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        <Image
          src={episode.cover_image || Logo}
          alt={episode.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
          unoptimized={Boolean(episode.cover_image)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Program Badge */}
        <span className="absolute left-3 top-3 border border-black/40 bg-[#04b093] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
          {episode.program_title}
        </span>

        {/* Play Overlay Button */}
        <button
          type="button"
          onClick={handlePlayToggle}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#04b093] text-black shadow-lg transition-transform hover:scale-110 active:scale-95"
          aria-label={isCurrentPlaying ? "Pause" : "Play episode"}
        >
          {isCurrentPlaying ? (
            <Pause className="h-4 w-4 fill-black" />
          ) : (
            <Play className="h-4 w-4 fill-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h4 className="text-base font-black uppercase text-white line-clamp-2 group-hover:text-[#04b093] transition-colors">
          <Link href={`/episodes/${encodeURIComponent(episode.slug)}`}>
            {episode.title}
          </Link>
        </h4>

        {published && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
            <CalendarDays className="h-3.5 w-3.5 text-[#04b093]" />
            <span>{published}</span>
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800">
          <Link
            href={`/episodes/${encodeURIComponent(episode.slug)}`}
            className="text-xs font-black uppercase tracking-wider text-[#04b093] hover:text-white transition-colors"
          >
            Show Details &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

function formatEpisodeDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-UG", { dateStyle: "medium", timeZone: "Africa/Kampala" }).format(date);
}
