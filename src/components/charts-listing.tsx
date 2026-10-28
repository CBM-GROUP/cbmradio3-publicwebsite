"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  Crown,
  Disc3,
  Minus,
  Pause,
  Play,
  Search,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { FaApple, FaSpotify, FaYoutube } from "react-icons/fa";
import { chartService } from "@/services/chart.service";
import type { Chart, ChartEntry } from "@/types/chart";
import CBMTeamArtwork from "../../public/cbm_images/take 3.jpeg";

type MovementFilter = "all" | "up" | "down" | "new" | "same";

const MOVEMENT_FILTERS: { key: MovementFilter; label: string; emoji: string }[] = [
  { key: "all", label: "Everything", emoji: "🎧" },
  { key: "up", label: "Climbers", emoji: "🚀" },
  { key: "down", label: "Fallers", emoji: "🪂" },
  { key: "new", label: "New", emoji: "✨" },
  { key: "same", label: "Holding", emoji: "🧊" },
];

const RANK_STYLES: Record<number, string> = {
  1: "bg-amber-300",
  2: "bg-slate-200",
  3: "bg-orange-300",
};

function artworkOf(entry?: ChartEntry | null) {
  return entry?.cover_image_url || entry?.cover_image || "";
}

function chartArtworkOf(chart?: Chart | null) {
  return chart?.cover_image_url || chart?.cover_image || "";
}

function movementOf(entry: ChartEntry) {
  return entry.movement?.status ?? (entry.previous_rank ? "same" : "new");
}

function formatEdition(date?: string) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ChartsListing() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [activeChart, setActiveChart] = useState<Chart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chartFilterQuery, setChartFilterQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All charts");
  const [movementFilter, setMovementFilter] = useState<MovementFilter>("all");
  const [countdownOrder, setCountdownOrder] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // In-page Audio Player State
  const [nowPlaying, setNowPlaying] = useState<ChartEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; duration: number }>({ current: 0, duration: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingTrackId = nowPlaying?.id ?? null;

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

  const selectChart = (chart: Chart) => {
    setSelectedSlug(chart.slug);
    setExpandedId(null);
    const params = new URLSearchParams(window.location.search);
    params.set("chart", chart.slug);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  // Audio Playback
  const playEntry = (entry: ChartEntry) => {
    const audio = audioRef.current;
    if (!entry.audio_url || !audio) return;
    audio.pause();
    audio.src = entry.audio_url;
    setProgress({ current: 0, duration: 0 });
    setNowPlaying(entry);
    setIsPlaying(true);
    audio.play().catch(() => setIsPlaying(false));
  };

  const togglePlayTrack = (entry: ChartEntry) => {
    if (!entry.audio_url) return;
    if (playingTrackId === entry.id) {
      if (isPlaying) audioRef.current?.pause();
      else audioRef.current?.play().catch(() => setIsPlaying(false));
      return;
    }
    playEntry(entry);
  };

  const stopPlayback = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setNowPlaying(null);
  };

  // Derived chart data
  const allEntries = useMemo(
    () => [...(activeChart?.entries || [])].sort((a, b) => a.rank - b.rank),
    [activeChart],
  );

  const movementCounts = useMemo(() => {
    const counts: Record<MovementFilter, number> = { all: allEntries.length, up: 0, down: 0, new: 0, same: 0 };
    allEntries.forEach((entry) => {
      counts[movementOf(entry)] += 1;
    });
    return counts;
  }, [allEntries]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allEntries.filter((e) => {
      const matchesMovement = movementFilter === "all" || movementOf(e) === movementFilter;
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        Boolean(e.featured_artists?.toLowerCase().includes(q)) ||
        Boolean(e.album?.toLowerCase().includes(q));
      return matchesMovement && matchesSearch;
    });
    return countdownOrder ? list.reverse() : list;
  }, [allEntries, countdownOrder, movementFilter, searchQuery]);

  const playableEntries = useMemo(() => filteredEntries.filter((e) => e.audio_url), [filteredEntries]);
  const playableIndex = playableEntries.findIndex((e) => e.id === playingTrackId);

  const playNext = () => {
    const next = playableEntries[playableIndex + 1] ?? playableEntries[0];
    if (next) playEntry(next);
  };

  const playPrevious = () => {
    const prev = playableEntries[playableIndex - 1] ?? playableEntries[playableEntries.length - 1];
    if (prev) playEntry(prev);
  };

  const shufflePlay = () => {
    if (playableEntries.length === 0) return;
    const pool = playableEntries.filter((e) => e.id !== playingTrackId);
    const pick = (pool.length ? pool : playableEntries)[Math.floor(Math.random() * (pool.length || playableEntries.length))];
    playEntry(pick);
  };

  const handleAudioEnded = () => {
    const next = playableEntries[playableIndex + 1];
    if (next) playEntry(next);
    else {
      setIsPlaying(false);
      setNowPlaying(null);
    }
  };

  const shareChart = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const top1 = allEntries.find((e) => e.rank === 1);
  const top2 = allEntries.find((e) => e.rank === 2);
  const top3 = allEntries.find((e) => e.rank === 3);
  const topClimber = allEntries
    .filter((e) => movementOf(e) === "up")
    .sort((a, b) => (b.movement?.diff ?? 0) - (a.movement?.diff ?? 0))[0];
  const maxWeeks = Math.max(1, ...allEntries.map((e) => e.weeks_on_chart || 0));
  const heroArtwork = chartArtworkOf(activeChart) || artworkOf(top1);

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
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-black bg-black px-6 py-3 text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.35)]">
          <Disc3 className="chart-spin h-5 w-5 text-[#04b093]" />
          <span className="text-sm font-bold">Spinning up the charts…</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#04b093] pb-32 text-black">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(e) =>
          setProgress({ current: e.currentTarget.currentTime, duration: e.currentTarget.duration || 0 })
        }
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* 01 // Chart Crate: pick a record */}
        <div className="mb-10">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-block -rotate-2 rounded-md border-2 border-black bg-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#04b093]">
                Dig the crate
              </span>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-tight sm:text-3xl">Pick a chart</h2>
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" aria-hidden="true" />
              <label htmlFor="chart-search" className="sr-only">Search charts</label>
              <input
                id="chart-search"
                type="search"
                placeholder="Find a chart…"
                value={chartFilterQuery}
                onChange={(event) => setChartFilterQuery(event.target.value)}
                className="min-h-11 w-full rounded-full border-2 border-black bg-white pl-9 pr-4 text-sm font-semibold text-black shadow-[3px_3px_0_0_#000] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <nav aria-label="Chart categories" className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {chartTypeTabs.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedType(type);
                    const firstMatch = type === "All charts" ? charts[0] : charts.find((chart) => chart.chart_type === type);
                    if (firstMatch) selectChart(firstMatch);
                  }}
                  className={`min-h-10 shrink-0 rounded-full border-2 px-5 text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${
                    isSelected
                      ? "border-black bg-black text-[#04b093] shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]"
                      : "border-black/30 bg-black/10 text-black hover:border-black hover:bg-black hover:text-white"
                  }`}
                >
                  {type.replace(/_/g, " ")}
                </button>
              );
            })}
          </nav>

          <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 pt-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {visibleCharts.map((chart, idx) => {
              const isSelected = selectedSlug === chart.slug;
              const cover = chartArtworkOf(chart);
              return (
                <button
                  key={chart.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectChart(chart)}
                  className={`group w-40 shrink-0 snap-start text-left transition-all duration-300 ease-out sm:w-44 ${
                    isSelected ? "-translate-y-1 rotate-0" : idx % 2 ? "rotate-2 hover:-translate-y-2 hover:rotate-0" : "-rotate-2 hover:-translate-y-2 hover:rotate-0"
                  }`}
                >
                  <div
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 border-black bg-black transition-shadow ${
                      isSelected ? "shadow-[6px_6px_0_0_#000] ring-4 ring-white" : "shadow-[4px_4px_0_0_#000] group-hover:shadow-[7px_7px_0_0_#000]"
                    }`}
                  >
                    {cover ? (
                      <Image src={cover} alt="" fill unoptimized sizes="176px" className="object-cover" />
                    ) : (
                      <div className="chart-vinyl flex h-full w-full items-center justify-center">
                        <div className="grid size-14 place-items-center rounded-full bg-[#04b093] text-black">
                          <Disc3 className="h-7 w-7" />
                        </div>
                      </div>
                    )}
                    {isSelected && (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border-2 border-black bg-[#04b093] px-2 py-0.5 text-[10px] font-black uppercase">
                        <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
                          <span className="animate-eq-1 w-0.5 bg-black" />
                          <span className="animate-eq-2 w-0.5 bg-black" />
                          <span className="animate-eq-3 w-0.5 bg-black" />
                        </span>
                        On
                      </span>
                    )}
                  </div>
                  <p className="mt-3 truncate text-sm font-black uppercase leading-tight">{chart.title}</p>
                  <p className="truncate text-[11px] font-bold text-black/60">
                    {formatEdition(chart.edition_date) || chart.chart_type.replace(/_/g, " ")}
                  </p>
                </button>
              );
            })}
            {visibleCharts.length === 0 && (
              <p className="rounded-xl border-2 border-dashed border-black/40 px-6 py-10 text-sm font-bold text-black/70">
                {charts.length === 0 ? "Charts are temporarily unavailable." : "No charts match your search. Try another word 🎶"}
              </p>
            )}
          </div>
        </div>

        {activeChart && (
          <>
            {/* 02 // Hero: sleeve + vinyl */}
            <div className="relative mb-12 overflow-hidden rounded-3xl border-2 border-black bg-black p-6 text-white shadow-[8px_8px_0_0_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#04b093]/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="relative grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)]">
                {/* Sleeve with sliding vinyl */}
                <div className="group relative mx-auto h-56 w-[19rem] sm:h-64 sm:w-[23rem]">
                  <div
                    className={`chart-vinyl absolute left-16 top-2 h-52 w-52 rounded-full shadow-2xl transition-transform duration-700 ease-out sm:left-20 sm:h-60 sm:w-60 ${
                      isPlaying ? "translate-x-20 sm:translate-x-24" : "translate-x-8 group-hover:translate-x-20 sm:group-hover:translate-x-24"
                    }`}
                  >
                    <div
                      className="chart-spin absolute inset-0 rounded-full"
                      style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                    >
                      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-black bg-[#04b093] sm:h-24 sm:w-24">
                        {artworkOf(top1) && (
                          <Image src={artworkOf(top1)} alt="" fill unoptimized sizes="96px" className="object-cover" />
                        )}
                        <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 h-56 w-56 overflow-hidden rounded-2xl border-2 border-white/20 bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-rotate-3 sm:h-64 sm:w-64">
                    {heroArtwork ? (
                      <Image src={heroArtwork} alt={activeChart.title} fill priority unoptimized sizes="256px" className="object-cover" />
                    ) : (
                      <Image src={CBMTeamArtwork} alt={activeChart.title} fill priority sizes="256px" className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 rotate-[-4deg] rounded-md border-2 border-black bg-[#04b093] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                      CBM Official
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 text-center lg:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <span className="rotate-[-2deg] rounded-full border-2 border-[#04b093] bg-[#04b093]/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#04b093]">
                      {activeChart.chart_type ? activeChart.chart_type.replace(/_/g, " ") : "Countdown"}
                    </span>
                    {activeChart.edition_date && (
                      <span className="inline-flex rotate-[1.5deg] items-center gap-1.5 rounded-full border-2 border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/80">
                        <Calendar className="h-3 w-3 text-[#04b093]" />
                        {formatEdition(activeChart.edition_date)}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl xl:text-6xl">
                    {activeChart.title}
                  </h2>
                  {activeChart.description && (
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-white/65 lg:mx-0">{activeChart.description}</p>
                  )}

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatTile label="Tracks" value={allEntries.length} accent="text-[#04b093]" />
                    <StatTile label="New entries" value={movementCounts.new} accent="text-amber-300" />
                    <StatTile label="Climbers" value={movementCounts.up} accent="text-emerald-300" />
                    <StatTile
                      label="Hot shot"
                      value={topClimber ? `+${topClimber.movement?.diff ?? 0}` : "—"}
                      accent="text-pink-300"
                      hint={topClimber?.title}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    {top1?.audio_url && (
                      <button
                        type="button"
                        onClick={() => togglePlayTrack(top1)}
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-black bg-[#04b093] px-6 text-sm font-black uppercase tracking-wider text-black shadow-[4px_4px_0_0_#fff] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#fff] active:translate-y-0 active:shadow-none"
                      >
                        {playingTrackId === top1.id && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-black" />}
                        {playingTrackId === top1.id && isPlaying ? "Pause #1" : "Play #1"}
                      </button>
                    )}
                    {playableEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={shufflePlay}
                        className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white bg-transparent px-5 text-sm font-black uppercase tracking-wider text-white transition-all hover:-rotate-2 hover:bg-white hover:text-black active:scale-95"
                      >
                        <Shuffle className="h-4 w-4" /> Surprise me
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void shareChart()}
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/30 px-5 text-sm font-bold text-white/80 transition-all hover:border-white hover:text-white active:scale-95"
                    >
                      {copied ? <Check className="h-4 w-4 text-[#04b093]" /> : <Share2 className="h-4 w-4" />}
                      {copied ? "Link copied!" : "Share"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 03 // Podium */}
            {top1 && movementFilter === "all" && !searchQuery && (
              <div className="mb-12">
                <SectionTitle sticker="Top 3" title="The podium" />
                <div className="mx-auto grid max-w-3xl grid-cols-3 items-end gap-3 sm:gap-5">
                  {[top2, top1, top3].map((entry, idx) => {
                    if (!entry) return <div key={idx} />;
                    const isChamp = entry.rank === 1;
                    const isActive = playingTrackId === entry.id && isPlaying;
                    const stepHeight = isChamp ? "h-28 sm:h-36" : entry.rank === 2 ? "h-20 sm:h-24" : "h-14 sm:h-16";
                    return (
                      <div key={entry.id} className="chart-pop-in flex flex-col items-center" style={{ animationDelay: `${idx * 120}ms` }}>
                        {isChamp && <Crown className="chart-float mb-1 h-8 w-8 fill-amber-300 text-black sm:h-10 sm:w-10" aria-hidden="true" />}
                        <button
                          type="button"
                          onClick={() => togglePlayTrack(entry)}
                          disabled={!entry.audio_url}
                          aria-label={entry.audio_url ? `${isActive ? "Pause" : "Play"} ${entry.title}` : entry.title}
                          className={`group relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[4px_4px_0_0_#000] transition-all enabled:hover:-translate-y-1 enabled:hover:rotate-1 enabled:hover:shadow-[7px_7px_0_0_#000] ${
                            isChamp ? "max-w-[13rem]" : "max-w-[10rem]"
                          }`}
                        >
                          {artworkOf(entry) ? (
                            <Image src={artworkOf(entry)} alt="" fill unoptimized sizes="208px" className="object-cover" />
                          ) : (
                            <div className="chart-vinyl h-full w-full" />
                          )}
                          {entry.audio_url && (
                            <span
                              className={`absolute inset-0 grid place-items-center bg-black/50 transition-opacity ${
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <span className="grid size-12 place-items-center rounded-full border-2 border-black bg-[#04b093]">
                                {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5 fill-black" />}
                              </span>
                            </span>
                          )}
                        </button>
                        <div className="mt-3 w-full px-1 text-center">
                          <p className="truncate text-xs font-black uppercase sm:text-sm">{entry.title}</p>
                          <p className="truncate text-[11px] font-bold text-black/60">{entry.artist}</p>
                        </div>
                        <div
                          className={`mt-2 flex w-full items-start justify-center rounded-t-xl border-2 border-b-0 border-black pt-2 ${stepHeight} ${RANK_STYLES[entry.rank]}`}
                        >
                          <span className="text-3xl font-black sm:text-5xl">{entry.rank}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mx-auto h-3 max-w-3xl rounded-b-lg border-2 border-black bg-black" />
              </div>
            )}

            {/* 04 // Tracklist */}
            <div>
              <SectionTitle sticker={countdownOrder ? "Countdown" : "Full list"} title="The tracklist" />

              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {MOVEMENT_FILTERS.map((filter) => {
                    const isActive = movementFilter === filter.key;
                    const count = movementCounts[filter.key];
                    return (
                      <button
                        key={filter.key}
                        type="button"
                        aria-pressed={isActive}
                        disabled={count === 0 && filter.key !== "all"}
                        onClick={() => setMovementFilter(filter.key)}
                        className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-black px-4 text-xs font-black uppercase tracking-wide transition-all enabled:active:scale-95 disabled:opacity-40 ${
                          isActive ? "bg-black text-white shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]" : "bg-white text-black enabled:hover:-translate-y-0.5 enabled:hover:shadow-[3px_3px_0_0_#000]"
                        }`}
                      >
                        <span aria-hidden="true">{filter.emoji}</span>
                        {filter.label}
                        <span className={`rounded-full px-1.5 text-[10px] ${isActive ? "bg-[#04b093] text-black" : "bg-black/10"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 lg:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/60" aria-hidden="true" />
                    <label htmlFor="artist-search" className="sr-only">Search songs or artists</label>
                    <input
                      id="artist-search"
                      type="search"
                      placeholder="Song, artist, album…"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="min-h-10 w-full rounded-full border-2 border-black bg-white pl-9 pr-4 text-sm font-semibold placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCountdownOrder((v) => !v)}
                    aria-pressed={countdownOrder}
                    title={countdownOrder ? "Show #1 first" : "Count down to #1"}
                    className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-black px-4 text-xs font-black uppercase transition-all active:scale-95 ${
                      countdownOrder ? "bg-black text-[#04b093]" : "bg-white text-black hover:shadow-[3px_3px_0_0_#000]"
                    }`}
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{countdownOrder ? "Countdown" : "Top first"}</span>
                  </button>
                </div>
              </div>

              {chartLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl border-2 border-black/20 bg-black/10" />
                  ))}
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-black/40 py-14 text-center">
                  <p className="text-3xl" aria-hidden="true">🙈</p>
                  <p className="mt-2 font-black uppercase">Nothing here</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setMovementFilter("all");
                    }}
                    className="mt-3 text-sm font-bold underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <ol key={`${activeChart.slug}-${movementFilter}-${countdownOrder}`} className="space-y-3">
                  {filteredEntries.map((entry, idx) => (
                    <TrackRow
                      key={entry.id}
                      entry={entry}
                      index={idx}
                      total={allEntries.length}
                      maxWeeks={maxWeeks}
                      isCurrent={playingTrackId === entry.id}
                      isPlaying={playingTrackId === entry.id && isPlaying}
                      expanded={expandedId === entry.id}
                      onToggleExpand={() => setExpandedId((id) => (id === entry.id ? null : entry.id))}
                      onTogglePlay={() => togglePlayTrack(entry)}
                    />
                  ))}
                </ol>
              )}
            </div>
          </>
        )}
      </div>

      {/* 05 // Now Playing dock */}
      {nowPlaying && (
        <div className="chart-pop-in fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-2xl border-2 border-black bg-black p-3 text-white shadow-[6px_6px_0_0_rgba(0,0,0,0.4)] sm:p-4">
          <div className="flex items-center gap-3">
            <div
              className="chart-spin relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-[#04b093] bg-zinc-900"
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
            >
              {artworkOf(nowPlaying) && <Image src={artworkOf(nowPlaying)} alt="" fill unoptimized sizes="48px" className="object-cover" />}
              <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">
                <span className="mr-1.5 text-[#04b093]">#{nowPlaying.rank}</span>
                {nowPlaying.title}
              </p>
              <p className="truncate text-xs text-white/60">{nowPlaying.artist}</p>
            </div>
            <div className="flex items-center gap-1">
              <DockButton label="Previous track" onClick={playPrevious} disabled={playableEntries.length < 2}>
                <SkipBack className="h-4 w-4" />
              </DockButton>
              <button
                type="button"
                onClick={() => togglePlayTrack(nowPlaying)}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="grid size-11 place-items-center rounded-full bg-[#04b093] text-black transition-transform hover:scale-110 active:scale-95"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5 fill-black" />}
              </button>
              <DockButton label="Next track" onClick={playNext} disabled={playableEntries.length < 2}>
                <SkipForward className="h-4 w-4" />
              </DockButton>
              <DockButton label="Close player" onClick={stopPlayback}>
                <X className="h-4 w-4" />
              </DockButton>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold tabular-nums text-white/50">
            <span>{formatTime(progress.current)}</span>
            <input
              type="range"
              min={0}
              max={progress.duration || 0}
              step={0.1}
              value={progress.current}
              aria-label="Seek"
              onChange={(e) => {
                const value = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = value;
                setProgress((p) => ({ ...p, current: value }));
              }}
              className="h-1.5 flex-1 cursor-pointer accent-[#04b093]"
            />
            <span>{formatTime(progress.duration)}</span>
          </div>
        </div>
      )}
    </section>
  );
}

function SectionTitle({ sticker, title }: { sticker: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="rotate-[-3deg] rounded-md border-2 border-black bg-white px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#000]">
        {sticker}
      </span>
      <h3 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">{title}</h3>
      <span className="h-0.5 flex-1 bg-black/80" aria-hidden="true" />
    </div>
  );
}

function StatTile({ label, value, accent, hint }: { label: string; value: number | string; accent: string; hint?: string }) {
  return (
    <div className="rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-white/30" title={hint}>
      <p className={`text-2xl font-black leading-none ${accent}`}>{value}</p>
      <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</p>
    </div>
  );
}

function DockButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function MovementSticker({ entry }: { entry: ChartEntry }) {
  const status = movementOf(entry);
  const diff = entry.movement?.diff ?? 0;
  if (status === "up")
    return (
      <span className="inline-flex rotate-[-4deg] items-center gap-0.5 rounded-md border-2 border-black bg-emerald-300 px-1.5 text-[10px] font-black text-black">
        <ArrowUp className="h-3 w-3" strokeWidth={3} />
        {diff}
      </span>
    );
  if (status === "down")
    return (
      <span className="inline-flex rotate-[3deg] items-center gap-0.5 rounded-md border-2 border-black bg-rose-300 px-1.5 text-[10px] font-black text-black">
        <ArrowDown className="h-3 w-3" strokeWidth={3} />
        {diff}
      </span>
    );
  if (status === "new")
    return (
      <span className="inline-flex rotate-[-3deg] items-center gap-0.5 rounded-md border-2 border-black bg-amber-300 px-1.5 text-[10px] font-black text-black">
        <Sparkles className="h-3 w-3" />
        NEW
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-md border-2 border-black/30 px-1.5 text-[10px] font-black text-current opacity-60">
      <Minus className="h-3 w-3" />
    </span>
  );
}

function StatBar({ label, value, percent, dark }: { label: string; value: string; percent: number; dark: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[11px] font-bold uppercase tracking-wider">
        <span className={dark ? "text-white/60" : "text-black/60"}>{label}</span>
        <span className="text-sm font-black">{value}</span>
      </div>
      <div className={`h-2.5 overflow-hidden rounded-full border-2 ${dark ? "border-white/30 bg-white/10" : "border-black bg-white"}`}>
        <div
          className="h-full rounded-full bg-[#04b093] transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(6, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

interface TrackRowProps {
  entry: ChartEntry;
  index: number;
  total: number;
  maxWeeks: number;
  isCurrent: boolean;
  isPlaying: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onTogglePlay: () => void;
}

function TrackRow({ entry, index, total, maxWeeks, isCurrent, isPlaying, expanded, onToggleExpand, onTogglePlay }: TrackRowProps) {
  const artwork = artworkOf(entry);
  const rankPercent = (rank: number | null) => (rank ? ((total - rank + 1) / Math.max(total, 1)) * 100 : 0);
  const panelId = `track-panel-${entry.id}`;
  const hasLinks = Boolean(entry.youtube_url || entry.spotify_url || entry.apple_music_url);

  return (
    <li
      className={`chart-pop-in group rounded-2xl border-2 border-black transition-all duration-200 ${
        isCurrent
          ? "bg-black text-white shadow-[5px_5px_0_0_rgba(0,0,0,0.35)]"
          : "bg-[#effcf8] text-black shadow-[4px_4px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000]"
      }`}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <div
        className="flex cursor-pointer items-center gap-3 p-3 sm:gap-4 sm:p-4"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button, a")) return;
          onToggleExpand();
        }}
      >
        {/* Rank */}
        <div className="flex w-14 shrink-0 flex-col items-center gap-1 sm:w-16">
          <span
            className={`grid size-12 place-items-center rounded-xl border-2 border-black text-xl font-black text-black transition-transform group-hover:rotate-[-4deg] sm:size-14 sm:text-2xl ${
              RANK_STYLES[entry.rank] ?? "bg-white"
            }`}
          >
            {entry.rank}
          </span>
          <MovementSticker entry={entry} />
        </div>

        {/* Artwork + play */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border-2 border-black bg-zinc-900 sm:size-16">
          {artwork ? (
            <Image src={artwork} alt="" fill unoptimized sizes="64px" className="object-cover" />
          ) : (
            <div className="chart-vinyl h-full w-full" />
          )}
          {entry.audio_url && (
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={`${isPlaying ? "Pause" : "Play"} preview of ${entry.title}`}
              className={`absolute inset-0 grid place-items-center bg-black/55 transition-opacity ${
                isCurrent ? "opacity-100" : "opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
              }`}
            >
              {isPlaying ? (
                <span className="flex h-5 items-end gap-0.5" aria-hidden="true">
                  <span className="animate-eq-1 w-1 rounded-sm bg-[#04b093]" />
                  <span className="animate-eq-2 w-1 rounded-sm bg-[#04b093]" />
                  <span className="animate-eq-3 w-1 rounded-sm bg-[#04b093]" />
                  <span className="animate-eq-4 w-1 rounded-sm bg-[#04b093]" />
                </span>
              ) : (
                <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
              )}
            </button>
          )}
        </div>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black uppercase sm:text-base">{entry.title}</p>
          <p className={`truncate text-xs font-semibold sm:text-sm ${isCurrent ? "text-white/70" : "text-black/65"}`}>
            {entry.artist}
            {entry.featured_artists && <span className="opacity-70"> ft. {entry.featured_artists}</span>}
          </p>
        </div>

        {/* Quick stats */}
        <div className="hidden items-center gap-5 text-center md:flex">
          <QuickStat label="Last wk" value={entry.previous_rank ?? "—"} dark={isCurrent} />
          <QuickStat label="Peak" value={entry.peak_rank} dark={isCurrent} />
          <QuickStat label="Weeks" value={entry.weeks_on_chart} dark={isCurrent} />
        </div>

        {entry.peak_rank === 1 && entry.rank !== 1 && (
          <span className="hidden rotate-6 rounded-full border-2 border-black bg-amber-300 px-2 py-0.5 text-[10px] font-black uppercase text-black lg:inline-block">
            Ex-#1
          </span>
        )}

        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={expanded ? "Hide details" : "Show details"}
          className={`grid size-9 shrink-0 place-items-center rounded-full border-2 transition-all ${
            isCurrent ? "border-white/30 hover:bg-white hover:text-black" : "border-black hover:bg-black hover:text-white"
          }`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expandable detail drawer */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className={`grid gap-5 border-t-2 border-dashed p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-5 ${isCurrent ? "border-white/20" : "border-black/30"}`}>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatBar label="This week" value={`#${entry.rank}`} percent={rankPercent(entry.rank)} dark={isCurrent} />
              <StatBar label="Peak" value={`#${entry.peak_rank}`} percent={rankPercent(entry.peak_rank)} dark={isCurrent} />
              <StatBar label="Weeks on chart" value={String(entry.weeks_on_chart)} percent={(entry.weeks_on_chart / maxWeeks) * 100} dark={isCurrent} />
              {entry.album && (
                <p className={`text-xs font-semibold sm:col-span-3 ${isCurrent ? "text-white/60" : "text-black/60"}`}>
                  <Disc3 className="mr-1 inline h-3.5 w-3.5" /> From <span className="font-black">{entry.album}</span>
                </p>
              )}
              {movementOf(entry) === "up" && (entry.movement?.diff ?? 0) >= 3 && (
                <p className="inline-flex items-center gap-1 text-xs font-black uppercase text-emerald-600 sm:col-span-3">
                  <TrendingUp className="h-3.5 w-3.5" /> Big mover this week!
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
              {entry.audio_url && (
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border-2 border-black bg-[#04b093] px-4 text-xs font-black uppercase text-black transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-black" />}
                  {isPlaying ? "Pause" : "Preview"}
                </button>
              )}
              {entry.youtube_url && (
                <StreamLink href={entry.youtube_url} label="YouTube" className="hover:bg-red-600 hover:text-white">
                  <FaYoutube className="h-3.5 w-3.5" />
                </StreamLink>
              )}
              {entry.spotify_url && (
                <StreamLink href={entry.spotify_url} label="Spotify" className="hover:bg-[#1DB954] hover:text-black">
                  <FaSpotify className="h-3.5 w-3.5" />
                </StreamLink>
              )}
              {entry.apple_music_url && (
                <StreamLink href={entry.apple_music_url} label="Apple Music" className="hover:bg-pink-500 hover:text-white">
                  <FaApple className="h-3.5 w-3.5" />
                </StreamLink>
              )}
              {!entry.audio_url && !hasLinks && (
                <span className={`text-xs font-semibold ${isCurrent ? "text-white/50" : "text-black/50"}`}>No listening links yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function QuickStat({ label, value, dark }: { label: string; value: number | string; dark: boolean }) {
  return (
    <div className="w-12">
      <p className="text-base font-black leading-none">{value}</p>
      <p className={`mt-1 text-[9px] font-bold uppercase tracking-wider ${dark ? "text-white/50" : "text-black/50"}`}>{label}</p>
    </div>
  );
}

function StreamLink({ href, label, className, children }: { href: string; label: string; className: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border-2 border-black bg-white px-4 text-xs font-black uppercase text-black transition-all hover:-translate-y-0.5 ${className}`}
    >
      {children}
      {label}
    </a>
  );
}
