"use client";

import {
  ArrowUpRight,
  Flame,
  Music2,
  Pause,
  Play,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { chartService } from "@/services/chart.service";
import type { Chart, ChartEntry } from "@/types/chart";
import RadioShowArtwork from "../../public/cbm_images/radio 2.jpeg";

// Curated fallback entries if API returns an empty chart
const fallbackEntries: ChartEntry[] = [
  {
    id: "fb-1",
    rank: 1,
    previous_rank: 2,
    peak_rank: 1,
    weeks_on_chart: 5,
    title: "Higher Frequency",
    artist: "CBM Featured Artist",
    featured_artists: "",
    cover_image_url:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop",
    movement: { status: "up", diff: 1, label: "+1 spot" },
  },
  {
    id: "fb-2",
    rank: 2,
    previous_rank: 1,
    peak_rank: 1,
    weeks_on_chart: 8,
    title: "Morning Sun",
    artist: "East African Collective",
    featured_artists: "",
    cover_image_url:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop",
    movement: { status: "down", diff: 1, label: "-1 spot" },
  },
  {
    id: "fb-3",
    rank: 3,
    previous_rank: 4,
    peak_rank: 3,
    weeks_on_chart: 4,
    title: "Grace Notes",
    artist: "Sound Tribe",
    featured_artists: "Trevor",
    cover_image_url:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop",
    movement: { status: "up", diff: 1, label: "+1 spot" },
  },
  {
    id: "fb-4",
    rank: 4,
    previous_rank: 3,
    peak_rank: 2,
    weeks_on_chart: 6,
    title: "City Lights",
    artist: "Acoustic Soul",
    featured_artists: "",
    cover_image_url:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop",
    movement: { status: "down", diff: 1, label: "-1 spot" },
  },
  {
    id: "fb-5",
    rank: 5,
    previous_rank: null,
    peak_rank: 5,
    weeks_on_chart: 1,
    title: "Alive & Free",
    artist: "Faith & Harmony",
    featured_artists: "",
    cover_image_url:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop",
    movement: { status: "new", diff: 0, label: "New Entry" },
  },
];

export default function HomepageCharts() {
  const [chart, setChart] = useState<Chart | null>(null);
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedChartSlug, setSelectedChartSlug] = useState<string>("");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadChartData() {
      try {
        const charts = await chartService.getCharts();
        const activeCharts = charts.filter((item) => item.is_active);
        const visibleCharts = activeCharts.length > 0 ? activeCharts : charts;

        // Prioritize charts that have entries
        const chartWithEntries =
          visibleCharts.find(
            (c) =>
              ((c as unknown as { entry_count?: number }).entry_count ?? 0) > 0 ||
              (c.entries?.length ?? 0) > 0 ||
              c.slug === "hot-100",
          ) ?? visibleCharts[0];

        const initialSlug = chartWithEntries?.slug ?? "";
        const details = initialSlug
          ? await chartService.getChartBySlug(initialSlug)
          : null;

        if (!isMounted) return;
        setAvailableCharts(visibleCharts);
        setSelectedChartSlug(initialSlug);
        setChart(details ?? chartWithEntries ?? null);
      } catch (error) {
        console.error("Failed to load homepage chart:", error);
      }
    }

    void loadChartData();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSelectChart(slug: string) {
    if (slug === selectedChartSlug) return;
    setSelectedChartSlug(slug);
    try {
      const details = await chartService.getChartBySlug(slug);
      if (details) {
        setChart(details);
      }
    } catch (e) {
      console.error(`Failed to load chart ${slug}:`, e);
    }
  }

  // Ensure entries are never empty
  const rawEntries = useMemo(() => {
    const list = chart?.entries?.filter((entry) => entry.rank > 0) ?? [];
    if (list.length > 0) {
      return [...list].sort((a, b) => a.rank - b.rank);
    }
    return fallbackEntries;
  }, [chart]);

  const top1 = rawEntries[0] ?? fallbackEntries[0];
  const leaderboardEntries = rawEntries.slice(1, 5);
  const chartHeroArtwork = chart?.cover_image_url || chart?.cover_image || RadioShowArtwork;

  const togglePlay = (entry: ChartEntry) => {
    if (playingTrackId === entry.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setPlayingTrackId(null);
    } else {
      const safeAudioUrl =
        entry.audio_url && /^(https?:\/\/|\/(?!\/))/i.test(entry.audio_url.trim())
          ? entry.audio_url.trim()
          : "";
      if (safeAudioUrl && audioRef.current) {
        audioRef.current.src = safeAudioUrl;
        audioRef.current.play().catch(() => {});
      }
      setPlayingTrackId(entry.id);
      setIsPlaying(true);
    }
  };

  return (
    <section id="charts" className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 text-black">
      {/* Hidden audio element for previews */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setPlayingTrackId(null);
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Master Billboard Showcase Container */}
        <div className="relative overflow-hidden border-2 border-black bg-black p-6 sm:p-10 text-white shadow-2xl">
          {/* Subtle Ambient Backlights */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#04b093]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-white/15 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-[#04b093] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-black">
                  OFFICIAL COUNTDOWN
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#04b093] flex items-center gap-1.5">
                  <Trophy size={13} />
                  <span>TOP 5 SPOTLIGHT</span>
                </span>
              </div>
              <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                {chart?.title || "The Official Music Countdown"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-xl font-medium">
                {chart?.description || "Ranked each week by verified listener streams, radio airplay, and audience favorites."}
              </p>
            </div>

            {/* Filter Tabs & Full Chart CTA */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {availableCharts.length > 1 && (
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 p-1">
                  {availableCharts.map((item) => {
                    const isSelected = item.slug === selectedChartSlug;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectChart(item.slug)}
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider transition ${
                          isSelected
                            ? "bg-[#04b093] text-black shadow-md"
                            : "text-zinc-300 hover:text-white"
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              )}

              <Link
                href={selectedChartSlug ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}` : "/charts"}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#04b093] px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-lg transition hover:bg-white hover:text-black hover:scale-105"
              >
                <span>Full Chart</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Clean 2-Column Showcase */}
          <div className="relative z-10 mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column (5 Cols): The #1 Anthem Card */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-zinc-900 to-black p-5 sm:p-6 shadow-xl transition-all hover:border-[#04b093]/60">
                {/* #1 Crown Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-full bg-amber-400 text-black font-black text-xs">
                      ★
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                      CURRENT #1 LEADER
                    </span>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                    {top1.weeks_on_chart ?? 1} wks on chart
                  </span>
                </div>

                {/* Album Cover Art */}
                <div className="relative mx-auto my-5 aspect-square w-full max-w-[260px] overflow-hidden rounded-xl border border-white/20 shadow-2xl">
                  <Image
                    src={top1.cover_image_url || top1.cover_image || RadioShowArtwork}
                    alt={top1.title}
                    fill
                    unoptimized={Boolean(top1.cover_image_url || top1.cover_image)}
                    sizes="260px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Floating #01 Rank Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-[#04b093] text-black font-black text-xl shadow-lg">
                      #01
                    </span>
                    <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#04b093] backdrop-blur-md">
                      Peak #{top1.peak_rank ?? 1}
                    </span>
                  </div>
                </div>

                {/* Song Meta */}
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white truncate">
                    {top1.title}
                  </h3>
                  <p className="text-sm font-bold text-[#04b093] truncate">
                    {top1.artist}
                    {top1.featured_artists ? <span className="text-white/60 font-medium"> ft. {top1.featured_artists}</span> : null}
                  </p>
                </div>

                {/* Play Preview Action */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => togglePlay(top1)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-black uppercase tracking-wider transition ${
                      playingTrackId === top1.id && isPlaying
                        ? "bg-[#04b093] text-black shadow-[0_0_20px_rgba(4,176,147,0.4)]"
                        : "bg-[#04b093] text-black hover:bg-white"
                    }`}
                  >
                    {playingTrackId === top1.id && isPlaying ? (
                      <>
                        <Pause size={14} fill="currentColor" />
                        <span>Pause Preview</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="currentColor" />
                        <span>Play Preview</span>
                      </>
                    )}
                  </button>
                  <Link
                    href={selectedChartSlug ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}` : "/charts"}
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/5 text-white/80 hover:border-[#04b093] hover:text-[#04b093] transition"
                    title="View chart details"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): The Ranked Contenders #2 - #5 */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/15 bg-zinc-950/70 p-4 sm:p-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#04b093]">
                    CHASING THE CROWN (#02 – #05)
                  </span>
                  <span className="text-[11px] font-bold text-zinc-400">
                    Movement &amp; Audio
                  </span>
                </div>

                {/* Ranked List */}
                <div className="divide-y divide-white/10">
                  {leaderboardEntries.map((entry, idx) => {
                    const isTrackPlaying = playingTrackId === entry.id && isPlaying;
                    const rank = entry.rank || idx + 2;

                    return (
                      <div
                        key={entry.id}
                        className="group flex items-center justify-between gap-3 py-3.5 px-2 rounded-xl hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank Badge */}
                          <span
                            className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black tabular-nums ${
                              rank === 2
                                ? "bg-slate-200 text-black"
                                : rank === 3
                                ? "bg-amber-600 text-white"
                                : "border border-white/20 bg-white/5 text-zinc-300"
                            }`}
                          >
                            0{rank}
                          </span>

                          {/* Thumbnail */}
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black">
                            <Image
                              src={entry.cover_image_url || entry.cover_image || RadioShowArtwork}
                              alt={entry.title}
                              fill
                              unoptimized={Boolean(entry.cover_image_url || entry.cover_image)}
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>

                          {/* Title & Artist */}
                          <div className="min-w-0">
                            <h4 className="text-sm font-black uppercase text-white truncate group-hover:text-[#04b093] transition">
                              {entry.title}
                            </h4>
                            <p className="text-xs text-zinc-400 truncate mt-0.5">
                              {entry.artist}
                              {entry.featured_artists ? ` ft. ${entry.featured_artists}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Movement & Play Trigger */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          {entry.movement?.status === "up" && (
                            <span className="hidden sm:inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                              ▲ {entry.movement.label}
                            </span>
                          )}
                          {entry.movement?.status === "down" && (
                            <span className="hidden sm:inline-block rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-black text-rose-400">
                              ▼ {entry.movement.label}
                            </span>
                          )}
                          {entry.movement?.status === "new" && (
                            <span className="hidden sm:inline-block rounded-full bg-[#04b093]/20 px-2 py-0.5 text-[10px] font-black text-[#04b093]">
                              ★ NEW
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => togglePlay(entry)}
                            aria-label={`Play preview of ${entry.title}`}
                            className={`grid size-8 place-items-center rounded-full border transition ${
                              isTrackPlaying
                                ? "border-[#04b093] bg-[#04b093] text-black shadow-[0_0_12px_rgba(4,176,147,0.4)]"
                                : "border-white/20 bg-white/5 text-white hover:border-[#04b093] hover:text-[#04b093]"
                            }`}
                          >
                            {isTrackPlaying ? (
                              <Pause size={12} fill="currentColor" />
                            ) : (
                              <Play size={12} className="ml-0.5" fill="currentColor" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Bar */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">
                    Live community votes &amp; radio airplay standings
                  </span>
                  <Link
                    href={selectedChartSlug ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}` : "/charts"}
                    className="font-black uppercase tracking-wider text-[#04b093] hover:underline flex items-center gap-1"
                  >
                    <span>Full Leaderboard</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
