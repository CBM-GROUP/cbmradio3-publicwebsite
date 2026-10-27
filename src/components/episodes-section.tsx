"use client";

import { ArrowUpRight, CalendarDays, Headphones, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import homeService from "@/services/home.service";
import YouTubeDialog from "@/components/media/youtube-dialog";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import type { EpisodeSummary } from "@/types/program";
import DanielPortrait from "../../public/cbm_images/daniel.svg";
import ConversationArtwork from "../../public/cbm_images/cbm-conversation-radio-show.png";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";
import InnocentPortrait from "../../public/cbm_images/innocent2.svg";

const episodeArtwork = [
  DanielPortrait,
  BrianPortrait,
  SamuelPortrait,
  InnocentPortrait,
];

const LATEST_EPISODE_LIMIT = 5;
type RequestState = "loading" | "ready" | "error";

export default function EpisodesSection() {
  const [featured, setFeatured] = useState<EpisodeSummary[]>([]);
  const [latest, setLatest] = useState<EpisodeSummary[]>([]);
  const [featuredState, setFeaturedState] = useState<RequestState>("loading");
  const [latestState, setLatestState] = useState<RequestState>("loading");
  const [activePlayer, setActivePlayer] = useState<{
    episode: EpisodeSummary;
    media: YouTubeMedia;
    trigger: HTMLButtonElement;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    homeService.getFeaturedEpisodes().then((items) => {
      if (!isMounted) return;
      setFeatured(items);
      setFeaturedState("ready");
    }).catch(() => {
      if (isMounted) setFeaturedState("error");
    });

    homeService.getLatestEpisodes().then((items) => {
      if (!isMounted) return;
      setLatest(items);
      setLatestState("ready");
    }).catch(() => {
      if (isMounted) setLatestState("error");
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const spotlight = featured[0] ?? latest[0];
  const recentEpisodes = latest
    .filter((episode) => episode.id !== spotlight?.id)
    .slice(0, LATEST_EPISODE_LIMIT);
  const hasEpisodes = Boolean(spotlight || recentEpisodes.length);
  const allEmpty = featuredState === "ready" && latestState === "ready" && !hasEpisodes;
  const allFailed = featuredState === "error" && latestState === "error";

  return (
    <section className="relative border-y border-white/10 bg-[#060a08] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              <Headphones size={14} />
              <span>On-Demand Audio & Video</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Podcasts & Conversations
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Listen to the discussions shaping our community, available anytime on-demand.
            </p>
          </div>
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521] w-fit"
          >
            <span>Explore All Episodes</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {(featuredState === "loading" || latestState === "loading") && !hasEpisodes && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-16 text-center text-zinc-400" aria-live="polite">
            Loading episodes...
          </div>
        )}

        {!hasEpisodes && featuredState !== "loading" && latestState !== "loading" && (
          <article className="cbm-card grid overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-[#0d1614] to-[#070b09] sm:grid-cols-[0.9fr_1.1fr] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="relative min-h-56 sm:min-h-72">
              <Image
                src={ConversationArtwork}
                alt="Radio show microphone and On Air radio talk show artwork"
                fill
                sizes="(max-width: 640px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00d4a5]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                PODCAST SPOTLIGHT
              </span>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">My Life, My Purpose</h3>
              <p className="mt-3 max-w-lg leading-relaxed text-zinc-300">
                Join Jerry Keyz and Kalinzi Louis for conversations about purpose, life, and the experiences we share.
              </p>
              <Link href="/programs" className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]">
                Explore The Show <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              {(allFailed || allEmpty) && (
                <p className="mt-3 text-xs text-white/40">
                  {allFailed ? "Episode listings are temporarily unavailable." : "More episode stories are on the way."}
                </p>
              )}
            </div>
          </article>
        )}

        {hasEpisodes && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {spotlight && (
              <SpotlightEpisode
                episode={spotlight}
                onPlay={(episode, media, trigger) =>
                  setActivePlayer({ episode, media, trigger })
                }
              />
            )}

            <section
              aria-labelledby="latest-episodes-heading"
              className="rounded-2xl border border-white/10 bg-[#09120f]/80 p-5 sm:p-7 shadow-xl backdrop-blur-md"
            >
              <div className="mb-5 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                    Recent Drops
                  </p>
                  <h3 id="latest-episodes-heading" className="mt-1 text-xl font-black text-white">
                    Latest Releases
                  </h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Newest First
                </span>
              </div>

              {recentEpisodes.length > 0 ? (
                <ol className="divide-y divide-white/5">
                  {recentEpisodes.map((episode, index) => (
                    <LatestEpisodeRow
                      key={episode.id}
                      episode={episode}
                      rank={index + 1}
                      onPlay={(selectedEpisode, media, trigger) =>
                        setActivePlayer({
                          episode: selectedEpisode,
                          media,
                          trigger,
                        })
                      }
                    />
                  ))}
                </ol>
              ) : latestState === "error" ? (
                <p className="py-8 text-center text-sm text-zinc-400">
                  Latest episodes are temporarily unavailable.
                </p>
              ) : latestState === "loading" ? (
                <p className="py-8 text-center text-sm text-zinc-400" aria-live="polite">
                  Loading latest episodes...
                </p>
              ) : (
                <p className="py-8 text-center text-sm text-zinc-400">
                  More episodes are on the way.
                </p>
              )}
            </section>
          </div>
        )}
      </div>

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

function SpotlightEpisode({
  episode,
  onPlay,
}: {
  episode: EpisodeSummary;
  onPlay: (episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => void;
}) {
  const media = getYouTubeMedia(episode.youtube_embed_url || episode.youtube_link);

  return (
    <article className="group relative flex min-h-[27rem] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#0c1814] to-[#070e0b] shadow-[0_20px_50px_rgba(0,212,165,0.12)] sm:min-h-[34rem] transition-all duration-300 hover:border-[#00d4a5]/40 hover:-translate-y-1">
      <Image
        src={episode.cover_image || DanielPortrait}
        alt={episode.cover_image ? episode.title : "CBM Radio"}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        unoptimized={Boolean(episode.cover_image)}
        className="object-cover transition duration-700 group-hover:scale-105"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
      <div className="relative mt-auto w-full p-6 sm:p-9">
        <span className="inline-flex rounded-full bg-[#00d4a5] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#062521] shadow-md">
          Featured Episode
        </span>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#00d4a5]">
          {episode.program_title}
        </p>
        <h3 className="mt-2 max-w-xl text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl group-hover:text-[#00d4a5] transition-colors">
          {episode.title}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-300">
          {episode.publish_date && <EpisodeDate date={episode.publish_date} />}
          <span>•</span>
          <span>Watch and listen on-demand</span>
        </div>
        {media ? (
          <button
            type="button"
            onClick={(event) => onPlay(episode, media, event.currentTarget)}
            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#00d4a5] px-7 text-xs font-black uppercase tracking-wider text-[#062521] shadow-[0_8px_25px_rgba(0,212,165,0.3)] transition hover:bg-[#34e2b8] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Play size={16} fill="currentColor" aria-hidden="true" />
            <span>Play Episode</span>
          </button>
        ) : (
          <Link
            href={"/episodes/" + episode.slug}
            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#00d4a5] px-7 text-xs font-black uppercase tracking-wider text-[#062521] shadow-[0_8px_25px_rgba(0,212,165,0.3)] transition hover:bg-[#34e2b8] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Discover Episode</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

function LatestEpisodeRow({
  episode,
  rank,
  onPlay,
}: {
  episode: EpisodeSummary;
  rank: number;
  onPlay: (episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => void;
}) {
  const media = getYouTubeMedia(episode.youtube_embed_url || episode.youtube_link);

  return (
    <li className="grid grid-cols-[2rem_4rem_minmax(0,1fr)_2.75rem] items-center gap-3 py-3.5 sm:grid-cols-[2.5rem_4.5rem_minmax(0,1fr)_2.75rem] sm:gap-4 transition-colors hover:bg-white/[0.02] px-2 rounded-xl">
      <span className="text-lg font-black tabular-nums text-white/40" aria-label={`Release ${rank}`}>
        {String(rank).padStart(2, "0")}
      </span>
      <div className="relative size-14 sm:size-16 overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <Image
          src={episode.cover_image || episodeArtwork[(rank - 1) % episodeArtwork.length]}
          alt={episode.cover_image ? episode.title : "CBM Radio presenter"}
          fill
          sizes="64px"
          unoptimized={Boolean(episode.cover_image)}
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[0.68rem] font-black uppercase tracking-wider text-[#00d4a5]">
          {episode.program_title}
        </p>
        <h4 className="mt-0.5 line-clamp-1 font-bold leading-snug text-white text-sm sm:text-base hover:text-[#00d4a5] transition-colors">
          {episode.title}
        </h4>
        {episode.publish_date && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
            <EpisodeDate date={episode.publish_date} />
          </p>
        )}
      </div>
      {media ? (
        <button
          type="button"
          onClick={(event) => onPlay(episode, media, event.currentTarget)}
          className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-[#00d4a5] shadow-sm transition-all hover:border-[#00d4a5] hover:bg-[#00d4a5] hover:text-[#062521] hover:scale-105"
          aria-label={"Play " + episode.title}
        >
          <Play size={15} fill="currentColor" aria-hidden="true" />
        </button>
      ) : (
        <Link
          href={"/episodes/" + episode.slug}
          className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-[#00d4a5] shadow-sm transition-all hover:border-[#00d4a5] hover:bg-[#00d4a5] hover:text-[#062521] hover:scale-105"
          aria-label={"Discover " + episode.title}
        >
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      )}
    </li>
  );
}

function EpisodeDate({ date }: { date: string }) {
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(date));

  return (
    <>
      <CalendarDays size={13} aria-hidden="true" />
      <time dateTime={date}>{formattedDate}</time>
    </>
  );
}
