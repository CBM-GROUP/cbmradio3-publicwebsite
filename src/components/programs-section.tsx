"use client";

import { useEffect, useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Headphones,
  Mic2,
  Sparkles,
  Radio,
  Play,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Share2,
} from "lucide-react";

import homeService from "@/services/home.service";
import { programService } from "@/services/program.service";
import type { ProgramSummary } from "@/types/program";

import DanielPortrait from "../../public/cbm_images/daniel.svg";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";
import InnocentPortrait from "../../public/cbm_images/innocent1.svg";
import StudioImg from "../../public/cbm_images/on-air-studio.png";
import ShowImg from "../../public/cbm_images/cbm-conversation-radio-show.png";
import BehindScenesImg from "../../public/cbm_images/behind-the-scenes-studio.png";
import ArtistSpotlightImg from "../../public/cbm_images/artist-spotlight.png";
import TurntablePlayer from "./turntable-player";

// Live radio stream URL placeholder (edit this constant to point to your live audio stream)
export const STREAM_URL = "https://stream.zeno.fm/f3wvbbqmdg8uv";

// Program metadata enrichment for genre tags, badges & icons
interface ProgramMeta {
  badge: string;
  genre: string;
  accent: string;
  artwork: StaticImageData | string;
  icon: "trophy" | "sparkles" | "radio" | "flame" | "mic";
}

const DEFAULT_PROGRAMS: (ProgramSummary & { meta: ProgramMeta })[] = [
  {
    id: 1,
    title: "CBM Live Broadcast",
    slug: "cbm-live-broadcast",
    presenter: "CBM On-Air Team",
    schedule: "Daily 24/7 Digital Radio",
    short_description:
      "Transformative conversations, inspiring perspectives, and uplifting music moving African sound and culture forward.",
    cover_image: "",
    promo_video_url: "",
    display_order: 1,
    is_featured: true,
    is_active: true,
    meta: {
      badge: "PRIME BROADCAST",
      genre: "Talk & Sound",
      accent: "#04b093",
      artwork: DanielPortrait,
      icon: "sparkles",
    },
  },
];

// Helper to determine meta for a program
function resolveProgramMeta(program: ProgramSummary, index: number): ProgramMeta {
  const metaPalette: ProgramMeta[] = [
    { badge: "FLAGSHIP SERIES", genre: "Culture & Dialogue", accent: "#04b093", artwork: DanielPortrait, icon: "sparkles" },
    { badge: "PRIME BROADCAST", genre: "Daily Talk & Sound", accent: "#f97316", artwork: SamuelPortrait, icon: "radio" },
    { badge: "EVENING SHOWCASE", genre: "Conversations & Music", accent: "#8b5cf6", artwork: StudioImg, icon: "mic" },
    { badge: "STUDIO FRANCHISE", genre: "Voices & Community", accent: "#ec4899", artwork: BehindScenesImg, icon: "flame" },
    { badge: "WEEKEND SPECIAL", genre: "Curated Showcase", accent: "#eab308", artwork: ArtistSpotlightImg, icon: "trophy" },
  ];

  const titleLower = program.title.toLowerCase();
  if (titleLower.includes("purpose") || titleLower.includes("life") || titleLower.includes("talk")) {
    return {
      badge: "FLAGSHIP TALK SERIES",
      genre: "Culture & Leadership",
      accent: "#04b093",
      artwork: DanielPortrait,
      icon: "sparkles",
    };
  }
  if (titleLower.includes("morning") || titleLower.includes("drive")) {
    return {
      badge: "PRIME BREAKFAST SHOW",
      genre: "News & Morning Drive",
      accent: "#f97316",
      artwork: SamuelPortrait,
      icon: "radio",
    };
  }
  if (titleLower.includes("kafunda") || titleLower.includes("mix") || titleLower.includes("pulse")) {
    return {
      badge: "STATION SPECIAL",
      genre: "Music & Culture",
      accent: "#ec4899",
      artwork: InnocentPortrait,
      icon: "flame",
    };
  }

  return metaPalette[index % metaPalette.length];
}

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<(ProgramSummary & { meta: ProgramMeta })[]>(DEFAULT_PROGRAMS);
  const [activeId, setActiveId] = useState<number>(DEFAULT_PROGRAMS[0].id);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch API programs directly from backend (both featured and all registered programs)
  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      homeService.getFeaturedPrograms(),
      programService.getPrograms({ ordering: "display_order" }),
    ]).then(([featuredRes, allRes]) => {
      if (!isMounted) return;
      const featured = featuredRes.status === "fulfilled" ? featuredRes.value : [];
      const all = allRes.status === "fulfilled" && allRes.value?.results ? allRes.value.results : [];

      const combined = [...featured];
      for (const p of all) {
        if (!combined.some((item) => item.id === p.id)) {
          combined.push(p);
        }
      }

      if (combined.length > 0) {
        const enriched = combined.map((item, idx) => ({
          ...item,
          meta: resolveProgramMeta(item, idx),
        }));
        setPrograms(enriched);
        setActiveId(enriched[0].id);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Active program pointer
  const activeProgram =
    programs.find((p) => p.id === activeId) || programs[0] || DEFAULT_PROGRAMS[0];
  const activeIndex = programs.findIndex((p) => p.id === activeProgram.id);

  // Auto-rotation when not interacting
  useEffect(() => {
    if (isHovering || programs.length <= 1) return;

    autoRotateTimerRef.current = setInterval(() => {
      setActiveId((currentId) => {
        const currentIdx = programs.findIndex((p) => p.id === currentId);
        const nextIdx = (currentIdx + 1) % programs.length;
        return programs[nextIdx].id;
      });
    }, 7000);

    return () => {
      if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
    };
  }, [isHovering, programs]);

  const handleSelectProgram = (id: number) => {
    setActiveId(id);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % programs.length;
    setActiveId(programs[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + programs.length) % programs.length;
    setActiveId(programs[prevIdx].id);
  };

  return (
    <section
      id="shows"
      className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-4 py-16 text-black sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header: Neo-Brutalist Zwart Billboard */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-black pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-black px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#04b093] shadow-md">
                FEATURED SHOW SPOTLIGHT
              </span>
              
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              Featured Shows & Series Spotlight
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-black/85">
              Explore CBM Radio&apos;s original shows, talk series, and daily broadcasts. Point or tap on any program disc below to slide out the master CD and explore full broadcast details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Prev / Next CD navigation buttons */}
            <div className="flex items-center gap-1.5 border-2 border-black bg-black p-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <button
                onClick={handlePrev}
                aria-label="Previous Program Disc"
                className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:bg-[#04b093] hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-2.5 text-xs font-mono font-bold text-[#04b093]">
                {String(activeIndex + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next Program Disc"
                className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:bg-[#04b093] hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 w-fit shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer"
            >
              <span>Full Directory</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            01 // MASTER SPOTLIGHT SHOWCASE: 3D SLIDING CD & EDITORIAL CONTROL CARD
            ========================================================================= */}
        <div className="relative mb-12 overflow-hidden rounded-3xl border-3 sm:border-4 border-black bg-black p-6 sm:p-10 lg:p-12 text-white shadow-[14px_14px_0_0_rgba(0,0,0,1)] hover:shadow-[18px_18px_0_0_rgba(0,0,0,1)] transition-all duration-300">
          {/* Ambient Program Art Background */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
            <Image
              src={activeProgram.cover_image || activeProgram.meta.artwork}
              alt={activeProgram.title}
              fill
              sizes="100vw"
              unoptimized={Boolean(activeProgram.cover_image)}
              className="object-cover blur-sm scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/75" />
          </div>

          {/* Subtle Ambient Backlights */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#04b093]/20 blur-3xl" />
          <div
            className="pointer-events-none absolute -bottom-24 left-10 h-80 w-80 rounded-full blur-3xl opacity-25 transition-colors duration-700"
            style={{ backgroundColor: activeProgram.meta.accent }}
          />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* LEFT COLUMN: TOP-DOWN REALISTIC VINYL TURNTABLE PLAYER */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <TurntablePlayer
                nowPlayingTitle={activeProgram.title}
                nowPlayingSubtitle={
                  activeProgram.presenter
                    ? `Hosted by ${activeProgram.presenter} • ${activeProgram.meta.genre}`
                    : `Original Broadcast • ${activeProgram.meta.genre}`
                }
                streamUrl={STREAM_URL}
              />
            </div>
            {/* RIGHT COLUMN: PROGRAM SPOTLIGHT METADATA & ACTIONS */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                
                {/* Badge Header Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-black shadow-md rounded-sm"
                    style={{ backgroundColor: activeProgram.meta.accent }}
                  >
                    {activeProgram.meta.badge}
                  </span>
                  
                  <span className="border border-white/20 bg-white/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-zinc-300">
                    DISC #{String(activeIndex + 1).padStart(2, "0")} OF {programs.length}
                  </span>

                  <span className="flex items-center gap-1.5 text-[0.65rem] font-black uppercase text-[#04b093]">
                    <span className="size-2 rounded-full bg-[#04b093]" />
                    ACTIVE SHOW
                  </span>
                </div>

                {/* Main Program Title */}
                <h3 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
                  {activeProgram.title}
                </h3>

                {/* Host & Schedule Badges */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-zinc-300">
                  {activeProgram.presenter && (
                    <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-white/15 px-3 py-1.5 rounded-md">
                      <Mic2 size={14} className="text-[#04b093]" />
                      <span>Hosted by <strong className="text-white">{activeProgram.presenter}</strong></span>
                    </div>
                  )}

                  {activeProgram.schedule && (
                    <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-white/15 px-3 py-1.5 rounded-md">
                      <Clock size={14} className="text-[#eab308]" />
                      <span>{activeProgram.schedule}</span>
                    </div>
                  )}
                </div>

                {/* Program Description */}
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-300 font-medium">
                  {activeProgram.short_description ||
                    "Dedicated original broadcasting covering cutting-edge talk, music culture, and vibrant perspectives."}
                </p>

                {/* Key Program Highlights / Features */}
                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-xs font-bold text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#04b093]" />
                    <span>Live On-Air & Podcast Crate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#04b093]" />
                    <span>Interactive Studio Hotline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#04b093]" />
                    <span>Exclusive YouTube Visuals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#04b093]" />
                    <span>Weekly Archived Episodes</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Stream Episodes, View Details */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/episodes?program=${encodeURIComponent(activeProgram.slug)}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#04b093] bg-[#04b093] px-7 py-3.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:border-white hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                >
                  <Headphones size={16} />
                  <span>Stream Show Episodes</span>
                  <ArrowUpRight size={14} />
                </Link>

                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-zinc-900 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black hover:border-white hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>All Programmes</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* =========================================================================
            02 // ROTATING CD RACK & CRATE SELECTOR
            Points directly at any CD disc (e.g. Sports Arena) to immediately pop it out!
            ========================================================================= */}
        <div className="mb-10">
          

          {/* Horizontal CD Disc Selector Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {programs.map((program, idx) => {
              const isActive = program.id === activeId;
              const artwork = program.cover_image || program.meta.artwork;

              return (
                <div
                  key={program.id}
                  onPointerEnter={() => handleSelectProgram(program.id)}
                  onClick={() => handleSelectProgram(program.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 sm:border-3 transition-all duration-300 p-4.5 ${
                    isActive
                      ? "border-black text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] scale-[1.03] -translate-y-1.5 z-20 ring-2 ring-[#04b093]"
                      : "border-black/80 text-white/95 hover:border-black hover:scale-[1.02] shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.9)] z-10"
                  }`}
                >
                  {/* Program Art Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={artwork}
                      alt={program.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      unoptimized={Boolean(program.cover_image)}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Rich Atmospheric Dark Gradient Overlay to ensure crisp readability */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isActive
                          ? "bg-gradient-to-t from-black via-black/85 to-black/60"
                          : "bg-gradient-to-t from-black via-black/90 to-black/75 group-hover:via-black/85 group-hover:to-black/65"
                      }`}
                    />
                    {/* Subtle Program Accent Ambient Glow */}
                    <div
                      className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-xl opacity-35"
                      style={{ backgroundColor: program.meta.accent }}
                    />
                  </div>

                  {/* Foreground Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top Bar with Disc No. & Active Pill */}
                    <div className="mb-3 flex items-center justify-between text-[0.62rem] font-mono font-black uppercase">
                      <span
                        className={`px-2.5 py-0.5 rounded-full ${
                          isActive ? "bg-[#04b093] text-black" : "bg-black/70 backdrop-blur-sm text-zinc-300 border border-white/10"
                        }`}
                      >
                        DISC 0{idx + 1}
                      </span>
                      {isActive ? (
                        <span className="flex items-center gap-1 font-bold text-[#04b093] bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          <span className="size-1.5 rounded-full bg-[#04b093] animate-ping" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-zinc-300 group-hover:text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">TAP TO CUE</span>
                      )}
                    </div>

                    {/* CD Visual Container: Sleeve + Sliding Disc */}
                    <div className="relative mb-3 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl bg-black/60 backdrop-blur-sm p-2 border border-white/15">
                      
                      {/* Compact Disc sliding out */}
                      <div
                        className={`chart-spin absolute top-1/2 aspect-square w-20 -translate-y-1/2 rounded-full border border-white/25 shadow-xl transition-all duration-500 ${
                          isActive
                            ? "right-2 scale-110"
                            : "right-6 opacity-75 group-hover:right-3 group-hover:opacity-100"
                        }`}
                        style={{
                          background: `
                            radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(255,255,255,0.06) 28.5% 29%, transparent 29.5%),
                            conic-gradient(from 0deg, #18181b 0deg, #3f3f46 45deg, #18181b 90deg, #52525b 135deg, #18181b 180deg, #3f3f46 225deg, #18181b 270deg, #52525b 315deg, #18181b 360deg),
                            conic-gradient(from 120deg, transparent 0deg, rgba(4,176,147,0.3) 60deg, rgba(234,179,8,0.3) 120deg, rgba(239,68,68,0.2) 180deg, rgba(59,130,246,0.3) 240deg, transparent 300deg)
                          `,
                        }}
                      >
                        {/* Disc Center Hole */}
                        <div className="absolute left-1/2 top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black">
                          <div className="size-2 rounded-full bg-zinc-900 border border-white/70" />
                        </div>
                      </div>

                      {/* Mini Jewel Case Sleeve (Front) */}
                      <div className="relative z-10 aspect-square h-full overflow-hidden rounded-lg border border-white/25 bg-zinc-900 shadow-md">
                        <Image
                          src={artwork}
                          alt={program.title}
                          fill
                          sizes="100px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized={Boolean(program.cover_image)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-1 left-1.5 right-1 text-[0.55rem] font-black uppercase text-white truncate">
                          {program.meta.genre}
                        </div>
                      </div>

                    </div>

                    {/* Program Title & Presenter */}
                    <h4
                      className={`text-sm font-black uppercase tracking-tight line-clamp-1 transition-colors ${
                        isActive ? "text-[#04b093]" : "text-white group-hover:text-[#04b093]"
                      }`}
                    >
                      {program.title}
                    </h4>

                    <p className="mt-0.5 text-[0.72rem] font-medium text-zinc-300 line-clamp-1">
                      {program.presenter ? `By ${program.presenter}` : program.meta.genre}
                    </p>

                    {/* Bottom Bar: Action Pill */}
                    <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2 text-[0.68rem] font-black uppercase">
                      <span className="text-[#04b093] flex items-center gap-1 font-bold">
                        <Play size={11} className={isActive ? "fill-[#04b093]" : ""} />
                        {isActive ? "Cued Up" : "Cue Show"}
                      </span>
                      <ArrowUpRight size={12} className="text-zinc-400 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            03 // ZWART-STYLE CO-CREATION PITCH BANNER
            ========================================================================= */}
        <div className="mt-8 border-4 border-black bg-black p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#04b093] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-black">
                CO-CREATE WITH US
              </span>
              <span className="text-xs font-mono text-zinc-400">STUDIO BROADCAST PITCH</span>
            </div>
            <h4 className="mt-2 text-base sm:text-lg font-black uppercase tracking-tight text-white">
              Pitch an original sports, talk, or music show concept
            </h4>
            <p className="mt-0.5 text-xs text-zinc-400">
              CBM Radio collaborates with producers, sports commentators, and cultural curators across Africa.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border-2 border-white bg-transparent px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#04b093] hover:text-black hover:border-black w-fit shrink-0 shadow-md font-bold"
          >
            <span>Pitch Your Show</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
