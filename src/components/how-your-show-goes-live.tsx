"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Radio, Mic, Send, CheckCircle2, Sparkles, Volume2 } from "lucide-react";

// =========================================================================
// 4 COUNTDOWN STAGES CONFIGURATION
// Exactly matching user specifications:
// 3 = PITCH: Send us your original show concept.
// 2 = REVIEW: Our team reviews your idea and audio sample.
// 1 = PILOT: Record a pilot episode with our studio.
// TODAY = LIVE ON CBM RADIO: Your show goes on air.
// =========================================================================
interface StageConfig {
  id: number;
  badge: string;
  name: string;
  tagline: string;
  detail: string;
  subtext: string;
  icon: typeof Mic;
}

const STAGES: StageConfig[] = [
  {
    id: 0,
    badge: "3",
    name: "PITCH",
    tagline: "Send us your original show concept.",
    detail: "Submit your format treatment, musical genre or talk premise, and creative vision to our programming board.",
    subtext: "STAGE 01 // CONCEPT SUBMISSION",
    icon: Send,
  },
  {
    id: 1,
    badge: "2",
    name: "REVIEW",
    tagline: "Our team reviews your idea and audio sample.",
    detail: "Our production team evaluates broadcast rhythm, voice tone, audience relevance, and 3-minute sample demo tape.",
    subtext: "STAGE 02 // CURATION & FEEDBACK",
    icon: CheckCircle2,
  },
  {
    id: 2,
    badge: "1",
    name: "PILOT",
    tagline: "Record a pilot episode with our studio.",
    detail: "Step into CBM Studio or provide mastered audio stems for professional sound-checks, sweepers, and station sound engineering.",
    subtext: "STAGE 03 // STUDIO PRODUCTION",
    icon: Mic,
  },
  {
    id: 3,
    badge: "TODAY",
    name: "LIVE ON CBM RADIO",
    tagline: "Your show goes on air.",
    detail: "Your premiere broadcast hits live FM & streaming airwaves, with permanent on-demand syndication in the station crate.",
    subtext: "STAGE 04 // LIVE BROADCAST TRANSMISSION",
    icon: Radio,
  },
];

export default function HowYourShowGoesLive() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTodayPausedFlash, setIsTodayPausedFlash] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Synchronized countdown cycle:
  // 3 (2s) -> 2 (2s) -> 1 (2s) -> TODAY (pauses for 2s with soft glow and flash) -> loops back
  useEffect(() => {
    if (isPaused || isReducedMotion) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const duration = activeStage === 3 ? 2400 : 1800;
    if (activeStage === 3) {
      setIsTodayPausedFlash(true);
    } else {
      setIsTodayPausedFlash(false);
    }

    timerRef.current = setTimeout(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
      setIsTodayPausedFlash(false);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeStage, isPaused, isReducedMotion]);

  return (
    <div
      aria-label="How Your Show Goes Live - Vintage Film Reel Poster Animation"
      className="group/poster relative rounded-3xl border-3 border-black bg-[#ece8de] text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          STYLES & ANIMATIONS
          - Vintage Film Reel continuous rotation (in sync with strip motion)
          - Sprocket hole crawling animation
          - Subtle film flicker & grain
          - Pause on hover & prefers-reduced-motion
          ========================================================================= */}
      <style>{`
        /* Continuous steady reel rotation */
        @keyframes reel-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Sprocket holes forward crawl */
        @keyframes sprockets-flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -32;
          }
        }

        /* Projector bulb flicker & grain pulse */
        @keyframes cinema-flicker {
          0%, 100% { opacity: 1; filter: contrast(100%) brightness(100%); }
          15% { opacity: 0.94; filter: contrast(105%) brightness(108%); }
          35% { opacity: 0.98; filter: contrast(98%) brightness(96%); }
          65% { opacity: 0.92; filter: contrast(106%) brightness(105%); }
          85% { opacity: 0.99; filter: contrast(100%) brightness(99%); }
        }

        /* Radar sweep for Academy Leader crosshair rings */
        @keyframes radar-hand {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Soft glow flash when TODAY reaches bottom */
        @keyframes today-flash {
          0%, 100% {
            filter: drop-shadow(0 0 16px rgba(4, 176, 147, 0.4)) drop-shadow(0 0 32px rgba(235, 170, 40, 0.35));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(4, 176, 147, 0.8)) drop-shadow(0 0 55px rgba(255, 220, 100, 0.7));
          }
        }

        .animate-reel {
          animation: reel-rotate 14s linear infinite;
          transform-origin: 85px 65px;
          will-change: transform;
        }

        .animate-sprockets {
          animation: sprockets-flow 1.5s linear infinite;
        }

        .animate-flicker {
          animation: cinema-flicker 0.28s infinite;
        }

        .animate-radar {
          animation: radar-hand 1.8s linear infinite;
          transform-origin: center center;
        }

        .animate-today-glow {
          animation: today-flash 1.2s ease-in-out infinite alternate;
        }

        /* Pause all animations on poster hover */
        .group\\/poster:hover .animate-reel,
        .group\\/poster:hover .animate-sprockets,
        .group\\/poster:hover .animate-radar {
          animation-play-state: paused !important;
        }

        /* Accessibility: prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-reel,
          .animate-sprockets,
          .animate-flicker,
          .animate-radar,
          .animate-today-glow {
            animation: none !important;
          }
        }
      `}</style>

      {/* Aged Paper Vignette & Film Grain Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(247,244,236,0.92)_0%,rgba(235,229,218,0.85)_55%,rgba(209,200,183,0.92)_100%)]"
        aria-hidden="true"
      />

      {/* Decorative Vintage Poster Inner Hairline Border & Registration Marks */}
      <div
        className="pointer-events-none absolute inset-3 rounded-2xl border border-[#a89d87]/45"
        aria-hidden="true"
      >
        <div className="absolute left-2 top-2 font-mono text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#786d58]">
          + CBM ARCHIVE // 35MM LEADER
        </div>
        <div className="absolute right-2 top-2 font-mono text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#786d58]">
          EMULSION SPEED: 24 FPS +
        </div>
        <div className="absolute right-2 bottom-2 font-mono text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#786d58]">
          TRANSMISSION COUNTDOWN // 04
        </div>
        <div className="absolute left-2 bottom-2 font-mono text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#786d58]">
          SOUNDTRACK OPTICAL HEAD
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        
        {/* Poster Top Bar: Title & Onboarding Hook */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#302a22]/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black px-3 py-0.5 font-mono text-[0.62rem] font-black uppercase tracking-[0.22em] text-[#04b093]">
                AIRWAVES COUNTDOWN
              </span>
              <span className="font-mono text-[0.68rem] font-black uppercase tracking-wider text-[#635745]">
                ORIGINAL SHOW ONBOARDING
              </span>
            </div>
            <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#1a1714] sm:text-3xl">
              HOW YOUR SHOW GOES LIVE
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-[#5a4e3e]">
              From initial concept to on-air transmission — the four-stage countdown to launching your voice on CBM Radio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white/70 px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-black shadow-sm">
              <span className="size-2 rounded-full bg-[#04b093] animate-pulse" />
              {isPaused ? "PAUSED (HOVERING)" : `NOW COUNTING: [ ${STAGES[activeStage].badge} ]`}
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-black px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#04b093] shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Pitch Your Show</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Poster Body: Grid with 4 Steps on Left and Vintage Film-Reel Stage on Right */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* =========================================================================
              LEFT COLUMN: 4 STEP DESCRIPTIONS ALIGNED WITH EACH FRAME
              3 = PITCH: Send us your original show concept.
              2 = REVIEW: Our team reviews your idea and audio sample.
              1 = PILOT: Record a pilot episode with our studio.
              TODAY = LIVE ON CBM RADIO: Your show goes on air.
              ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 order-2 lg:order-1">
            {STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              const isToday = stage.badge === "TODAY";
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setActiveStage(idx);
                    setIsPaused(true);
                  }}
                  className={`group/card text-left rounded-2xl border-2 transition-all duration-300 p-3.5 sm:p-4 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "border-black bg-white shadow-[5px_5px_0_0_rgba(0,0,0,1)] translate-x-1"
                      : "border-black/25 bg-black/[0.03] hover:border-black/60 hover:bg-white/50 hover:translate-x-0.5"
                  }`}
                >
                  {/* Subtle stage indicator strip on active */}
                  {isActive && (
                    <div
                      className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                        isToday ? "bg-[#04b093]" : "bg-black"
                      }`}
                    />
                  )}

                  <div className="flex items-start gap-3.5">
                    {/* Badge circle styled like vintage film leader countdown stamp */}
                    <div
                      className={`flex shrink-0 items-center justify-center rounded-xl font-mono font-black transition-all ${
                        isToday
                          ? isActive
                            ? "bg-[#04b093] text-black ring-2 ring-black px-2.5 h-10 text-xs shadow-md"
                            : "bg-black text-[#04b093] px-2.5 h-10 text-[0.7rem]"
                          : isActive
                          ? "bg-black text-[#04b093] size-10 text-base shadow-md"
                          : "bg-black/15 text-black size-10 text-sm border border-black/20"
                      }`}
                    >
                      {stage.badge}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[0.62rem] font-bold uppercase tracking-widest text-[#726450]">
                          {stage.subtext}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 font-mono text-[0.58rem] font-black uppercase text-[#04b093] bg-black px-2 py-0.5 rounded-full">
                            <span className="size-1 rounded-full bg-[#04b093] animate-ping" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-baseline gap-1.5">
                        <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-black">
                          <span className="font-mono text-xs sm:text-sm text-[#726450] mr-1">{stage.badge} =</span>
                          {stage.name}:
                        </h4>
                        <span className="text-xs sm:text-sm font-bold text-black/90 truncate">
                          {stage.tagline}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#524638] leading-relaxed line-clamp-2">
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Quick Helper Note */}
            <div className="mt-1 flex items-center justify-between px-2 pt-1 font-mono text-[0.62rem] text-[#6e604d]">
              <span>* Click any stage or hover to inspect details</span>
              <span>100% INDEPENDENT AIRWAVES</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: VINTAGE FILM-REEL & S-CURVE ANIMATED POSTER CANVAS
              - Top-Left: Large silver-grey metal film reel, tilted & partly cut off
              - Black film strip leaving reel, curling in 3D S-curve toward bottom-right
              - Strip expands wider (perspective 3D coming toward viewer)
              - White rounded sprocket holes along both edges
              - 4 Frames: "3", "2", "1", "TODAY"
              ========================================================================= */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex items-center justify-center">
            
            {/* The SVG Cinematic Poster Stage */}
            <div className="relative w-full aspect-[16/11] max-h-[500px] rounded-2xl bg-[#f2ede2] border-2 border-black/30 shadow-inner overflow-hidden select-none">
              
              {/* Soft Vignette Inside Canvas */}
              <div
                className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_40%_40%,transparent_40%,rgba(195,183,163,0.5)_95%)]"
                aria-hidden="true"
              />

              {/* Live Projector Light Beam Pulse on Canvas */}
              <div
                className={`pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-[#04b093]/15 blur-3xl transition-opacity duration-700 ${
                  activeStage === 3 ? "opacity-100 scale-125" : "opacity-35 scale-100"
                }`}
                aria-hidden="true"
              />

              <svg
                viewBox="0 0 960 620"
                className="relative z-10 w-full h-full block"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Metallic Bevel Gradient for Reel Rim */}
                  <linearGradient id="metalRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c3038" />
                    <stop offset="25%" stopColor="#cfd4dc" />
                    <stop offset="50%" stopColor="#8d939c" />
                    <stop offset="75%" stopColor="#f4f6f8" />
                    <stop offset="100%" stopColor="#41464e" />
                  </linearGradient>

                  {/* Brushed Metal Hub Gradient */}
                  <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#bcc1c9" />
                    <stop offset="70%" stopColor="#636974" />
                    <stop offset="100%" stopColor="#2e333b" />
                  </radialGradient>

                  {/* Wound Celluloid Film Spool Gradient */}
                  <radialGradient id="woundFilmGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#221c17" />
                    <stop offset="65%" stopColor="#15120f" />
                    <stop offset="100%" stopColor="#080706" />
                  </radialGradient>

                  {/* Dark Photographic Sepia Frame Base Gradient */}
                  <linearGradient id="sepiaFrameBase" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#30261e" />
                    <stop offset="50%" stopColor="#221a14" />
                    <stop offset="100%" stopColor="#14100c" />
                  </linearGradient>

                  {/* Today Gold-Teal Highlight Gradient */}
                  <linearGradient id="todayFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#382d20" />
                    <stop offset="60%" stopColor="#201a14" />
                    <stop offset="100%" stopColor="#0b1b17" />
                  </linearGradient>

                  {/* Drop Shadow for the 3D Film Strip */}
                  <filter id="stripShadow" x="-20%" y="-20%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#1e1812" floodOpacity="0.45" />
                  </filter>

                  {/* Soft projector glow filter */}
                  <filter id="projectorGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* =================================================================
                    01 // THE 3D S-CURVE BLACK FILM STRIP
                    Leaves reel around (160, 160), sweeps to (880, 560)
                    Wider as it reaches the bottom (perspective effect)
                    ================================================================= */}
                {/* 3D Drop Shadow Polygon */}
                <path
                  d="M 160,195 C 290,205 380,240 480,315 C 590,395 700,470 820,530 L 920,580 L 870,640 L 760,570 C 650,510 540,430 440,355 C 340,285 240,245 160,235 Z"
                  fill="#1f1812"
                  opacity="0.25"
                  filter="blur(10px)"
                />

                {/* Main Black Celluloid Film Strip Body (Expanding Perspective Polygon) */}
                <path
                  d="M 155,170 C 285,185 375,225 470,295 C 585,380 690,455 810,515 L 900,560 L 850,620 L 750,555 C 635,495 530,420 430,340 C 330,265 235,225 155,210 Z"
                  fill="#151413"
                  stroke="#38332c"
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_12px_16px_rgba(20,15,10,0.35)]"
                />

                {/* Upper Sprocket Rail Guide Line & Sprocket Holes (Forward Continuous Crawl) */}
                <path
                  d="M 155,178 C 285,193 375,233 470,303 C 585,388 690,463 810,523 L 900,568"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeDasharray="9, 9"
                  strokeLinecap="round"
                  className="animate-sprockets opacity-90"
                />

                {/* Lower Sprocket Rail Guide Line & Sprocket Holes (Forward Continuous Crawl) */}
                <path
                  d="M 155,202 C 235,217 330,257 430,332 C 530,412 635,487 750,547 L 850,612"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeDasharray="12, 12"
                  strokeLinecap="round"
                  className="animate-sprockets opacity-90"
                />

                {/* Optical Audio Track Stripe (Authentic 35mm Feature) */}
                <path
                  d="M 155,185 C 285,200 375,240 470,310 C 585,395 690,470 810,530 L 900,575"
                  fill="none"
                  stroke="#04b093"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  strokeDasharray="2, 4"
                />

                {/* =================================================================
                    02 // THE 4 COUNTDOWN FRAMES ON THE FILM STRIP
                    In order from reel downward:
                    1. "3": Smallest & furthest away
                    2. "2": Circular film-leader ring around it
                    3. "1": Thin circle with crosshair lines (classic Academy Leader)
                    4. "TODAY": Largest at bottom, quadrants with crosshairs & bold serif
                    ================================================================= */}

                {/* -------------------------------------------------------------
                    FRAME 1 = "3" (PITCH)
                    Coordinates: x=245, y=198, angle=18deg, scale ~0.68
                    ------------------------------------------------------------- */}
                <g
                  transform="translate(245, 198) rotate(18) scale(0.68)"
                  className={`cursor-pointer transition-transform duration-500 ${
                    activeStage === 0 ? "scale-[0.78]" : "opacity-85"
                  }`}
                  onClick={() => {
                    setActiveStage(0);
                    setIsPaused(true);
                  }}
                >
                  {/* Outer Frame Border */}
                  <rect
                    x="-42"
                    y="-30"
                    width="84"
                    height="60"
                    rx="3"
                    fill="url(#sepiaFrameBase)"
                    stroke={activeStage === 0 ? "#04b093" : "#625343"}
                    strokeWidth={activeStage === 0 ? "3" : "1.5"}
                    className={activeStage === 0 ? "animate-flicker" : ""}
                  />
                  {/* Sepia Vignette Inner Box */}
                  <rect x="-38" y="-26" width="76" height="52" fill="#1b1510" opacity="0.6" />
                  
                  {/* Subtle Grain / Film Border lines */}
                  <line x1="-36" y1="-26" x2="-36" y2="26" stroke="#4a3e32" strokeWidth="0.8" />
                  <line x1="36" y1="-26" x2="36" y2="26" stroke="#4a3e32" strokeWidth="0.8" />

                  {/* Big Black/Dark Sepia Number "3" */}
                  <text
                    x="0"
                    y="11"
                    textAnchor="middle"
                    fill={activeStage === 0 ? "#ffffff" : "#c4b5a2"}
                    fontFamily="serif"
                    fontWeight="900"
                    fontSize="34"
                    letterSpacing="1"
                  >
                    3
                  </text>

                  {/* Stage Label */}
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    fill={activeStage === 0 ? "#04b093" : "#80705e"}
                    fontFamily="monospace"
                    fontWeight="bold"
                    fontSize="7"
                    letterSpacing="1.5"
                  >
                    PITCH
                  </text>
                </g>

                {/* -------------------------------------------------------------
                    FRAME 2 = "2" (REVIEW)
                    Coordinates: x=395, y=258, angle=30deg, scale ~0.88
                    Circular film-leader ring around the "2"
                    ------------------------------------------------------------- */}
                <g
                  transform="translate(395, 258) rotate(30) scale(0.88)"
                  className={`cursor-pointer transition-transform duration-500 ${
                    activeStage === 1 ? "scale-[0.98]" : "opacity-85"
                  }`}
                  onClick={() => {
                    setActiveStage(1);
                    setIsPaused(true);
                  }}
                >
                  {/* Outer Frame Border */}
                  <rect
                    x="-50"
                    y="-36"
                    width="100"
                    height="72"
                    rx="4"
                    fill="url(#sepiaFrameBase)"
                    stroke={activeStage === 1 ? "#04b093" : "#6e5d4b"}
                    strokeWidth={activeStage === 1 ? "3.5" : "1.8"}
                    className={activeStage === 1 ? "animate-flicker" : ""}
                  />
                  <rect x="-45" y="-31" width="90" height="62" fill="#1b1510" opacity="0.6" />

                  {/* Circular Film-Leader Ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r="23"
                    fill="none"
                    stroke={activeStage === 1 ? "#04b093" : "#8a7863"}
                    strokeWidth="2.5"
                    strokeDasharray="6, 3"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="27"
                    fill="none"
                    stroke="#594b3c"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />

                  {/* Big Number "2" inside Ring */}
                  <text
                    x="0"
                    y="11"
                    textAnchor="middle"
                    fill={activeStage === 1 ? "#ffffff" : "#ded1be"}
                    fontFamily="serif"
                    fontWeight="900"
                    fontSize="36"
                  >
                    2
                  </text>

                  {/* Subtitle */}
                  <text
                    x="0"
                    y="-23"
                    textAnchor="middle"
                    fill={activeStage === 1 ? "#04b093" : "#80705e"}
                    fontFamily="monospace"
                    fontWeight="bold"
                    fontSize="7"
                    letterSpacing="1.8"
                  >
                    REVIEW
                  </text>
                </g>

                {/* -------------------------------------------------------------
                    FRAME 3 = "1" (PILOT)
                    Coordinates: x=580, y=378, angle=36deg, scale ~1.12
                    Bigger "1" inside thin circle with crosshair lines
                    ------------------------------------------------------------- */}
                <g
                  transform="translate(580, 378) rotate(36) scale(1.12)"
                  className={`cursor-pointer transition-transform duration-500 ${
                    activeStage === 2 ? "scale-[1.22]" : "opacity-90"
                  }`}
                  onClick={() => {
                    setActiveStage(2);
                    setIsPaused(true);
                  }}
                >
                  {/* Outer Frame Border */}
                  <rect
                    x="-58"
                    y="-42"
                    width="116"
                    height="84"
                    rx="5"
                    fill="url(#sepiaFrameBase)"
                    stroke={activeStage === 2 ? "#04b093" : "#7d6b56"}
                    strokeWidth={activeStage === 2 ? "4" : "2"}
                    className={activeStage === 2 ? "animate-flicker" : ""}
                  />
                  <rect x="-52" y="-36" width="104" height="72" fill="#18130e" opacity="0.65" />

                  {/* Classic Academy Leader Crosshair Lines */}
                  <line x1="-50" y1="0" x2="50" y2="0" stroke="#72614e" strokeWidth="1" strokeDasharray="3, 3" />
                  <line x1="0" y1="-34" x2="0" y2="34" stroke="#72614e" strokeWidth="1" strokeDasharray="3, 3" />

                  {/* Thin Circle with Crosshair Lines */}
                  <circle
                    cx="0"
                    cy="0"
                    r="27"
                    fill="none"
                    stroke={activeStage === 2 ? "#04b093" : "#9e8c75"}
                    strokeWidth="2"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="31"
                    fill="none"
                    stroke="#504336"
                    strokeWidth="1"
                    strokeDasharray="4, 4"
                  />

                  {/* Radar sweep indicator when active */}
                  {activeStage === 2 && (
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-27"
                      stroke="#04b093"
                      strokeWidth="2"
                      className="animate-radar"
                    />
                  )}

                  {/* Bigger "1" inside Circle */}
                  <text
                    x="0"
                    y="13"
                    textAnchor="middle"
                    fill={activeStage === 2 ? "#ffffff" : "#ede2d2"}
                    fontFamily="serif"
                    fontWeight="900"
                    fontSize="42"
                  >
                    1
                  </text>

                  {/* Subtitle */}
                  <text
                    x="0"
                    y="29"
                    textAnchor="middle"
                    fill={activeStage === 2 ? "#04b093" : "#8c7c6a"}
                    fontFamily="monospace"
                    fontWeight="bold"
                    fontSize="7.5"
                    letterSpacing="2"
                  >
                    PILOT
                  </text>
                </g>

                {/* -------------------------------------------------------------
                    FRAME 4 = "TODAY" (LIVE ON CBM RADIO)
                    Coordinates: x=800, y=525, angle=38deg, scale ~1.45
                    Largest frame at bottom, blank sepia divided by crosshair lines,
                    with "TODAY" in bold dark serif capitals across the middle,
                    and subtitle underneath. Pauses with soft glow and flash!
                    ------------------------------------------------------------- */}
                <g
                  transform="translate(800, 525) rotate(38) scale(1.45)"
                  className={`cursor-pointer transition-all duration-700 ${
                    activeStage === 3
                      ? "scale-[1.58] animate-today-glow"
                      : "opacity-95"
                  }`}
                  onClick={() => {
                    setActiveStage(3);
                    setIsPaused(true);
                  }}
                >
                  {/* Outer Frame with Glow and Flash */}
                  <rect
                    x="-68"
                    y="-48"
                    width="136"
                    height="96"
                    rx="6"
                    fill="url(#todayFrameGrad)"
                    stroke={activeStage === 3 ? "#04b093" : "#99856f"}
                    strokeWidth={activeStage === 3 ? "4.5" : "2.5"}
                    className={activeStage === 3 ? "animate-flicker" : ""}
                  />

                  {/* Frame Divided into Quadrants by Thin Crosshairs Lines */}
                  <rect x="-62" y="-42" width="124" height="84" fill="#13110d" opacity="0.6" />
                  
                  {/* Horizontal Crosshair Line */}
                  <line
                    x1="-62"
                    y1="0"
                    x2="62"
                    y2="0"
                    stroke={activeStage === 3 ? "#04b093" : "#6b5c4b"}
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                  />
                  {/* Vertical Crosshair Line */}
                  <line
                    x1="0"
                    y1="-42"
                    x2="0"
                    y2="42"
                    stroke={activeStage === 3 ? "#04b093" : "#6b5c4b"}
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                  />

                  {/* Concentric Countdown Rings */}
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill="none"
                    stroke={activeStage === 3 ? "#04b093" : "#5a4d3e"}
                    strokeWidth="1.2"
                    strokeDasharray="4, 3"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="38"
                    fill="none"
                    stroke="#42372c"
                    strokeWidth="0.8"
                  />

                  {/* "TODAY" in Bold Dark Serif Capitals across the middle */}
                  <text
                    x="0"
                    y="7"
                    textAnchor="middle"
                    fill={activeStage === 3 ? "#ffffff" : "#f5eee3"}
                    fontFamily="serif"
                    fontWeight="900"
                    fontSize="27"
                    letterSpacing="3"
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    TODAY
                  </text>

                  {/* Small Subtitle Underneath */}
                  <text
                    x="0"
                    y="22"
                    textAnchor="middle"
                    fill={activeStage === 3 ? "#04b093" : "#a89985"}
                    fontFamily="monospace"
                    fontWeight="900"
                    fontSize="6.5"
                    letterSpacing="1.8"
                  >
                    LIVE ON CBM RADIO
                  </text>

                  {/* Transmission ON-AIR badge when active */}
                  {activeStage === 3 && (
                    <g transform="translate(0, -26)">
                      <rect
                        x="-30"
                        y="-8"
                        width="60"
                        height="14"
                        rx="7"
                        fill="#04b093"
                        stroke="#000000"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill="#000000"
                        fontFamily="monospace"
                        fontWeight="900"
                        fontSize="6.5"
                        letterSpacing="1.2"
                      >
                        ON AIR NOW
                      </text>
                    </g>
                  )}
                </g>

                {/* =================================================================
                    03 // TOP-LEFT: LARGE SILVER-GREY METAL FILM REEL
                    Tilted in perspective & partly cut off by top-left edge
                    Centre hub with 6 big oval cut-out holes, 3D rim and shadow
                    Slowly & steadily rotating in sync with strip speed
                    ================================================================= */}
                {/* Reel Cast Shadow on Paper */}
                <circle
                  cx="85"
                  cy="65"
                  r="165"
                  fill="#2a231b"
                  opacity="0.3"
                  filter="blur(16px)"
                />

                {/* Rotating Reel Assembly */}
                <g className="animate-reel">
                  {/* Coiled Film Bulk visible behind flange */}
                  <circle cx="85" cy="65" r="148" fill="url(#woundFilmGrad)" />
                  <circle cx="85" cy="65" r="142" fill="none" stroke="#2a221a" strokeWidth="6" strokeDasharray="5, 3" />
                  <circle cx="85" cy="65" r="128" fill="none" stroke="#1d1712" strokeWidth="5" strokeDasharray="4, 4" />
                  <circle cx="85" cy="65" r="114" fill="none" stroke="#251e17" strokeWidth="4" strokeDasharray="3, 3" />

                  {/* Outer Metallic Flange Rim with 3D Bevel */}
                  <circle
                    cx="85"
                    cy="65"
                    r="155"
                    fill="none"
                    stroke="url(#metalRimGrad)"
                    strokeWidth="16"
                  />
                  <circle
                    cx="85"
                    cy="65"
                    r="163"
                    fill="none"
                    stroke="#1c1f24"
                    strokeWidth="2"
                  />
                  <circle
                    cx="85"
                    cy="65"
                    r="147"
                    fill="none"
                    stroke="#23272e"
                    strokeWidth="2"
                  />

                  {/* Outer Rim Silver Rivet Studs (12 around the edge) */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const rx = 85 + 155 * Math.cos(rad);
                    const ry = 65 + 155 * Math.sin(rad);
                    return (
                      <circle
                        key={deg}
                        cx={rx}
                        cy={ry}
                        r="2.5"
                        fill="#e9ecf0"
                        stroke="#383c44"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* 6 BIG OVAL CUT-OUT HOLES (60-degree increments) */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const cx = 85 + 84 * Math.cos(rad);
                    const cy = 65 + 84 * Math.sin(rad);
                    return (
                      <g key={deg} transform={`rotate(${deg}, 85, 65)`}>
                        {/* Oval Cutout Drop Shadow */}
                        <ellipse
                          cx={85 + 84}
                          cy={65}
                          rx="34"
                          ry="22"
                          fill="#0e0c0a"
                          stroke="#1a1e24"
                          strokeWidth="2.5"
                        />
                        {/* 3D Bevel Highlight Rim on Oval */}
                        <ellipse
                          cx={85 + 84}
                          cy={65}
                          rx="36"
                          ry="24"
                          fill="none"
                          stroke="url(#metalRimGrad)"
                          strokeWidth="2.5"
                          strokeOpacity="0.85"
                        />
                      </g>
                    );
                  })}

                  {/* Center Metallic Spindle Hub */}
                  <circle
                    cx="85"
                    cy="65"
                    r="44"
                    fill="url(#hubGrad)"
                    stroke="#1e2229"
                    strokeWidth="3"
                  />
                  <circle
                    cx="85"
                    cy="65"
                    r="38"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                  />
                  
                  {/* Axle Spindle Notch & Keyway */}
                  <circle cx="85" cy="65" r="16" fill="#111317" stroke="#484f5c" strokeWidth="2" />
                  <rect x="82" y="47" width="6" height="8" rx="1" fill="#111317" />
                  
                  {/* 3 Hub Mounting Screws */}
                  {[0, 120, 240].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const sx = 85 + 28 * Math.cos(rad);
                    const sy = 65 + 28 * Math.sin(rad);
                    return (
                      <circle
                        key={deg}
                        cx={sx}
                        cy={sy}
                        r="2.5"
                        fill="#cfd4dc"
                        stroke="#1c1f24"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                </g>

                {/* Where the film leaves the reel: Lower-right reel tangential roll guide */}
                <circle cx="168" cy="184" r="7" fill="#69717d" stroke="#1c1f24" strokeWidth="1.5" />
                <circle cx="168" cy="184" r="2" fill="#e9ecf0" />
              </svg>

              {/* Bottom Right Live Indicator Stamp */}
              <div className="absolute right-3 bottom-3 z-20 flex items-center gap-2 rounded-lg border border-black/30 bg-black/80 px-2.5 py-1 font-mono text-[0.62rem] font-bold text-white shadow-md backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#04b093] animate-ping" />
                <span className="text-[#04b093]">35MM REEL SIMULATOR</span>
                <span className="text-zinc-400">| 24 FPS</span>
              </div>
            </div>

          </div>

        </div>

        {/* Poster Footer Action Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#302a22]/15 pt-5">
          <div className="flex items-center gap-3 text-xs text-[#5c503f]">
            <span className="font-mono text-[0.65rem] font-black uppercase text-black bg-[#d9d0be] px-2.5 py-0.5 rounded">
              BROADCAST CRITERIA
            </span>
            <span className="font-medium">
              Open to East African podcasters, DJs, gospel storytellers, youth hosts & journalists.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shows"
              className="font-mono text-xs font-black uppercase tracking-wider text-black hover:text-[#04b093] transition-colors underline underline-offset-4"
            >
              Browse Existing Shows
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#04b093] px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Submit Concept</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
