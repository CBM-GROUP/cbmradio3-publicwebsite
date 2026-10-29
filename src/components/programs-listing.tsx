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
  const spotlightProgram = featuredProgram || programs.results[0];
  const spotlightMedia = spotlightProgram
    ? getYouTubeMedia(spotlightProgram.promo_video_url)
    : null;

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
    <section id="programs-content" className="scroll-mt-24 bg-[#080a09] px-4 pb-20 pt-12 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {state === "ready" && featuredProgram && (
          <section aria-labelledby="featured-show-heading" className="mb-16">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">Now on CBM</p>
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
          <div className="space-y-14" aria-busy="true" aria-live="polite">
            <section aria-label="Featured show loading">
              <div className="mb-5 border-b border-white/15 pb-5">
                <div className="h-3 w-28 animate-pulse bg-zinc-800" />
                <div className="mt-3 h-8 w-52 animate-pulse bg-zinc-800" />
              </div>
              <div className="grid animate-pulse overflow-hidden border border-white/10 bg-[#111] lg:grid-cols-2">
                <div className="min-h-64 bg-zinc-800 sm:min-h-80 lg:min-h-[25rem]" />
                <div className="flex flex-col justify-center gap-5 p-6 sm:p-9 lg:p-10">
                  <div className="h-3 w-28 bg-zinc-800" />
                  <div className="h-10 w-3/4 bg-zinc-800" />
                  <div className="h-4 w-2/3 bg-zinc-800" />
                  <div className="h-16 w-full max-w-lg bg-zinc-800" />
                  <div className="h-11 w-40 bg-zinc-800" />
                </div>
              </div>
            </section>

            <section aria-label="Show directory loading">
              <div className="mb-6 border-b border-white/15 pb-5">
                <div className="h-3 w-32 animate-pulse bg-zinc-800" />
                <div className="mt-3 h-8 w-40 animate-pulse bg-zinc-800" />
              </div>
              <div className="grid grid-cols-2 gap-3 min-[440px]:grid-cols-3 sm:gap-5">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#111]">
                    <div className="aspect-[4/3] bg-zinc-800" />
                    <div className="space-y-3 p-3 sm:p-5">
                      <div className="h-2 w-1/2 bg-zinc-800" />
                      <div className="h-5 w-3/4 bg-zinc-800" />
                      <div className="h-3 w-full bg-zinc-800" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section aria-label="Presenter list loading">
              <div className="mb-5 border-b border-white/15 pb-5">
                <div className="h-3 w-44 animate-pulse bg-zinc-800" />
                <div className="mt-3 h-8 w-52 animate-pulse bg-zinc-800" />
              </div>
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="flex min-w-28 animate-pulse flex-col items-center gap-3 rounded-xl border border-white/10 bg-[#111] p-4">
                    <div className="size-16 rounded-full bg-zinc-800" />
                    <div className="w-full space-y-2">
                      <div className="mx-auto h-3 w-3/4 bg-zinc-800" />
                      <div className="mx-auto h-2 w-1/2 bg-zinc-800" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <span className="sr-only">Loading shows...</span>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-14">
            <section aria-labelledby="featured-show-heading">
              <div className="mb-5 border-b border-white/15 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">Now on CBM</p>
                <h3 id="featured-show-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                  Featured show
                </h3>
              </div>
              <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#111] lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-56 bg-black sm:min-h-72">
                  <Image
                    src="/cbm_images/on-air-studio.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">CBM original</p>
                  <p className="mt-3 text-xl font-black uppercase text-white">Shows are temporarily unavailable</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    We couldn&apos;t load the show lineup. Please try again in a moment.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRetryVersion((value) => value + 1)}
                    className="mt-6 inline-flex min-h-11 w-fit items-center border border-[#04b093] bg-[#04b093] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:border-white hover:bg-white"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </section>

            <section aria-labelledby="all-shows-heading">
              <div className="mb-6 border-b border-white/15 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">Find your next listen</p>
                <h3 id="all-shows-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                  Explore the shows
                </h3>
              </div>
              <p className="border border-white/10 bg-black px-6 py-10 text-center text-sm font-bold text-zinc-400" role="status">
                The show directory will appear here when it is available.
              </p>
            </section>

            <section aria-labelledby="show-hosts-heading">
              <div className="mb-6 border-b border-white/15 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">The people behind the mic</p>
                <h3 id="show-hosts-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                  Meet the presenters
                </h3>
              </div>
              <p className="border border-white/10 bg-black px-6 py-8 text-center text-sm font-bold text-zinc-400" role="status">
                Presenter profiles will appear alongside the show lineup.
              </p>
            </section>
          </div>
        )}

        {state === "ready" && programs.results.length === 0 && (
          <div className="border border-white/10 bg-black px-6 py-16 text-center font-bold text-zinc-300">
            <p>
              {page > 1
                ? "There are no shows on this page."
                : "No shows are available just yet."}
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
            <section aria-labelledby="all-shows-heading" className="mb-14">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">Find your next listen</p>
                  <h3 id="all-shows-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    Explore the shows
                  </h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {programs.count} {programs.count === 1 ? "show" : "shows"}
                </span>
              </div>
              {directoryPrograms.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 min-[440px]:grid-cols-3 sm:gap-5">
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
              <section aria-labelledby="show-hosts-heading" className="mb-14">
                <div className="mb-5 border-b border-white/15 pb-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">The people behind the mic</p>
                  <h3 id="show-hosts-heading" className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    Meet the presenters
                  </h3>
                </div>
                <div className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-4">
                  {presenters.map((program) => (
                    <Link
                      key={program.id}
                      href={`/episodes?program=${encodeURIComponent(program.slug)}`}
                      className="group flex min-w-28 snap-start flex-col items-center gap-3 rounded-xl border border-white/10 bg-[#111] p-4 text-center transition-colors hover:border-[#04b093]/70 hover:bg-[#151817] sm:min-w-36"
                    >
                      <span className="relative block size-16 shrink-0 overflow-hidden rounded-full border border-[#04b093]/50 bg-[#04b093]/10">
                        <Image
                          src={program.cover_image || Logo}
                          alt=""
                          fill
                          sizes="64px"
                          unoptimized={Boolean(program.cover_image)}
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 w-full">
                        <span className="block truncate text-sm font-black uppercase text-white transition-colors group-hover:text-[#04b093]">
                          {program.presenter}
                        </span>
                        <span className="mt-1 block truncate text-[0.6rem] font-bold uppercase tracking-wider text-zinc-500">
                          {program.title}
                        </span>
                      </span>
                      <ArrowUpRight size={14} className="text-[#04b093]" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </>
        )}

        <section aria-labelledby="listen-more-heading" className="relative isolate mt-16 flex min-h-80 items-end overflow-hidden rounded-2xl border border-white/10 bg-black px-6 py-8 sm:min-h-[28rem] sm:px-10 sm:py-10">
          <Image
            src="/cbm_images/behind-the-scenes-studio.png"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/25" aria-hidden="true" />
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">Inside the studio</p>
            <h3 id="listen-more-heading" className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              {spotlightProgram ? `Behind ${spotlightProgram.title}` : "The conversation continues"}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-300">
              Step behind the mic, meet the voices, and catch up on the conversations shaping CBM Radio.
            </p>
            {spotlightMedia && spotlightProgram ? (
              <button
                type="button"
                onClick={(event) => setActivePlayer({ program: spotlightProgram, media: spotlightMedia, trigger: event.currentTarget })}
                className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[#04b093] bg-[#04b093] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:border-white hover:bg-white"
                aria-label={"Play promo for " + spotlightProgram.title}
              >
                <Play size={14} fill="currentColor" aria-hidden="true" />
                Watch the show
              </button>
            ) : (
              <Link
                href="/episodes"
                className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[#04b093] bg-[#04b093] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:border-white hover:bg-white"
              >
                Listen to episodes <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>

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
    <article className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#111] lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative min-h-64 bg-zinc-900 sm:min-h-80 lg:min-h-[23rem]">
        <Image
          src={program.cover_image || Logo}
          alt={program.cover_image ? program.title : "CBM Radio"}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          unoptimized={Boolean(program.cover_image)}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-sm bg-[#04b093] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-black">
          <Sparkles size={12} aria-hidden="true" /> Featured show
        </span>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">CBM original show</p>
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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111] text-white transition-colors hover:border-[#04b093]/70">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
        <Image
          src={program.cover_image || Logo}
          alt={program.cover_image ? program.title : "CBM Radio"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={Boolean(program.cover_image)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-black/80 px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.12em] text-[#04b093] sm:left-3 sm:top-3 sm:px-2.5">
          <Sparkles size={10} aria-hidden="true" /> CBM Original
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="text-sm font-black uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#04b093] sm:text-xl">
          {program.title}
        </h3>
        <dl className="mt-2 space-y-1.5 text-[0.65rem] font-bold sm:mt-3 sm:space-y-2 sm:text-xs">
          {program.presenter && (
            <div className="flex items-center gap-1.5 text-zinc-300 sm:gap-2">
              <Mic2 size={12} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Presenter</dt>
              <dd className="truncate">Hosted by {program.presenter}</dd>
            </div>
          )}
          {program.schedule && (
            <div className="flex items-center gap-1.5 text-zinc-400 sm:gap-2">
              <CalendarDays size={12} className="shrink-0 text-[#04b093]" aria-hidden="true" />
              <dt className="sr-only">Schedule</dt>
              <dd className="line-clamp-1">{program.schedule}</dd>
            </div>
          )}
        </dl>
        {description && (
          <p className="mt-2 line-clamp-2 text-[0.65rem] leading-relaxed text-zinc-400 sm:mt-4 sm:line-clamp-3 sm:text-sm">{description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-white/10 pt-3 sm:gap-3 sm:pt-5">
          {promoMedia ? (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="inline-flex min-h-8 items-center gap-1 bg-[#04b093] px-2 py-1.5 text-[0.55rem] font-black uppercase tracking-wide text-black transition-colors hover:bg-white sm:min-h-10 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-wider"
              aria-label={"Play promo for " + program.title}
            >
              <Play size={11} fill="currentColor" />
              Play
            </button>
          ) : <span className="inline-flex items-center gap-1 text-[0.55rem] font-black uppercase tracking-wide text-zinc-500 sm:gap-2 sm:text-[0.65rem] sm:tracking-wider"><Headphones size={12} aria-hidden="true" /> Tune in</span>}
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex min-h-8 items-center gap-1 text-[0.55rem] font-black uppercase tracking-wide text-[#04b093] transition-colors hover:text-white sm:min-h-10 sm:gap-1.5 sm:text-xs sm:tracking-wider"
          >
            Episodes <ArrowUpRight size={12} aria-hidden="true" />
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
