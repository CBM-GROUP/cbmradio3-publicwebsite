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
  Disc3,
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
import type { ProgramSummary } from "@/types/program";

import DanielPortrait from "../../public/cbm_images/daniel.svg";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";
import InnocentPortrait from "../../public/cbm_images/innocent1.svg";
import StudioImg from "../../public/cbm_images/on-air-studio.png";
import ShowImg from "../../public/cbm_images/cbm-conversation-radio-show.png";
import BehindScenesImg from "../../public/cbm_images/behind-the-scenes-studio.png";
import ArtistSpotlightImg from "../../public/cbm_images/artist-spotlight.png";

// Program metadata enrichment for genre tags, badges & icons
interface ProgramMeta {
  badge: string;
  genre: string;
  accent: string;
  artwork: StaticImageData | string;
  icon: "trophy" | "sparkles" | "radio" | "flame" | "mic";
}

const FALLBACK_PROGRAMS: (ProgramSummary & { meta: ProgramMeta })[] = [
  {
    id: 101,
    title: "CBM Sports Arena",
    slug: "cbm-sports-arena",
    presenter: "Brian SportsDesk & Team",
    schedule: "Saturdays & Sundays 2:00 PM – 5:00 PM EAT",
    short_description:
      "High-octane football, rugby, athletics coverage, match tactical analysis, live scores, and fierce fan debates.",
    cover_image: "",
    promo_video_url: "",
    display_order: 1,
    is_featured: true,
    is_active: true,
    meta: {
      badge: "WEEKEND SPORTS EXTRA",
      genre: "Sports & Athletics",
      accent: "#eab308", // Golden Yellow
      artwork: BrianPortrait,
      icon: "trophy",
    },
  },
  {
    id: 102,
    title: "My Life, My Purpose",
    slug: "my-life-my-purpose",
    presenter: "Daniel K.",
    schedule: "Wednesdays 8:00 PM – 10:00 PM EAT",
    short_description:
      "Transformational conversations on career, purpose, personal growth, and community culture with top guest interviews.",
    cover_image: "",
    promo_video_url: "",
    display_order: 2,
    is_featured: true,
    is_active: true,
    meta: {
      badge: "FLAGSHIP TALK SERIES",
      genre: "Culture & Leadership",
      accent: "#04b093", // CBM Emerald
      artwork: DanielPortrait,
      icon: "sparkles",
    },
  },
  {
    id: 103,
    title: "The Morning Drive",
    slug: "the-morning-drive",
    presenter: "Samuel & Sarah",
    schedule: "Monday – Friday 6:00 AM – 10:00 AM EAT",
    short_description:
      "Wake up with unstoppable energy, breaking headlines, traffic alerts, comedy bits, and the vibrant morning playlist.",
    cover_image: "",
    promo_video_url: "",
    display_order: 3,
    is_featured: true,
    is_active: true,
    meta: {
      badge: "PRIME BREAKFAST SHOW",
      genre: "News & Morning Drive",
      accent: "#f97316", // Warm Orange
      artwork: SamuelPortrait,
      icon: "radio",
    },
  },
  {
    id: 104,
    title: "Urban Pulse & Top 20",
    slug: "urban-pulse-top-20",
    presenter: "DJ Innocent",
    schedule: "Fridays 7:00 PM – 11:00 PM EAT",
    short_description:
      "The definitive weekend kick-off featuring the top 20 hits, blazing guest mixes, and urban street culture.",
    cover_image: "",
    promo_video_url: "",
    display_order: 4,
    is_featured: true,
    is_active: true,
    meta: {
      badge: "COUNTDOWN & MIX SHOW",
      genre: "Afrobeats & Urban",
      accent: "#ec4899", // Neon Pink
      artwork: InnocentPortrait,
      icon: "flame",
    },
  },
  {
    id: 105,
    title: "Night Reflections & Soul Lounge",
    slug: "night-reflections-soul-lounge",
    presenter: "Grace M.",
    schedule: "Monday – Thursday 10:00 PM – 1:00 AM EAT",
    short_description:
      "Unwind with smooth neo-soul, acoustic gems, late-night open mic confessions, and peaceful late-night vibes.",
    cover_image: "",
    promo_video_url: "",
    display_order: 5,
    is_featured: true,
    is_active: true,
    meta: {
      badge: "LATE NIGHT LOUNGE",
      genre: "Neo-Soul & Talks",
      accent: "#8b5cf6", // Purple
      artwork: StudioImg,
      icon: "mic",
    },
  },
];

// Helper to determine meta for a program
function resolveProgramMeta(program: ProgramSummary, index: number): ProgramMeta {
  const titleLower = program.title.toLowerCase();
  const slugLower = program.slug.toLowerCase();

  if (titleLower.includes("sport") || slugLower.includes("sport")) {
    return {
      badge: "WEEKEND SPORTS EXTRA",
      genre: "Sports & Athletics",
      accent: "#eab308",
      artwork: BrianPortrait,
      icon: "trophy",
    };
  }
  if (titleLower.includes("purpose") || titleLower.includes("life") || slugLower.includes("purpose")) {
    return {
      badge: "FLAGSHIP TALK SERIES",
      genre: "Culture & Leadership",
      accent: "#04b093",
      artwork: DanielPortrait,
      icon: "sparkles",
    };
  }
  if (titleLower.includes("morning") || titleLower.includes("drive") || slugLower.includes("morning")) {
    return {
      badge: "PRIME BREAKFAST SHOW",
      genre: "News & Morning Drive",
      accent: "#f97316",
      artwork: SamuelPortrait,
      icon: "radio",
    };
  }
  if (titleLower.includes("urban") || titleLower.includes("top") || slugLower.includes("urban")) {
    return {
      badge: "COUNTDOWN & MIX SHOW",
      genre: "Afrobeats & Urban",
      accent: "#ec4899",
      artwork: InnocentPortrait,
      icon: "flame",
    };
  }

  // Generic fallbacks based on index
  const metaPalette: ProgramMeta[] = [
    { badge: "WEEKEND SPORTS EXTRA", genre: "Sports & Live Match", accent: "#eab308", artwork: BrianPortrait, icon: "trophy" },
    { badge: "ORIGINAL SERIES", genre: "Talk & Culture", accent: "#04b093", artwork: DanielPortrait, icon: "sparkles" },
    { badge: "LIVE ON-AIR", genre: "Broadcast & Music", accent: "#f97316", artwork: SamuelPortrait, icon: "radio" },
    { badge: "STUDIO FRANCHISE", genre: "Entertainment & Mix", accent: "#ec4899", artwork: BehindScenesImg, icon: "flame" },
    { badge: "EVENING SPECIAL", genre: "Soul & Discourse", accent: "#8b5cf6", artwork: StudioImg, icon: "mic" },
  ];

  return metaPalette[index % metaPalette.length];
}

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<(ProgramSummary & { meta: ProgramMeta })[]>(FALLBACK_PROGRAMS);
  const [activeId, setActiveId] = useState<number>(FALLBACK_PROGRAMS[0].id);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch API programs and combine with rich metadata
  useEffect(() => {
    let isMounted = true;
    homeService
      .getFeaturedPrograms()
      .then((items) => {
        if (!isMounted) return;
        if (items && items.length > 0) {
          const enriched = items.map((item, idx) => ({
            ...item,
            meta: resolveProgramMeta(item, idx),
          }));
          setPrograms(enriched);
          setActiveId((prev) => {
            const found = enriched.some((p) => p.id === prev);
            return found ? prev : enriched[0].id;
          });
        }
      })
      .catch(() => {
        // Fallbacks already in state
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Active program pointer
  const activeProgram =
    programs.find((p) => p.id === activeId) || programs[0] || FALLBACK_PROGRAMS[0];
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
                ROTATING SHOW CRATE
              </span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-black">
                SELECTABLE VINYL & CD SHOWCASE
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              Original Shows & Series Roster
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-black/85">
              Point or tap on any program disc below—like the{" "}
              <span className="bg-black px-1.5 py-0.5 text-white font-black uppercase">
                Sports Arena
              </span>{" "}
              or cultural talk series—to slide out the master CD and explore full broadcast details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Prev / Next CD navigation buttons */}
            <div className="flex items-center gap-1.5 border-2 border-black bg-black p-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <button
                onClick={handlePrev}
                aria-label="Previous Program Disc"
                className="flex size-9 items-center justify-center bg-zinc-900 text-white transition hover:bg-[#04b093] hover:text-black cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-2.5 text-xs font-mono font-bold text-[#04b093]">
                {String(activeIndex + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next Program Disc"
                className="flex size-9 items-center justify-center bg-zinc-900 text-white transition hover:bg-[#04b093] hover:text-black cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              href="/programs"
              className="inline-flex items-center gap-2 border-2 border-black bg-black px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition hover:bg-white hover:text-black w-fit shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              <span>Full Directory</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            01 // MASTER SPOTLIGHT SHOWCASE: 3D SLIDING CD & EDITORIAL CONTROL CARD
            ========================================================================= */}
        <div className="relative mb-12 overflow-hidden rounded-2xl border-4 border-black bg-black p-6 sm:p-10 lg:p-12 text-white shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          {/* Subtle Ambient Backlights */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#04b093]/20 blur-3xl" />
          <div
            className="pointer-events-none absolute -bottom-24 left-10 h-80 w-80 rounded-full blur-3xl opacity-25 transition-colors duration-700"
            style={{ backgroundColor: activeProgram.meta.accent }}
          />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* LEFT COLUMN: 3D CD SLEEVE + PHYSICAL SLIDING COMPACT DISC */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              
              {/* Turntable / Jewel Case Stage */}
              <div className="relative flex w-full max-w-[460px] items-center justify-center py-6 sm:py-8">
                
                {/* 
                  COMPACT DISC (CD) - Spins continuously and slides outward to the right
                  When user hovers or points in, it brings itself out dynamically!
                */}
                <div
                  className="group/cd absolute left-1/2 top-1/2 aspect-square w-[75%] sm:w-[80%] -translate-y-1/2 transition-all duration-700 ease-out z-10"
                  style={{
                    transform: isHovering
                      ? "translate(15%, -50%) rotate(12deg)"
                      : "translate(5%, -50%) rotate(0deg)",
                  }}
                >
                  {/* Holographic Iridescent CD Surface */}
                  <div className="relative h-full w-full rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(4,176,147,0.3)] transition-transform duration-500 group-hover/cd:scale-105">
                    
                    {/* Continuous CD Spin Mechanism */}
                    <div
                      className="chart-spin relative h-full w-full rounded-full border border-white/20"
                      style={{
                        background: `
                          radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(255,255,255,0.06) 28.5% 29%, transparent 29.5%),
                          conic-gradient(from 0deg, #18181b 0deg, #3f3f46 45deg, #18181b 90deg, #52525b 135deg, #18181b 180deg, #3f3f46 225deg, #18181b 270deg, #52525b 315deg, #18181b 360deg),
                          conic-gradient(from 120deg, transparent 0deg, rgba(4,176,147,0.35) 60deg, rgba(234,179,8,0.3) 120deg, rgba(239,68,68,0.25) 180deg, rgba(59,130,246,0.35) 240deg, transparent 300deg)
                        `,
                      }}
                    >
                      {/* CD Concentric Micro-Grooves */}
                      <div className="absolute inset-4 rounded-full border border-white/10" />
                      <div className="absolute inset-8 rounded-full border border-white/5" />
                      <div className="absolute inset-12 rounded-full border border-white/10" />

                      {/* Disc Outer Rainbow Sheen Reflection */}
                      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-80" />

                      {/* Center Hub & Printed Artwork Label */}
                      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 sm:h-28 sm:w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-black bg-zinc-950 p-1 shadow-2xl">
                        
                        {/* Artwork disc circular thumbnail */}
                        <div className="relative h-full w-full overflow-hidden rounded-full border border-white/30">
                          <Image
                            src={activeProgram.cover_image || activeProgram.meta.artwork}
                            alt={activeProgram.title}
                            fill
                            sizes="120px"
                            className="object-cover"
                            unoptimized={Boolean(activeProgram.cover_image)}
                          />
                          <div className="absolute inset-0 bg-black/25" />
                        </div>

                        {/* Transparent Clamping Hub Ring */}
                        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60 bg-black/70 backdrop-blur-md flex items-center justify-center">
                          {/* Spindle Center Hole */}
                          <div className="h-4 w-4 rounded-full bg-black border border-white/80" />
                        </div>
                      </div>

                      {/* Dynamic Equalizer Pulse on CD Disc edge */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/20">
                        <span className="w-1 bg-[#04b093] rounded-full animate-eq-1 h-3" />
                        <span className="w-1 bg-[#04b093] rounded-full animate-eq-2 h-4" />
                        <span className="w-1 bg-[#04b093] rounded-full animate-eq-3 h-2" />
                        <span className="w-1 bg-[#04b093] rounded-full animate-eq-4 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 
                  JEWEL CASE / SHOW SLEEVE JACKET
                  Stands in front on the left; the CD slides out from behind it.
                */}
                <div className="relative z-20 aspect-square w-[75%] sm:w-[80%] overflow-hidden rounded-xl border-4 border-white/30 bg-zinc-950 shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-all duration-500 hover:-rotate-1">
                  
                  {/* Show Artwork Poster inside Jacket */}
                  <div className="relative h-full w-full">
                    <Image
                      src={activeProgram.cover_image || activeProgram.meta.artwork}
                      alt={activeProgram.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={Boolean(activeProgram.cover_image)}
                    />
                    
                    {/* High-Gloss Plastic CD Sleeve Finish */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-white/20" />
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
                    
                    {/* Top Spine Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-black/90 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-widest text-[#04b093] border border-white/20 backdrop-blur-md">
                        DISC 0{activeIndex + 1} // CBM RADIO
                      </span>
                      <span
                        className="px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-black rounded-sm shadow-sm"
                        style={{ backgroundColor: activeProgram.meta.accent }}
                      >
                        {activeProgram.meta.genre}
                      </span>
                    </div>

                    {/* Bottom Jacket Title Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-wider text-[#04b093]">
                        <Disc3 size={13} className="animate-spin text-[#04b093]" style={{ animationDuration: "4s" }} />
                        <span>COMPACT DISC DIGITAL AUDIO</span>
                      </div>
                      <h4 className="mt-1 text-lg sm:text-xl font-black uppercase text-white tracking-tight line-clamp-1">
                        {activeProgram.title}
                      </h4>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status indicator pill */}
              <div className="mt-2 flex items-center gap-2 text-xs font-mono font-bold text-zinc-400">
                <span className="inline-block size-2 rounded-full bg-[#04b093] animate-ping" />
                <span className="text-white">TURNTABLE READY:</span>
                <span className="text-[#04b093] uppercase">{activeProgram.title}</span>
              </div>
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
                  className="inline-flex items-center gap-2 border-2 border-[#04b093] bg-[#04b093] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]"
                >
                  <Headphones size={16} />
                  <span>Stream Show Episodes</span>
                  <ArrowUpRight size={14} />
                </Link>

                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 border-2 border-white/30 bg-zinc-900 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black hover:border-white"
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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc3 size={18} className="animate-spin text-black" style={{ animationDuration: "5s" }} />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black">
                CD RACK SELECTOR — HOVER OR TAP ANY DISC TO BRING IT OUT
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-black/75">
              Tip: Hovering immediately activates that programme
            </span>
          </div>

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
                  className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 p-4 ${
                    isActive
                      ? "border-black bg-black text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] scale-[1.03] -translate-y-1.5 z-20"
                      : "border-black/60 bg-black/80 text-white/90 hover:border-black hover:bg-black hover:scale-[1.02] shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] z-10"
                  }`}
                >
                  {/* Top Bar with Disc No. & Active Pill */}
                  <div className="mb-3 flex items-center justify-between text-[0.62rem] font-mono font-black uppercase">
                    <span
                      className={`px-2 py-0.5 rounded-sm ${
                        isActive ? "bg-[#04b093] text-black" : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      DISC 0{idx + 1}
                    </span>
                    {isActive ? (
                      <span className="flex items-center gap-1 font-bold text-[#04b093]">
                        <span className="size-1.5 rounded-full bg-[#04b093] animate-ping" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-zinc-400 group-hover:text-white">TAP TO EJECT</span>
                    )}
                  </div>

                  {/* CD Visual Container: Sleeve + Sliding Disc */}
                  <div className="relative mb-3 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-950 p-2 border border-white/10">
                    
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
                    <div className="relative z-10 aspect-square h-full overflow-hidden rounded border border-white/20 bg-zinc-900 shadow-md">
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

                  <p className="mt-0.5 text-[0.72rem] font-medium text-zinc-400 line-clamp-1">
                    {program.presenter ? `By ${program.presenter}` : program.meta.genre}
                  </p>

                  {/* Bottom Bar: Action Pill */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[0.68rem] font-black uppercase">
                    <span className="text-[#04b093] flex items-center gap-1">
                      <Play size={11} className={isActive ? "fill-[#04b093]" : ""} />
                      {isActive ? "Selected" : "Select"}
                    </span>
                    <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-white" />
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
