"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X, Camera } from "lucide-react";

// =========================================================================
// 📸 STATION PHOTO PRINTS CONFIGURATION
// Easily swap in your own photos by changing `imageUrl` to any file inside
// `cbmradio3-publicwebsite/public/` (for example: `/cbm_images/my-photo.jpg`)
// =========================================================================
export interface PhotoPrintItem {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  handwrittenNote: string;
  tag: string;
  storySlug: string;
  storyExcerpt: string;
  date: string;
  hideOnMobile?: boolean; // For mobile: show 3 prints as requested
  desktop: {
    left: string;
    top: string;
    width: string;
    rotation: number;
    zIndex: number;
    depth: number; // For mouse parallax
  };
  mobile: {
    left: string;
    top: string;
    width: string;
    rotation: number;
    zIndex: number;
  };
}

export const STATION_PHOTO_PRINTS: PhotoPrintItem[] = [
  {
    id: "print-1",
    imageUrl: "/cbm_images/behind-the-scenes-studio.png",
    alt: "Behind the scenes in CBM radio studio",
    caption: "Behind the Mic",
    handwrittenNote: "Stories — Studio A late session",
    tag: "BEHIND THE MIC",
    storySlug: "behind-the-scenes-studio",
    storyExcerpt: "Late-night reel recording with station engineers dialing in analogue soundscapes for East Africa.",
    date: "OCT 2026",
    desktop: {
      left: "4%",
      top: "14%",
      width: "44%",
      rotation: -12,
      zIndex: 10,
      depth: 16,
    },
    mobile: {
      left: "4%",
      top: "8%",
      width: "55%",
      rotation: -10,
      zIndex: 10,
    },
  },
  {
    id: "print-2",
    imageUrl: "/cbm_images/cbm-conversation-radio-show.png",
    alt: "Live talk conversation and guest interview",
    caption: "Culture",
    handwrittenNote: "Culture — Nairobi voices in flow",
    tag: "CULTURE",
    storySlug: "cbm-conversation-radio-show",
    storyExcerpt: "An impromptu roundtable sharing untold stories, faith reflections, and grassroot music rhythms.",
    date: "OCT 2026",
    desktop: {
      left: "32%",
      top: "4%",
      width: "42%",
      rotation: 3,
      zIndex: 15,
      depth: 12,
    },
    mobile: {
      left: "38%",
      top: "12%",
      width: "56%",
      rotation: 5,
      zIndex: 15,
    },
  },
  {
    id: "print-3",
    imageUrl: "/cbm_images/on-air-studio.png",
    alt: "On air studio transmission desk",
    caption: "Dispatch #12",
    handwrittenNote: "Dispatch #12 — 104.2 FM live",
    tag: "DISPATCH",
    storySlug: "on-air-studio",
    storyExcerpt: "The red tally lamp goes live as the mid-day cultural journal dispatches across Kenya and syndication.",
    date: "NOV 2026",
    desktop: {
      left: "48%",
      top: "36%",
      width: "45%",
      rotation: 9,
      zIndex: 25,
      depth: 22,
    },
    mobile: {
      left: "18%",
      top: "48%",
      width: "64%",
      rotation: 2,
      zIndex: 25,
    },
  },
  {
    id: "print-4",
    imageUrl: "/cbm_images/artist-spotlight.png",
    alt: "Artist interview and studio music acoustic session",
    caption: "Stories",
    handwrittenNote: "Voices — Acoustic live take",
    tag: "STORIES",
    storySlug: "artist-spotlight",
    storyExcerpt: "Under the warm studio lamps, emerging gospel musicians break down their new single chord by chord.",
    date: "NOV 2026",
    hideOnMobile: true, // Only 3 prints on mobile as requested
    desktop: {
      left: "14%",
      top: "50%",
      width: "43%",
      rotation: -5,
      zIndex: 20,
      depth: 18,
    },
    mobile: {
      left: "10%",
      top: "52%",
      width: "50%",
      rotation: -4,
      zIndex: 12,
    },
  },
];

export default function StationDispatchesFlatLay() {
  const [activeModalPrint, setActiveModalPrint] = useState<PhotoPrintItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const tableRef = useRef<HTMLDivElement | null>(null);

  // Trigger entrance drops on mount
  useEffect(() => {
    setIsLoaded(true);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Parallax tracking when mouse moves over table
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !tableRef.current) return;
    const rect = tableRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setHoveredId(null);
  };

  return (
    <section
      id="station-dispatches"
      aria-label="Stories, Culture & Station Dispatches Flat Lay"
      className="relative rounded-3xl border-3 border-black bg-[#060c18] text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* =========================================================================
          CSS KEYFRAMES:
          - Realistic drop & bounce entrance
          - Idle breathing oscillation
          - Soft window light drift across the wood
          ========================================================================= */}
      <style>{`
        /* Realistic photo print drop entrance with slight bounce */
        @keyframes print-drop {
          0% {
            opacity: 0;
            transform: translateY(-44px) scale(1.12);
            filter: drop-shadow(0 35px 30px rgba(0,0,0,0.85));
          }
          70% {
            opacity: 1;
            transform: translateY(3px) scale(0.99);
            filter: drop-shadow(0 12px 14px rgba(0,0,0,0.55));
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: drop-shadow(0 16px 20px rgba(0,0,0,0.6));
          }
        }

        /* Subtle idle breathing float for prints */
        @keyframes print-breathe-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(0.6deg); }
        }
        @keyframes print-breathe-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(2.5px) rotate(-0.7deg); }
        }
        @keyframes print-breathe-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(-0.5deg); }
        }

        /* Soft sunlight drift through window panes */
        @keyframes window-light-drift {
          0%, 100% {
            opacity: 0.22;
            transform: translate(0, 0) scale(1);
          }
          50% {
            opacity: 0.34;
            transform: translate(14px, -8px) scale(1.04);
          }
        }

        .animate-light-drift {
          animation: window-light-drift 10s ease-in-out infinite;
        }

        .breathe-1 { animation: print-breathe-1 6.5s ease-in-out infinite; }
        .breathe-2 { animation: print-breathe-2 7.8s ease-in-out infinite; }
        .breathe-3 { animation: print-breathe-3 5.9s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-light-drift,
          .breathe-1,
          .breathe-2,
          .breathe-3 {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient Deep Navy / Teal Flare */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#04b093]/10 blur-[90px]"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
        
        {/* =========================================================================
            LEFT COLUMN (DESKTOP) / TOP (MOBILE):
            - Small monospace label: "FROM THE STATION"
            - Heading (bold uppercase): "STORIES, CULTURE & STATION DISPATCHES"
            - Description: "Behind-the-scenes moments, voices from across Africa, and the latest news from inside CBM Radio."
            - Button: "READ THE DISPATCHES"
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          
          {/* Small Monospace Label: "FROM THE STATION" */}
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#04b093] bg-[#04b093]/10 px-3.5 py-1 rounded-full border border-[#04b093]/30">
              FROM THE STATION
            </span>
            <span className="hidden sm:inline-block size-1.5 rounded-full bg-[#04b093] animate-pulse" />
          </div>

          {/* Heading (Bold Uppercase): "STORIES, CULTURE & STATION DISPATCHES" */}
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.08]">
            STORIES, CULTURE & STATION DISPATCHES
          </h2>

          {/* One-Line Description */}
          <p className="mt-4 text-sm sm:text-base font-semibold leading-relaxed text-zinc-300 max-w-xl">
            Behind-the-scenes moments, voices from across Africa, and the latest news from inside CBM Radio.
          </p>

          {/* Editorial Highlights Bullet List */}
          <div className="mt-6 flex flex-col gap-2.5 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-[#04b093]">▸</span>
              <span>Authentic Polaroid studio snapshots & field reels</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#04b093]">▸</span>
              <span>East African culture, interviews & creator chronicles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#04b093]">▸</span>
              <span>Live production logs from 104.2 FM & digital stream</span>
            </div>
          </div>

          {/* Action Button: READ THE DISPATCHES */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-black bg-[#04b093] px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>READ THE DISPATCHES</span>
              <ArrowUpRight size={16} />
            </Link>

            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-zinc-400">
              * Tap any photo to inspect
            </span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (DESKTOP) / BOTTOM (MOBILE):
            TOP-DOWN FLAT LAY OF PRINTED PHOTOS ON A WARM WALNUT WOOD TABLE
            - Background: Rich brown walnut wood table with visible grain & vignette
            - Soft diagonal window light patches & shadows
            - 3 to 4 instant-print photos (Polaroid style) scattered & overlapping
            - 1 blank white card peeking out from underneath
            - Decorative props:
              - 2 brass film canisters labelled "ISO" (1 on mobile)
              - Short strip of dark film negative with sprocket holes at top edge
              - Dried rose / botanical stem at right edge
            - Interactive lift, tilt, parallax & modal zoom
            ========================================================================= */}
        <div className="lg:col-span-7">
          
          {/* The Walnut Wood Table Panel with rounded corners and thin teal border */}
          <div
            ref={tableRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group/table relative w-full aspect-[4/3] sm:aspect-[16/12] max-h-[580px] rounded-3xl border-2 border-[#04b093]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden cursor-default select-none transition-all duration-300"
            style={{
              backgroundColor: "#2c190e",
            }}
          >
            
            {/* 1. Procedural Walnut Wood Table Texture (Rich Brown Grain Layers) */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(90deg, 
                    rgba(38, 22, 13, 0.95) 0%, 
                    rgba(54, 32, 18, 0.9) 25%, 
                    rgba(43, 25, 14, 0.95) 50%, 
                    rgba(61, 36, 21, 0.9) 75%, 
                    rgba(34, 19, 11, 0.95) 100%
                  ),
                  repeating-linear-gradient(179deg,
                    transparent 0px,
                    rgba(20, 10, 5, 0.15) 2px,
                    transparent 5px,
                    rgba(80, 48, 28, 0.12) 8px,
                    transparent 12px
                  )
                `,
                backgroundBlendMode: "multiply",
              }}
              aria-hidden="true"
            />

            {/* Subtle Wood Plank Seam Lines */}
            <div
              className="absolute inset-0 z-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: `
                  linear-gradient(to right, transparent 33.1%, rgba(10,5,2,0.9) 33.3%, rgba(90,55,30,0.5) 33.5%, transparent 33.8%),
                  linear-gradient(to right, transparent 66.4%, rgba(10,5,2,0.9) 66.6%, rgba(90,55,30,0.5) 66.8%, transparent 67.1%)
                `,
              }}
              aria-hidden="true"
            />

            {/* 2. Soft Diagonal Window-Light Patches & Mullion Shadows (Drifting) */}
            <div
              className="pointer-events-none absolute -inset-10 z-1 animate-light-drift opacity-30 mix-blend-soft-light"
              style={{
                background: `
                  linear-gradient(135deg, 
                    transparent 20%, 
                    rgba(255, 240, 205, 0.55) 35%, 
                    transparent 42%,
                    rgba(255, 235, 190, 0.65) 50%, 
                    transparent 58%,
                    rgba(255, 245, 215, 0.45) 72%, 
                    transparent 85%
                  )
                `,
                filter: "blur(22px)",
              }}
              aria-hidden="true"
            />

            {/* Table Edge Vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-2 bg-[radial-gradient(circle_at_48%_45%,transparent_42%,rgba(14,7,3,0.78)_100%)]"
              aria-hidden="true"
            />

            {/* =================================================================
                DECORATIVE PROPS:
                1. Strip of Dark Film Negative with Sprocket Holes (Top edge)
                2. 2 Brass Film Canisters labelled "ISO" (2 on desktop, 1 on mobile)
                3. Dried Rose / Botanical Stem (Right edge, hidden on narrow mobile)
                4. Blank White Card peeking out from underneath
                ================================================================= */}

            {/* PROP 1: Dark Film Negative Strip (Top Edge, partly cut off) */}
            <div
              className="absolute -top-3 left-[18%] sm:left-[24%] z-5 w-40 sm:w-56 h-12 sm:h-16 pointer-events-none rotate-[-6deg] opacity-85 transition-transform duration-500"
              style={{
                transform: `rotate(-6deg) translate(${mouseOffset.x * 6}px, ${mouseOffset.y * 6}px)`,
                background: "linear-gradient(180deg, #18120c 0%, #291e14 50%, #150f09 100%)",
                borderRadius: "3px",
                boxShadow: "0 8px 18px rgba(0,0,0,0.7)",
                border: "1px solid rgba(80,60,40,0.5)",
              }}
              aria-hidden="true"
            >
              {/* Negative Sprocket Holes Top & Bottom */}
              <div
                className="absolute top-1 left-2 right-2 h-2 opacity-80"
                style={{
                  backgroundImage: "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 45%, transparent 60%)",
                  backgroundSize: "12px 6px",
                  backgroundRepeat: "repeat-x",
                }}
              />
              <div
                className="absolute bottom-1 left-2 right-2 h-2 opacity-80"
                style={{
                  backgroundImage: "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 45%, transparent 60%)",
                  backgroundSize: "12px 6px",
                  backgroundRepeat: "repeat-x",
                }}
              />
              {/* Exposed negative frames */}
              <div className="absolute inset-x-3 top-2.5 bottom-2.5 flex items-center justify-around gap-2 px-1">
                <div className="h-full flex-1 bg-[#4a3420]/40 border border-white/20 rounded-sm flex items-center justify-center font-mono text-[0.42rem] sm:text-[0.48rem] text-[#04b093]/70">
                  <span>▲ 24A</span>
                </div>
                <div className="h-full flex-1 bg-[#4a3420]/40 border border-white/20 rounded-sm flex items-center justify-center font-mono text-[0.42rem] sm:text-[0.48rem] text-[#04b093]/70">
                  <span>▲ 25A</span>
                </div>
                <div className="h-full flex-1 bg-[#4a3420]/40 border border-white/20 rounded-sm flex items-center justify-center font-mono text-[0.42rem] sm:text-[0.48rem] text-[#04b093]/70">
                  <span>▲ 26A</span>
                </div>
              </div>
            </div>

            {/* PROP 2: Blank White Card Peeking Out From Underneath */}
            <div
              className="absolute left-[6%] sm:left-[10%] top-[34%] z-6 w-32 sm:w-44 h-44 sm:h-56 rounded-md bg-[#faf7ef] pointer-events-none shadow-[0_12px_24px_rgba(0,0,0,0.65)] border border-[#d8d0bf] rotate-[-15deg] transition-transform duration-500"
              style={{
                transform: `rotate(-15deg) translate(${mouseOffset.x * 10}px, ${mouseOffset.y * 10}px)`,
              }}
              aria-hidden="true"
            >
              <div className="p-2.5 sm:p-3">
                <div className="h-28 sm:h-36 w-full rounded border border-dashed border-[#b3a894] bg-[#f0ebd9]/60 flex items-center justify-center">
                  <span className="font-mono text-[0.5rem] sm:text-[0.55rem] font-bold text-[#8c7f6b] uppercase tracking-widest rotate-[-10deg]">
                    [ TEST PRINT // CBM ]
                  </span>
                </div>
                <div className="mt-2.5 font-mono text-[0.5rem] sm:text-[0.55rem] text-[#695d4b]">
                  REC // 35MM LEADER
                </div>
              </div>
            </div>

            {/* PROP 3: Brass Film Canister 1 (Top Left, labelled "ISO 400") */}
            <div
              className="absolute left-[2%] top-[2%] sm:top-[4%] z-7 w-11 sm:w-16 h-18 sm:h-24 pointer-events-none transition-transform duration-500"
              style={{
                transform: `rotate(28deg) translate(${mouseOffset.x * 24}px, ${mouseOffset.y * 24}px)`,
                filter: "drop-shadow(0 14px 14px rgba(0,0,0,0.75))",
              }}
              aria-hidden="true"
            >
              {/* Cylindrical Brass Body */}
              <div
                className="w-full h-full rounded-lg relative overflow-hidden border border-[#594212]"
                style={{
                  background: "linear-gradient(90deg, #6e4e11 0%, #d4af37 28%, #fae69e 55%, #aa820a 78%, #4a340b 100%)",
                }}
              >
                {/* Knurled Top Cap */}
                <div
                  className="h-3 sm:h-4 w-full border-b border-[#3b2b0a]"
                  style={{
                    background: "linear-gradient(90deg, #443009 0%, #aa820a 35%, #ffd700 65%, #3b2a09 100%)",
                  }}
                />
                {/* ISO Label Stamp */}
                <div className="absolute inset-x-0 top-5 sm:top-6 text-center">
                  <div className="inline-block bg-black/85 px-1 py-0.5 rounded text-[0.45rem] sm:text-[0.58rem] font-mono font-black text-[#d4af37] tracking-widest">
                    ISO 400
                  </div>
                  <div className="text-[0.38rem] sm:text-[0.45rem] font-mono font-bold text-[#3a2909] uppercase tracking-tighter mt-0.5">
                    CBM // 36 EXP
                  </div>
                </div>
              </div>
            </div>

            {/* PROP 4: Brass Film Canister 2 (Bottom Left, labelled "ISO 800", hidden on mobile) */}
            <div
              className="hidden sm:block absolute left-[2%] bottom-[-2%] z-7 w-14 h-22 pointer-events-none transition-transform duration-500"
              style={{
                transform: `rotate(-48deg) translate(${mouseOffset.x * 20}px, ${mouseOffset.y * 20}px)`,
                filter: "drop-shadow(0 14px 14px rgba(0,0,0,0.8))",
              }}
              aria-hidden="true"
            >
              <div
                className="w-full h-full rounded-lg relative overflow-hidden border border-[#594212]"
                style={{
                  background: "linear-gradient(90deg, #593e0b 0%, #c59f27 25%, #f4dda2 50%, #997307 80%, #3d2906 100%)",
                }}
              >
                <div className="h-3 w-full border-b border-[#3b2b0a] bg-[#7d5f13]" />
                <div className="absolute inset-x-0 top-5 text-center">
                  <span className="inline-block bg-black/85 px-1 py-0.5 rounded text-[0.5rem] font-mono font-black text-[#ffd700] tracking-wider">
                    ISO 800
                  </span>
                </div>
              </div>
            </div>

            {/* PROP 5: Dried Rose / Botanical Leaf Stem (Right edge, hidden on mobile) */}
            <div
              className="hidden sm:block absolute -right-4 sm:-right-6 top-[22%] sm:top-[28%] z-8 w-24 sm:w-32 h-52 sm:h-64 pointer-events-none transition-transform duration-500"
              style={{
                transform: `rotate(14deg) translate(${mouseOffset.x * 16}px, ${mouseOffset.y * 16}px)`,
                filter: "drop-shadow(0 12px 14px rgba(0,0,0,0.7))",
              }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 100 220" className="w-full h-full block">
                {/* Stem */}
                <path
                  d="M 50,220 C 45,160 55,100 48,35"
                  fill="none"
                  stroke="#5a422d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Dried leaves */}
                <path
                  d="M 49,150 C 30,140 22,120 32,112 C 42,108 48,130 49,150 Z"
                  fill="#61553c"
                  stroke="#3d3320"
                  strokeWidth="0.8"
                />
                <path
                  d="M 51,120 C 72,110 80,95 70,86 C 60,82 52,102 51,120 Z"
                  fill="#544c37"
                  stroke="#352e1e"
                  strokeWidth="0.8"
                />
                <path
                  d="M 48,80 C 32,70 28,52 38,46 C 46,44 48,65 48,80 Z"
                  fill="#6e5d42"
                  stroke="#423624"
                  strokeWidth="0.8"
                />
                {/* Dried Rose Bud / Petals */}
                <g transform="translate(48, 30)">
                  <path
                    d="M 0,5 C -12,0 -16,-18 -4,-24 C 6,-30 18,-18 10,-4 Z"
                    fill="#5e2b2c"
                    stroke="#381516"
                    strokeWidth="1"
                  />
                  <path
                    d="M -4,-2 C -15,-10 -10,-24 0,-22 C 10,-20 8,-8 0,0 Z"
                    fill="#783a3c"
                    stroke="#481f21"
                    strokeWidth="0.8"
                  />
                  <ellipse cx="0" cy="-12" rx="6" ry="10" fill="#91494c" opacity="0.9" />
                </g>
              </svg>
            </div>

            {/* =================================================================
                THE INSTANT-PRINT PHOTOS (POLAROID STYLE)
                Scattered, overlapping, rotating between -12° and +9°
                Thick bottom white border with handwritten caption
                Hover straightens, lifts, deepens shadow & glows teal!
                ================================================================= */}
            {STATION_PHOTO_PRINTS.map((photo, index) => {
              const isHovered = hoveredId === photo.id;
              const breatheClass = index % 3 === 0 ? "breathe-1" : index % 3 === 1 ? "breathe-2" : "breathe-3";
              const entranceDelay = `${index * 140}ms`;

              // Parallax calculation
              const px = mouseOffset.x * photo.desktop.depth;
              const py = mouseOffset.y * photo.desktop.depth;

              return (
                <div
                  key={photo.id}
                  onClick={() => setActiveModalPrint(photo)}
                  onMouseEnter={() => setHoveredId(photo.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`absolute cursor-pointer transition-all duration-300 group/photo ${
                    photo.hideOnMobile ? "hidden sm:block" : ""
                  } ${isHovered ? "z-50" : ""}`}
                  style={{
                    left: photo.desktop.left,
                    top: photo.desktop.top,
                    width: photo.desktop.width,
                    zIndex: isHovered ? 50 : photo.desktop.zIndex,
                    animation: isLoaded && !isReducedMotion ? `print-drop 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${entranceDelay} backwards` : undefined,
                  }}
                >
                  {/* Floating Breathing Container */}
                  <div
                    className={`${!isHovered && !isReducedMotion ? breatheClass : ""}`}
                    style={{
                      transform: isHovered
                        ? `rotate(0deg) scale(1.07) translateY(-8px)`
                        : `rotate(${photo.desktop.rotation}deg) translate(${px}px, ${py}px)`,
                      transition: "transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.3s ease",
                    }}
                  >
                    {/* The Polaroid Cardstock */}
                    <div
                      className={`relative rounded-md bg-[#faf7f2] p-2 sm:p-2.5 pb-7 sm:pb-9 transition-all duration-300 ${
                        isHovered
                          ? "ring-2 ring-[#04b093] shadow-[0_28px_50px_rgba(0,0,0,0.85)]"
                          : "shadow-[0_14px_24px_-4px_rgba(0,0,0,0.7)] border border-[#dcd4c3]"
                      }`}
                    >
                      {/* Photo Image Frame */}
                      <div className="relative aspect-square w-full overflow-hidden rounded bg-[#1f1712] border border-[#2a2018]/20">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 768px) 50vw, 30vw"
                          className="object-cover transition-transform duration-500 group-hover/photo:scale-105"
                        />

                        {/* Subtle glossy photo finish glare */}
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-60"
                          aria-hidden="true"
                        />

                        {/* Category Tag on Photo */}
                        <div className="absolute left-1.5 top-1.5">
                          <span className="rounded bg-black/80 px-2 py-0.5 font-mono text-[0.55rem] sm:text-[0.62rem] font-black uppercase tracking-wider text-[#04b093] backdrop-blur-sm shadow">
                            {photo.tag}
                          </span>
                        </div>

                        {/* Inspect icon badge on hover */}
                        <div
                          className={`absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full bg-[#04b093] text-black shadow-md transition-opacity duration-200 ${
                            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                          }`}
                        >
                          <ArrowUpRight size={13} />
                        </div>
                      </div>

                      {/* Polaroid Chin: Handwritten-Style Caption */}
                      <div className="mt-2 sm:mt-2.5 px-0.5 flex items-center justify-between">
                        <p className="font-serif italic text-xs sm:text-sm font-black text-[#2e2318] truncate tracking-tight">
                          {photo.handwrittenNote}
                        </p>
                        <span className="font-mono text-[0.55rem] sm:text-[0.6rem] font-bold text-[#80705c]">
                          {photo.date}
                        </span>
                      </div>

                      {/* "Read Story" Reveal Pill on Hover */}
                      <div
                        className={`absolute left-2 right-2 -bottom-3 z-20 flex items-center justify-center gap-1 rounded-full bg-black px-3 py-1 font-mono text-[0.62rem] font-black uppercase tracking-wider text-[#04b093] shadow-lg border border-[#04b093] transition-all duration-200 ${
                          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                        }`}
                      >
                        <span>Inspect Dispatch</span>
                        <ArrowUpRight size={10} />
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom-right Station Watermark Stamp on Wood */}
            <div className="absolute right-3.5 bottom-2.5 z-5 pointer-events-none flex items-center gap-2 font-mono text-[0.58rem] sm:text-[0.65rem] font-bold uppercase tracking-widest text-[#a88258]/55">
              <Camera size={11} />
              <span>CBM RADIO // DARKROOM ARCHIVE</span>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          LIGHTBOX MODAL: FULL PHOTO INSPECTION & STORY DISPATCH PREVIEW
          Triggered when clicking any instant print
          ========================================================================= */}
      {activeModalPrint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalPrint(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border-3 border-black bg-[#faf7f0] p-6 text-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalPrint(null)}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border-2 border-black bg-white text-black hover:bg-[#04b093] transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X size={18} />
            </button>

            {/* Large Photo Preview in Polaroid Framing */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black border-2 border-black shadow-md">
              <Image
                src={activeModalPrint.imageUrl}
                alt={activeModalPrint.alt}
                fill
                className="object-cover"
              />
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-[#04b093]">
                  {activeModalPrint.tag}
                </span>
              </div>
            </div>

            {/* Handwritten Title & Metadata */}
            <div className="mt-5">
              <div className="flex items-center justify-between font-mono text-xs text-[#73634e]">
                <span>ARCHIVE ID: {activeModalPrint.id.toUpperCase()}</span>
                <span>{activeModalPrint.date}</span>
              </div>

              <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
                {activeModalPrint.caption}
              </h3>

              <p className="mt-1 font-serif italic text-base text-[#614e38]">
                "{activeModalPrint.handwrittenNote}"
              </p>

              <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-800">
                {activeModalPrint.storyExcerpt}
              </p>
            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-black/15 pt-4">
              <button
                type="button"
                onClick={() => setActiveModalPrint(null)}
                className="rounded-full border-2 border-black bg-white px-5 py-2 font-mono text-xs font-bold uppercase text-black hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Close
              </button>

              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#04b093] px-6 py-2 font-mono text-xs font-black uppercase text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Read Full Dispatch</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
