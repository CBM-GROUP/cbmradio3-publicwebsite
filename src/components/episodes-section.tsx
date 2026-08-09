"use client";

import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import homeService from "@/services/home.service";
import YouTubeDialog from "@/components/media/youtube-dialog";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import type { EpisodeSummary } from "@/types/program";
import Logo from "../../public/cbmradio.png";

const EPISODE_LIMIT = 3;
type RequestState = "loading" | "ready" | "error";

export default function EpisodesSection() {
  const [featured, setFeatured] = useState<EpisodeSummary[]>([]);
  const [latest, setLatest] = useState<EpisodeSummary[]>([]);
  const [featuredState, setFeaturedState] = useState<RequestState>("loading");
  const [latestState, setLatestState] = useState<RequestState>("loading");
  const [activePlayer, setActivePlayer] = useState<{ episode: EpisodeSummary; media: YouTubeMedia; trigger: HTMLButtonElement } | null>(null);

  useEffect(() => {
    let isMounted = true;
    homeService.getFeaturedEpisodes().then((items) => {
      if (!isMounted) return;
      setFeatured(items.slice(0, EPISODE_LIMIT));
      setFeaturedState("ready");
    }).catch(() => { if (isMounted) setFeaturedState("error"); });
    homeService.getLatestEpisodes().then((items) => {
      if (!isMounted) return;
      setLatest(items);
      setLatestState("ready");
    }).catch(() => { if (isMounted) setLatestState("error"); });
    return () => { isMounted = false; };
  }, []);

  const featuredIds = new Set(featured.map((episode) => episode.id));
  const uniqueLatest = latest.filter((episode) => !featuredIds.has(episode.id)).slice(0, EPISODE_LIMIT);
  const allEmpty = featuredState === "ready" && latestState === "ready" && featured.length === 0 && uniqueLatest.length === 0;

  return (
    <section className="bg-zinc-900 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Episodes</p><h2 className="mt-3 text-3xl font-bold">Listen and watch</h2></div>
        {(featuredState === "loading" || latestState === "loading") && featured.length === 0 && uniqueLatest.length === 0 && <p className="min-h-48 text-center text-zinc-400" aria-live="polite">Loading episodes...</p>}
        {featuredState === "error" && latestState === "error" && <p className="min-h-48 text-center text-zinc-400">Episodes are temporarily unavailable.</p>}
        {allEmpty && <p className="min-h-48 text-center text-zinc-400">No episodes are available right now.</p>}

        {featured.length > 0 && <EpisodeGroup heading="Featured episodes" episodes={featured} onPlay={(episode, media, trigger) => setActivePlayer({ episode, media, trigger })} />}
        {featuredState === "error" && uniqueLatest.length > 0 && <p className="mb-5 text-sm text-zinc-500">Featured episodes are temporarily unavailable.</p>}
        {uniqueLatest.length > 0 && <div className={featured.length > 0 ? "mt-12" : ""}><EpisodeGroup heading="Latest episodes" episodes={uniqueLatest} onPlay={(episode, media, trigger) => setActivePlayer({ episode, media, trigger })} /></div>}
        {latestState === "error" && featured.length > 0 && <p className="mt-6 text-sm text-zinc-500">Latest episodes are temporarily unavailable.</p>}
      </div>
      {activePlayer && <YouTubeDialog title={activePlayer.episode.title} media={activePlayer.media} returnFocus={activePlayer.trigger} onClose={() => setActivePlayer(null)} />}
    </section>
  );
}

function EpisodeGroup({ heading, episodes, onPlay }: { heading: string; episodes: EpisodeSummary[]; onPlay: (episode: EpisodeSummary, media: YouTubeMedia, trigger: HTMLButtonElement) => void }) {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">{heading}</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {episodes.map((episode) => {
          const media = getYouTubeMedia(episode.youtube_embed_url || episode.youtube_link);
          const content = (
            <>
              <div className="relative aspect-video bg-zinc-950"><Image src={episode.cover_image || Logo} alt={episode.title} fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized={Boolean(episode.cover_image)} className="object-cover" /></div>
              <div className="p-5"><p className="text-sm text-emerald-500">{episode.program_title}</p><h4 className="mt-2 text-lg font-bold">{episode.title}</h4>{episode.publish_date && <p className="mt-3 flex items-center gap-2 text-xs text-zinc-400"><CalendarDays size={15} /> {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(episode.publish_date))}</p>}</div>
            </>
          );
          return media ? <button type="button" key={episode.id} onClick={(event) => onPlay(episode, media, event.currentTarget)} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-left transition hover:border-emerald-600" aria-label={"Play " + episode.title}>{content}</button> : <article key={episode.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">{content}</article>;
        })}
      </div>
    </div>
  );
}
