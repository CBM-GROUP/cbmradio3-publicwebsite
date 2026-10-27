"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Disc3,
  Flame,
  Headphones,
  Music2,
  Sparkles,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { chartService } from "@/services/chart.service";
import type { Chart, ChartEntry } from "@/types/chart";
import RadioShowArtwork from "../../public/cbm_images/radio 2.jpeg";
import CBMTeamArtwork from "../../public/cbm_images/take 3.jpeg";

type LoadState = "loading" | "ready" | "error";

const chartArtwork = [RadioShowArtwork, CBMTeamArtwork];
const fallbackChartCategories = ["Top 20 Countdown", "Afrobeats Pulse", "Gospel Praise", "East African Heat"];

export default function HomepageCharts() {
  const [chart, setChart] = useState<Chart | null>(null);
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedChartType, setSelectedChartType] = useState(fallbackChartCategories[0]);
  const [discRotation, setDiscRotation] = useState(0);
  const [status, setStatus] = useState<LoadState>("loading");
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadChart() {
      try {
        const charts = await chartService.getCharts();
        const activeCharts = charts.filter((item) => item.is_active);
        const visibleCharts = activeCharts.length > 0 ? activeCharts : charts;
        const featured = visibleCharts[0];
        const details = featured
          ? await chartService.getChartBySlug(featured.slug)
          : null;

        if (!isMounted) return;
        setAvailableCharts(visibleCharts);
        setChart(details ?? featured ?? null);
        setSelectedChartType(
          (details ?? featured)?.chart_type ?? fallbackChartCategories[0],
        );
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load homepage chart:", error);
        if (isMounted) setStatus("error");
      }
    }

    void loadChart();
    return () => {
      isMounted = false;
    };
  }, []);

  const entries = chart?.entries
    ?.filter((entry) => entry.rank > 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5) ?? [];
  const artwork = chart?.cover_image_url || chart?.cover_image || RadioShowArtwork;
  const availableChartTypes = Array.from(
    new Set(availableCharts.map((item) => item.chart_type.trim()).filter(Boolean)),
  );
  const chartCategories =
    availableChartTypes.length > 0 ? availableChartTypes : fallbackChartCategories;
  const selectedChart =
    availableCharts.find((item) => item.chart_type === selectedChartType) ?? chart;
  const selectedArtwork =
    selectedChart?.cover_image_url || selectedChart?.cover_image || artwork;

  function rotateDisc(direction: -1 | 1) {
    if (chartCategories.length === 0) return;
    const currentIndex = Math.max(0, chartCategories.indexOf(selectedChartType));
    const nextIndex =
      (currentIndex + direction + chartCategories.length) % chartCategories.length;
    setSelectedChartType(chartCategories[nextIndex]);
    setDiscRotation((rotation) => rotation + direction * 360);
  }

  function selectChartType(type: string) {
    if (type === selectedChartType) return;
    setSelectedChartType(type);
    setDiscRotation((rotation) => rotation + 360);
  }

  return (
    <section id="charts" className="relative border-y border-white/10 bg-[#080d0b] text-white">
      {/* Subtle Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-full max-w-7xl bg-[radial-gradient(ellipse_at_top,rgba(0,212,165,0.12)_0%,transparent_70%)]"
      />

      {/* Sleek Dark Brand Header Bar */}
      <div className="border-b border-white/10 bg-[#0c1411]/90 px-5 backdrop-blur-md sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5">
          <Link href="/charts" className="flex items-center gap-2 text-2xl font-black tracking-[-0.06em] sm:text-3xl">
            <Disc3 className="text-[#00d4a5]" size={28} />
            <span>CBM<span className="text-[#00d4a5]">CHARTS</span></span>
          </Link>
          <nav aria-label="Chart quick links" className="flex items-center gap-5 text-xs font-extrabold sm:gap-8 sm:text-sm">
            <Link href="/charts" className="text-[#00d4a5] hover:text-white transition-colors">Top Charts</Link>
            <Link href="/programs" className="text-white/70 hover:text-[#00d4a5] transition-colors">Broadcasts</Link>
            <Link href="/episodes" className="text-white/70 hover:text-[#00d4a5] transition-colors">Podcasts</Link>
            <Link href="/news" className="hidden text-white/70 hover:text-[#00d4a5] sm:inline transition-colors">Newsroom</Link>
          </nav>
          <Link
            href="/charts"
            className="hidden items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.15em] text-[#00d4a5] transition-colors hover:bg-[#00d4a5] hover:text-[#062521] sm:inline-flex"
          >
            Full Countdown <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="border-b border-white/10 bg-[#09100e]/75 px-5 backdrop-blur-sm sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
            <Flame size={14} className="text-[#00d4a5]" />
            <span>Rankings:</span>
          </div>
          <nav aria-label="Music chart genres" className="flex flex-1 gap-2 overflow-x-auto py-1 no-scrollbar">
            {chartCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => selectChartType(category)}
                aria-pressed={selectedChartType === category}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all duration-200 ${
                  selectedChartType === category
                    ? "bg-[#00d4a5] text-[#062521] shadow-[0_0_16px_rgba(0,212,165,0.35)]"
                    : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Interactive Charts Layout */}
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12 lg:px-12 lg:py-16">
        
        {/* Left Column: Interactive Vinyl Deck & Chart Selector */}
        <aside className="cbm-card relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#0e1714] to-[#070b09] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#00d4a5]">
              VIRTUAL TURNTABLE
            </p>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-bold text-white/70">
              33 RPM
            </span>
          </div>

          {/* Realistic Grooved Vinyl Record with Center Label */}
          <div className="relative mx-auto my-6 aspect-square w-44 sm:w-48">
            {/* Turntable Platter Outer Shadow */}
            <div className="absolute inset-0 rounded-full bg-black/60 shadow-[0_16px_36px_rgba(0,0,0,0.8)]" />

            {/* Tonearm graphic overlay */}
            <div className="pointer-events-none absolute -right-2 -top-3 z-20 h-16 w-8 rotate-12 opacity-80" aria-hidden="true">
              <div className="h-full w-1 bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-500 rounded-full shadow-md" />
              <div className="h-3 w-2.5 bg-teal-400 rounded-sm shadow-sm" />
            </div>

            {/* Spinning Vinyl Body */}
            <div
              role="img"
              aria-label={`Selected chart vinyl: ${selectedChartType}`}
              className="absolute inset-0 overflow-hidden rounded-full border-[6px] border-[#151d1a] shadow-[0_0_0_2px_rgba(72,212,193,0.4)] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ transform: `rotate(${discRotation}deg)` }}
            >
              {/* Concentric Vinyl Grooves Pattern */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,#111_0%,#090909_40%,#1a1a1a_60%,#050505_100%)]">
                <div className="absolute inset-0 rounded-full opacity-60 bg-[repeating-radial-gradient(circle,transparent_0_3px,rgba(255,255,255,0.06)_4px_5px)]" />
              </div>

              {/* Gloss Light Reflection Sheen */}
              <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_45%,rgba(255,255,255,0.08)_100%)] pointer-events-none" />

              {/* Center Spindle & Custom Label */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative size-20 rounded-full border-4 border-black/80 bg-gradient-to-tr from-[#00d4a5] to-[#48d4c1] p-1 shadow-[0_0_15px_rgba(0,212,165,0.5)] overflow-hidden">
                  <Image
                    src={selectedArtwork}
                    alt=""
                    fill
                    sizes="80px"
                    unoptimized={typeof selectedArtwork === "string"}
                    className="object-cover opacity-80 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-center text-[0.55rem] font-black uppercase leading-tight tracking-wider text-[#062521] px-1 drop-shadow-sm">
                      {selectedChartType}
                    </span>
                  </div>
                  {/* Center Spindle Hole */}
                  <div className="absolute inset-0 m-auto size-3 rounded-full bg-black border border-white/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Spin Turntable Action */}
          <div className="text-center">
            <p className="text-xs font-bold text-white/60">
              Spin or switch chart genre
            </p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => rotateDisc(-1)}
                aria-label="Previous chart"
                className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-[#00d4a5] hover:bg-[#00d4a5]/10 hover:text-[#00d4a5]"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <span className="min-w-0 max-w-40 truncate text-center text-xs font-black uppercase tracking-wider text-[#00d4a5]">
                {selectedChartType}
              </span>
              <button
                type="button"
                onClick={() => rotateDisc(1)}
                aria-label="Next chart"
                className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-[#00d4a5] hover:bg-[#00d4a5]/10 hover:text-[#00d4a5]"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Chart Category Quick Buttons */}
          <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4">
            {chartCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => selectChartType(category)}
                aria-pressed={selectedChartType === category}
                className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3.5 text-left text-xs font-bold transition-all ${
                  selectedChartType === category
                    ? "bg-[#00d4a5]/15 text-[#00d4a5] border border-[#00d4a5]/30 font-extrabold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{category}</span>
                <span className="text-sm opacity-60">›</span>
              </button>
            ))}
          </div>

          <Link
            href={
              selectedChart
                ? `/charts?chart=${encodeURIComponent(selectedChart.slug)}`
                : `/charts?type=${encodeURIComponent(selectedChartType)}`
            }
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00d4a5] px-4 text-xs font-extrabold text-[#062521] shadow-[0_6px_20px_rgba(0,212,165,0.2)] transition-all hover:bg-[#48d4c1] hover:shadow-[0_8px_25px_rgba(0,212,165,0.35)]"
          >
            Explore Full {selectedChartType} <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </aside>

        {/* Right Column: Hero Visual Showcase + Ranked Leaderboard */}
        <div className="min-w-0 space-y-6">
          
          {/* Header & Date */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#00d4a5]">
                <Sparkles size={14} /> The Official East African Charts
              </p>
              <h2 className="mt-1.5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                The CBM Countdown
              </h2>
            </div>
            {chart?.edition_date && (
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/70">
                Week of {chart.edition_date}
              </span>
            )}
          </div>

          {/* Hero Visual Spotlight Card */}
          <div className="cbm-card relative isolate overflow-hidden rounded-2xl border-2 border-[#00d4a5]/60 bg-[#070e0b] shadow-[0_20px_50px_rgba(0,212,165,0.15)]">
            <div className="relative min-h-[17rem] overflow-hidden sm:min-h-[22rem]">
              <Image
                src={CBMTeamArtwork}
                alt="The CBM Radio team together"
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover object-[center_28%] transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040908]/90 via-[#040908]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040908] via-transparent to-transparent" />

              <div className="absolute left-5 top-5 max-w-md sm:left-8 sm:top-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#62e6d4]">
                  <Trophy size={13} /> SOUNDTRACK OF THE WEEK
                </span>
                <h3 className="mt-3 text-2xl font-black leading-tight text-white drop-shadow-md sm:text-4xl">
                  {chart?.title || "East Africa's Top Trending Frequency"}
                </h3>
                <p className="mt-2 text-sm text-white/80 line-clamp-2">
                  {chart?.description || "Ranked each week by community votes, airplay, and streaming pulse."}
                </p>
              </div>

              {/* Inset artwork stamp */}
              <div className="absolute bottom-5 right-5 h-24 w-20 overflow-hidden rounded-lg border-2 border-white/80 shadow-2xl sm:bottom-7 sm:right-7 sm:h-36 sm:w-28 sm:border-4">
                <Image
                  src={artwork}
                  alt={chart?.title ? `${chart.title} chart artwork` : "Chart artwork"}
                  fill
                  sizes="120px"
                  unoptimized={typeof artwork === "string"}
                  className="object-cover"
                />
              </div>

              <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
                <div className="inline-flex items-center gap-2 rounded-xl bg-[#00d4a5] px-4 py-2 font-black text-[#062521] shadow-lg">
                  <Music2 size={18} />
                  <span className="text-sm uppercase tracking-wider">OFFICIAL SELECTION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ranked Track Countdown Leaderboard */}
          <div className="cbm-card rounded-2xl border border-white/15 bg-[#0f1714]/80 p-5 sm:p-7 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#00d4a5]">
                  <Trophy size={14} /> Ranked Leaderboard
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  Top Tracks on Repeat
                </h3>
              </div>
              <span className="text-xs font-bold text-white/50">
                {selectedChartType}
              </span>
            </div>

            {status === "loading" && (
              <p className="py-8 text-center text-sm text-white/60" aria-live="polite">
                Loading official chart leaderboard...
              </p>
            )}

            {status === "error" && (
              <p className="py-8 text-center text-sm text-white/60">
                Chart standings are temporarily unavailable.
              </p>
            )}

            {status === "ready" && entries.length > 0 && (
              <ol className="divide-y divide-white/10" aria-label="Official chart rankings">
                {entries.map((entry, index) => (
                  <ChartRankRow
                    key={entry.id}
                    entry={entry}
                    index={index}
                    isPlaying={activePreviewIndex === index}
                    onTogglePreview={() =>
                      setActivePreviewIndex(activePreviewIndex === index ? null : index)
                    }
                  />
                ))}
              </ol>
            )}

            {status === "ready" && entries.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-white/70">
                  Countdown tracks are currently being compiled for this category.
                </p>
                <Link
                  href="/charts"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00d4a5] hover:underline"
                >
                  View all active charts <ArrowUpRight size={14} />
                </Link>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <span className="text-xs text-white/50">
                Updated weekly based on listener votes & radio spins.
              </span>
              <Link
                href="/charts"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-[#00d4a5] hover:text-white transition-colors"
              >
                <span>View Full Top 20 Countdown</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
            {[
              {
                title: "The Presenters",
                detail: "Meet on-air talent",
                image: CBMTeamArtwork,
                href: "/team",
              },
              {
                title: "Daily Programs",
                detail: "Explore lineup",
                image: RadioShowArtwork,
                href: "/programs",
              },
              {
                title: "Music Charts",
                detail: "Vote for your track",
                image: CBMTeamArtwork,
                href: "/charts",
              },
            ].map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="cbm-card group flex flex-col items-center rounded-xl border border-white/10 bg-[#111a17]/70 p-3 text-center sm:p-4 hover:border-[#00d4a5]/50 transition-all"
              >
                <div className="relative aspect-square w-full max-w-28 overflow-hidden rounded-full border-2 border-white/15 bg-black shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:border-[#00d4a5]">
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 24vw, 120px"
                    className="object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-2.5 text-xs font-black uppercase text-white sm:text-sm">
                  {tile.title}
                </p>
                <p className="mt-0.5 hidden text-[0.7rem] text-white/60 sm:block">
                  {tile.detail}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function ChartRankRow({
  entry,
  index,
  isPlaying,
  onTogglePreview,
}: {
  entry: ChartEntry;
  index: number;
  isPlaying: boolean;
  onTogglePreview: () => void;
}) {
  const image = entry.cover_image_url || entry.cover_image;
  const isTop1 = entry.rank === 1;
  const isTop2 = entry.rank === 2;
  const isTop3 = entry.rank === 3;

  return (
    <li className="flex items-center justify-between gap-4 py-3.5 first:pt-4 last:pb-2 transition-colors hover:bg-white/[0.02] px-2 rounded-lg">
      <div className="flex items-center gap-3.5 min-w-0">
        
        {/* Rank Badge with metallic highlight */}
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-lg text-sm font-black tabular-nums shadow-sm ${
            isTop1
              ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.4)]"
              : isTop2
              ? "bg-slate-300 text-black"
              : isTop3
              ? "bg-amber-700/80 text-white"
              : "border border-white/15 bg-black/40 text-white/70"
          }`}
        >
          {String(entry.rank).padStart(2, "0")}
        </span>

        {/* Cover Art */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-black/40 border border-white/10 shadow-sm">
          <Image
            src={image || chartArtwork[index % chartArtwork.length]}
            alt={image ? `${entry.title} cover` : "Track cover"}
            fill
            sizes="56px"
            unoptimized={Boolean(image)}
            className="object-cover"
          />
        </div>

        {/* Title, Artist, & Metadata */}
        <div className="min-w-0">
          <h4 className="truncate font-black text-white text-sm sm:text-base">
            {entry.title}
          </h4>
          <p className="truncate text-xs text-white/70 mt-0.5">
            {entry.artist}
            {entry.featured_artists ? ` feat. ${entry.featured_artists}` : ""}
          </p>
        </div>
      </div>

      {/* Right side: Movement Tag & Preview Visualizer Button */}
      <div className="flex items-center gap-3 shrink-0">
        {isTop1 ? (
          <span className="hidden sm:inline-flex rounded-full bg-amber-400/20 px-2 py-0.5 text-[0.65rem] font-black text-amber-300">
            ★ #1 HIT
          </span>
        ) : (
          <span className="hidden sm:inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-white/60">
            TOP 10
          </span>
        )}

        <button
          type="button"
          onClick={onTogglePreview}
          aria-label={`Preview ${entry.title}`}
          className={`grid size-9 place-items-center rounded-full border transition-all ${
            isPlaying
              ? "border-[#00d4a5] bg-[#00d4a5] text-[#062521] shadow-[0_0_12px_rgba(0,212,165,0.4)]"
              : "border-white/15 bg-white/5 text-white/80 hover:border-[#00d4a5] hover:text-[#00d4a5]"
          }`}
        >
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
              <span className="w-0.5 bg-current animate-eq-1 rounded-full" />
              <span className="w-0.5 bg-current animate-eq-2 rounded-full" />
              <span className="w-0.5 bg-current animate-eq-3 rounded-full" />
            </div>
          ) : (
            <Headphones size={15} />
          )}
        </button>
      </div>
    </li>
  );
}
