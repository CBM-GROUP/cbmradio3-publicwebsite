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
import CBMTeamArtwork from "../../public/cbm_images/take 3.jpeg";

export default function ChartsListing() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [activeChart, setActiveChart] = useState<Chart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chartFilterQuery, setChartFilterQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All charts");

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
        const displayedCharts = activeList.length ? activeList : list;
        setCharts(displayedCharts);

        if (displayedCharts.length > 0) {
          const params = new URLSearchParams(window.location.search);
          const requestedSlug = params.get("chart");
          const requestedType = params.get("type");
          const requestedChart = displayedCharts.find((item) => item.slug === requestedSlug);
          const requestedTypeChart = displayedCharts.find(
            (item) => item.chart_type === requestedType,
          );
          const initialChart =
            requestedChart ?? requestedTypeChart ?? displayedCharts[0];
          setSelectedType(
            requestedChart?.chart_type ??
              (requestedTypeChart ? requestedTypeChart.chart_type : "All charts"),
          );
          setSelectedSlug(initialChart.slug);
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
  const chartTypes = useMemo(
    () => Array.from(new Set(charts.map((chart) => chart.chart_type.trim()).filter(Boolean))),
    [charts],
  );
  const chartTypeTabs = ["All charts", ...chartTypes];
  const visibleCharts = charts.filter((chart) => {
    const matchesType = selectedType === "All charts" || chart.chart_type === selectedType;
    const matchesSearch = chart.title.toLowerCase().includes(chartFilterQuery.trim().toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-black bg-black px-6 py-3 text-white shadow-xl">
          <Disc3 className="h-5 w-5 animate-spin text-[#04b093]" />
          <span className="text-sm font-bold">Loading CBM Music Charts…</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#04b093] pb-20 text-black">
      {/* Hidden Audio Player Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <nav aria-label="Chart categories" className="border-b-2 border-black bg-[#04b093] py-4">
        <div className="mx-auto flex max-w-[1800px] items-center gap-2 overflow-x-auto px-4 sm:px-6 lg:px-10">
          {chartTypeTabs.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSelectedType(type);
                  const firstMatch =
                    type === "All charts"
                      ? charts[0]
                      : charts.find((chart) => chart.chart_type === type);
                  if (firstMatch) setSelectedSlug(firstMatch.slug);
                }}
                className={`min-h-10 shrink-0 rounded-full px-5 text-xs font-black uppercase tracking-wider transition-all ${
                  isSelected
                    ? "border-2 border-black bg-black text-[#04b093] shadow-md"
                    : "border-2 border-black/30 bg-black/10 text-black hover:border-black hover:bg-black hover:text-white"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mx-auto grid max-w-[1800px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 lg:px-10 lg:py-8">
        <aside className="cbm-card h-fit rounded-2xl border-2 border-black bg-black p-5 text-white shadow-2xl lg:sticky lg:top-28">
          <label htmlFor="chart-search" className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/80">Search charts</label>
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#04b093]" aria-hidden="true" />
            <input
              id="chart-search"
              type="search"
              placeholder="Chart name"
              value={chartFilterQuery}
              onChange={(event) => setChartFilterQuery(event.target.value)}
              className="min-h-10 w-full rounded-lg border border-white/20 bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#04b093] focus:outline-none focus:ring-1 focus:ring-[#04b093]"
            />
          </div>

          <label htmlFor="artist-search" className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/80">Search songs or artists</label>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#04b093]" aria-hidden="true" />
            <input
              id="artist-search"
              type="search"
              placeholder="Artist, song, album"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-h-10 w-full rounded-lg border border-white/20 bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#04b093] focus:outline-none focus:ring-1 focus:ring-[#04b093]"
            />
          </div>

          <h3 className="mb-2 border-b border-white/15 pb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#04b093]">Charts</h3>
          <div className="max-h-[55vh] space-y-1.5 overflow-y-auto pr-1">
            {visibleCharts.map((chart) => (
              <button
                key={chart.id}
                type="button"
                onClick={() => {
                  setSelectedType(chart.chart_type);
                  setSelectedSlug(chart.slug);
                }}
                className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3.5 text-left text-sm font-semibold transition-all ${
                  selectedSlug === chart.slug
                    ? "border border-black bg-[#04b093] text-black font-black shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="truncate">{chart.title}</span>
                {selectedSlug === chart.slug && <span className="ml-2 size-2 shrink-0 rounded-full bg-black" aria-hidden="true" />}
              </button>
            ))}
            {visibleCharts.length === 0 && <p className="px-3 py-5 text-sm text-white/70">{charts.length === 0 ? "Charts are temporarily unavailable." : "No charts match your search."}</p>}
          </div>
        </aside>

        <div className="cbm-card min-w-0 rounded-2xl border-2 border-black bg-gradient-to-b from-[#091210] via-black to-[#060a09] p-4 text-white shadow-2xl sm:p-6 lg:p-8">
          {/* Billboard / Spotify Style Hero Banner Card */}
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#04b093]/15 via-[#070e0c]/90 to-black p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-xl">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -left-20 -top-20 -z-0 h-72 w-72 rounded-full bg-[#04b093]/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 -z-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 lg:gap-8">
              {/* Left: Prominent Album / Hero Artwork Sleeve */}
              <div className="group relative h-48 w-48 sm:h-56 sm:w-56 lg:h-60 lg:w-60 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
                {activeChart?.cover_image_url || activeChart?.cover_image ? (
                  <Image
                    src={activeChart.cover_image_url || activeChart.cover_image || ""}
                    alt={activeChart.title}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : top1?.cover_image_url || top1?.cover_image ? (
                  <Image
                    src={top1.cover_image_url || top1.cover_image || ""}
                    alt={top1.title}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={CBMTeamArtwork}
                    alt={activeChart?.title || "CBM Radio"}
                    fill
                    priority
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#04b093] backdrop-blur-md border border-white/10">
                  <Flame className="h-3 w-3" /> Official
                </span>
              </div>

              {/* Right: Billboard / Spotify Typography & Details */}
              <div className="flex-1 min-w-0 text-center md:text-left space-y-3">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#04b093]/40 bg-[#04b093]/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#04b093]">
                    <Trophy className="h-3 w-3" />
                    {activeChart?.chart_type ? activeChart.chart_type.replace(/_/g, " ").toUpperCase() : "OFFICIAL COUNTDOWN"}
                  </span>
                  {activeChart?.edition_date && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/80">
                      <Calendar className="h-3 w-3 text-[#04b093]" />
                      {activeChart.edition_date}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                  {activeChart?.title || "Music Charts"}
                </h2>

                {activeChart?.description && (
                  <p className="max-w-2xl text-xs sm:text-sm text-white/70 line-clamp-2">
                    {activeChart.description}
                  </p>
                )}

                {/* Metadata Row */}
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-white/75 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#04b093] font-black">{activeChart?.entries?.length || 0}</span>
                    <span>Total Tracks</span>
                  </div>
                  {top1 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-black">#1:</span>
                      <span className="text-white font-bold truncate max-w-[200px]">{top1.title}</span>
                      <span className="text-white/50 text-[11px] truncate max-w-[150px]">— {top1.artist}</span>
                    </div>
                  )}
                  {top1?.audio_url && (
                    <button
                      type="button"
                      onClick={() => togglePlayTrack(top1)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#04b093] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-md transition-all hover:bg-white hover:scale-105"
                    >
                      {playingTrackId === top1.id && isPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5" />
                          <span>Pause #1</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-black" />
                          <span>Play #1</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Podium Spotlight (Sleeker and More Compact) */}
          {!searchQuery && top1 && (
            <div className="mb-8">
              <div className="mb-3.5 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400">
                  <Trophy className="h-3.5 w-3.5" /> Podium Spotlight • Top 3
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* #2 Rank Card (Silver) */}
                {top2 && (
                  <div className="relative overflow-hidden rounded-xl border border-slate-400/30 bg-gradient-to-b from-slate-900/60 to-black/80 p-3.5 shadow-md transition-all hover:border-slate-300 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 border border-slate-400/30">
                        {top2.cover_image_url || top2.cover_image ? (
                          <Image
                            src={top2.cover_image_url || top2.cover_image || ""}
                            alt={top2.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-600">
                            <Disc3 className="h-6 w-6" />
                          </div>
                        )}
                        <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-md bg-slate-300 text-zinc-950 font-black text-xs shadow-md">
                          #2
                        </span>
                        {top2.audio_url && (
                          <button
                            type="button"
                            onClick={() => togglePlayTrack(top2)}
                            className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-md transition-transform hover:scale-110"
                            title={playingTrackId === top2.id && isPlaying ? "Pause" : "Play Preview"}
                          >
                            {playingTrackId === top2.id && isPlaying ? (
                              <Pause className="h-3.5 w-3.5 text-amber-400" />
                            ) : (
                              <Play className="h-3.5 w-3.5 fill-white" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Silver</span>
                          <span className="text-[10px] text-white/50">Peak #{top2.peak_rank}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white truncate">{top2.title}</h4>
                        <p className="text-xs text-white/70 truncate">{top2.artist}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* #1 Rank Card (Gold Champion) */}
                <div className="relative overflow-hidden rounded-xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-950/40 via-zinc-900/90 to-black p-3.5 shadow-xl shadow-amber-500/10 transition-all hover:border-amber-400">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 border border-amber-400/50 shadow-md">
                      {top1.cover_image_url || top1.cover_image ? (
                        <Image
                          src={top1.cover_image_url || top1.cover_image || ""}
                          alt={top1.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-600">
                          <Disc3 className="h-6 w-6" />
                        </div>
                      )}
                      <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-amber-400 to-yellow-300 text-black font-black text-xs shadow-md">
                        #1
                      </span>
                      {top1.audio_url && (
                        <button
                          type="button"
                          onClick={() => togglePlayTrack(top1)}
                          className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-black shadow-md transition-transform hover:scale-110"
                          title={playingTrackId === top1.id && isPlaying ? "Pause" : "Play Preview"}
                        >
                          {playingTrackId === top1.id && isPlaying ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5 fill-black" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                          <Trophy className="h-3 w-3" /> Champion
                        </span>
                        <span className="text-[10px] text-amber-400/80 font-bold">{top1.weeks_on_chart} {top1.weeks_on_chart === 1 ? "wk" : "wks"}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white truncate">{top1.title}</h4>
                      <p className="text-xs text-amber-200/80 truncate">{top1.artist}</p>
                    </div>
                  </div>
                </div>

                {/* #3 Rank Card (Bronze) */}
                {top3 && (
                  <div className="relative overflow-hidden rounded-xl border border-amber-700/40 bg-gradient-to-b from-amber-950/20 to-black/80 p-3.5 shadow-md transition-all hover:border-amber-600 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 border border-amber-700/40">
                        {top3.cover_image_url || top3.cover_image ? (
                          <Image
                            src={top3.cover_image_url || top3.cover_image || ""}
                            alt={top3.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-600">
                            <Disc3 className="h-6 w-6" />
                          </div>
                        )}
                        <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-md bg-amber-700 text-white font-black text-xs shadow-md">
                          #3
                        </span>
                        {top3.audio_url && (
                          <button
                            type="button"
                            onClick={() => togglePlayTrack(top3)}
                            className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-md transition-transform hover:scale-110"
                            title={playingTrackId === top3.id && isPlaying ? "Pause" : "Play Preview"}
                          >
                            {playingTrackId === top3.id && isPlaying ? (
                              <Pause className="h-3.5 w-3.5 text-amber-400" />
                            ) : (
                              <Play className="h-3.5 w-3.5 fill-white" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Bronze</span>
                          <span className="text-[10px] text-white/50">Peak #{top3.peak_rank}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white truncate">{top3.title}</h4>
                        <p className="text-xs text-white/70 truncate">{top3.artist}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Countdown Leaderboard - Modern Track Cards / Rows */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white/90">
                {searchQuery ? `Search Results (${filteredEntries.length})` : "Official Countdown Tracklist"}
              </h3>
              <span className="text-xs text-white/50 font-medium">
                {filteredEntries.length} {filteredEntries.length === 1 ? "song" : "songs"} listed
              </span>
            </div>

            {chartLoading ? (
              <div className="py-16 text-center text-white/50">
                <Disc3 className="h-7 w-7 animate-spin mx-auto text-[#04b093] mb-2" />
                <p className="text-sm">Loading countdown tracks…</p>
              </div>
            ) : !activeChart ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/20 px-6 py-10 text-center">
                <Trophy className="mb-3 h-10 w-10 text-[#04b093]/70" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">Charts are temporarily unavailable</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/65">The chart service could not be reached. Please try again later.</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/60">
                No tracks found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="space-y-2">
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
                    <div
                      key={entry.id}
                      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border p-3 sm:p-3.5 transition-all duration-200 ${
                        isCurrentlyPlaying
                          ? "border-amber-400/60 bg-amber-500/10 shadow-[0_4px_24px_rgba(245,158,11,0.18)]"
                          : entry.rank === 1
                          ? "border-amber-400/35 bg-gradient-to-r from-amber-500/10 via-black/50 to-black/70 hover:border-amber-400/60"
                          : "border-white/10 bg-black/40 hover:border-[#04b093]/40 hover:bg-black/70"
                      }`}
                    >
                      {/* Left: Rank, Movement, Artwork, Title & Artist */}
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        {/* Rank Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg font-black text-sm shadow-sm ${
                              entry.rank === 1
                                ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-black shadow-amber-400/30"
                                : entry.rank === 2
                                ? "bg-slate-300 text-zinc-950 shadow-slate-300/20"
                                : entry.rank === 3
                                ? "bg-amber-700 text-white shadow-amber-700/20"
                                : "bg-white/5 border border-white/10 text-white/90"
                            }`}
                          >
                            {entry.rank}
                          </span>

                          {/* Trend Movement */}
                          <div className="w-12 text-center shrink-0">
                            {movement.status === "up" && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-black text-emerald-400 bg-emerald-500/15">
                                <ArrowUp className="h-3 w-3 stroke-[3]" />
                                {movement.label}
                              </span>
                            )}
                            {movement.status === "down" && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-black text-rose-400 bg-rose-500/15">
                                <ArrowDown className="h-3 w-3 stroke-[3]" />
                                {movement.label}
                              </span>
                            )}
                            {movement.status === "new" && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-black text-amber-300 bg-amber-400/20">
                                <Sparkles className="h-2.5 w-2.5" />
                                NEW
                              </span>
                            )}
                            {movement.status === "same" && (
                              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium text-white/40 bg-white/5">
                                <Minus className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Artwork Sleeve with Play button overlay */}
                        <div className="relative h-13 w-13 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-900 border border-white/10 group/art shadow-sm">
                          {artworkUrl ? (
                            <Image
                              src={artworkUrl}
                              alt={entry.title}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-300 group-hover/art:scale-105"
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
                              className={`absolute inset-0 flex items-center justify-center transition-all ${
                                isCurrentlyPlaying
                                  ? "bg-black/60 opacity-100"
                                  : "bg-black/60 opacity-0 group-hover/art:opacity-100"
                              }`}
                              title={isCurrentlyPlaying ? "Pause Preview" : "Play Preview"}
                            >
                              {isCurrentlyPlaying ? (
                                <Pause className="h-5 w-5 text-amber-400" />
                              ) : (
                                <Play className="h-5 w-5 fill-white text-white translate-x-0.5" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Title & Artist Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white truncate text-sm sm:text-base">
                              {entry.title}
                            </p>
                            {isCurrentlyPlaying && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400">
                                <Volume2 className="h-3 w-3 animate-pulse" />
                                Playing
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/70 truncate">
                            {entry.artist}
                            {entry.featured_artists && (
                              <span className="text-white/45"> ft. {entry.featured_artists}</span>
                            )}
                          </p>
                          {entry.album && (
                            <p className="text-[11px] text-white/40 italic truncate">
                              {entry.album}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Stats & Streaming Links */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pl-14 sm:pl-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                        {/* Stats Row */}
                        <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-white/60">
                          <div className="text-center">
                            <span className="block text-[9px] uppercase tracking-wider text-white/40">Last Wk</span>
                            <span className="font-semibold text-white/80">{entry.previous_rank ? `#${entry.previous_rank}` : "—"}</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-[9px] uppercase tracking-wider text-white/40">Peak</span>
                            <span className="font-black text-white">#{entry.peak_rank}</span>
                          </div>
                          <div className="text-center">
                            <span className="block text-[9px] uppercase tracking-wider text-white/40">Weeks</span>
                            <span className="font-semibold text-white/80">{entry.weeks_on_chart}</span>
                          </div>
                        </div>

                        {/* Streaming Action Links */}
                        <div className="flex items-center gap-1.5">
                          {entry.audio_url && (
                            <button
                              type="button"
                              onClick={() => togglePlayTrack(entry)}
                              className={`rounded-lg p-2 transition-colors ${
                                isCurrentlyPlaying
                                  ? "bg-amber-500 text-black shadow-sm"
                                  : "bg-white/10 text-white/80 hover:bg-[#04b093] hover:text-black"
                              }`}
                              title={isCurrentlyPlaying ? "Pause Preview" : "Play Preview"}
                            >
                              {isCurrentlyPlaying ? (
                                <Pause className="h-3.5 w-3.5" />
                              ) : (
                                <Play className="h-3.5 w-3.5 fill-current" />
                              )}
                            </button>
                          )}
                          {entry.youtube_url && (
                            <a
                              href={entry.youtube_url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-red-500 hover:text-white transition-colors"
                              title="Watch on YouTube"
                            >
                              <FaYoutube className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {entry.spotify_url && (
                            <a
                              href={entry.spotify_url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-emerald-500 hover:text-white transition-colors"
                              title="Listen on Spotify"
                            >
                              <FaSpotify className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {entry.apple_music_url && (
                            <a
                              href={entry.apple_music_url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-pink-500 hover:text-white transition-colors"
                              title="Listen on Apple Music"
                            >
                              <FaApple className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

      </div>
      </div>
    </section>
  );
}
