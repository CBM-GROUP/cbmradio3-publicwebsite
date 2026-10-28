"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Headphones, Mic2, Play, Sparkles } from "lucide-react";

import { programService } from "@/services/program.service";
import YouTubeDialog from "@/components/media/youtube-dialog";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import type { PaginatedResponse } from "@/types/api";
import type { ProgramSummary } from "@/types/program";
import Logo from "../../public/cbmradio.png";

type RequestState = "loading" | "ready" | "error";

const EMPTY_PROGRAMS: PaginatedResponse<ProgramSummary> = {
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
  const [programs, setPrograms] = useState(EMPTY_PROGRAMS);
  const [state, setState] = useState<RequestState>("loading");
  const [retryVersion, setRetryVersion] = useState(0);
  const [activePlayer, setActivePlayer] = useState<{ program: ProgramSummary; media: YouTubeMedia; trigger: HTMLButtonElement } | null>(null);
  const featuredProgram = programs.results.find((program) => program.is_featured);
  const directoryPrograms = programs.results.filter((program) => program.id !== featuredProgram?.id);
  const presenters = getPresenters(programs.results);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setState("loading");
    });

    programService.getPrograms({ page }).then((response) => {
      if (!isMounted) return;
      setPrograms(response);
      setState("ready");
    }).catch((error: unknown) => {
      if (!isMounted) return;
      if (page > 1 && axios.isAxiosError(error) && error.response?.status === 404) {
        setPrograms(EMPTY_PROGRAMS);
        setState("ready");
      } else {
        setState("error");
      }
    });

    return () => { isMounted = false; };
  }, [page, retryVersion]);

  const navigateToPage = useCallback((nextPage: number) => {
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
  }, [pathname, router, searchParams]);

  return (
    <section id="programs-content" className="scroll-mt-24 bg-[#090909] px-4 pb-20 pt-12 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-[#04b093] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-black">
                CBM original shows
              </span>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-zinc-400">
                Voices worth tuning in for
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Find your next favorite
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Meet the presenters, find your next favorite conversation, and catch every new episode.
            </p>
          </div>
          <Link
            href="/episodes"
            className="inline-flex min-h-11 w-fit items-center gap-2 border border-[#04b093] bg-[#04b093] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:border-white hover:bg-white"
          >
            Browse episodes <ArrowUpRight size={15} />
          </Link>
        </div>

        {state === "ready" && featuredProgram && (
          <section aria-labelledby="featured-show-heading" className="mb-16">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">On air at CBM</p>
                <h3 id="featured-show-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                  Featured show
                </h3>
              </div>
              <Link
                href={`/episodes?program=${encodeURIComponent(featuredProgram.slug)}`}
                className="inline-flex min-h-10 items-center gap-2 text-xs font-black uppercase tracking-wider text-[#04b093] transition-colors hover:text-white"
              >
                Explore episodes <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <FeaturedProgram
              program={featuredProgram}
              onPlay={(media, trigger) => setActivePlayer({ program: featuredProgram, media, trigger })}
            />
          </section>
        )}

        {state === "loading" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="animate-pulse border border-white/10 bg-black">
                <div className="aspect-[4/3] bg-zinc-800" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/3 bg-zinc-800" />
                  <div className="h-6 w-3/4 bg-zinc-800" />
                  <div className="h-3 w-full bg-zinc-800" />
                </div>
              </div>
            ))}
            <span className="sr-only">Loading shows...</span>
          </div>
        )}

        {state === "error" && (
          <div className="border border-white/10 bg-black px-6 py-16 text-center text-white" role="alert">
            <p className="text-lg font-bold">Shows are temporarily unavailable.</p>
            <button
              type="button"
              onClick={() => setRetryVersion((value) => value + 1)}
              className="mt-5 border border-[#04b093] bg-[#04b093] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:border-white hover:bg-white"
            >
              Retry
            </button>
          </div>
        )}

        {state === "ready" && programs.results.length === 0 && (
          <div className="border border-white/10 bg-black px-6 py-16 text-center font-bold text-zinc-300">
            <p>
              {page > 1
                ? "No shows are available on this page."
                : "No shows are available yet."}
            </p>
            {page > 1 && (
              <button
                type="button"
                onClick={() => navigateToPage(1)}
                className="mt-4 inline-block font-black uppercase text-[#04b093] underline underline-offset-4"
              >
                Return to page 1
              </button>
            )}
          </div>
        )}

        {state === "ready" && programs.results.length > 0 && (
          <>
            <section aria-labelledby="all-shows-heading" className="mb-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">Browse the lineup</p>
                  <h3 id="all-shows-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    All shows
                  </h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {programs.count} {programs.count === 1 ? "show" : "shows"}
                </span>
              </div>
              {directoryPrograms.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {directoryPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} onPlay={(media, trigger) => setActivePlayer({ program, media, trigger })} />
                  ))}
                </div>
              ) : !featuredProgram ? (
                <p className="border border-white/10 bg-black px-6 py-12 text-center font-bold text-zinc-300">
                  No shows are available yet.
                </p>
              ) : null}
            </section>

            {presenters.length > 0 && (
              <section aria-labelledby="show-hosts-heading" className="mb-16">
                <div className="mb-6 border-b border-white/15 pb-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">The people behind the mic</p>
                  <h3 id="show-hosts-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    Meet the voices
                  </h3>
                </div>
                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                  {presenters.map((program) => (
                    <Link
                      key={program.id}
                      href={`/episodes?program=${encodeURIComponent(program.slug)}`}
                      className="group flex min-h-28 items-center gap-4 bg-[#111] p-5 transition-colors hover:bg-[#171717]"
                    >
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#04b093]/50 bg-[#04b093]/10 text-sm font-black uppercase tracking-wider text-[#04b093]">
                        {getInitials(program.presenter)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-base font-black uppercase text-white transition-colors group-hover:text-[#04b093]">
                          {program.presenter}
                        </span>
                        <span className="mt-1 block truncate text-xs font-bold uppercase tracking-wider text-zinc-500">
                          {program.title}
                        </span>
                      </span>
                      <ArrowUpRight size={16} className="ml-auto shrink-0 text-[#04b093]" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="listen-more-heading" className="relative isolate flex min-h-72 items-end overflow-hidden border border-white/10 bg-black px-6 py-8 sm:min-h-96 sm:px-10 sm:py-10">
              <Image
                src="/cbm_images/on-air-studio.png"
                alt=""
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="absolute inset-0 -z-20 object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/20" aria-hidden="true" />
              <div className="max-w-xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">Your world. Your frequency.</p>
                <h3 id="listen-more-heading" className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                  The conversation continues
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-300">
                  Catch up on the voices, ideas, and stories you love with the latest episodes from CBM Radio.
                </p>
                <Link
                  href="/episodes"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[#04b093] bg-[#04b093] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:border-white hover:bg-white"
                >
                  Listen to episodes <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </>
        )}

        {state === "ready" && (programs.previous || programs.next) && (
          <nav aria-label="Show pagination" className="mt-12 flex items-center justify-center gap-4 border-t border-white/10 pt-8">
            <button
              type="button"
              disabled={!programs.previous}
              onClick={() => navigateToPage(Math.max(1, page - 1))}
              className="border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-[#04b093] hover:text-[#04b093] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-zinc-400" aria-current="page">Page {page}</span>
            <button
              type="button"
              disabled={!programs.next}
              onClick={() => navigateToPage(page + 1)}
              className="border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-[#04b093] hover:text-[#04b093] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
      {activePlayer && <YouTubeDialog title={activePlayer.program.title} media={activePlayer.media} returnFocus={activePlayer.trigger} onClose={() => setActivePlayer(null)} />}
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
    <article className="grid overflow-hidden border border-white/10 bg-[#111] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-64 bg-zinc-900 sm:min-h-80 lg:min-h-[25rem]">
        <Image
          src={program.cover_image || Logo}
          alt={program.cover_image ? program.title : "CBM Radio"}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          unoptimized={Boolean(program.cover_image)}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-[#04b093] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-black">
          <Sparkles size={12} aria-hidden="true" /> Featured show
        </span>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">CBM original</p>
        <h4 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
          {program.title}
        </h4>
        <dl className="mt-5 space-y-3 text-sm">
          {program.presenter && (
            <div className="flex items-center gap-2 text-zinc-300">
              <Mic2 size={15} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Presenter</dt>
              <dd>Hosted by {program.presenter}</dd>
            </div>
          )}
          {program.schedule && (
            <div className="flex items-center gap-2 text-zinc-300">
              <CalendarDays size={15} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Schedule</dt>
              <dd>{program.schedule}</dd>
            </div>
          )}
        </dl>
        {program.short_description && (
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-400">{program.short_description}</p>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex min-h-11 items-center gap-2 bg-[#04b093] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-white"
          >
            Explore episodes <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          {promoMedia && (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-wider text-white transition-colors hover:text-[#04b093]"
              aria-label={"Play promo for " + program.title}
            >
              <Play size={14} className="text-[#04b093]" fill="currentColor" aria-hidden="true" />
              Play promo
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProgramCard({ program, onPlay }: { program: ProgramSummary; onPlay: (media: YouTubeMedia, trigger: HTMLButtonElement) => void }) {
  const description = program.short_description;
  const promoMedia = getYouTubeMedia(program.promo_video_url);

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-black text-white transition-colors hover:border-[#04b093]/70">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-zinc-900">
        <Image
          src={program.cover_image || Logo}
          alt={program.cover_image ? program.title : "CBM Radio"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={Boolean(program.cover_image)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-black/80 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.16em] text-[#04b093]">
          <Sparkles size={11} aria-hidden="true" /> CBM Original
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-[#04b093]">
          {program.title}
        </h3>
        <dl className="mt-3 space-y-2 text-xs font-bold">
          {program.presenter && (
            <div className="flex items-center gap-2 text-zinc-300">
              <Mic2 size={13} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Presenter</dt>
              <dd>Hosted by {program.presenter}</dd>
            </div>
          )}
          {program.schedule && (
            <div className="flex items-center gap-2 text-zinc-400">
              <CalendarDays size={13} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Schedule</dt>
              <dd>{program.schedule}</dd>
            </div>
          )}
        </dl>
        {description && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-400">{description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          {promoMedia ? (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="inline-flex items-center gap-2 bg-[#04b093] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-white"
              aria-label={"Play promo for " + program.title}
            >
              <Play size={13} fill="currentColor" />
              Play Promo
            </button>
          ) : <span className="inline-flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-wider text-zinc-500"><Headphones size={14} aria-hidden="true" /> Tune in</span>}
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-colors hover:text-white"
          >
            Episodes <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
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

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}
