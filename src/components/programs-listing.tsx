"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

import { programService } from "@/services/program.service";
import YouTubeDialog from "@/components/media/youtube-dialog";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import type { PaginatedResponse } from "@/types/api";
import type { ProgramSummary } from "@/types/program";

type RequestState = "loading" | "ready" | "error";

const FALLBACK_PROGRAM_COVER = "/cbm_images/the-morning-show.jpg";

function getProgramCover(cover?: string | null): string {
  if (cover && cover.trim() !== "") return cover;
  return FALLBACK_PROGRAM_COVER;
}

const INITIAL_RESPONSE: PaginatedResponse<ProgramSummary> = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

function parsePage(value: string | null) {
  if (!value || !/^\d+$/.test(value)) return 1;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function ProgramsListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const [programs, setPrograms] = useState(INITIAL_RESPONSE);
  const [state, setState] = useState<RequestState>("loading");
  const [retryVersion, setRetryVersion] = useState(0);
  const [activePlayer, setActivePlayer] = useState<{
    program: ProgramSummary;
    media: YouTubeMedia;
    trigger: HTMLButtonElement;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    programService
      .getPrograms({ page })
      .then((response) => {
        if (!isMounted) return;
        if (response && Array.isArray(response.results)) {
          setPrograms(response);
        }
        setState("ready");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setState("ready");
      });

    return () => {
      isMounted = false;
    };
  }, [page, retryVersion]);

  const activePrograms = programs.results;
  const featuredProgram = activePrograms.find((p) => p.is_featured) || activePrograms[0];
  const directoryPrograms = activePrograms.filter((p) => p.id !== featuredProgram?.id);
  const presenters = getPresenters(activePrograms);
  const spotlightProgram = featuredProgram || activePrograms[0];
  const spotlightMedia = spotlightProgram
    ? getYouTubeMedia(spotlightProgram.promo_video_url)
    : null;

  const navigateToPage = useCallback(
    (nextPage: number) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (nextPage <= 1) nextParams.delete("page");
      else nextParams.set("page", String(nextPage));
      const query = nextParams.toString();
      router.push(query ? pathname + "?" + query : pathname, { scroll: false });
      window.requestAnimationFrame(() => {
        document.getElementById("programs-content")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <section
      id="programs-content"
      className="scroll-mt-24 bg-[#04b093] px-4 pb-20 pt-12 text-black sm:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Active Programs or Empty State */}
        {activePrograms.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-black/30 bg-black/5 p-12 text-center my-8">
            <p className="text-xl font-black uppercase text-black">
              {state === "loading" ? "Loading programs..." : "No programs listed yet"}
            </p>
            <p className="mt-1 text-sm font-bold text-black/70">
              {state === "loading"
                ? "Connecting to CBM Radio broadcast lineup..."
                : "Add or edit programs from the admin dashboard to see them appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* =========================================================================
                FEATURED PROGRAM SHOWCASE
                ========================================================================= */}
            {featuredProgram && (
              <section aria-labelledby="featured-show-heading" className="mb-16">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-black pb-5">
                  <div>
                    <span className="rounded-full bg-black px-4 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                      ORIGINAL LINEUP
                    </span>
                    <h3
                      id="featured-show-heading"
                      className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl"
                    >
                      Featured Broadcast Show
                    </h3>
                  </div>
                  <Link
                    href={`/episodes?program=${encodeURIComponent(featuredProgram.slug)}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black hover:scale-105 shadow-md"
                  >
                    <span>Explore episodes</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>

                <FeaturedProgram
                  program={featuredProgram}
                  onPlay={(media, trigger) =>
                    setActivePlayer({ program: featuredProgram, media, trigger })
                  }
                />
              </section>
            )}

            {/* =========================================================================
                EXPLORE THE SHOWS ROSTER
                ========================================================================= */}
            {directoryPrograms.length > 0 && (
              <section aria-labelledby="all-shows-heading" className="mb-16">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-black pb-5">
                  <div>
                    <span className="rounded-full bg-black px-4 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                      DISC DIRECTORY
                    </span>
                    <h3
                      id="all-shows-heading"
                      className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl"
                    >
                      Explore The Shows Roster
                    </h3>
                  </div>
                  <span className="rounded-full border-2 border-black bg-black px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm">
                    {directoryPrograms.length} {directoryPrograms.length === 1 ? "Program" : "Programs"} On Deck
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {directoryPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onPlay={(media, trigger) =>
                        setActivePlayer({ program, media, trigger })
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* =========================================================================
                MEET THE PRESENTERS ROSTER
                ========================================================================= */}
            {presenters.length > 0 && (
              <section aria-labelledby="show-hosts-heading" className="mb-16">
                <div className="mb-6 border-b-2 border-black pb-5">
                  <span className="rounded-full bg-black px-4 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                    ON-AIR VOICES
                  </span>
                  <h3
                    id="show-hosts-heading"
                    className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl"
                  >
                    Meet The Presenters
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {presenters.map((program) => (
                    <Link
                      key={program.id}
                      href={`/episodes?program=${encodeURIComponent(program.slug)}`}
                      className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-black bg-black p-4 text-center text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:border-white"
                    >
                      <span className="relative block size-20 shrink-0 overflow-hidden rounded-full border-2 border-[#04b093] bg-[#04b093]/10">
                        <Image
                          src={getProgramCover(program.cover_image)}
                          alt={program.presenter}
                          fill
                          sizes="80px"
                          unoptimized={Boolean(program.cover_image)}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </span>
                      <div className="min-w-0 w-full">
                        <span className="block truncate text-sm font-black uppercase text-white transition-colors group-hover:text-[#04b093]">
                          {program.presenter}
                        </span>
                        <span className="mt-1 block truncate text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400">
                          {program.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* =========================================================================
            STUDIO STAGE BANNER
            ========================================================================= */}
        <section
          aria-labelledby="listen-more-heading"
          className="relative isolate mt-16 flex min-h-80 items-end overflow-hidden rounded-3xl border-4 border-black bg-black px-6 py-8 sm:min-h-[26rem] sm:px-10 sm:py-10 text-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]"
        >
          <Image
            src="/cbm_images/behind-the-scenes-studio.png"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/30"
            aria-hidden="true"
          />
          <div className="max-w-xl">
            <span className="rounded-full bg-[#04b093] px-3.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-black">
              INSIDE THE STUDIO
            </span>
            <h3
              id="listen-more-heading"
              className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
            >
              {spotlightProgram ? `Behind ${spotlightProgram.title}` : "The Conversation Continues"}
            </h3>
            <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-zinc-300">
              Step behind the microphone, meet the voices, and catch up on the authentic conversations shaping CBM Radio.
            </p>
            {spotlightMedia && spotlightProgram ? (
              <button
                type="button"
                onClick={(event) =>
                  setActivePlayer({
                    program: spotlightProgram,
                    media: spotlightMedia,
                    trigger: event.currentTarget,
                  })
                }
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-[#04b093] px-8 py-3 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105 shadow-md cursor-pointer"
                aria-label={"Play promo for " + spotlightProgram.title}
              >
                <Play size={13} fill="currentColor" aria-hidden="true" />
                <span>Watch Studio Promo</span>
              </button>
            ) : (
              <Link
                href="/episodes"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-[#04b093] px-8 py-3 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105 shadow-md"
              >
                <span>Listen to Episodes</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>

        {/* Pagination */}
        {programs.previous || programs.next ? (
          <nav
            aria-label="Show pagination"
            className="mt-12 flex items-center justify-center gap-4 border-t-2 border-black pt-8"
          >
            <button
              type="button"
              disabled={!programs.previous}
              onClick={() => navigateToPage(Math.max(1, page - 1))}
              className="rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
            >
              Previous
            </button>
            <span
              className="text-xs font-mono font-black uppercase tracking-wider text-black"
              aria-current="page"
            >
              Page {page}
            </span>
            <button
              type="button"
              disabled={!programs.next}
              onClick={() => navigateToPage(page + 1)}
              className="rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 shadow-md"
            >
              Next
            </button>
          </nav>
        ) : null}

      </div>

      {activePlayer && (
        <YouTubeDialog
          title={activePlayer.program.title}
          media={activePlayer.media}
          returnFocus={activePlayer.trigger}
          onClose={() => setActivePlayer(null)}
        />
      )}
    </section>
  );
}

function FeaturedProgram({
  program,
  onPlay,
}: {
  program: ProgramSummary;
  onPlay: (media: YouTubeMedia, trigger: HTMLButtonElement) => void;
}) {
  const promoMedia = getYouTubeMedia(program.promo_video_url);

  return (
    <article className="grid overflow-hidden rounded-3xl border-4 border-black bg-black text-white shadow-[10px_10px_0_0_rgba(0,0,0,1)] lg:grid-cols-[1.15fr_0.85fr]">
      {/* Artwork with clear background */}
      <div className="relative min-h-64 bg-zinc-950 sm:min-h-80 lg:min-h-[24rem] overflow-hidden">
        <Image
          src={getProgramCover(program.cover_image)}
          alt={program.title}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          unoptimized={Boolean(program.cover_image)}
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"
          aria-hidden="true"
        />
        
        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-[#04b093] px-3.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-black shadow-md">
            FEATURED SHOW
          </span>
          <span className="rounded-full bg-black/90 px-3 py-1 text-[0.6rem] font-mono font-bold text-[#04b093] border border-white/20">
            CBM BROADCAST
          </span>
        </div>
      </div>

      {/* Program Details */}
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
        <span className="text-xs font-mono font-black uppercase tracking-[0.2em] text-[#04b093]">
          BROADCAST ROSTER
        </span>
        <h4 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
          {program.title}
        </h4>

        <div className="mt-5 space-y-2 text-sm">
          {program.presenter && (
            <p className="text-zinc-300">
              Hosted by <strong className="text-white">{program.presenter}</strong>
            </p>
          )}
          {program.schedule && (
            <p className="text-[#eab308] font-bold">
              {program.schedule}
            </p>
          )}
        </div>

        {program.short_description && (
          <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-zinc-300">
            {program.short_description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-black bg-[#04b093] px-8 py-3 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105 shadow-md"
          >
            <span>Explore Episodes</span>
            <ArrowUpRight size={14} className="ml-1.5" />
          </Link>

          {promoMedia && (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white/30 bg-zinc-900 px-7 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black hover:scale-105 cursor-pointer"
              aria-label={"Play promo for " + program.title}
            >
              <Play size={13} className="text-[#04b093] mr-1.5" fill="currentColor" aria-hidden="true" />
              <span>Watch Promo</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProgramCard({
  program,
  onPlay,
}: {
  program: ProgramSummary;
  onPlay: (media: YouTubeMedia, trigger: HTMLButtonElement) => void;
}) {
  const description = program.short_description;
  const promoMedia = getYouTubeMedia(program.promo_video_url);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:border-white">
      {/* Card Header with real background image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <Image
          src={getProgramCover(program.cover_image)}
          alt={program.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={Boolean(program.cover_image)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#04b093]">
          {program.title}
        </h3>

        <div className="mt-3 space-y-1 text-xs font-bold">
          {program.presenter && (
            <p className="text-zinc-300 truncate">Hosted by {program.presenter}</p>
          )}
          {program.schedule && (
            <p className="text-[#eab308] truncate">{program.schedule}</p>
          )}
        </div>

        {description && (
          <p className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-400">
            {description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex items-center justify-center rounded-full border border-black bg-[#04b093] px-5 py-2 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105"
          >
            <span>Episodes</span>
            <ArrowUpRight size={12} className="ml-1" />
          </Link>

          {promoMedia && (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black"
            >
              <Play size={10} fill="currentColor" className="mr-1" />
              <span>Promo</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function getPresenters(programs: ProgramSummary[]) {
  const uniquePresenters = new Map<string, ProgramSummary>();
  for (const program of programs) {
    const presenter = program.presenter?.trim();
    if (presenter && !uniquePresenters.has(presenter.toLowerCase())) {
      uniquePresenters.set(presenter.toLowerCase(), program);
    }
  }
  return [...uniquePresenters.values()];
}
