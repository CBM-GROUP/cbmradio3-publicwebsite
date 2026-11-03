"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Headphones,
  Play,
  Sparkles,
} from "lucide-react";

import homeService from "@/services/home.service";
import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import type { EpisodeSummary } from "@/types/program";

import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

// =========================================================================
// TOP 6 TRENDING ARTISTS CONFIGURATION
// Colors alternate between White (#ffffff) and CBM Brand Theme Teal (#04b093).
// Edit week label, artist names, images, colors, links & widths below:
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

export const TOP_TRENDING_ARTISTS: TrendingArtist[] = [
  {
    rank: 1,
    name: "Amani Sound",
    image: "/artists/artist-1.jpg",
    color: "#ffffff", // 1st: Solid White
    textColor: "#000000",
    strokeColor: "rgba(0, 0, 0, 0.9)",
    link: "#",
    widthPercent: 100,
  },
  {
    rank: 2,
    name: "Kalonzo Vibe",
    image: "/artists/artist-2.jpg",
    color: "#04b093", // 2nd: CBM Company Theme Teal
    textColor: "#000000",
    strokeColor: "rgba(0, 0, 0, 0.9)",
    link: "#",
    widthPercent: 92,
  },
  {
    rank: 3,
    name: "Zion Echoes",
    image: "/artists/artist-3.jpg",
    color: "#ffffff", // 3rd: Solid White
    textColor: "#000000",
    strokeColor: "rgba(0, 0, 0, 0.9)",
    link: "#",
    widthPercent: 85,
  },
  {
    rank: 4,
    name: "Grace Tribe",
    image: "/artists/artist-4.jpg",
    color: "#04b093", // 4th: CBM Company Theme Teal
    textColor: "#000000",
    strokeColor: "rgba(0, 0, 0, 0.9)",
    link: "#",
    widthPercent: 78,
  },
  {
    rank: 5,
    name: "Sauti Soul",
    image: "/artists/artist-5.jpg",
    color: "#ffffff", // 5th: Solid White
    textColor: "#000000",
    strokeColor: "rgba(0, 0, 0, 0.9)",
    link: "#",
    widthPercent: 70,
  },
  {
    rank: 6,
    name: "David & Choir",
    image: "/artists/artist-6.jpg",
    color: "#04b093", // 6th: CBM Company Theme Teal
    textColor: "#000000",
    strokeColor: "rgba(0, 0, 0, 0.9)",
    link: "#",
    widthPercent: 62,
  },
];

export default function HeroSection() {
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const { playEpisode } = useEpisodePlayerStore();

  // Scroll observer for staggered slide-in animation
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      homeService.getFeaturedEpisodes(),
      homeService.getLatestEpisodes(),
    ]).then(([featuredRes, latestRes]) => {
      if (!isMounted) return;
      const featured = featuredRes.status === "fulfilled" ? featuredRes.value : [];
      const latest = latestRes.status === "fulfilled" ? latestRes.value : [];
      const combined = [...featured, ...latest.filter((l) => !featured.some((f) => f.id === l.id))];
      setEpisodes(combined.slice(0, 5));
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

  const activeEpisode = episodes[0] || null;

  return (
    <section className="relative border-b-2 border-black bg-[#04b093] text-black">
      {/* Billboard Editorial Marquee News Wire */}
      <div className="border-b-2 border-black bg-black py-2.5 overflow-hidden text-white">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-[0.68rem] font-black uppercase tracking-[0.25em]">
          <span className="flex items-center gap-2 text-[#04b093]">
            <Flame size={13} className="fill-[#04b093]" />
            HOT PODCAST DROPS
          </span>
          <span className="text-white/30">•</span>
          <span>ORIGINAL EAST AFRICAN TALK & AUDIO SERIES</span>
          <span className="text-white/30">•</span>
          <span className="text-[#04b093] font-black">STREAM ON DEMAND</span>
          <span className="text-white/30">•</span>
          <span>CBM RADIO MEDIA NETWORK</span>
          <span className="text-white/30">•</span>
          <span>FAITH · CULTURE · CONVERSATIONS · VOICES</span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2 text-[#04b093]">
            <Flame size={13} className="fill-[#04b093]" />
            HOT PODCAST DROPS
          </span>
          <span className="text-white/30">•</span>
          <span>ORIGINAL EAST AFRICAN TALK & AUDIO SERIES</span>
          <span className="text-white/30">•</span>
          <span className="text-[#04b093] font-black">STREAM ON DEMAND</span>
          <span className="text-white/30">•</span>
          <span>CBM RADIO MEDIA NETWORK</span>
          <span className="text-white/30">•</span>
          <span>FAITH · CULTURE · CONVERSATIONS · VOICES</span>
          <span className="text-white/30">•</span>
        </div>
      </div>

      {/* Main Billboard + Zwart Hero Stage */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column (7 cols): The Billboard Cover Story */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category Kicker */}
              <div className="flex items-center gap-3">
                <span className="bg-black px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                  COVER STORY
                </span>
                <span className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-black flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>CBM ORIGINAL BROADCAST</span>
                </span>
              </div>

              {/* Massive Billboard Headline */}
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.98] text-black">
                Moving African Sound, Culture & Faith Forward.
              </h1>

              {/* Lead Deck */}
              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-black/85 font-semibold">
                Authentic dialogue, transformative conversations, and community-powered stories created for the people who shape culture every day. Stream every episode on demand.
              </p>

              {/* Call-to-Action Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <a
                  href="#episodes"
                  className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-black px-7 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer"
                >
                  <Headphones size={16} />
                  <span>Stream Episodes</span>
                </a>

                <a
                  href="#shows"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-black bg-transparent px-6 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Explore Series</span>
                  <ArrowUpRight size={15} />
                </a>

                <Link
                  href="/charts"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-black/30 bg-black/5 px-6 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-black hover:text-[#04b093] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Official Charts</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            {/* Spotlight Video Tile (The Zwart/Billboard Lead Media Card) */}
            <div className="mt-10 rounded-3xl border-3 sm:border-4 border-black bg-black p-5 sm:p-7 text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-all duration-300">
              <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10">
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

                {/* Top Badge */}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-black/90 px-3.5 py-1 text-[0.62rem] font-black uppercase tracking-widest text-[#04b093] border border-white/20">
                    ★ NOW FEATURED // {activeEpisode?.program_title || "ORIGINAL SERIES"}
                  </span>
                </div>

                {/* Central Play Trigger Button */}
                {activeEpisode ? (
                  <button
                    type="button"
                    onClick={() => playEpisode(activeEpisode, true)}
                    aria-label={`Play ${activeEpisode.title}`}
                    className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-[#04b093] text-black shadow-2xl transition-all hover:scale-110 active:scale-95 hover:bg-white cursor-pointer"
                  >
                    <Play size={24} className="ml-1 fill-black" />
                  </button>
                ) : (
                  <a
                    href="#episodes"
                    className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-[#04b093] text-black shadow-2xl transition-all hover:scale-110 active:scale-95 hover:bg-white cursor-pointer"
                  >
                    <Play size={24} className="ml-1 fill-black" />
                  </a>
                )}
              </div>

              {/* Title & Metadata Strip */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-black uppercase tracking-wider text-[#04b093]">
                    {activeEpisode?.program_title || "My Life, My Purpose"}
                  </p>
                  <h2 className="text-lg font-black uppercase text-white truncate max-w-lg">
                    {activeEpisode?.title || "Conversations on Purpose & Calling"}
                  </h2>
                </div>

                {activeEpisode && (
                  <button
                    type="button"
                    onClick={() => playEpisode(activeEpisode, true)}
                    className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-white/10 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] hover:bg-[#04b093] hover:text-black transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                  >
                    <Play size={12} className="fill-current" />
                    <span>Watch / Listen</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Top 6 Trending Artists Leaderboard */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div
              ref={leaderboardRef}
              className="rounded-3xl border-3 sm:border-4 border-black bg-black p-5 sm:p-7 text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:shadow-[16px_16px_0_0_rgba(0,0,0,1)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Section Header */}
              <div className="border-b-2 border-white/20 pb-4">
                <p className="text-[0.62rem] sm:text-xs font-black uppercase tracking-[0.25em] text-[#04b093]">
                  {TRENDING_WEEK_LABEL}
                </p>
                <h3 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Top 6 Trending Artists
                </h3>
              </div>

              {/* 6 Horizontal Bars Stacked Vertically */}
              <div className="my-5 flex flex-col gap-2.5 sm:gap-3">
                {TOP_TRENDING_ARTISTS.map((artist, idx) => {
                  const textColor = artist.textColor || "#000000";
                  const strokeColor = artist.strokeColor || "rgba(0, 0, 0, 0.9)";

                  return (
                    <a
                      key={artist.rank}
                      href={artist.link || "#"}
                      aria-label={`${artist.name} - Rank ${artist.rank}`}
                      className="group relative flex h-13 sm:h-15 items-center justify-between overflow-hidden rounded-xl sm:rounded-2xl w-full sm:w-[var(--desktop-width)] transition-all duration-300 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98] cursor-pointer shadow-md select-none"
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
                          className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider truncate"
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
                          className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter select-none leading-none"
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

              {/* Leaderboard Footer */}
              <div className="border-t-2 border-white/20 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400 text-[0.68rem] uppercase font-bold tracking-wider">
                  OFFICIAL AIRPLAY & STREAMING METRICS
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
      </div>
    </section>
  );
}
