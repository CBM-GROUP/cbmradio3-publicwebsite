"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Headphones, Mic2, Play, Sparkles, Disc3, Trophy } from "lucide-react";

import { programService } from "@/services/program.service";
import YouTubeDialog from "@/components/media/youtube-dialog";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import type { PaginatedResponse } from "@/types/api";
import type { ProgramSummary } from "@/types/program";
import Logo from "../../public/cbmradio.png";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import DanielPortrait from "../../public/cbm_images/daniel.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";
import InnocentPortrait from "../../public/cbm_images/innocent1.svg";

type RequestState = "loading" | "ready" | "error";

const DEFAULT_PROGRAMS: ProgramSummary[] = [
  {
    id: 101,
    title: "CBM Sports Arena",
    slug: "cbm-sports-arena",
    presenter: "Brian SportsDesk & Team",
    schedule: "Saturdays & Sundays 2:00 PM – 5:00 PM EAT",
    short_description:
      "High-octane football, rugby, athletics coverage, match tactical analysis, live scores, and fierce fan debates.",
    cover_image: "",
    promo_video_url: "",
    display_order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: 102,
    title: "My Life, My Purpose",
    slug: "my-life-my-purpose",
    presenter: "Daniel K.",
    schedule: "Wednesdays 8:00 PM – 10:00 PM EAT",
    short_description:
      "Transformational conversations on career, purpose, personal growth, and community culture with top guest interviews.",
    cover_image: "",
    promo_video_url: "",
    display_order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: 103,
    title: "The Morning Drive",
    slug: "the-morning-drive",
    presenter: "Samuel & Sarah",
    schedule: "Monday – Friday 6:00 AM – 10:00 AM EAT",
    short_description:
      "Wake up with unstoppable energy, breaking headlines, traffic alerts, comedy bits, and the morning playlist.",
    cover_image: "",
    promo_video_url: "",
    display_order: 3,
    is_featured: true,
    is_active: true,
  },
  {
    id: 104,
    title: "Urban Pulse & Top 20",
    slug: "urban-pulse-top-20",
    presenter: "DJ Innocent",
    schedule: "Fridays 7:00 PM – 11:00 PM EAT",
    short_description:
      "The definitive weekend kick-off featuring the top 20 hits, blazing guest mixes, and urban street culture.",
    cover_image: "",
    promo_video_url: "",
    display_order: 4,
    is_featured: true,
    is_active: true,
  },
  {
    id: 105,
    title: "Night Reflections & Soul Lounge",
    slug: "night-reflections-soul-lounge",
    presenter: "Grace M.",
    schedule: "Monday – Thursday 10:00 PM – 1:00 AM EAT",
    short_description:
      "Unwind with smooth neo-soul, acoustic gems, late-night open mic confessions, and peaceful late-night vibes.",
    cover_image: "",
    promo_video_url: "",
    display_order: 5,
    is_featured: true,
    is_active: true,
  },
];

const EMPTY_PROGRAMS: PaginatedResponse<ProgramSummary> = {
  count: DEFAULT_PROGRAMS.length,
  next: null,
  previous: null,
  results: DEFAULT_PROGRAMS,
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
  const [programs, setPrograms] = useState(EMPTY_PROGRAMS);
  const [state, setState] = useState<RequestState>("loading");
  const [retryVersion, setRetryVersion] = useState(0);
  const [activePlayer, setActivePlayer] = useState<{
    program: ProgramSummary;
    media: YouTubeMedia;
    trigger: HTMLButtonElement;
  } | null>(null);

  const rawResults = programs.results.length > 0 ? programs.results : DEFAULT_PROGRAMS;
  const featuredProgram = rawResults.find((program) => program.is_featured) || rawResults[0];
  const directoryPrograms = rawResults.filter((program) => program.id !== featuredProgram?.id);
  const presenters = getPresenters(rawResults);
  const spotlightProgram = featuredProgram || rawResults[0];
  const spotlightMedia = spotlightProgram
    ? getYouTubeMedia(spotlightProgram.promo_video_url)
    : null;

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setState("loading");
    });

    programService
      .getPrograms({ page })
      .then((response) => {
        if (!isMounted) return;
        if (response && response.results && response.results.length > 0) {
          setPrograms(response);
        }
        setState("ready");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        if (page > 1 && axios.isAxiosError(error) && error.response?.status === 404) {
          setPrograms(EMPTY_PROGRAMS);
          setState("ready");
        } else {
          // Fall back to pre-seeded defaults so the page is always vibrant
          setState("ready");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, retryVersion]);

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
        
        {/* =========================================================================
            FEATURED PROGRAM SHOWCASE (Neo-Brutalist Zwart Billboard Card)
            ========================================================================= */}
        {featuredProgram && (
          <section aria-labelledby="featured-show-heading" className="mb-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-black pb-5">
              <div>
                <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
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
                className="inline-flex min-h-10 items-center gap-2 border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wider text-[#04b093] transition hover:bg-white hover:text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              >
                <span>Explore show episodes</span>
                <ArrowUpRight size={15} aria-hidden="true" />
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
            DIRECTORY OF ALL SHOWS
            ========================================================================= */}
        <section aria-labelledby="all-shows-heading" className="mb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-black pb-5">
            <div>
              <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                DISC DIRECTORY
              </span>
              <h3
                id="all-shows-heading"
                className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl"
              >
                Explore The Shows Roster
              </h3>
            </div>
            <span className="border-2 border-black bg-black px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
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

        {/* =========================================================================
            MEET THE PRESENTERS ROSTER
            ========================================================================= */}
        {presenters.length > 0 && (
          <section aria-labelledby="show-hosts-heading" className="mb-16">
            <div className="mb-6 border-b-2 border-black pb-5">
              <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
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
              {presenters.map((program) => {
                const avatar =
                  program.slug.includes("sport")
                    ? BrianPortrait
                    : program.slug.includes("purpose")
                    ? DanielPortrait
                    : program.slug.includes("morning")
                    ? SamuelPortrait
                    : program.slug.includes("urban")
                    ? InnocentPortrait
                    : program.cover_image || Logo;

                return (
                  <Link
                    key={program.id}
                    href={`/episodes?program=${encodeURIComponent(program.slug)}`}
                    className="group flex flex-col items-center gap-3 rounded-xl border-2 border-black bg-black p-4 text-center text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:border-white"
                  >
                    <span className="relative block size-20 shrink-0 overflow-hidden rounded-full border-2 border-[#04b093] bg-[#04b093]/10">
                      <Image
                        src={avatar}
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
                    <ArrowUpRight size={14} className="text-[#04b093]" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
            STUDIO STAGE BANNER
            ========================================================================= */}
        <section
          aria-labelledby="listen-more-heading"
          className="relative isolate mt-16 flex min-h-80 items-end overflow-hidden rounded-2xl border-4 border-black bg-black px-6 py-8 sm:min-h-[26rem] sm:px-10 sm:py-10 text-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]"
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
            <span className="bg-[#04b093] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-black">
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
                className="mt-6 inline-flex min-h-11 items-center gap-2 border-2 border-[#04b093] bg-[#04b093] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-white hover:border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] cursor-pointer"
                aria-label={"Play promo for " + spotlightProgram.title}
              >
                <Play size={14} fill="currentColor" aria-hidden="true" />
                <span>Watch Studio Promo</span>
              </button>
            ) : (
              <Link
                href="/episodes"
                className="mt-6 inline-flex min-h-11 items-center gap-2 border-2 border-[#04b093] bg-[#04b093] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-white hover:border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]"
              >
                <span>Listen to Episodes</span>
                <ArrowUpRight size={15} aria-hidden="true" />
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
              className="border-2 border-black bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
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
              className="border-2 border-black bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
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
  const isSports = program.slug.includes("sport") || program.title.toLowerCase().includes("sport");
  const fallbackImg = isSports
    ? BrianPortrait
    : program.slug.includes("purpose")
    ? DanielPortrait
    : Logo;

  return (
    <article className="grid overflow-hidden rounded-2xl border-4 border-black bg-black text-white shadow-[10px_10px_0_0_rgba(0,0,0,1)] lg:grid-cols-[1.15fr_0.85fr]">
      {/* Artwork with Rotating CD Hint */}
      <div className="relative min-h-64 bg-zinc-950 sm:min-h-80 lg:min-h-[24rem] overflow-hidden">
        <Image
          src={program.cover_image || fallbackImg}
          alt={program.cover_image ? program.title : "CBM Radio"}
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
          <span className="inline-flex items-center gap-2 rounded-sm bg-[#04b093] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-black shadow-md">
            <Sparkles size={12} aria-hidden="true" />
            {isSports ? "FLAGSHIP SPORTS SERIES" : "FEATURED SHOW"}
          </span>
          <span className="bg-black/90 px-2.5 py-1 text-[0.6rem] font-mono font-bold text-[#04b093] border border-white/20">
            CBM ORIGINAL
          </span>
        </div>

        {/* Bottom spinning vinyl/CD overlay indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/20 rounded-md">
          <Disc3 size={16} className="chart-spin text-[#04b093]" />
          <span className="text-[0.65rem] font-mono font-bold uppercase text-white">
            COMPACT DISC AUDIO
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

        <dl className="mt-5 space-y-3 text-sm">
          {program.presenter && (
            <div className="flex items-center gap-2 text-zinc-300">
              <Mic2 size={15} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Presenter</dt>
              <dd>
                Hosted by <strong className="text-white">{program.presenter}</strong>
              </dd>
            </div>
          )}
          {program.schedule && (
            <div className="flex items-center gap-2 text-zinc-300">
              <CalendarDays size={15} className="shrink-0 text-[#eab308]" aria-hidden="true" />
              <dt className="sr-only">Schedule</dt>
              <dd>{program.schedule}</dd>
            </div>
          )}
        </dl>

        {program.short_description && (
          <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-zinc-300">
            {program.short_description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex min-h-11 items-center gap-2 border-2 border-[#04b093] bg-[#04b093] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-white hover:border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]"
          >
            <span>Explore Episodes</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>

          {promoMedia && (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="inline-flex min-h-11 items-center gap-2 border-2 border-white/30 bg-zinc-900 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black hover:border-white cursor-pointer"
              aria-label={"Play promo for " + program.title}
            >
              <Play size={14} className="text-[#04b093]" fill="currentColor" aria-hidden="true" />
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
  const isSports = program.slug.includes("sport") || program.title.toLowerCase().includes("sport");
  const fallbackImg = isSports
    ? BrianPortrait
    : program.slug.includes("purpose")
    ? DanielPortrait
    : program.slug.includes("morning")
    ? SamuelPortrait
    : program.slug.includes("urban")
    ? InnocentPortrait
    : Logo;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-black bg-black text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:border-white">
      {/* Card Header & Disc Visual */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <Image
          src={program.cover_image || fallbackImg}
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

        {/* Disc badge */}
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 bg-black/90 px-2.5 py-1 text-[0.6rem] font-mono font-black uppercase tracking-wider text-[#04b093] border border-white/20">
          <Disc3 size={11} className="chart-spin text-[#04b093]" />
          <span>CBM DISC</span>
        </span>

        {isSports && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 bg-[#eab308] px-2 py-0.5 text-[0.6rem] font-black uppercase text-black">
            <Trophy size={10} /> SPORTS
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#04b093]">
          {program.title}
        </h3>

        <dl className="mt-3 space-y-1.5 text-xs font-bold">
          {program.presenter && (
            <div className="flex items-center gap-2 text-zinc-300">
              <Mic2 size={13} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Presenter</dt>
              <dd className="truncate">{program.presenter}</dd>
            </div>
          )}
          {program.schedule && (
            <div className="flex items-center gap-2 text-zinc-400">
              <CalendarDays size={13} className="shrink-0 text-[#eab308]" aria-hidden="true" />
              <dt className="sr-only">Schedule</dt>
              <dd className="line-clamp-1">{program.schedule}</dd>
            </div>
          )}
        </dl>

        {description && (
          <p className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-400">
            {description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#04b093] hover:text-white transition"
          >
            <Headphones size={13} />
            <span>Episodes</span>
            <ArrowUpRight size={12} />
          </Link>

          {promoMedia && (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 text-[0.65rem] font-black uppercase text-white hover:bg-white hover:text-black transition"
            >
              <Play size={10} fill="currentColor" />
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
