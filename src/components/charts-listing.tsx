"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Disc3,
  Flame,
  Minus,
  Pause,
  Play,
  Search,
  Sparkles,
  Trophy,
  Volume2,
} from "lucide-react";
import { FaApple, FaSpotify, FaYoutube } from "react-icons/fa";
import { chartService } from "@/services/chart.service";
import type { Chart, ChartEntry } from "@/types/chart";

export default function ChartsListing() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [activeChart, setActiveChart] = useState<Chart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // In-page Audio Player State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load available charts
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const list = await chartService.getCharts();
        if (!isMounted) return;
        const activeList = list.filter((c) => c.is_active);
        setCharts(activeList.length ? activeList : list);

        if (list.length > 0) {
          const firstSlug = (activeList[0] || list[0]).slug;
          setSelectedSlug(firstSlug);
        }
      } catch (err) {
        console.error("Failed to fetch charts:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    void init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load selected chart details
  const loadChart = useCallback(async (slug: string) => {
    if (!slug) return;
    setChartLoading(true);
    try {
      const data = await chartService.getChartBySlug(slug);
      setActiveChart(data);
    } catch (err) {
      console.error(`Failed to load chart ${slug}:`, err);
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      const t = setTimeout(() => void loadChart(selectedSlug), 0);
      return () => clearTimeout(t);
    }
  }, [selectedSlug, loadChart]);

  // Audio Playback Handler
  const togglePlayTrack = (entry: ChartEntry) => {
    if (!entry.audio_url) return;

    if (playingTrackId === entry.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = entry.audio_url;
        audioRef.current.play().catch(() => setIsPlaying(false));
        setPlayingTrackId(entry.id);
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayingTrackId(null);
  };

  // Filter entries
  const filteredEntries = useMemo(() => {
    const entries = activeChart?.entries || [];
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        (e.featured_artists && e.featured_artists.toLowerCase().includes(q)) ||
        (e.album && e.album.toLowerCase().includes(q)),
    );
  }, [activeChart, searchQuery]);

  // Top 3 Spotlight tracks
  const top1 = activeChart?.entries?.find((e) => e.rank === 1);
  const top2 = activeChart?.entries?.find((e) => e.rank === 2);
  const top3 = activeChart?.entries?.find((e) => e.rank === 3);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-zinc-400">
          <Disc3 className="h-5 w-5 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Loading CBM Music Charts…</span>
        </div>
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
          <Trophy className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="text-lg font-semibold text-white">No Charts Available</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Check back soon for the latest gospel music countdowns!
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hidden Audio Player Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Charts Selector Tabs & Meta Header */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {/* Chart Tabs */}
          {charts.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {charts.map((c) => {
                const isSelected = c.slug === selectedSlug;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedSlug(c.slug)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                        : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {activeChart?.title || "Music Charts"}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              <Flame className="h-3.5 w-3.5" />
              Official
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
            {activeChart?.edition_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                Issue:{" "}
                <strong className="text-zinc-200">
                  {new Date(activeChart.edition_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </span>
            )}
            <span>•</span>
            <span>
              Total Tracks:{" "}
              <strong className="text-zinc-200">
                {activeChart?.entries?.length || 0}
              </strong>
            </span>
            {activeChart?.description && (
              <>
                <span>•</span>
                <span className="text-zinc-400 italic">
                  {activeChart.description}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search song, artist, album…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900/80 pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Top 3 Podium Spotlight (Shown when no search query active) */}
      {!searchQuery && top1 && (
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Podium Spotlight • Top 3
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            {/* #2 Rank Card */}
            {top2 && (
              <div className="order-2 lg:order-1 lg:col-span-3">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-800/60 to-zinc-900/80 p-5 shadow-xl backdrop-blur-sm transition-all hover:border-zinc-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-300 text-zinc-900 font-black text-sm shadow-md">
                      #2
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Silver
                    </span>
                  </div>

                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-800 mb-4 group">
                    {top2.cover_image_url || top2.cover_image ? (
                      <Image
                        src={top2.cover_image_url || top2.cover_image || ""}
                        alt={top2.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <Disc3 className="h-12 w-12" />
                      </div>
                    )}
                    {top2.audio_url && (
                      <button
                        type="button"
                        onClick={() => togglePlayTrack(top2)}
                        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-transform hover:scale-110"
                        title={playingTrackId === top2.id && isPlaying ? "Pause" : "Preview"}
                      >
                        {playingTrackId === top2.id && isPlaying ? (
                          <Pause className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Play className="h-5 w-5 fill-white text-white translate-x-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-white truncate">{top2.title}</h4>
                  <p className="text-xs text-zinc-300 truncate mt-0.5">{top2.artist}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-400">
                    <span>Peak: #{top2.peak_rank}</span>
                    <span>{top2.weeks_on_chart} {top2.weeks_on_chart === 1 ? "wk" : "wks"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* #1 Champion Spotlight */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-black font-black text-lg shadow-lg shadow-amber-400/30">
                        #1
                      </span>
                      <div>
                        <span className="block text-[11px] font-black uppercase tracking-widest text-amber-400">
                          Number One Track
                        </span>
                        <span className="block text-xs text-zinc-400">Official Gospel Chart</span>
                      </div>
                    </div>
                    <Trophy className="h-7 w-7 text-amber-400 animate-pulse" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="relative aspect-square w-full sm:col-span-5 overflow-hidden rounded-2xl bg-zinc-800 shadow-xl group">
                      {top1.cover_image_url || top1.cover_image ? (
                        <Image
                          src={top1.cover_image_url || top1.cover_image || ""}
                          alt={top1.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-600">
                          <Disc3 className="h-16 w-16" />
                        </div>
                      )}
                      {top1.audio_url && (
                        <button
                          type="button"
                          onClick={() => togglePlayTrack(top1)}
                          className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/40 transition-transform hover:scale-110"
                          title={playingTrackId === top1.id && isPlaying ? "Pause" : "Play Preview"}
                        >
                          {playingTrackId === top1.id && isPlaying ? (
                            <Pause className="h-6 w-6 text-black" />
                          ) : (
                            <Play className="h-6 w-6 fill-black text-black translate-x-0.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="sm:col-span-7 flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5 mb-2">
                          {top1.movement?.label || "CHAMPION"}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                          {top1.title}
                        </h3>
                        <p className="mt-1 text-sm sm:text-base font-semibold text-zinc-300">
                          {top1.artist}
                          {top1.featured_artists && (
                            <span className="text-zinc-400 text-xs">
                              {" "}
                              ft. {top1.featured_artists}
                            </span>
                          )}
                        </p>
                        {top1.album && (
                          <p className="mt-1 text-xs text-zinc-500 italic">
                            Album: {top1.album}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-zinc-800 pt-4 text-center">
                        <div className="rounded-lg bg-zinc-900/80 p-2">
                          <span className="block text-[10px] text-zinc-500 uppercase font-semibold">
                            Last Wk
                          </span>
                          <span className="text-sm font-bold text-zinc-200">
                            {top1.previous_rank ? `#${top1.previous_rank}` : "—"}
                          </span>
                        </div>
                        <div className="rounded-lg bg-zinc-900/80 p-2">
                          <span className="block text-[10px] text-zinc-500 uppercase font-semibold">
                            Peak
                          </span>
                          <span className="text-sm font-bold text-amber-400">
                            #{top1.peak_rank}
                          </span>
                        </div>
                        <div className="rounded-lg bg-zinc-900/80 p-2">
                          <span className="block text-[10px] text-zinc-500 uppercase font-semibold">
                            Weeks
                          </span>
                          <span className="text-sm font-bold text-zinc-200">
                            {top1.weeks_on_chart}
                          </span>
                        </div>
                      </div>

                      {/* External Streaming Links */}
                      <div className="mt-4 flex items-center gap-2">
                        {top1.youtube_url && (
                          <a
                            href={top1.youtube_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <FaYoutube className="h-3.5 w-3.5 text-red-500" />
                            YouTube
                          </a>
                        )}
                        {top1.spotify_url && (
                          <a
                            href={top1.spotify_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            <FaSpotify className="h-3.5 w-3.5 text-emerald-500" />
                            Spotify
                          </a>
                        )}
                        {top1.apple_music_url && (
                          <a
                            href={top1.apple_music_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-500/20 bg-pink-500/10 px-3 py-1.5 text-xs font-semibold text-pink-400 hover:bg-pink-500/20 transition-colors"
                          >
                            <FaApple className="h-3.5 w-3.5 text-pink-400" />
                            Apple Music
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* #3 Rank Card */}
            {top3 && (
              <div className="order-3 lg:order-3 lg:col-span-3">
                <div className="relative overflow-hidden rounded-2xl border border-amber-900/50 bg-gradient-to-b from-amber-950/20 to-zinc-900/80 p-5 shadow-xl backdrop-blur-sm transition-all hover:border-amber-700/60">
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-700 text-white font-black text-sm shadow-md">
                      #3
                    </span>
                    <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
                      Bronze
                    </span>
                  </div>

                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-800 mb-4 group">
                    {top3.cover_image_url || top3.cover_image ? (
                      <Image
                        src={top3.cover_image_url || top3.cover_image || ""}
                        alt={top3.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <Disc3 className="h-12 w-12" />
                      </div>
                    )}
                    {top3.audio_url && (
                      <button
                        type="button"
                        onClick={() => togglePlayTrack(top3)}
                        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-transform hover:scale-110"
                        title={playingTrackId === top3.id && isPlaying ? "Pause" : "Preview"}
                      >
                        {playingTrackId === top3.id && isPlaying ? (
                          <Pause className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Play className="h-5 w-5 fill-white text-white translate-x-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-white truncate">{top3.title}</h4>
                  <p className="text-xs text-zinc-300 truncate mt-0.5">{top3.artist}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-400">
                    <span>Peak: #{top3.peak_rank}</span>
                    <span>{top3.weeks_on_chart} {top3.weeks_on_chart === 1 ? "wk" : "wks"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Countdown Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            {searchQuery ? `Search Results (${filteredEntries.length})` : "Complete Countdown Tracklist"}
          </h3>
          <span className="text-xs text-zinc-500">
            {filteredEntries.length} songs listed
          </span>
        </div>

        {chartLoading ? (
          <div className="py-12 text-center text-zinc-500">
            <Disc3 className="h-6 w-6 animate-spin mx-auto text-amber-500 mb-2" />
            Loading tracks…
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
            No tracks found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3.5 px-4 text-center w-16">Rank</th>
                    <th className="py-3.5 px-3 text-center w-20">Trend</th>
                    <th className="py-3.5 px-4">Title & Artist</th>
                    <th className="py-3.5 px-4 text-center w-24">Last Wk</th>
                    <th className="py-3.5 px-4 text-center w-20">Peak</th>
                    <th className="py-3.5 px-4 text-center w-24">Weeks</th>
                    <th className="py-3.5 px-4 text-center w-36">Listen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredEntries.map((entry) => {
                    const artworkUrl = entry.cover_image_url || entry.cover_image;
                    const movement = entry.movement || {
                      status:
                        entry.previous_rank === null
                          ? "new"
                          : entry.previous_rank > entry.rank
                          ? "up"
                          : entry.previous_rank < entry.rank
                          ? "down"
                          : "same",
                      diff:
                        entry.previous_rank !== null
                          ? Math.abs(entry.previous_rank - entry.rank)
                          : 0,
                      label:
                        entry.previous_rank === null
                          ? "NEW"
                          : entry.previous_rank > entry.rank
                          ? `+${entry.previous_rank - entry.rank}`
                          : entry.previous_rank < entry.rank
                          ? `-${entry.rank - entry.previous_rank}`
                          : "=",
                    };

                    const isCurrentlyPlaying = playingTrackId === entry.id && isPlaying;

                    return (
                      <tr
                        key={entry.id}
                        className={`transition-colors hover:bg-zinc-800/40 ${
                          isCurrentlyPlaying ? "bg-amber-500/5" : ""
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-black text-sm ${
                              entry.rank === 1
                                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                                : entry.rank === 2
                                ? "bg-slate-300 text-zinc-900"
                                : entry.rank === 3
                                ? "bg-amber-700 text-white"
                                : "text-zinc-300 font-semibold"
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </td>

                        {/* Trend / Movement */}
                        <td className="py-3.5 px-3 text-center">
                          {movement.status === "up" && (
                            <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10">
                              <ArrowUp className="h-3 w-3 stroke-[2.5]" />
                              {movement.label}
                            </span>
                          )}
                          {movement.status === "down" && (
                            <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-bold text-rose-400 bg-rose-500/10">
                              <ArrowDown className="h-3 w-3 stroke-[2.5]" />
                              {movement.label}
                            </span>
                          )}
                          {movement.status === "new" && (
                            <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-black text-amber-300 bg-amber-400/15">
                              <Sparkles className="h-2.5 w-2.5" />
                              NEW
                            </span>
                          )}
                          {movement.status === "same" && (
                            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 bg-zinc-800/60">
                              <Minus className="h-3 w-3" />
                            </span>
                          )}
                        </td>

                        {/* Artwork & Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-800 border border-zinc-700/60 group">
                              {artworkUrl ? (
                                <Image
                                  src={artworkUrl}
                                  alt={entry.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                                  <Disc3 className="h-6 w-6" />
                                </div>
                              )}
                              {entry.audio_url && (
                                <button
                                  type="button"
                                  onClick={() => togglePlayTrack(entry)}
                                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  {isCurrentlyPlaying ? (
                                    <Pause className="h-5 w-5 text-amber-400" />
                                  ) : (
                                    <Play className="h-5 w-5 fill-white text-white" />
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-white truncate text-sm">
                                  {entry.title}
                                </p>
                                {isCurrentlyPlaying && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                                    <Volume2 className="h-3 w-3 animate-pulse" />
                                    Playing
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-300 truncate">
                                {entry.artist}
                                {entry.featured_artists && (
                                  <span className="text-zinc-500">
                                    {" "}
                                    ft. {entry.featured_artists}
                                  </span>
                                )}
                              </p>
                              {entry.album && (
                                <p className="text-[11px] text-zinc-500 italic truncate">
                                  {entry.album}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Last Week */}
                        <td className="py-3.5 px-4 text-center text-xs text-zinc-400">
                          {entry.previous_rank ? `#${entry.previous_rank}` : "—"}
                        </td>

                        {/* Peak */}
                        <td className="py-3.5 px-4 text-center text-xs font-bold text-zinc-200">
                          #{entry.peak_rank}
                        </td>

                        {/* Weeks on Chart */}
                        <td className="py-3.5 px-4 text-center text-xs text-zinc-400">
                          {entry.weeks_on_chart} {entry.weeks_on_chart === 1 ? "wk" : "wks"}
                        </td>

                        {/* Streaming Buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {entry.audio_url && (
                              <button
                                type="button"
                                onClick={() => togglePlayTrack(entry)}
                                className={`rounded-lg p-1.5 transition-colors ${
                                  isCurrentlyPlaying
                                    ? "bg-amber-500 text-black"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                }`}
                                title={isCurrentlyPlaying ? "Pause Preview" : "Play Preview"}
                              >
                                {isCurrentlyPlaying ? (
                                  <Pause className="h-3.5 w-3.5" />
                                ) : (
                                  <Play className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                            {entry.youtube_url && (
                              <a
                                href={entry.youtube_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-zinc-800 p-1.5 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                title="Watch on YouTube"
                              >
                                <FaYoutube className="h-3.5 w-3.5 text-red-500" />
                              </a>
                            )}
                            {entry.spotify_url && (
                              <a
                                href={entry.spotify_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-zinc-800 p-1.5 text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                                title="Listen on Spotify"
                              >
                                <FaSpotify className="h-3.5 w-3.5 text-emerald-500" />
                              </a>
                            )}
                            {entry.apple_music_url && (
                              <a
                                href={entry.apple_music_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-zinc-800 p-1.5 text-zinc-400 hover:bg-pink-500/20 hover:text-pink-400 transition-colors"
                                title="Listen on Apple Music"
                              >
                                <FaApple className="h-3.5 w-3.5 text-pink-400" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
