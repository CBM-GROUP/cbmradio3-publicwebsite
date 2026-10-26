"use client";

import { ArrowUpRight, CalendarDays, Play } from "lucide-react";
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
    <section className="border-y border-white/10 bg-[#111816] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">
              From the lineup
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              What we’re talking about
            </h2>
          </div>
          <Link
            href="/episodes"
            className="inline-flex min-h-11 items-center gap-2 font-bold text-[#48d4c1] transition hover:text-white"
          >
            Explore all episodes <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {(featuredState === "loading" || latestState === "loading") && !hasEpisodes && (
          <p className="rounded-lg border border-white/10 bg-black/20 px-5 py-8 text-center text-white/70" aria-live="polite">
            Loading episodes...
          </p>
        )}
        {!hasEpisodes && featuredState !== "loading" && latestState !== "loading" && (
          <article className="cbm-card grid overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-56 sm:min-h-72">
              <Image
                src={ConversationArtwork}
                alt="Radio show microphone and On Air radio talk show artwork"
                fill
                sizes="(max-width: 640px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-300">A CBM conversation</p>
              <h3 className="mt-3 text-2xl font-black sm:text-3xl">My Life, My Purpose</h3>
              <p className="mt-3 max-w-lg leading-7 text-zinc-300">
                Join Jerry Keyz and Kalinzi Louis for conversations about purpose, life, and the experiences we share.
              </p>
              <Link href="/programs" className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-teal-300 hover:text-white">
                Explore the show <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              {(allFailed || allEmpty) && (
                <p className="mt-3 text-xs text-white/45">
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
              className="cbm-card rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-7"
            >
              <div className="mb-5 flex items-end justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-400">
                    Just released
                  </p>
                  <h3 id="latest-episodes-heading" className="mt-2 text-2xl font-bold">
                    Latest episodes
                  </h3>
                </div>
                <span className="pb-1 text-xs uppercase tracking-wider text-zinc-500">
                  Newest first
                </span>
              </div>

              {recentEpisodes.length > 0 ? (
                <ol className="divide-y divide-zinc-800">
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
                <p className="py-8 text-sm text-zinc-400">
                  Latest episodes are temporarily unavailable.
                </p>
              ) : latestState === "loading" ? (
                <p className="py-8 text-sm text-zinc-400" aria-live="polite">
                  Loading latest episodes...
                </p>
              ) : (
                <p className="py-8 text-sm text-zinc-400">
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
    <article className="cbm-card group relative flex min-h-[27rem] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 sm:min-h-[34rem]">
      <Image
        src={episode.cover_image || DanielPortrait}
        alt={episode.cover_image ? episode.title : "CBM Radio"}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        unoptimized={Boolean(episode.cover_image)}
        className="object-cover transition duration-700 group-hover:scale-105"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
      <div className="relative mt-auto w-full p-6 sm:p-9">
        <span className="inline-flex rounded-full bg-teal-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-950">
          Featured episode
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-teal-300">
          {episode.program_title}
        </p>
        <h3 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
          {episode.title}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
          {episode.publish_date && <EpisodeDate date={episode.publish_date} />}
          <span>Listen and watch on CBM</span>
        </div>
        {media ? (
          <button
            type="button"
            onClick={(event) => onPlay(episode, media, event.currentTarget)}
            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-teal-400 px-6 font-bold text-zinc-950 transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Play size={17} fill="currentColor" aria-hidden="true" />
            Play episode
          </button>
        ) : (
          <Link
            href={"/episodes/" + episode.slug}
            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-teal-400 px-6 font-bold text-zinc-950 transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Discover episode <ArrowUpRight size={18} aria-hidden="true" />
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
    <li className="grid grid-cols-[2rem_4rem_minmax(0,1fr)_2.75rem] items-center gap-3 py-4 sm:grid-cols-[2.5rem_4.5rem_minmax(0,1fr)_2.75rem] sm:gap-4">
      <span className="text-xl font-extrabold tabular-nums text-zinc-500" aria-label={`Release ${rank}`}>
        {String(rank).padStart(2, "0")}
      </span>
      <Image
        src={episode.cover_image || episodeArtwork[(rank - 1) % episodeArtwork.length]}
        alt={episode.cover_image ? episode.title : "CBM Radio presenter"}
        width={72}
        height={72}
        sizes="72px"
        unoptimized={Boolean(episode.cover_image)}
        className="h-16 w-16 rounded-lg object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
      />
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-teal-400">
          {episode.program_title}
        </p>
        <h4 className="mt-1 line-clamp-2 font-bold leading-snug text-white">
          {episode.title}
        </h4>
        {episode.publish_date && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
            <EpisodeDate date={episode.publish_date} />
          </p>
        )}
      </div>
      {media ? (
        <button
          type="button"
          onClick={(event) => onPlay(episode, media, event.currentTarget)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-teal-300 transition hover:border-teal-400 hover:bg-teal-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          aria-label={"Play " + episode.title}
        >
          <Play size={16} fill="currentColor" aria-hidden="true" />
        </button>
      ) : (
        <Link
          href={"/episodes/" + episode.slug}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-teal-300 transition hover:border-teal-400 hover:bg-teal-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          aria-label={"Discover " + episode.title}
        >
          <ArrowUpRight size={18} aria-hidden="true" />
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
      <CalendarDays size={14} aria-hidden="true" />
      <time dateTime={date}>{formattedDate}</time>
    </>
  );
}
