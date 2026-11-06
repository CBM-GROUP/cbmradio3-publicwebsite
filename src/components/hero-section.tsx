"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Headphones,
  Play,
  Sparkles,
} from "lucide-react";

import homeService from "@/services/home.service";
import { pageSectionService } from "@/services/page-section.service";
import { chartService } from "@/services/chart.service";
import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import type { EpisodeSummary } from "@/types/program";
import type { PageSection } from "@/types/hero";
import type { Chart } from "@/types/chart";
import LiveWireMarquee from "@/components/live-wire-marquee";

import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

// =========================================================================
// TOP 6 TRENDING ARTISTS CONFIGURATION
// Colors alternate between White (#ffffff) and CBM Brand Theme Teal (#04b093).
// =========================================================================
export const TRENDING_WEEK_LABEL = "Week of October 27, 2026 LEADERBOARD";

export interface TrendingArtist {
  rank: number;
  name: string;
  image: string;
  color: string;
  textColor?: string;
  strokeColor?: string;
  link: string;
  widthPercent: number; // Width % on desktop (ranks shrink: 100% down to 62%)
}

export default function HeroSection() {
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [heroSection, setHeroSection] = useState<PageSection | null>(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const { playEpisode } = useEpisodePlayerStore();

  // Scroll observer for staggered slide-in animation
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      homeService.getFeaturedEpisodes(),
      homeService.getLatestEpisodes(),
      pageSectionService.getSectionsForPage("home", "hero"),
      chartService.getCharts(),
    ]).then(async ([featuredRes, latestRes, heroRes, chartsRes]) => {
      if (!isMounted) return;

      const featured = featuredRes.status === "fulfilled" ? featuredRes.value : [];
      const latest = latestRes.status === "fulfilled" ? latestRes.value : [];
      const combined = [...featured, ...latest.filter((l) => !featured.some((f) => f.id === l.id))];
      setEpisodes(combined.slice(0, 5));

      if (heroRes.status === "fulfilled" && Array.isArray(heroRes.value) && heroRes.value.length > 0) {
        setHeroSection(heroRes.value[0]);
      }

      if (chartsRes.status === "fulfilled" && Array.isArray(chartsRes.value) && chartsRes.value.length > 0) {
        const activeCharts = chartsRes.value.filter((c) => c.is_active);
        const targetChart =
          activeCharts.find(
            (c) =>
              (c.entry_count ?? c.entries_count ?? 0) > 0 ||
              (c.entries?.length ?? 0) > 0,
          ) ||
          activeCharts[0] ||
          chartsRes.value[0];

        if (targetChart?.slug) {
          try {
            const chartDetails = await chartService.getChartBySlug(targetChart.slug);
            if (isMounted && chartDetails) {
              setChart(chartDetails);
            }
          } catch {
            // Keep empty
          }
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const node = leaderboardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLeaderboardVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const safeEpisodeIndex =
    episodes.length > 0 ? Math.min(selectedEpisodeIndex, episodes.length - 1) : 0;
  const activeEpisode = episodes[safeEpisodeIndex] || null;

  // Dynamic Leaderboard Items mapped from Dashboard Chart
  const leaderboardItems: TrendingArtist[] = useMemo(() => {
    if (chart && Array.isArray(chart.entries) && chart.entries.length > 0) {
      const widthPercents = [100, 92, 85, 78, 70, 62];
      return chart.entries.slice(0, 6).map((entry, idx) => {
        const isTeal = idx % 2 === 1;
        const entryImage =
          entry.cover_image ||
          entry.cover_image_url ||
          `/artists/artist-${(idx % 6) + 1}.jpg`;
        const link =
          entry.spotify_url ||
          entry.apple_music_url ||
          entry.youtube_url ||
          entry.audio_url ||
          "/charts";

        return {
          rank: entry.rank || idx + 1,
          name: entry.artist ? `${entry.title} — ${entry.artist}` : entry.title,
          image: entryImage,
          color: isTeal ? "#04b093" : "#ffffff",
          textColor: "#000000",
          strokeColor: "rgba(0, 0, 0, 0.9)",
          link,
          widthPercent: widthPercents[idx] || 60,
        };
      });
    }
    return [];
  }, [chart]);

  const leaderboardLabel = chart
    ? chart.edition_date
      ? `EDITION: ${chart.edition_date} // ${chart.title.toUpperCase()}`
      : `${chart.title.toUpperCase()} // LEADERBOARD`
    : "OFFICIAL MUSIC LEADERBOARD";

  const heroHeadline =
    heroSection?.title ||
    (activeEpisode?.title
      ? `Spotlight: ${activeEpisode.title}`
      : "Sound, Culture & Calling");
  const heroSubtitle =
    heroSection?.subtitle ||
    activeEpisode?.program_title ||
    "FEATURED BROADCAST SHOWCASE";
  const heroBody =
    heroSection?.body ||
    activeEpisode?.description ||
    "Stream premier broadcast episodes direct from our Kampala studio and track the official weekly East African music leaderboard.";
  const heroCtaLabel = heroSection?.cta_label;
  const heroCtaUrl = heroSection?.cta_url;

  return (
    <section className="relative border-b-2 border-black bg-[#04b093] text-black">
      {/* Billboard Editorial Marquee News Wire */}
      <LiveWireMarquee className="border-black" />

      {/* Main Billboard Stage */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        
        {/* TOP EDITORIAL BANNER: Clean, High-Impact Header Across Width */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-2 border-black pb-8">
          <div className="max-w-2xl">
            {/* Category Kicker */}
            <div className="flex items-center gap-2.5">
              <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                {heroSection?.title ? "COVER STORY" : "BROADCAST SHOWCASE"}
              </span>
              <span className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-black flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>{heroSubtitle}</span>
              </span>
            </div>

            {/* Massive Billboard Headline */}
            <h1 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.98] text-black">
              {heroHeadline}
            </h1>

            {/* Lead Deck */}
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-black/85 font-semibold max-w-xl">
              {heroBody}
            </p>
          </div>

          {/* Navigational CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            {heroCtaLabel && heroCtaUrl ? (
              <a
                href={heroCtaUrl}
                target={heroCtaUrl.startsWith("http") ? "_blank" : undefined}
                rel={heroCtaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-6 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer"
              >
                <span>{heroCtaLabel}</span>
                <ArrowUpRight size={14} />
              </a>
            ) : null}

            <a
              href="#episodes"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-6 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer"
            >
              <Headphones size={15} />
              <span>All Episodes</span>
            </a>

            <a
              href="#shows"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-black bg-transparent px-5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore Series</span>
              <ArrowUpRight size={14} />
            </a>

            <Link
              href="/charts"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-black/30 bg-black/5 px-5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-black hover:text-[#04b093] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Official Charts</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* TWIN PREMIER MEDIA CARDS: Spotlight Episode (7 cols) + Charts Leaderboard (5 cols) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-stretch">
          
          {/* LEFT: Spotlight Episode Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border-3 sm:border-4 border-black bg-black p-5 sm:p-7 text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-all duration-300">
            <div>
              {/* Card Header Strip */}
              <div className="flex items-center justify-between border-b-2 border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-[#04b093] px-3 py-1 text-[0.62rem] font-black uppercase tracking-widest text-black">
                    SPOTLIGHT EPISODE
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    {activeEpisode?.program_title || "ORIGINAL SERIES"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-[#04b093] animate-pulse" />
                  <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#04b093]">
                    FEATURED RELEASE
                  </span>
                </div>
              </div>

              {/* Artwork Media Canvas */}
              <div className="group relative mt-5 aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-inner">
                <Image
                  src={
                    activeEpisode?.cover_image ||
                    activeEpisode?.external_cover_image_url ||
                    StudioImage
                  }
                  alt={activeEpisode ? activeEpisode.title : "CBM Spotlight Release"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                  unoptimized={Boolean(activeEpisode?.cover_image)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Central Floating Play Trigger Button */}
                {activeEpisode ? (
                  <button
                    type="button"
                    onClick={() => playEpisode(activeEpisode, true)}
                    aria-label={`Play ${activeEpisode.title}`}
                    className="absolute inset-0 m-auto grid size-16 sm:size-18 place-items-center rounded-full bg-[#04b093] text-black shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white cursor-pointer group-hover:ring-8 group-hover:ring-[#04b093]/30"
                  >
                    <Play size={26} className="ml-1 fill-black" />
                  </button>
                ) : (
                  <a
                    href="#episodes"
                    className="absolute inset-0 m-auto grid size-16 sm:size-18 place-items-center rounded-full bg-[#04b093] text-black shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white cursor-pointer"
                  >
                    <Play size={26} className="ml-1 fill-black" />
                  </a>
                )}

                {/* Bottom Left Overlay Badge on Art */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="rounded-full bg-black/85 px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#04b093] backdrop-blur border border-white/20">
                    TAP TO STREAM AUDIO / VIDEO
                  </span>
                </div>
              </div>

              {/* Episode Title & Synopsis */}
              <div className="mt-5">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                  {activeEpisode?.title || "Conversations on Purpose & Calling"}
                </h2>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-300 line-clamp-2">
                  {activeEpisode?.description ||
                    "Stream the newest full-length broadcast episode from our Kampala studio. Tune in directly or watch the visual studio broadcast on demand."}
                </p>
              </div>

              {/* Quick Multi-Episode Switcher Shelf */}
              {episodes.length > 1 && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#04b093] mb-2.5">
                    MORE SPOTLIGHT DROPS:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {episodes.slice(0, 3).map((ep, idx) => {
                      const isSelected = idx === safeEpisodeIndex;
                      return (
                        <button
                          key={ep.id || idx}
                          type="button"
                          onClick={() => setSelectedEpisodeIndex(idx)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#04b093] bg-[#04b093]/20 ring-1 ring-[#04b093]"
                              : "border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                          }`}
                        >
                          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                            <Image
                              src={ep.cover_image || ep.external_cover_image_url || StudioImage}
                              alt={ep.title}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.58rem] font-black uppercase text-[#04b093] truncate">
                              {ep.program_title || "Episode"}
                            </p>
                            <p className="text-[0.68rem] font-bold text-white truncate">
                              {ep.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Card Action Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-white/15 pt-4">
              {activeEpisode ? (
                <button
                  type="button"
                  onClick={() => playEpisode(activeEpisode, true)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#04b093] px-6 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  <Play size={14} className="fill-black" />
                  <span>Stream Now</span>
                </button>
              ) : (
                <a
                  href="#episodes"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#04b093] px-6 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  <Play size={14} className="fill-black" />
                  <span>Stream Episodes</span>
                </a>
              )}

              {activeEpisode?.slug && (
                <Link
                  href={`/episodes/${activeEpisode.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Episode Details</span>
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT: Top 6 Trending Artists Leaderboard Card (5 cols) */}
          <div
            ref={leaderboardRef}
            className="lg:col-span-5 flex flex-col justify-between rounded-3xl border-3 sm:border-4 border-black bg-black p-5 sm:p-7 text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-all duration-300"
          >
            <div>
              {/* Section Header */}
              <div className="border-b-2 border-white/15 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[0.62rem] sm:text-xs font-black uppercase tracking-[0.25em] text-[#04b093]">
                    {leaderboardLabel}
                  </span>
                  <Link
                    href="/charts"
                    className="text-[0.65rem] font-black uppercase text-[#04b093] hover:underline flex items-center gap-1"
                  >
                    <span>Full Chart</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
                <h3 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Top 6 Trending Artists
                </h3>
              </div>

              {/* 6 Horizontal Bars Stacked Vertically */}
              {leaderboardItems.length > 0 ? (
                <div className="my-5 flex flex-col gap-2.5 sm:gap-3">
                  {leaderboardItems.map((artist, idx) => {
                    const textColor = artist.textColor || "#000000";
                    const strokeColor = artist.strokeColor || "rgba(0, 0, 0, 0.9)";

                    return (
                      <a
                        key={artist.rank}
                        href={artist.link || "#"}
                        aria-label={`${artist.name} - Rank ${artist.rank}`}
                        className="group relative flex h-13 sm:h-14 items-center justify-between overflow-hidden rounded-xl sm:rounded-2xl w-full sm:w-[var(--desktop-width)] transition-all duration-300 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98] cursor-pointer shadow-md select-none"
                        style={
                          {
                            backgroundColor: artist.color,
                            "--desktop-width": `${artist.widthPercent}%`,
                            opacity: isLeaderboardVisible ? 1 : 0,
                            transform: isLeaderboardVisible
                              ? "translateX(0)"
                              : "translateX(-45px)",
                            transition: `transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${
                              idx * 90
                            }ms, opacity 550ms ease ${
                              idx * 90
                            }ms, filter 200ms ease, scale 200ms ease`,
                          } as React.CSSProperties
                        }
                      >
                        {/* Left: Artist Name in Bold */}
                        <div className="relative z-20 flex items-center min-w-0 pl-4 sm:pl-5 py-3">
                          <span
                            className="text-xs sm:text-sm font-black uppercase tracking-wider truncate"
                            style={{ color: textColor }}
                          >
                            {artist.name}
                          </span>
                        </div>

                        {/* Right: Cropped close-up of artist's eyes/face with color tint & gradient fade */}
                        <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-36 md:w-44 overflow-hidden pointer-events-none z-10">
                          {/* Base Image */}
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="h-full w-full object-cover object-center grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Color overlay with mix-blend-multiply in bar's solid color */}
                          {artist.color !== "#ffffff" && (
                            <>
                              <div
                                className="absolute inset-0 mix-blend-multiply opacity-90 transition-opacity group-hover:opacity-100"
                                style={{ backgroundColor: artist.color }}
                              />
                              <div
                                className="absolute inset-0 mix-blend-color opacity-85"
                                style={{ backgroundColor: artist.color }}
                              />
                            </>
                          )}

                          {/* Horizontal gradient fading seamlessly into the solid bar */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(to right, ${artist.color} 0%, ${artist.color} 20%, transparent 80%)`,
                            }}
                          />
                        </div>

                        {/* Far Right: Large Outlined Rank Number */}
                        <div className="relative z-20 pr-3 sm:pr-4 flex items-center justify-end shrink-0">
                          <span
                            className="text-3xl sm:text-4xl font-black italic tracking-tighter select-none leading-none"
                            style={{
                              WebkitTextStroke: `1.5px ${strokeColor}`,
                              color: "transparent",
                            }}
                          >
                            {artist.rank}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="my-8 rounded-2xl border-2 border-dashed border-white/20 p-6 text-center">
                  <p className="text-sm font-bold text-zinc-300">
                    Leaderboard edition is currently being compiled.
                  </p>
                  <Link
                    href="/charts"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#04b093] hover:underline"
                  >
                    <span>Explore Official Charts</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            {/* Leaderboard Footer */}
            <div className="border-t-2 border-white/15 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-zinc-400 text-[0.65rem] uppercase font-bold tracking-wider">
                VERIFIED STREAMING & AIRPLAY METRICS
              </span>
              <Link
                href="/charts"
                className="font-black uppercase tracking-wider text-[#04b093] hover:underline flex items-center gap-1"
              >
                <span>Full Leaderboard</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
