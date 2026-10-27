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
import CBMTeamArtwork from "../../public/cbm_images/take 3.jpeg";

// Curated fallback entries if API returns an empty chart
const fallbackEntries: ChartEntry[] = [
  {
    id: "fb-1",
    rank: 1,
    previous_rank: 2,
    peak_rank: 1,
    weeks_on_chart: 5,
    title: "Way Maker",
    artist: "Sinach",
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
    title: "Goodness of God",
    artist: "CeCe Winans",
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
    title: "Jireh",
    artist: "Elevation Worship",
    featured_artists: "Maverick City Music",
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
    title: "Trust In God",
    artist: "Elevation Worship",
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
    title: "Holy Forever",
    artist: "Chris Tomlin",
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
      if (entry.audio_url && audioRef.current) {
        audioRef.current.src = entry.audio_url;
        audioRef.current.play().catch(() => {});
      }
      setPlayingTrackId(entry.id);
      setIsPlaying(true);
    }
  };

  return (
    <section id="charts" className="relative border-y border-white/10 bg-[#070c0a] py-14 text-white sm:py-20">
      {/* Background radial ambiance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(0,212,165,0.12)_0%,transparent_70%)]"
      />

      {/* Hidden audio element for previews */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setPlayingTrackId(null);
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              <Trophy size={14} className="text-[#00d4a5]" />
              <span>Official Music Countdown</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              The CBM Top Countdown
            </h2>
            <p className="mt-2 text-sm text-white/70 max-w-2xl sm:text-base">
              The biggest gospel and afro-beats anthems trending on radio airplay, online streams, and weekly listener votes across East Africa.
            </p>
          </div>

          {/* Chart selector tabs & Full Countdown button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {availableCharts.length > 0 ? (
              availableCharts.map((item) => {
                const isSelected = item.slug === selectedChartSlug;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectChart(item.slug)}
                    aria-pressed={isSelected}
                    className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                      isSelected
                        ? "bg-[#00d4a5] text-[#062521] shadow-[0_0_16px_rgba(0,212,165,0.35)]"
                        : "border border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })
            ) : (
              <span className="rounded-full bg-[#00d4a5] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#062521]">
                Gospel Hot 100
              </span>
            )}

            <Link
              href={selectedChartSlug ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}` : "/charts"}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521]"
            >
              <span>Full 100 Tracks</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Chart Hero Image Banner */}
        <div className="mt-8 cbm-card relative isolate overflow-hidden rounded-2xl border-4 border-[#00d4a5] bg-[#00d4a5] p-1.5 shadow-[0_20px_50px_rgba(0,212,165,0.2)] sm:border-[6px] sm:p-2">
          <div className="relative min-h-[17rem] overflow-hidden rounded-xl sm:min-h-[22rem] lg:min-h-[26rem]">
            <Image
              src={CBMTeamArtwork}
              alt="The CBM Radio team together"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover object-[center_28%] transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Overlay Headline */}
            <div className="absolute left-5 top-5 max-w-sm sm:left-8 sm:top-8 sm:max-w-lg">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#78f2d5]">
                <Music2 size={13} /> Your world. Your frequency.
              </span>
              <h3 className="mt-3 text-2xl font-black leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                {chart?.title || "The voices moving the culture."}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/85 line-clamp-2 drop-shadow-md max-w-md">
                {chart?.description ||
                  "Ranked each week by community votes, airplay, and streaming pulse across East Africa."}
              </p>
            </div>

            {/* Inset chart artwork stamp on bottom right */}
            <div className="absolute bottom-4 right-4 h-24 w-20 overflow-hidden rounded-lg border-2 border-white shadow-2xl sm:bottom-7 sm:right-7 sm:h-36 sm:w-28 sm:border-4">
              <Image
                src={chartHeroArtwork}
                alt={chart?.title ? `${chart.title} artwork` : "Chart artwork"}
                fill
                sizes="120px"
                unoptimized={typeof chartHeroArtwork === "string"}
                className="object-cover"
              />
            </div>

            {/* Bottom Left Brand Pill */}
            <div className="absolute bottom-4 left-4 rounded-lg bg-[#00d4a5] px-3.5 py-1.5 text-base font-black tracking-[-0.07em] text-[#062521] shadow-lg sm:bottom-7 sm:left-7 sm:px-5 sm:py-2.5 sm:text-3xl">
              CBM <span className="font-light tracking-tight text-white">MUSIC</span>
            </div>
          </div>
        </div>

        {/* Content Grid: Left #1 Spotlight Card + Right Ranked Leaderboard */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: #1 Track Spotlight (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative isolate overflow-hidden rounded-2xl border border-[#00d4a5]/40 bg-gradient-to-b from-[#0c1814] to-[#070e0b] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,212,165,0.12)]">
              {/* Header badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-amber-400 text-black font-black text-xs shadow-md">
                    ★
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    Current #1 Anthem
                  </span>
                </div>
                {chart?.edition_date && (
                  <span className="text-[0.68rem] font-bold text-white/50 uppercase tracking-wider">
                    Week of {chart.edition_date}
                  </span>
                )}
              </div>

              {/* Artwork Showcase with Vinyl Sleeve Effect */}
              <div className="relative mx-auto my-7 aspect-square w-full max-w-[280px] sm:max-w-[320px]">
                {/* Vinyl Record Peeking Behind Sleeve */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 size-44 sm:size-52 rounded-full border-[5px] border-[#181818] bg-[radial-gradient(circle_at_center,#111_0%,#090909_40%,#1a1a1a_60%,#050505_100%)] shadow-2xl transition-transform duration-500 hover:translate-x-7">
                  <div className="absolute inset-0 m-auto size-16 rounded-full border-2 border-black bg-[#00d4a5] p-1 flex items-center justify-center">
                    <div className="size-3 rounded-full bg-black" />
                  </div>
                </div>

                {/* Main Album Cover Sleeve */}
                <div className="relative size-full overflow-hidden rounded-xl border border-white/20 bg-black/60 shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
                  <Image
                    src={top1.cover_image_url || top1.cover_image || RadioShowArtwork}
                    alt={`${top1.title} album cover`}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Big Rank #01 Stamp */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-[#00d4a5] font-black text-2xl text-[#062521] shadow-lg">
                      #01
                    </span>
                    <span className="rounded-full bg-black/60 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-[#00d4a5] backdrop-blur-md">
                      Leader
                    </span>
                  </div>
                </div>
              </div>

              {/* Track Title, Artist, and Stats */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl line-clamp-1">
                  {top1.title}
                </h3>
                <p className="text-base font-bold text-[#00d4a5]">
                  {top1.artist}
                  {top1.featured_artists ? (
                    <span className="text-white/60 font-medium"> feat. {top1.featured_artists}</span>
                  ) : null}
                </p>

                {/* Stat pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/70">
                    <Flame size={12} className="text-amber-400" />
                    <span>{top1.weeks_on_chart ?? 4} wks on chart</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/70">
                    <Trophy size={12} className="text-[#00d4a5]" />
                    <span>Peak #{top1.peak_rank ?? 1}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => togglePlay(top1)}
                  className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    playingTrackId === top1.id && isPlaying
                      ? "bg-[#00d4a5] text-[#062521] shadow-[0_0_20px_rgba(0,212,165,0.4)]"
                      : "bg-[#00d4a5] text-[#062521] hover:bg-[#34e2b8] hover:scale-[1.02]"
                  }`}
                >
                  {playingTrackId === top1.id && isPlaying ? (
                    <>
                      <Pause size={16} fill="currentColor" />
                      <span>Pause Preview</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" />
                      <span>Play Preview</span>
                    </>
                  )}
                </button>

                <Link
                  href={selectedChartSlug ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}` : "/charts"}
                  className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#00d4a5] hover:text-[#00d4a5]"
                  aria-label="View full countdown details"
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Ranked Leaderboard Tracks #2 - #5 (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/15 bg-[#0a120f]/85 p-5 sm:p-7 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Music2 size={16} className="text-[#00d4a5]" />
                  <h3 className="text-base font-black uppercase tracking-wider text-white">
                    Ranked Countdown (#02 – #05)
                  </h3>
                </div>
                <span className="text-xs font-bold text-white/50">
                  {chart?.title ?? "Official Standings"}
                </span>
              </div>

              {/* Track rows */}
              <div className="mt-4 divide-y divide-white/5">
                {leaderboardEntries.map((entry, index) => {
                  const isTrackPlaying = playingTrackId === entry.id && isPlaying;
                  const rankNumber = entry.rank || index + 2;
                  const isTop2 = rankNumber === 2;
                  const isTop3 = rankNumber === 3;

                  return (
                    <div
                      key={entry.id}
                      className="group flex items-center justify-between gap-3 py-3.5 transition-colors hover:bg-white/[0.03] px-2.5 rounded-xl"
                    >
                      {/* Left: Rank + Art + Title/Artist */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Rank Badge */}
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-lg text-sm font-black tabular-nums ${
                            isTop2
                              ? "bg-slate-200 text-[#07100f] font-black"
                              : isTop3
                              ? "bg-amber-600/80 text-white font-black"
                              : "border border-white/15 bg-white/5 text-white/70"
                          }`}
                        >
                          {String(rankNumber).padStart(2, "0")}
                        </span>

                        {/* Thumbnail Artwork */}
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                          <Image
                            src={
                              entry.cover_image_url ||
                              entry.cover_image ||
                              RadioShowArtwork
                            }
                            alt={`${entry.title} cover`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0">
                          <h4 className="truncate font-extrabold text-white text-sm sm:text-base group-hover:text-[#00d4a5] transition-colors">
                            {entry.title}
                          </h4>
                          <p className="truncate text-xs text-white/60 mt-0.5">
                            {entry.artist}
                            {entry.featured_artists ? ` ft. ${entry.featured_artists}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Right: Movement Pill + Play Button */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Movement indicator */}
                        {entry.movement?.status === "up" && (
                          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-400">
                            ▲ {entry.movement.label}
                          </span>
                        )}
                        {entry.movement?.status === "down" && (
                          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-rose-400">
                            ▼ {entry.movement.label}
                          </span>
                        )}
                        {entry.movement?.status === "new" && (
                          <span className="hidden sm:inline-flex items-center rounded-full bg-[#00d4a5]/20 px-2.5 py-0.5 text-[0.65rem] font-black text-[#00d4a5]">
                            ★ NEW
                          </span>
                        )}
                        {!entry.movement && (
                          <span className="hidden sm:inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-white/60">
                            HOT 100
                          </span>
                        )}

                        {/* Play button */}
                        <button
                          type="button"
                          onClick={() => togglePlay(entry)}
                          aria-label={`Play preview of ${entry.title}`}
                          className={`grid size-9 place-items-center rounded-full border transition-all ${
                            isTrackPlaying
                              ? "border-[#00d4a5] bg-[#00d4a5] text-[#062521] shadow-[0_0_12px_rgba(0,212,165,0.4)]"
                              : "border-white/15 bg-white/5 text-white/80 hover:border-[#00d4a5] hover:text-[#00d4a5]"
                          }`}
                        >
                          {isTrackPlaying ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} className="translate-x-0.5" fill="currentColor" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Leaderboard Footer */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-white/50">
                  Showing Top 5 of 100 tracks. Updated every Friday.
                </span>
                <Link
                  href={selectedChartSlug ? `/charts?chart=${encodeURIComponent(selectedChartSlug)}` : "/charts"}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00d4a5] hover:text-white transition-colors"
                >
                  <span>Explore Full Top 100 & Vote</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            {/* Quick Feature Discovery Cards (3 columns) */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                {
                  title: "Presenter Lineup",
                  detail: "Voices of CBM",
                  href: "/team",
                  image: CBMTeamArtwork,
                },
                {
                  title: "Live Shows",
                  detail: "Broadcast Schedule",
                  href: "/programs",
                  image: RadioShowArtwork,
                },
                {
                  title: "Top Podcasts",
                  detail: "Listen on Demand",
                  href: "/episodes",
                  image: CBMTeamArtwork,
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col items-center rounded-xl border border-white/10 bg-[#09120f]/60 p-3 text-center transition-all hover:border-[#00d4a5]/40 hover:bg-[#0c1814]"
                >
                  <div className="relative aspect-square w-16 overflow-hidden rounded-full border border-white/15 bg-black">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>
                  <span className="mt-2 block text-[0.72rem] font-black uppercase tracking-tight text-white group-hover:text-[#00d4a5]">
                    {item.title}
                  </span>
                  <span className="hidden sm:block text-[0.65rem] text-white/50 mt-0.5">
                    {item.detail}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
