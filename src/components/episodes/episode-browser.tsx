"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import EpisodeCard from "@/components/episodes/episode-card";
import ProgramTabs from "@/components/episodes/program-tabs";
import YouTubeDialog from "@/components/media/youtube-dialog";
import type { YouTubeMedia } from "@/lib/youtube";
import { episodeService } from "@/services/episode.service";
import { programService } from "@/services/program.service";
import type { EpisodeSummary, ProgramSummary } from "@/types/program";

type RequestState = "loading" | "ready" | "error";

export default function EpisodeBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get("program")?.trim() || "";
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [programsState, setProgramsState] = useState<RequestState>("loading");
  const [programsPartial, setProgramsPartial] = useState(false);
  const [programsRetry, setProgramsRetry] = useState(0);
  const [featured, setFeatured] = useState<EpisodeSummary[]>([]);
  const [recent, setRecent] = useState<EpisodeSummary[]>([]);
  const [featuredState, setFeaturedState] = useState<RequestState>("loading");
  const [recentState, setRecentState] = useState<RequestState>("loading");
  const [featuredRetry, setFeaturedRetry] = useState(0);
  const [recentRetry, setRecentRetry] = useState(0);
  const [recentNextPage, setRecentNextPage] = useState<number | null>(null);
  const [loadMoreState, setLoadMoreState] = useState<"idle" | "loading" | "error">("idle");
  const recentRequestVersion = useRef(0);
  const [activePlayer, setActivePlayer] = useState<{
    episode: EpisodeSummary;
    media: YouTubeMedia;
    trigger: HTMLButtonElement;
  } | null>(null);

  useEffect(() => {
    queueMicrotask(() => setActivePlayer(null));
  }, [requestedSlug]);

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => { if (mounted) setProgramsState("loading"); });
    programService.getPrograms().then((response) => {
      if (!mounted) return;
      setPrograms(response.results);
      setProgramsPartial(false);
      setProgramsState("ready");
    }).catch(() => { if (mounted) setProgramsState("error"); });
    return () => { mounted = false; };
  }, [programsRetry]);

  const selectedProgram = programs.find((program) => program.slug === requestedSlug);
  const selectedSlug = selectedProgram?.slug || "";
  const programId = selectedProgram?.id;
  const filterReady = programsState !== "loading";

  useEffect(() => {
    if (!filterReady) return;
    let mounted = true;
    queueMicrotask(() => { if (mounted) setFeaturedState("loading"); });
    episodeService.getEpisodes({
      page: 1,
      program: programId,
      isFeatured: true,
      ordering: "-publish_date",
    }).then((response) => {
      if (!mounted) return;
      setFeatured(response.results.slice(0, selectedProgram ? 2 : 3));
      setFeaturedState("ready");
    }).catch(() => { if (mounted) setFeaturedState("error"); });
    return () => { mounted = false; };
  }, [featuredRetry, filterReady, programId, selectedProgram]);

  useEffect(() => {
    if (!filterReady) return;
    const requestVersion = ++recentRequestVersion.current;
    let mounted = true;
    queueMicrotask(() => {
      if (!mounted) return;
      setRecent([]);
      setRecentNextPage(null);
      setLoadMoreState("idle");
      setRecentState("loading");
    });
    episodeService.getEpisodes({
      page: 1,
      program: programId,
      ordering: "-publish_date",
    }).then((response) => {
      if (!mounted || recentRequestVersion.current !== requestVersion) return;
      setRecent(response.results);
      setRecentNextPage(getNextPage(response.next));
      setRecentState("ready");
    }).catch(() => {
      if (mounted && recentRequestVersion.current === requestVersion) setRecentState("error");
    });
    return () => { mounted = false; };
  }, [filterReady, programId, recentRetry]);

  const featuredIds = useMemo(
    () => new Set(featured.map((episode) => episode.id)),
    [featured],
  );
  const uniqueRecent = recent.filter((episode) => !featuredIds.has(episode.id));

  const openPlayer = useCallback((episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => {
    setActivePlayer({ episode, media, trigger });
  }, []);

  const loadMore = useCallback(async () => {
    if (!recentNextPage || loadMoreState === "loading") return;
    const requestVersion = recentRequestVersion.current;
    const requestedPage = recentNextPage;
    setLoadMoreState("loading");
    try {
      const response = await episodeService.getEpisodes({
        page: requestedPage,
        program: programId,
        ordering: "-publish_date",
      });
      if (recentRequestVersion.current !== requestVersion) return;
      setRecent((current) => mergeEpisodes(current, response.results));
      setRecentNextPage(getNextPage(response.next));
      setLoadMoreState("idle");
    } catch {
      if (recentRequestVersion.current === requestVersion) setLoadMoreState("error");
    }
  }, [loadMoreState, programId, recentNextPage]);

  const selectProgram = useCallback((slug: string) => {
    if (slug === selectedSlug && !(requestedSlug && !selectedProgram)) return;
    setActivePlayer(null);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("program", slug);
    else params.delete("program");
    const query = params.toString();
    router.push(query ? pathname + "?" + query : pathname, { scroll: false });
  }, [pathname, requestedSlug, router, searchParams, selectedProgram, selectedSlug]);

  return (
    <section className="bg-[#04b093] px-4 py-16 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {programsState === "loading" && (
          <p className="min-h-14 text-sm font-bold text-black" aria-live="polite">
            Loading program filters...
          </p>
        )}
        {programsState === "error" && (
          <div className="flex min-h-14 flex-wrap items-center gap-3 text-sm text-black" role="alert">
            <span>Program filters are temporarily unavailable. Showing all episodes.</span>
            <button type="button" onClick={() => setProgramsRetry((value) => value + 1)} className="font-black text-black underline">Retry</button>
          </div>
        )}
        {programsState === "ready" && (
          <ProgramTabs programs={programs} selectedSlug={selectedSlug} onSelect={selectProgram} />
        )}
        {programsState === "ready" && programsPartial && (
          <p className="mt-4 text-sm text-amber-200">
            Some program filters could not be loaded. Available programs are shown.
          </p>
        )}
        {programsState === "ready" && requestedSlug && !selectedProgram && (
          <p className="mt-4 rounded-lg border border-amber-800/50 bg-amber-950/20 p-3 text-sm text-amber-200">
            That program is unavailable. Showing all episodes.
          </p>
        )}

        <EpisodeSection
          heading={selectedProgram ? "Featured Episodes for " + selectedProgram.title : "Featured Episodes"}
          episodes={featured}
          state={featuredState}
          featured
          onPlay={openPlayer}
          retry={() => setFeaturedRetry((value) => value + 1)}
        />
        <EpisodeSection
          heading={selectedProgram ? "Recent Episodes from " + selectedProgram.title : "Recent Episodes"}
          episodes={uniqueRecent}
          state={recentState}
          onPlay={openPlayer}
          emptyMessage={selectedProgram ? "There are currently no episodes for this program." : "No episodes have been published yet."}
          retry={() => setRecentRetry((value) => value + 1)}
          canLoadMore={recentNextPage !== null}
          loadMoreState={loadMoreState}
          onLoadMore={loadMore}
        />
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

function EpisodeSection({
  heading,
  episodes,
  state,
  featured = false,
  emptyMessage = "No featured episodes are available right now.",
  retry,
  onPlay,
  canLoadMore = false,
  loadMoreState = "idle",
  onLoadMore,
}: {
  heading: string;
  episodes: EpisodeSummary[];
  state: RequestState;
  featured?: boolean;
  emptyMessage?: string;
  retry: () => void;
  onPlay: (episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => void;
  canLoadMore?: boolean;
  loadMoreState?: "idle" | "loading" | "error";
  onLoadMore?: () => void;
}) {
  return (
    <section className="mt-14" aria-labelledby={heading.replaceAll(" ", "-").toLowerCase()}>
      <h2 id={heading.replaceAll(" ", "-").toLowerCase()} className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">{heading}</h2>
      {state === "loading" && <p className="min-h-48 pt-8 font-bold text-black" aria-live="polite">Loading {heading.toLowerCase()}...</p>}
      {state === "error" && (
        <div className="min-h-48 pt-8 text-black" role="alert">
          <p>{heading} are temporarily unavailable.</p>
          <button type="button" onClick={retry} className="mt-4 border-2 border-black bg-black px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093]">Retry</button>
        </div>
      )}
      {state === "ready" && episodes.length === 0 && <p className="min-h-24 pt-6 font-medium text-black/80">{emptyMessage}</p>}
      {state === "ready" && episodes.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} featured={featured} onPlay={onPlay} />)}
        </div>
      )}
      {state === "ready" && episodes.length > 0 && (canLoadMore || loadMoreState !== "idle") && onLoadMore && (
        <div className="mt-8 text-center">
          {loadMoreState === "error" && <p className="mb-3 text-sm text-red-950 font-bold" role="alert">More episodes could not be loaded.</p>}
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadMoreState === "loading"}
            className="min-h-11 border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition hover:bg-white hover:text-black shadow-md disabled:cursor-wait disabled:opacity-60"
          >
            {loadMoreState === "loading" ? "Loading more episodes..." : loadMoreState === "error" ? "Try Again" : "Load More Episodes"}
          </button>
          <span className="sr-only" aria-live="polite">{loadMoreState === "loading" ? "Loading more episodes" : ""}</span>
        </div>
      )}
    </section>
  );
}

function getNextPage(next: string | null) {
  if (!next) return null;
  try {
    const value = Number(new URL(next, window.location.origin).searchParams.get("page"));
    return Number.isSafeInteger(value) && value > 1 ? value : null;
  } catch {
    return null;
  }
}

function mergeEpisodes(current: EpisodeSummary[], incoming: EpisodeSummary[]) {
  const ids = new Set(current.map((episode) => episode.id));
  return [...current, ...incoming.filter((episode) => !ids.has(episode.id) && ids.add(episode.id))];
}
