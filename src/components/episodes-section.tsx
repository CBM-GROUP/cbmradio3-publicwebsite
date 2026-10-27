"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Copy,
  Filter,
  LayoutGrid,
  List,
  Play,
  Search,
  X,
} from "lucide-react";

import homeService from "@/services/home.service";
import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import type { EpisodeSummary, ProgramSummary } from "@/types/program";

import DanielPortrait from "../../public/cbm_images/daniel.svg";

export default function EpisodesSection() {
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { playEpisode } = useEpisodePlayerStore();

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      homeService.getFeaturedEpisodes(),
      homeService.getLatestEpisodes(),
      homeService.getFeaturedPrograms(),
    ]).then(([featuredRes, latestRes, programsRes]) => {
      if (!isMounted) return;

      const featured = featuredRes.status === "fulfilled" ? featuredRes.value : [];
      const latest = latestRes.status === "fulfilled" ? latestRes.value : [];
      const unique = [...featured];
      for (const item of latest) {
        if (!unique.some((e) => e.id === item.id)) {
          unique.push(item);
        }
      }
      setEpisodes(unique);

      if (programsRes.status === "fulfilled") {
        setPrograms(programsRes.value);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter episodes by series and search query
  const filteredEpisodes = episodes.filter((ep) => {
    const matchesProgram =
      selectedProgramId === "all" || ep.program_id === selectedProgramId;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      ep.title.toLowerCase().includes(query) ||
      ep.program_title.toLowerCase().includes(query) ||
      ep.description.toLowerCase().includes(query);

    return matchesProgram && matchesQuery;
  });

  const displayList = filteredEpisodes.slice(0, 9);

  const handleCopyLink = (ep: EpisodeSummary) => {
    const url = `${window.location.origin}/episodes/${encodeURIComponent(ep.slug)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(ep.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section
      id="episodes"
      className="relative scroll-mt-20 border-b border-white/10 bg-[#08090a] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Section Index & Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#00d4a5]">
              <span>INDEX 02</span>
              <span className="text-white/20">/</span>
              <span>EPISODE CRATE</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              On-Demand Recordings & Podcasts
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Listen to full episodes released from the CBM studio. Search, filter by series, or stream instantly.
            </p>
          </div>

          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5] w-fit"
          >
            <span>Complete Catalog ({episodes.length})</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Interactive Controls Bar: Search, Filters & View Mode */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-5">
          
          {/* Live Search Input */}
          <div className="relative w-full max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search episodes, topics, or series..."
              className="w-full border border-white/15 bg-[#0e1013] py-2.5 pl-10 pr-9 text-xs text-white placeholder-zinc-500 focus:border-[#00d4a5] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Controls: View Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-zinc-500">
              Showing {filteredEpisodes.length} {filteredEpisodes.length === 1 ? "release" : "releases"}
            </span>

            <div className="flex items-center border border-white/15 bg-[#0e1013]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid layout"
                className={`p-2 transition ${
                  viewMode === "grid"
                    ? "bg-[#00d4a5] text-[#062521]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List layout"
                className={`p-2 transition ${
                  viewMode === "list"
                    ? "bg-[#00d4a5] text-[#062521]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>

        </div>

        {/* Series Filter Chips */}
        {programs.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 mr-2">
              <Filter size={12} />
              <span>Series:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedProgramId("all")}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                selectedProgramId === "all"
                  ? "bg-[#00d4a5] text-[#062521]"
                  : "border border-white/10 bg-[#0e1013] text-zinc-400 hover:border-white/30 hover:text-white"
              }`}
            >
              All Series ({episodes.length})
            </button>
            {programs.map((prog) => {
              const count = episodes.filter((e) => e.program_id === prog.id).length;
              return (
                <button
                  key={prog.id}
                  type="button"
                  onClick={() => setSelectedProgramId(prog.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                    selectedProgramId === prog.id
                      ? "bg-[#00d4a5] text-[#062521]"
                      : "border border-white/10 bg-[#0e1013] text-zinc-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {prog.title} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="border border-white/10 bg-[#0e1013] p-16 text-center text-zinc-400">
            <p className="text-sm font-semibold tracking-wider">RETRIEVING EPISODES ARCHIVE...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayList.length === 0 && (
          <div className="border border-white/10 bg-[#0e1013] p-16 text-center text-zinc-400">
            <p className="text-sm">No episodes match your search or filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedProgramId("all");
                setSearchQuery("");
              }}
              className="mt-4 text-xs font-bold text-[#00d4a5] underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* VIEW MODE 1: EDITORIAL GRID */}
        {!loading && displayList.length > 0 && viewMode === "grid" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayList.map((episode, idx) => {
              const formattedDate = formatCardDate(episode.publish_date);

              return (
                <article
                  key={episode.id}
                  className="group flex flex-col justify-between border border-white/10 bg-[#0e1013] p-5 transition-all duration-200 hover:border-[#00d4a5]"
                >
                  <div>
                    {/* Media Thumbnail */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 border border-white/10">
                      <Image
                        src={
                          episode.cover_image ||
                          episode.external_cover_image_url ||
                          DanielPortrait
                        }
                        alt={episode.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={Boolean(episode.cover_image)}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Top Track Identifier */}
                      <div className="absolute left-3 top-3">
                        <span className="bg-black/80 px-2 py-0.5 text-[0.62rem] font-black uppercase tracking-wider text-zinc-300 border border-white/10">
                          REC 0{idx + 1}
                        </span>
                      </div>

                      {/* Play Button Overlay */}
                      <button
                        type="button"
                        onClick={() => playEpisode(episode, true)}
                        aria-label={`Play ${episode.title}`}
                        className="absolute inset-0 m-auto grid size-12 place-items-center bg-[#00d4a5] text-[#062521] opacity-0 transition-opacity group-hover:opacity-100 hover:scale-105"
                      >
                        <Play size={18} className="ml-0.5 fill-[#062521]" />
                      </button>
                    </div>

                    {/* Metadata Header */}
                    <div className="mt-4 flex items-center justify-between text-[0.68rem] text-zinc-500">
                      <span className="font-black uppercase tracking-wider text-[#00d4a5]">
                        {episode.program_title || "Original Series"}
                      </span>
                      {formattedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          <span>{formattedDate}</span>
                        </span>
                      )}
                    </div>

                    {/* Episode Headline */}
                    <h3 className="mt-2 text-lg font-black text-white group-hover:text-[#00d4a5] transition-colors line-clamp-2">
                      <Link href={`/episodes/${encodeURIComponent(episode.slug)}`}>
                        {episode.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    {episode.description && (
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                        {episode.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => playEpisode(episode, true)}
                      className="inline-flex items-center gap-1.5 text-[#00d4a5] hover:text-[#34e2b8] transition"
                    >
                      <Play size={12} className="fill-current" />
                      <span>Stream Master</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(episode)}
                        aria-label="Copy link"
                        className="text-zinc-400 hover:text-[#00d4a5] transition"
                      >
                        {copiedId === episode.id ? (
                          <span className="text-[0.68rem] text-[#00d4a5]">Copied!</span>
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>

                      <Link
                        href={`/episodes/${encodeURIComponent(episode.slug)}`}
                        className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition"
                      >
                        <span>Details</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 2: TRACKLIST / AUDIO DECK VIEW */}
        {!loading && displayList.length > 0 && viewMode === "list" && (
          <div className="border border-white/10 bg-[#0e1013] divide-y divide-white/10">
            {displayList.map((episode, idx) => {
              const formattedDate = formatCardDate(episode.publish_date);

              return (
                <div
                  key={episode.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    
                    {/* Track Number / Play Button */}
                    <div className="relative size-10 shrink-0">
                      <button
                        type="button"
                        onClick={() => playEpisode(episode, true)}
                        aria-label={`Play ${episode.title}`}
                        className="grid size-10 place-items-center bg-[#00d4a5] text-[#062521] shadow transition hover:scale-105 hover:bg-[#34e2b8]"
                      >
                        <Play size={14} className="ml-0.5 fill-[#062521]" />
                      </button>
                    </div>

                    {/* Information */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[0.65rem] text-zinc-500">
                        <span className="font-black uppercase tracking-wider text-[#00d4a5]">
                          {episode.program_title}
                        </span>
                        <span>·</span>
                        <span>TRACK 0{idx + 1}</span>
                        {formattedDate && (
                          <>
                            <span>·</span>
                            <span>{formattedDate}</span>
                          </>
                        )}
                      </div>

                      <h4 className="mt-0.5 text-sm font-black text-white group-hover:text-[#00d4a5] transition-colors truncate max-w-xl">
                        <Link href={`/episodes/${encodeURIComponent(episode.slug)}`}>
                          {episode.title}
                        </Link>
                      </h4>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 self-end sm:self-auto shrink-0 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(episode)}
                      className="text-zinc-400 hover:text-[#00d4a5] transition"
                    >
                      {copiedId === episode.id ? (
                        <span className="text-[0.68rem] text-[#00d4a5]">Copied!</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[0.7rem]">
                          <Copy size={12} /> Share
                        </span>
                      )}
                    </button>

                    <Link
                      href={`/episodes/${encodeURIComponent(episode.slug)}`}
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition"
                    >
                      <span>Episode Page</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

function formatCardDate(value: string | null) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-UG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d);
}
