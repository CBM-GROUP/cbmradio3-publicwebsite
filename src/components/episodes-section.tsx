"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Headphones,
  Play,
  Sparkles,
} from "lucide-react";

import YouTubeDialog from "@/components/media/youtube-dialog";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import homeService from "@/services/home.service";
import type { EpisodeSummary } from "@/types/program";

import DanielPortrait from "../../public/cbm_images/daniel.svg";
import ConversationArtwork from "../../public/cbm_images/cbm-conversation-radio-show.png";
import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

type RequestState = "loading" | "ready" | "error";

export default function EpisodesSection() {
  const [featured, setFeatured] = useState<EpisodeSummary[]>([]);
  const [latest, setLatest] = useState<EpisodeSummary[]>([]);
  const [featuredState, setFeaturedState] = useState<RequestState>("loading");
  const [latestState, setLatestState] = useState<RequestState>("loading");
  const [activeTab, setActiveTab] = useState<"featured" | "latest">("featured");

  const [activePlayer, setActivePlayer] = useState<{
    episode: EpisodeSummary;
    media: YouTubeMedia;
    trigger: HTMLButtonElement;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    homeService
      .getFeaturedEpisodes()
      .then((items) => {
        if (!isMounted) return;
        setFeatured(items);
        setFeaturedState("ready");
      })
      .catch(() => {
        if (isMounted) setFeaturedState("error");
      });

    homeService
      .getLatestEpisodes()
      .then((items) => {
        if (!isMounted) return;
        setLatest(items);
        setLatestState("ready");
      })
      .catch(() => {
        if (isMounted) setLatestState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeEpisodes = activeTab === "featured" ? featured : latest;
  // If active tab list is empty, fallback to the other
  const displayEpisodes =
    activeEpisodes.length > 0 ? activeEpisodes : featured.length > 0 ? featured : latest;

  const spotlight = displayEpisodes[0];
  const gridEpisodes = displayEpisodes.slice(1, 5);

  const hasEpisodes = Boolean(spotlight || gridEpisodes.length);
  const isLoading = (featuredState === "loading" && latestState === "loading") && !hasEpisodes;

  return (
    <section
      id="episodes"
      className="relative scroll-mt-20 border-b border-white/10 bg-[#060a08] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              <Headphones size={14} />
              <span>On-Demand Series</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Featured Episodes & Podcasts
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Listen to the discussions shaping our community, available anytime on-demand.
            </p>
          </div>

          {/* Tab Switcher & Full Catalog Link */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab("featured")}
                className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === "featured"
                    ? "bg-[#00d4a5] text-[#062521] shadow-[0_2px_12px_rgba(0,212,165,0.3)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Featured
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("latest")}
                className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === "latest"
                    ? "bg-[#00d4a5] text-[#062521] shadow-[0_2px_12px_rgba(0,212,165,0.3)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Latest Drops
              </button>
            </div>

            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 py-2 text-xs font-black uppercase tracking-wider text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521]"
            >
              <span>All Episodes</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div
            className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-20 text-center text-zinc-400"
            aria-live="polite"
          >
            <p className="text-sm font-semibold">Loading episodes from CBM studio...</p>
          </div>
        )}

        {/* Fallback Display if no episodes available */}
        {!hasEpisodes && !isLoading && (
          <article className="cbm-card grid overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#0d1614] to-[#070b09] sm:grid-cols-[0.9fr_1.1fr] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="relative min-h-64 sm:min-h-80">
              <Image
                src={ConversationArtwork}
                alt="My Life, My Purpose episode spotlight"
                fill
                sizes="(max-width: 640px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00d4a5]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                <Sparkles size={13} /> PODCAST SPOTLIGHT
              </span>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                My Life, My Purpose
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-300">
                Join our host for authentic conversations on purpose, calling, life milestones, and the stories that unite us all.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/episodes"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]"
                >
                  <span>Explore Episodes</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  href="/programs"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                >
                  <span>Our Shows</span>
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* Content Layout: Spotlight + Grid */}
        {hasEpisodes && (
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Left / Spotlight Episode (Large high-impact card) */}
            {spotlight && (
              <div className="lg:col-span-7">
                <SpotlightEpisodeCard
                  episode={spotlight}
                  onPlay={(ep, media, trigger) => setActivePlayer({ episode: ep, media, trigger })}
                />
              </div>
            )}

            {/* Right / Recent Drops Column */}
            <div className={spotlight ? "lg:col-span-5 flex flex-col justify-between gap-4" : "lg:col-span-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
              <div className="rounded-2xl border border-white/10 bg-[#09120f]/80 p-5 sm:p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-[#00d4a5]">
                    {activeTab === "featured" ? "More Featured" : "Recent Drops"}
                  </span>
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-zinc-400">
                    On-Demand
                  </span>
                </div>

                {gridEpisodes.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {gridEpisodes.map((episode) => (
                      <EpisodeRow
                        key={episode.id}
                        episode={episode}
                        onPlay={(ep, media, trigger) =>
                          setActivePlayer({ episode: ep, media, trigger })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-zinc-400">
                    <p>More episodes are being uploaded from the studio.</p>
                    <Link
                      href="/episodes"
                      className="mt-3 inline-flex items-center gap-1 font-bold text-[#00d4a5] hover:underline"
                    >
                      Browse full library <ArrowUpRight size={13} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0b1612] to-[#070c0a] p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Full Podcast Catalog</h4>
                  <p className="text-xs text-zinc-400">Explore complete archives by show and date.</p>
                </div>
                <Link
                  href="/episodes"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#00d4a5] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]"
                >
                  <span>View All</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Embedded Video Dialog Player */}
      {activePlayer && (
        <YouTubeDialog
          title={activePlayer.episode.title}
          media={activePlayer.media}
          returnFocus={activePlayer.trigger}
          onClose={() => setActivePlayer(null)}
        />
      )}
    </section>
  );
}

function SpotlightEpisodeCard({
  episode,
  onPlay,
}: {
  episode: EpisodeSummary;
  onPlay: (episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => void;
}) {
  const media = getYouTubeMedia(episode.youtube_embed_url || episode.youtube_link);
  const published = formatEpisodeDate(episode.publish_date);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1c17] to-[#070e0b] shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-[#00d4a5]/40">
      
      {/* Media Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/60">
        <Image
          src={
            episode.cover_image ||
            episode.external_cover_image_url ||
            StudioImage
          }
          alt={episode.title}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          unoptimized={Boolean(episode.cover_image)}
          className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-[#00d4a5] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#062521] shadow-md">
            Spotlight
          </span>
          {episode.program_title && (
            <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              {episode.program_title}
            </span>
          )}
        </div>

        {/* Center Play Button Overlay */}
        {media && (
          <button
            type="button"
            onClick={(e) => onPlay(episode, media, e.currentTarget)}
            aria-label={`Play ${episode.title}`}
            className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-[#00d4a5] text-[#062521] shadow-[0_0_25px_rgba(0,212,165,0.6)] transition-all duration-300 hover:scale-110 hover:bg-[#34e2b8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4a5]"
          >
            <Play size={24} className="ml-1 fill-[#062521]" />
          </button>
        )}
      </div>

      {/* Episode Details */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          {published && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
              <CalendarDays size={13} className="text-[#00d4a5]" />
              <span>{published}</span>
            </p>
          )}

          <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl leading-snug group-hover:text-[#00d4a5] transition-colors">
            <Link href={`/episodes/${encodeURIComponent(episode.slug)}`}>
              {episode.title}
            </Link>
          </h3>

          {episode.description && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-300 line-clamp-3">
              {episode.description}
            </p>
          )}
        </div>

        {/* Action Row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
          {media ? (
            <button
              type="button"
              onClick={(e) => onPlay(episode, media, e.currentTarget)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]"
            >
              <Play size={14} className="fill-[#062521]" />
              <span>Play Episode</span>
            </button>
          ) : (
            <Link
              href={`/episodes/${encodeURIComponent(episode.slug)}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]"
            >
              <Headphones size={14} />
              <span>Listen Now</span>
            </Link>
          )}

          <Link
            href={`/episodes/${encodeURIComponent(episode.slug)}`}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white/80 hover:text-[#00d4a5] transition-colors"
          >
            <span>Episode Details & Discussion</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

    </article>
  );
}

function EpisodeRow({
  episode,
  onPlay,
}: {
  episode: EpisodeSummary;
  onPlay: (episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => void;
}) {
  const media = getYouTubeMedia(episode.youtube_embed_url || episode.youtube_link);
  const published = formatEpisodeDate(episode.publish_date);

  return (
    <article className="group flex items-center justify-between gap-4 py-4 transition-colors">
      <div className="flex items-center gap-3.5 min-w-0">
        
        {/* Thumbnail with quick play button */}
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-black/40 border border-white/10">
          <Image
            src={
              episode.cover_image ||
              episode.external_cover_image_url ||
              DanielPortrait
            }
            alt={episode.title}
            fill
            sizes="64px"
            unoptimized={Boolean(episode.cover_image)}
            className="object-cover"
          />
          {media && (
            <button
              type="button"
              onClick={(e) => onPlay(episode, media, e.currentTarget)}
              aria-label={`Play ${episode.title}`}
              className="absolute inset-0 m-auto grid size-8 place-items-center rounded-full bg-[#00d4a5]/90 text-[#062521] opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Play size={13} className="ml-0.5 fill-[#062521]" />
            </button>
          )}
        </div>

        {/* Text information */}
        <div className="min-w-0">
          <p className="text-[0.68rem] font-black uppercase tracking-wider text-[#00d4a5] truncate">
            {episode.program_title}
          </p>
          <h4 className="mt-0.5 text-sm font-black text-white line-clamp-1 group-hover:text-[#00d4a5] transition-colors">
            <Link href={`/episodes/${encodeURIComponent(episode.slug)}`}>
              {episode.title}
            </Link>
          </h4>
          {published && (
            <p className="mt-1 text-[0.7rem] text-zinc-400">
              {published}
            </p>
          )}
        </div>
      </div>

      {/* Quick Play Trigger or Link */}
      <div className="shrink-0">
        {media ? (
          <button
            type="button"
            onClick={(e) => onPlay(episode, media, e.currentTarget)}
            aria-label={`Play ${episode.title}`}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-[#00d4a5] transition-all hover:scale-105 hover:border-[#00d4a5] hover:bg-[#00d4a5] hover:text-[#062521]"
          >
            <Play size={14} className="ml-0.5 fill-current" />
          </button>
        ) : (
          <Link
            href={`/episodes/${encodeURIComponent(episode.slug)}`}
            aria-label={`View ${episode.title}`}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:scale-105 hover:border-[#00d4a5] hover:text-[#00d4a5]"
          >
            <ArrowUpRight size={15} />
          </Link>
        )}
      </div>
    </article>
  );
}

function formatEpisodeDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-UG", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Africa/Kampala",
      }).format(date);
}
