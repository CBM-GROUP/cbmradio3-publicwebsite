"use client";

import axios from "axios";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
    <section id="programs-content" className="scroll-mt-24 bg-zinc-950 px-6 pb-20 pt-32 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Programs</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Our Shows</h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Explore CBM Radio programs, presenters and broadcast schedules.
          </p>
        </div>

        {state === "loading" && (
          <p className="min-h-80 text-center text-zinc-400" aria-live="polite">
            Loading programs...
          </p>
        )}

        {state === "error" && (
          <div className="min-h-80 text-center text-zinc-400" role="alert">
            <p>Programs are temporarily unavailable.</p>
            <button
              type="button"
              onClick={() => setRetryVersion((value) => value + 1)}
              className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-black"
            >
              Retry
            </button>
          </div>
        )}

        {state === "ready" && programs.results.length === 0 && (
          <div className="min-h-80 text-center text-zinc-400">
            <p>
              {page > 1
                ? "No programs are available on this page."
                : "No programs are available yet."}
            </p>
            {page > 1 && (
              <button
                type="button"
                onClick={() => navigateToPage(1)}
                className="mt-4 font-semibold text-emerald-500 underline"
              >
                Return to page 1
              </button>
            )}
          </div>
        )}

        {state === "ready" && programs.results.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programs.results.map((program) => (
              <ProgramCard key={program.id} program={program} onPlay={(media, trigger) => setActivePlayer({ program, media, trigger })} />
            ))}
          </div>
        )}

        {state === "ready" && (programs.previous || programs.next) && (
          <nav aria-label="Program pagination" className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={!programs.previous}
              onClick={() => navigateToPage(Math.max(1, page - 1))}
              className="rounded-lg border border-zinc-700 px-5 py-2.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-400" aria-current="page">Page {page}</span>
            <button
              type="button"
              disabled={!programs.next}
              onClick={() => navigateToPage(page + 1)}
              className="rounded-lg border border-zinc-700 px-5 py-2.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
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
    <article className="cbm-card flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="relative aspect-video bg-zinc-800">
        <Image
          src={program.cover_image || Logo}
          alt={program.cover_image ? program.title : "CBM Radio"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={Boolean(program.cover_image)}
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-2xl font-bold">{program.title}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          {program.presenter && (
            <div>
              <dt className="inline font-semibold text-emerald-500">Presenter: </dt>
              <dd className="inline text-zinc-300">{program.presenter}</dd>
            </div>
          )}
          {program.schedule && (
            <div>
              <dt className="inline font-semibold text-emerald-500">Schedule: </dt>
              <dd className="inline text-zinc-300">{program.schedule}</dd>
            </div>
          )}
        </dl>
        {description && (
          <p className="mt-5 line-clamp-4 leading-7 text-zinc-400">{description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
          {promoMedia && (
            <button
              type="button"
              onClick={(event) => onPlay(promoMedia, event.currentTarget)}
              className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400"
              aria-label={"Play promo for " + program.title}
            >
              Play Promo
            </button>
          )}
          <span className="text-sm text-zinc-500">Episodes page coming soon</span>
        </div>
      </div>
    </article>
  );
}
