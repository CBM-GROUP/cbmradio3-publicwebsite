"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
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
      className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-5 py-16 text-black sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header: Billboard + Zwart Aesthetic */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-black pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                THE HOT CRATE
              </span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-black">
                ON-DEMAND EPISODES & SERIES
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              Must-Listen Episodes & Podcast Releases
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-black/85">
              Browse our curated releases across life, culture, faith, and entertainment. Stream every release directly in the master player.
            </p>
          </div>

          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 border-2 border-black bg-black px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition hover:bg-white hover:text-black w-fit shadow-xl"
          >
            <span>All Catalog ({episodes.length})</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Billboard Search & Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-black/20 pb-5">
          
          {/* Live Search Input */}
          <div className="relative w-full max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search episodes, series, or topics..."
              className="w-full border-2 border-black bg-black py-2.5 pl-10 pr-9 text-xs font-bold text-white placeholder-zinc-400 focus:outline-none"
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-[0.68rem] font-black uppercase tracking-wider text-black">
              {filteredEpisodes.length} {filteredEpisodes.length === 1 ? "release" : "releases"} found
            </span>

            <div className="flex items-center border-2 border-black bg-black">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid layout"
                className={`p-2 transition ${
                  viewMode === "grid"
                    ? "bg-[#04b093] text-black"
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
                    ? "bg-[#04b093] text-black"
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
            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black mr-2">
              <Filter size={12} />
              <span>Series:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedProgramId("all")}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                selectedProgramId === "all"
                  ? "bg-black text-[#04b093] shadow-md"
                  : "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white"
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
                  className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                    selectedProgramId === prog.id
                      ? "bg-black text-[#04b093] shadow-md"
                      : "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white"
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
          <div className="border-2 border-black bg-black p-16 text-center text-white">
            <p className="text-sm font-black uppercase tracking-wider">RETRIEVING CRATE DROPS...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayList.length === 0 && (
          <div className="border-2 border-black bg-black p-16 text-center text-white">
            <p className="text-sm">No episodes match your search or filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedProgramId("all");
                setSearchQuery("");
              }}
              className="mt-4 text-xs font-black text-[#04b093] underline uppercase"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* VIEW MODE 1: ZWART POSTER GRID */}
        {!loading && displayList.length > 0 && viewMode === "grid" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayList.map((episode, idx) => {
              const formattedDate = formatCardDate(episode.publish_date);

              return (
                <article
                  key={episode.id}
                  className="group flex flex-col justify-between border-2 border-black bg-black p-5 text-white transition-all duration-200 hover:border-white shadow-2xl"
                >
                  <div>
                    {/* Media Thumbnail */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black border border-white/15">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      {/* Rank / Track Identifier Badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="bg-black/90 px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-white border border-white/20">
                          #{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="bg-[#04b093] px-2 py-0.5 text-[0.62rem] font-black uppercase tracking-wider text-black">
                            HOT
                          </span>
                        )}
                      </div>

                      {/* Play Button Overlay */}
                      <button
                        type="button"
                        onClick={() => playEpisode(episode, true)}
                        aria-label={`Play ${episode.title}`}
                        className="absolute inset-0 m-auto grid size-12 place-items-center bg-[#04b093] text-black opacity-0 transition-opacity group-hover:opacity-100 hover:scale-105"
                      >
                        <Play size={18} className="ml-0.5 fill-black" />
                      </button>
                    </div>

                    {/* Metadata Header */}
                    <div className="mt-4 flex items-center justify-between text-[0.68rem]">
                      <span className="font-black uppercase tracking-wider text-[#04b093]">
                        {episode.program_title || "Original Series"}
                      </span>
                      {formattedDate && (
                        <span className="text-zinc-400">
                          {formattedDate}
                        </span>
                      )}
                    </div>

                    {/* Episode Headline */}
                    <h3 className="mt-2 text-lg font-black uppercase tracking-tight text-white group-hover:text-[#04b093] transition-colors line-clamp-2">
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
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-black uppercase">
                    <button
                      type="button"
                      onClick={() => playEpisode(episode, true)}
                      className="inline-flex items-center gap-1.5 text-[#04b093] hover:text-[#05c6a5] transition"
                    >
                      <Play size={12} className="fill-current" />
                      <span>Stream Master</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(episode)}
                        aria-label="Copy link"
                        className="text-zinc-400 hover:text-[#04b093] transition"
                      >
                        {copiedId === episode.id ? (
                          <span className="text-[0.68rem] text-[#04b093]">Copied!</span>
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

        {/* VIEW MODE 2: BILLBOARD CHART LIST VIEW */}
        {!loading && displayList.length > 0 && viewMode === "list" && (
          <div className="border-2 border-black bg-black text-white divide-y divide-white/10 shadow-2xl">
            
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-[0.68rem] font-black uppercase tracking-wider text-zinc-400 border-b border-white/15 bg-black">
              <span className="col-span-1">RANK</span>
              <span className="col-span-6">EPISODE / SHOW</span>
              <span className="col-span-2">RELEASE</span>
              <span className="col-span-3 text-right">ACTION</span>
            </div>

            {displayList.map((episode, idx) => {
              const formattedDate = formatCardDate(episode.publish_date);

              return (
                <div
                  key={episode.id}
                  className="group grid grid-cols-1 sm:grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-white/[0.04]"
                >
                  {/* Rank */}
                  <div className="sm:col-span-1 flex items-center gap-3">
                    <span className="text-2xl font-black tabular-nums tracking-tighter text-[#04b093]">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Episode Info */}
                  <div className="sm:col-span-6 flex items-center gap-3.5 min-w-0">
                    <div className="relative size-12 shrink-0 overflow-hidden bg-black border border-white/20">
                      <Image
                        src={
                          episode.cover_image ||
                          episode.external_cover_image_url ||
                          DanielPortrait
                        }
                        alt={episode.title}
                        fill
                        sizes="48px"
                        unoptimized={Boolean(episode.cover_image)}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.65rem] font-black uppercase tracking-wider text-[#04b093]">
                        {episode.program_title}
                      </p>
                      <h4 className="text-sm font-black uppercase text-white group-hover:text-[#04b093] transition-colors truncate">
                        <Link href={`/episodes/${encodeURIComponent(episode.slug)}`}>
                          {episode.title}
                        </Link>
                      </h4>
                    </div>
                  </div>

                  {/* Release Date */}
                  <div className="sm:col-span-2 text-xs font-bold text-zinc-400">
                    {formattedDate || "Recorded"}
                  </div>

                  {/* Action Controls */}
                  <div className="sm:col-span-3 flex items-center justify-end gap-3 text-xs font-black uppercase">
                    <button
                      type="button"
                      onClick={() => playEpisode(episode, true)}
                      className="inline-flex items-center gap-1.5 bg-[#04b093] px-3.5 py-1.5 text-black hover:bg-[#05c6a5] transition"
                    >
                      <Play size={12} className="fill-black" />
                      <span>Play</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(episode)}
                      className="border border-white/20 p-2 text-zinc-400 hover:text-white hover:border-white transition"
                    >
                      {copiedId === episode.id ? (
                        <span className="text-[0.65rem] text-[#04b093]">✓</span>
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>

                    <Link
                      href={`/episodes/${encodeURIComponent(episode.slug)}`}
                      className="border border-white/20 p-2 text-zinc-400 hover:text-white hover:border-white transition"
                    >
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
