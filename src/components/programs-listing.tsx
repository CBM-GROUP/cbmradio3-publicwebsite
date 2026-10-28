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
    <section id="programs-content" className="scroll-mt-24 bg-[#090909] px-6 pb-20 pt-14 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-black">
                The show directory
              </span>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-zinc-400">
                Voices worth tuning in for
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Discover our shows
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Meet the presenters, find your next favorite conversation, and catch every new episode.
            </p>
          </div>
          <Link
            href="/episodes"
            className="inline-flex w-fit items-center gap-2 border border-amber-500 bg-amber-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:border-amber-400 hover:bg-amber-400"
          >
            Browse episodes <ArrowUpRight size={15} />
          </Link>
        </div>

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
              className="mt-5 border border-amber-500 bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-amber-400"
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
                className="mt-4 inline-block font-black uppercase text-amber-400 underline underline-offset-4"
              >
                Return to page 1
              </button>
            )}
          </div>
        )}

        {state === "ready" && programs.results.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.results.map((program) => (
              <ProgramCard key={program.id} program={program} onPlay={(media, trigger) => setActivePlayer({ program, media, trigger })} />
            ))}
          </div>
        )}

        {state === "ready" && (programs.previous || programs.next) && (
          <nav aria-label="Show pagination" className="mt-12 flex items-center justify-center gap-4 border-t border-white/10 pt-8">
            <button
              type="button"
              disabled={!programs.previous}
              onClick={() => navigateToPage(Math.max(1, page - 1))}
              className="border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-amber-500 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-zinc-400" aria-current="page">Page {page}</span>
            <button
              type="button"
              disabled={!programs.next}
              onClick={() => navigateToPage(page + 1)}
              className="border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:border-amber-500 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
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

function ProgramCard({ program, onPlay }: { program: ProgramSummary; onPlay: (media: YouTubeMedia, trigger: HTMLButtonElement) => void }) {
  const description = program.short_description;
  const promoMedia = getYouTubeMedia(program.promo_video_url);

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-black text-white transition-colors hover:border-amber-500/70">
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
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-black/80 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.16em] text-amber-400">
          <Sparkles size={11} /> CBM Original
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-amber-400">
          {program.title}
        </h3>
        <dl className="mt-3 space-y-2 text-xs font-bold">
          {program.presenter && (
            <div className="flex items-center gap-2 text-zinc-300">
              <Mic2 size={13} className="shrink-0 text-amber-400" />
              <dt className="sr-only">Presenter</dt>
              <dd>Hosted by {program.presenter}</dd>
            </div>
          )}
          {program.schedule && (
            <div className="flex items-center gap-2 text-zinc-400">
              <CalendarDays size={13} className="shrink-0 text-amber-400" />
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
              className="inline-flex items-center gap-2 bg-amber-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-amber-400"
              aria-label={"Play promo for " + program.title}
            >
              <Play size={13} fill="currentColor" />
              Play Promo
            </button>
          ) : <span className="inline-flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-wider text-zinc-500"><Headphones size={14} /> Tune in</span>}
          <Link
            href={`/episodes?program=${encodeURIComponent(program.slug)}`}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 transition-colors hover:text-amber-300"
          >
            Episodes <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
