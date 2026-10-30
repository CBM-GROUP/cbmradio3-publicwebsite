"use client";

import {
  ArrowUpRight,
  Crown,
  Radio,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

function getAirplayTier(rank: number): { label: string; badgeClass: string } {
  switch (rank) {
    case 1:
      return {
        label: "Heavy Rotation",
        badgeClass: "bg-amber-400 text-black border-amber-300",
      };
    case 2:
      return {
        label: "Prime Airplay",
        badgeClass: "bg-slate-200 text-black border-slate-300",
      };
    case 3:
      return {
        label: "Power Play",
        badgeClass: "bg-amber-600 text-white border-amber-500",
      };
    case 4:
      return {
        label: "Rising Wave",
        badgeClass: "bg-[#04b093]/20 text-[#04b093] border-[#04b093]/40",
      };
    default:
      return {
        label: "Market Contender",
        badgeClass: "bg-white/10 text-zinc-300 border-white/20",
      };
  }
}

function renderMovement(entry: ChartEntry) {
  const status =
    entry.movement?.status ??
    (entry.previous_rank
      ? entry.previous_rank > entry.rank
        ? "up"
        : entry.previous_rank < entry.rank
        ? "down"
        : "same"
      : "new");
  const diff =
    entry.movement?.diff ??
    (entry.previous_rank ? Math.abs(entry.previous_rank - entry.rank) : 0);

  if (status === "up") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
        <span>▲</span>
        <span>{diff > 0 ? `+${diff}` : "UP"}</span>
      </span>
    );
  }
  if (status === "down") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-400">
        <span>▼</span>
        <span>{diff > 0 ? `-${diff}` : "DOWN"}</span>
      </span>
    );
  }
  if (status === "new" || !entry.previous_rank) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#04b093]/40 bg-[#04b093]/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#04b093]">
        <span>★</span>
        <span>NEW</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
      <span>●</span>
      <span>HOLD</span>
    </span>
  );
}

export default function HomepageCharts() {
  const [chart, setChart] = useState<Chart | null>(null);
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedChartSlug, setSelectedChartSlug] = useState<string>("");

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

  return (
    <section
      id="charts"
      className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-4 py-12 text-black sm:px-8 sm:py-16 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Master Billboard Showcase Container */}
        <div className="relative overflow-hidden border-2 border-black bg-black p-6 text-white shadow-2xl sm:p-10">
          {/* Subtle Ambient Backlights */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#04b093]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          {/* Section Header (Preserved as requested) */}
          <div className="relative z-10 flex flex-col gap-5 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="bg-[#04b093] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-black">
                  OFFICIAL COUNTDOWN
                </span>
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#04b093]">
                  <Trophy size={13} />
                  <span>TOP 5 SPOTLIGHT</span>
                </span>
              </div>
              <h2 className="mt-2.5 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                {chart?.title || "The Official Music Countdown"}
              </h2>
              <p className="mt-1 max-w-xl text-xs font-medium text-zinc-300 sm:text-sm">
                {chart?.description ||
                  "Ranked each week by verified listener streams, radio airplay, and audience favorites."}
              </p>
            </div>

            {/* Filter Tabs & Full Chart CTA */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
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
                href={
                  selectedChartSlug
                    ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}`
                    : "/charts"
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-[#04b093] px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-lg transition hover:scale-105 hover:bg-white hover:text-black"
              >
                <span>Full Chart</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Radio Market Telemetry Banner */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#04b093] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#04b093]" />
              </span>
              <span className="text-white">Broadcast Airplay &amp; Market Rankings</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="hidden sm:inline">Official Weekly Standing</span>
              <span className="text-[#04b093]">Top 5 Leaders</span>
            </div>
          </div>

          {/* Pure Ranking Layout */}
          <div className="relative z-10 mt-6 space-y-4">
            {/* #01 The Market Leader Champion Podium */}
            <div className="group relative overflow-hidden rounded-2xl border-2 border-[#04b093]/70 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-5 shadow-2xl transition-all hover:border-[#04b093] sm:p-7">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#04b093]/10 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Rank Badge + Artwork + Title */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  {/* Huge #01 Champion Badge */}
                  <div className="flex flex-col items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 px-3.5 py-3 text-black shadow-[0_0_20px_rgba(245,158,11,0.35)] sm:px-5 sm:py-4">
                    <Crown size={18} className="fill-black stroke-black" />
                    <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none mt-1">
                      #01
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest mt-0.5">
                      NO. 1
                    </span>
                  </div>

                  {/* Album Cover Art */}
                  <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-xl border-2 border-white/20 shadow-2xl bg-black">
                    <Image
                      src={
                        top1.cover_image_url ||
                        top1.cover_image ||
                        RadioShowArtwork
                      }
                      alt={top1.title}
                      fill
                      unoptimized={Boolean(
                        top1.cover_image_url || top1.cover_image,
                      )}
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Song & Artist Info */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                        ★ Current Market Leader
                      </span>
                      <span className="rounded-full bg-[#04b093]/20 border border-[#04b093]/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#04b093]">
                        Heavy Radio Rotation
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white truncate">
                      {top1.title}
                    </h3>

                    <p className="mt-0.5 text-sm sm:text-base font-bold text-[#04b093] truncate">
                      {top1.artist}
                      {top1.featured_artists ? (
                        <span className="text-white/60 font-medium">
                          {" "}
                          ft. {top1.featured_artists}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>

                {/* Right: Authoritative Radio Telemetry Stats */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-3 border-t border-white/10 lg:border-t-0 lg:pt-0">
                  <div className="flex-1 lg:flex-none text-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      LAST WK
                    </span>
                    <span className="text-base sm:text-lg font-black text-white tabular-nums">
                      {top1.previous_rank ? `#${top1.previous_rank}` : "—"}
                    </span>
                  </div>

                  <div className="flex-1 lg:flex-none text-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      PEAK
                    </span>
                    <span className="text-base sm:text-lg font-black text-amber-400 tabular-nums">
                      #{top1.peak_rank ?? 1}
                    </span>
                  </div>

                  <div className="flex-1 lg:flex-none text-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      WEEKS
                    </span>
                    <span className="text-base sm:text-lg font-black text-white tabular-nums">
                      {top1.weeks_on_chart ?? 1}
                    </span>
                  </div>

                  <div className="flex-1 lg:flex-none text-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      MOVEMENT
                    </span>
                    <div className="mt-0.5">{renderMovement(top1)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chasing Contenders Ranking Table (#02 - #05) */}
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/80 backdrop-blur-md shadow-xl">
              {/* Desktop Column Header */}
              <div className="hidden sm:grid grid-cols-12 items-center gap-4 border-b border-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <div className="col-span-1 text-center">RANK</div>
                <div className="col-span-5">SONG &amp; ARTIST</div>
                <div className="col-span-2 text-center">AIRPLAY ROTATION</div>
                <div className="col-span-1 text-center">LAST WK</div>
                <div className="col-span-1 text-center">PEAK</div>
                <div className="col-span-1 text-center">WEEKS</div>
                <div className="col-span-1 text-center">TREND</div>
              </div>

              {/* Contender Rows */}
              <div className="divide-y divide-white/10">
                {leaderboardEntries.map((entry, idx) => {
                  const rank = entry.rank || idx + 2;
                  const tier = getAirplayTier(rank);

                  return (
                    <div
                      key={entry.id}
                      className="group flex flex-col gap-3 p-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6 sm:py-4 transition-colors hover:bg-white/5"
                    >
                      {/* Rank Badge */}
                      <div className="col-span-1 flex items-center justify-between sm:justify-center">
                        <span
                          className={`flex size-10 items-center justify-center rounded-xl text-sm font-black tabular-nums shadow-md ${
                            rank === 2
                              ? "bg-slate-200 text-black font-black"
                              : rank === 3
                              ? "bg-amber-600 text-white font-black"
                              : "border border-white/20 bg-white/5 text-zinc-200"
                          }`}
                        >
                          0{rank}
                        </span>

                        {/* Mobile movement tag indicator */}
                        <div className="sm:hidden">{renderMovement(entry)}</div>
                      </div>

                      {/* Cover Art + Track & Artist */}
                      <div className="col-span-5 flex items-center gap-3.5 min-w-0">
                        <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black">
                          <Image
                            src={
                              entry.cover_image_url ||
                              entry.cover_image ||
                              RadioShowArtwork
                            }
                            alt={entry.title}
                            fill
                            unoptimized={Boolean(
                              entry.cover_image_url || entry.cover_image,
                            )}
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-black uppercase text-white tracking-tight truncate group-hover:text-[#04b093] transition-colors">
                            {entry.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">
                            {entry.artist}
                            {entry.featured_artists ? (
                              <span className="text-zinc-500">
                                {" "}
                                ft. {entry.featured_artists}
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </div>

                      {/* Airplay Rotation Tier */}
                      <div className="col-span-2 text-left sm:text-center">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${tier.badgeClass}`}
                        >
                          {tier.label}
                        </span>
                      </div>

                      {/* Telemetry Stats: Last Wk, Peak, Weeks, Trend */}
                      <div className="col-span-4 grid grid-cols-4 items-center text-center text-xs">
                        {/* Last Week */}
                        <div>
                          <span className="block text-[9px] font-black text-zinc-500 sm:hidden">
                            LW
                          </span>
                          <span className="font-bold text-zinc-300 tabular-nums">
                            {entry.previous_rank
                              ? `#${entry.previous_rank}`
                              : "—"}
                          </span>
                        </div>

                        {/* Peak */}
                        <div>
                          <span className="block text-[9px] font-black text-zinc-500 sm:hidden">
                            PEAK
                          </span>
                          <span className="font-bold text-white tabular-nums">
                            #{entry.peak_rank ?? rank}
                          </span>
                        </div>

                        {/* Weeks on Chart */}
                        <div>
                          <span className="block text-[9px] font-black text-zinc-500 sm:hidden">
                            WKS
                          </span>
                          <span className="font-bold text-zinc-300 tabular-nums">
                            {entry.weeks_on_chart ?? 1}
                          </span>
                        </div>

                        {/* Trend (Desktop) */}
                        <div className="hidden sm:block">
                          {renderMovement(entry)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Chart Explanatory Footer */}
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-[#04b093] shrink-0" />
                <span>
                  Official rankings computed weekly from CBM broadcast airplay spins, request logs, and market trends.
                </span>
              </div>

              <Link
                href={
                  selectedChartSlug
                    ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}`
                    : "/charts"
                }
                className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-[#04b093] hover:text-white transition-colors shrink-0"
              >
                <span>View Full Top 100 Chart &amp; Community Voting</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
