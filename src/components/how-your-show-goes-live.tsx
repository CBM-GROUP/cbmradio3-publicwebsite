"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Radio, Mic, Sparkles, Send, CheckCircle2 } from "lucide-react";

// =========================================================================
// COUNTDOWN STEPS CONFIGURATION
// 4 Frames: "3", "2", "1", "TODAY"
// =========================================================================
interface CountdownFrame {
  id: number;
  count: string;
  phase: string;
  title: string;
  description: string;
  tag: string;
  icon: typeof Mic;
  timeEstimate: string;
}

const COUNTDOWN_FRAMES: CountdownFrame[] = [
  {
    id: 1,
    count: "3",
    phase: "PITCH",
    title: "Send Us Your Original Show Concept",
    description:
      "Submit your initial treatment, format outline, musical or spoken-word style, and creative vision to our station board.",
    tag: "STAGE 01 // SUBMISSION",
    icon: Send,
    timeEstimate: "STEP 01",
  },
  {
    id: 2,
    count: "2",
    phase: "REVIEW",
    title: "Our Team Reviews Your Idea & Audio Sample",
    description:
      "Our station producers evaluate your creative hook, host dynamics, cultural resonance, and 3-minute sample demo tape.",
    tag: "STAGE 02 // CURATION",
    icon: CheckCircle2,
    timeEstimate: "STEP 02",
  },
  {
    id: 3,
    count: "1",
    phase: "PILOT",
    title: "Record a Pilot Episode with Our Studio",
    description:
      "Step into the CBM Radio booth or submit stem recordings for professional audio mixing, jingle beds, and mastering.",
    tag: "STAGE 03 // PRODUCTION",
    icon: Mic,
    timeEstimate: "STEP 03",
  },
  {
    id: 4,
    count: "TODAY",
    phase: "LIVE ON CBM RADIO",
    title: "Your Show Goes Live on the Airwaves",
    description:
      "Your premiere broadcast hits the live FM stream, syndication airwaves, and lands permanently in our on-demand episode crate.",
    tag: "STAGE 04 // TRANSMISSION",
    icon: Radio,
    timeEstimate: "ON AIR NOW",
  },
];

export default function HowYourShowGoesLive() {
  const [activeFrame, setActiveFrame] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 8-second projector rotation cycle (each frame lights up for ~2 seconds in turn)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % COUNTDOWN_FRAMES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="how-your-show-goes-live"
      aria-label="How Your Show Goes Live"
      className="group/section relative scroll-mt-20 border-b-2 border-black bg-[#060c18] px-4 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          01 // CSS ANIMATIONS & GPU-ACCELERATED KEYFRAMES
          - Vintage Film Reel Continuous Rotation
          - Authentic 35mm Sprocket Perforation Continuous Motion
          - Cinema Projector 24fps Light Flicker & Grain
          - Academy Leader Countdown Crosshair Radar Sweep
          - Hover Pause & Prefers-Reduced-Motion Handling
          ========================================================================= */}
      <style>{`
        /* Continuous Film Reel Rotation (in sync with strip motion) */
        @keyframes reel-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Continuous Sprocket Hole Crawl (Horizontal) */
        @keyframes sprocket-crawl-h {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 48px 0px;
          }
        }

        /* Continuous Sprocket Hole Crawl (Vertical for Mobile) */
        @keyframes sprocket-crawl-v {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 0px 48px;
          }
        }

        /* Vintage 24fps Projector Bulb Flicker & Grain */
        @keyframes projector-flicker {
          0%, 100% {
            opacity: 0.98;
            filter: brightness(1) contrast(1);
          }
          20% {
            opacity: 0.92;
            filter: brightness(1.07) contrast(1.04);
          }
          40% {
            opacity: 0.99;
            filter: brightness(0.96) contrast(0.98);
          }
          60% {
            opacity: 0.94;
            filter: brightness(1.04) contrast(1.02);
          }
          80% {
            opacity: 1;
            filter: brightness(0.98) contrast(1);
          }
        }

        /* Academy Leader Target Radar Sweep */
        @keyframes radar-sweep {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Subtle Cinema Film Grain Simulation */
        @keyframes grain-drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2%, 2%); }
          50% { transform: translate(2%, -1%); }
          75% { transform: translate(-1%, -2%); }
        }

        .animate-reel-spin {
          animation: reel-spin 10s linear infinite;
          transform-origin: center center;
          will-change: transform;
        }

        .animate-projector-flicker {
          animation: projector-flicker 0.22s infinite;
        }

        .animate-radar-sweep {
          animation: radar-sweep 2s linear infinite;
          transform-origin: center center;
        }

        /* Authentic 35mm Cinema Sprocket Holes (Rounded Rectangles with Inner Punch) */
        .cinema-sprocket-h {
          background-image: 
            radial-gradient(ellipse at center, #ffffff 45%, #e2e8f0 55%, transparent 60%);
          background-size: 24px 14px;
          background-repeat: repeat-x;
          animation: sprocket-crawl-h 1.2s linear infinite;
        }

        .cinema-sprocket-v {
          background-image: 
            radial-gradient(ellipse at center, #ffffff 45%, #e2e8f0 55%, transparent 60%);
          background-size: 14px 24px;
          background-repeat: repeat-y;
          animation: sprocket-crawl-v 1.2s linear infinite;
        }

        /* Pause all motion on container hover */
        .group\\/section:hover .animate-reel-spin,
        .group\\/section:hover .cinema-sprocket-h,
        .group\\/section:hover .cinema-sprocket-v,
        .group\\/section:hover .animate-radar-sweep {
          animation-play-state: paused !important;
        }

        /* Accessibility: Disable motion for users with reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-reel-spin,
          .animate-projector-flicker,
          .animate-radar-sweep,
          .cinema-sprocket-h,
          .cinema-sprocket-v {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient Deep Navy / Teal Projector Lens Flare */}
      <div
        className="pointer-events-none absolute -left-36 top-1/4 h-[550px] w-[550px] rounded-full bg-[#04b093]/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-36 bottom-1/4 h-[550px] w-[550px] rounded-full bg-[#04b093]/15 blur-[150px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* =========================================================================
            02 // SECTION HEADER
            - Small monospace label above heading
            - Big bold uppercase heading
            - One-line description under the heading
            ========================================================================= */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-zinc-800 pb-8">
          <div>
            {/* Small Monospace Label Above Heading */}
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#04b093] bg-black/60 px-3 py-1 border border-[#04b093]/40 rounded-full shadow-[0_0_12px_rgba(4,176,147,0.25)] flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-[#04b093] animate-pulse" />
                BROADCAST PIPELINE // AIRWAVES COUNTDOWN
              </span>
            </div>

            {/* Section Heading */}
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              HOW YOUR SHOW GOES LIVE
            </h2>

            {/* One-Line Description Under Heading */}
            <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-zinc-300 max-w-2xl">
              From initial concept to on-air transmission—the four-stage countdown to launching your original show on CBM Radio.
            </p>
          </div>

          {/* Action Pitch Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#04b093] bg-[#04b093] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:border-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(4,176,147,0.35)] cursor-pointer"
            >
              <span>Submit Show Pitch</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            03 // VINTAGE FILM REEL & FILM STRIP VISUAL STAGE
            - Film Reel (SVG) at top-left rotating continuously
            - Black film strip coming out of the reel, with white sprocket holes along both edges
            - Curving across the section into 4 Countdown Frames
            ========================================================================= */}
        <div className="relative rounded-3xl border-2 border-zinc-800/90 bg-[#080f1e] p-4 sm:p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          
          {/* Top Cinema Metadata Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex size-3 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase">
                35MM STUDIO REEL // ACADEMY LEADER COUNTDOWN
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#04b093] bg-black/60 px-3 py-1 rounded-full border border-zinc-800">
              <span className="text-zinc-400">PROJECTOR BEAM:</span>
              <span className="font-bold text-white uppercase">
                {isPaused ? "PAUSED ON HOVER" : `FRAME ${activeFrame + 1} ACTIVE (2S INTERVAL)`}
              </span>
            </div>
          </div>

          {/* Reel + Curving Film Strip Ribbon Flow */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            
            {/* -------------------------------------------------------------
                A) VINTAGE 35MM FILM REEL (SVG) AT TOP-LEFT
                Rotates smoothly in sync with the film strip
                ------------------------------------------------------------- */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative flex items-center justify-center p-2">
                {/* Cinema Projector Backlight Glow */}
                <div className="absolute inset-0 rounded-full bg-[#04b093]/20 blur-xl" />

                {/* Film Reel SVG with 6 Cinema Spoke Cutouts & Wound Film */}
                <svg
                  className="animate-reel-spin relative z-10 size-36 sm:size-44 lg:size-48 drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)]"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Vintage Rotating 35mm Cinema Film Reel"
                >
                  {/* Outer Rim Flange */}
                  <circle cx="100" cy="100" r="95" stroke="#1f293d" strokeWidth="6" fill="#0d1424" />
                  <circle cx="100" cy="100" r="92" stroke="#04b093" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                  {/* Wound Film Layer between reel flanges */}
                  <circle cx="100" cy="100" r="76" fill="#090d16" stroke="#2a3b5c" strokeWidth="2" />
                  <circle cx="100" cy="100" r="74" stroke="#04b093" strokeWidth="0.8" opacity="0.3" strokeDasharray="4 2" />

                  {/* 6 Cinema Reel Spokes and Flange Cutouts */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <g key={deg} transform={`rotate(${deg} 100 100)`}>
                      <path
                        d="M 88,40 C 94,36 106,36 112,40 L 118,65 C 108,68 92,68 82,65 Z"
                        fill="#05080f"
                        stroke="#04b093"
                        strokeWidth="1.2"
                        opacity="0.85"
                      />
                      {/* Perimeter Rivets on Flange */}
                      <circle cx="100" cy="18" r="2.5" fill="#04b093" opacity="0.8" />
                    </g>
                  ))}

                  {/* Inner Hub Flange */}
                  <circle cx="100" cy="100" r="32" fill="#131b2e" stroke="#04b093" strokeWidth="2.5" />
                  
                  {/* 3 Center Drive Spindle Holes */}
                  <circle cx="100" cy="100" r="14" fill="#060c18" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="100" cy="85" r="3.5" fill="#ffffff" />
                  <circle cx="87" cy="107" r="3.5" fill="#ffffff" />
                  <circle cx="113" cy="107" r="3.5" fill="#ffffff" />
                </svg>

                {/* Fixed Center Spindle Axle Cap */}
                <div className="absolute z-20 size-7 rounded-full bg-black border-2 border-[#04b093] shadow-[0_0_12px_#04b093] flex items-center justify-center pointer-events-none">
                  <div className="size-2 rounded-full bg-white" />
                </div>
              </div>

              {/* Reel Meta Caption */}
              <div className="mt-3 text-center">
                <span className="block font-mono text-[0.68rem] font-bold text-zinc-400 uppercase tracking-widest">
                  MASTER FEED REEL
                </span>
                <span className="text-[0.62rem] font-mono text-[#04b093]">
                  24 FPS // OPTICAL SOUND
                </span>
              </div>
            </div>

            {/* -------------------------------------------------------------
                B) FILM STRIP RUNNING & CURVING ACROSS THE SECTION
                - Black film strip with white sprocket holes along both edges
                - Seamless continuous loop motion
                - Desktop: Horizontal film track with top & bottom sprocket holes
                - Mobile: Vertical stacked film strip with side sprocket rails
                ------------------------------------------------------------- */}
            <div className="relative w-full flex-1 overflow-hidden">
              
              {/* Outer Film Strip Casing */}
              <div className="relative rounded-2xl bg-black border-2 border-zinc-800 shadow-[inset_0_2px_20px_rgba(0,0,0,0.95)]">
                
                {/* TOP SPROCKET HOLES TRACK (Desktop & Tablet) */}
                <div
                  className="hidden md:block h-6 w-full border-b border-zinc-800/80 bg-zinc-950 cinema-sprocket-h"
                  aria-hidden="true"
                />

                {/* FILM STRIP INTERIOR: 4 COUNTDOWN FRAMES */}
                <div className="relative p-3 sm:p-5 md:p-6">
                  
                  {/* Mobile Left & Right Sprocket Rails */}
                  <div className="block md:hidden absolute left-1 top-0 bottom-0 w-3.5 cinema-sprocket-v opacity-60 pointer-events-none" />
                  <div className="block md:hidden absolute right-1 top-0 bottom-0 w-3.5 cinema-sprocket-v opacity-60 pointer-events-none" />

                  {/* 4 Movie Countdown Frames */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 px-4 md:px-0">
                    {COUNTDOWN_FRAMES.map((frame, idx) => {
                      const isCurrent = activeFrame === idx;
                      const isToday = frame.count === "TODAY";
                      const IconComponent = frame.icon;

                      return (
                        <div
                          key={frame.id}
                          onClick={() => setActiveFrame(idx)}
                          className={`group/frame relative cursor-pointer rounded-2xl border-2 transition-all duration-500 p-5 overflow-hidden ${
                            isCurrent
                              ? isToday
                                ? "border-[#04b093] bg-gradient-to-b from-[#0a2628] via-[#051719] to-[#030e12] shadow-[0_0_40px_rgba(4,176,147,0.55)] scale-[1.03] -translate-y-1.5 z-20 ring-2 ring-[#04b093]"
                                : "border-[#04b093]/80 bg-gradient-to-b from-[#0f2130] via-[#091522] to-[#060e18] shadow-[0_0_28px_rgba(4,176,147,0.35)] scale-[1.02] -translate-y-1 z-20 ring-1 ring-[#04b093]/80"
                              : "border-zinc-800/90 bg-[#090e18]/90 text-zinc-300 hover:border-zinc-700 hover:bg-[#0c1424] hover:scale-[1.01] z-10"
                          }`}
                        >
                          {/* Subtle Vintage Projector Grain / Flicker Overlay when illuminated */}
                          {isCurrent && (
                            <div className="animate-projector-flicker pointer-events-none absolute inset-0 bg-[#04b093]/8 mix-blend-screen" />
                          )}

                          {/* Film Frame Header: Stage Tag & Time Marker */}
                          <div className="mb-4 flex items-center justify-between">
                            <span
                              className={`font-mono text-[0.62rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                                isCurrent
                                  ? isToday
                                    ? "bg-[#04b093] text-black font-black"
                                    : "bg-[#04b093]/20 text-[#04b093] border border-[#04b093]/40"
                                  : "bg-zinc-800/80 text-zinc-400"
                              }`}
                            >
                              {frame.tag}
                            </span>
                            <span
                              className={`text-[0.62rem] font-mono font-bold ${
                                isCurrent ? "text-[#04b093]" : "text-zinc-500"
                              }`}
                            >
                              {frame.timeEstimate}
                            </span>
                          </div>

                          {/* ==============================================================
                              MOVIE COUNTDOWN VISUAL: SMPTE / ACADEMY LEADER TARGET
                              Concentric circles + crosshairs + big countdown number
                              ============================================================== */}
                          <div className="relative my-4 flex items-center justify-center">
                            <div
                              className={`relative flex items-center justify-center size-28 sm:size-32 rounded-full border-2 transition-all duration-500 ${
                                isCurrent
                                  ? isToday
                                    ? "border-[#04b093] bg-black/95 shadow-[0_0_30px_rgba(4,176,147,0.7)]"
                                    : "border-[#04b093]/80 bg-black/85 shadow-[0_0_18px_rgba(4,176,147,0.4)]"
                                  : "border-zinc-800 bg-zinc-950"
                              }`}
                            >
                              {/* Academy Leader Concentric Dashed Ring */}
                              <div
                                className={`absolute size-[86%] rounded-full border border-dashed transition-colors duration-500 ${
                                  isCurrent ? "border-[#04b093]/60" : "border-zinc-800"
                                }`}
                              />

                              {/* Leader Crosshairs (Horizontal & Vertical Target Lines) */}
                              <div
                                className={`absolute h-full w-[1px] transition-colors duration-500 ${
                                  isCurrent ? "bg-[#04b093]/40" : "bg-zinc-800"
                                }`}
                              />
                              <div
                                className={`absolute w-full h-[1px] transition-colors duration-500 ${
                                  isCurrent ? "bg-[#04b093]/40" : "bg-zinc-800"
                                }`}
                              />

                              {/* Radar Sweep Needle when illuminated */}
                              {isCurrent && (
                                <div className="animate-radar-sweep absolute size-full rounded-full pointer-events-none">
                                  <div className="h-1/2 w-[2px] bg-gradient-to-t from-[#04b093] to-transparent mx-auto" />
                                </div>
                              )}

                              {/* THE BIG COUNTDOWN DIGIT / WORD */}
                              <span
                                className={`relative z-10 font-black tracking-tighter transition-all duration-300 ${
                                  isToday
                                    ? "text-2xl sm:text-3xl uppercase font-mono tracking-tight"
                                    : "text-5xl sm:text-6xl font-mono"
                                } ${
                                  isCurrent
                                    ? isToday
                                      ? "text-[#04b093] drop-shadow-[0_0_15px_rgba(4,176,147,0.95)]"
                                      : "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                                    : "text-zinc-600"
                                }`}
                              >
                                {frame.count}
                              </span>
                            </div>
                          </div>

                          {/* ==============================================================
                              FRAME METADATA: PHASE, TITLE & DESCRIPTION
                              ============================================================== */}
                          <div className="mt-3 text-left">
                            {/* Phase Header */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <IconComponent
                                size={14}
                                className={isCurrent ? "text-[#04b093]" : "text-zinc-500"}
                              />
                              <h3
                                className={`text-xs font-black uppercase tracking-[0.2em] font-mono ${
                                  isCurrent
                                    ? isToday
                                      ? "text-[#04b093]"
                                      : "text-white"
                                    : "text-zinc-400"
                                }`}
                              >
                                {frame.phase}
                              </h3>
                            </div>

                            {/* Title */}
                            <h4
                              className={`text-sm sm:text-base font-bold leading-snug line-clamp-2 transition-colors ${
                                isCurrent ? "text-white" : "text-zinc-300"
                              }`}
                            >
                              {frame.title}
                            </h4>

                            {/* Short Description */}
                            <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
                              {frame.description}
                            </p>
                          </div>

                          {/* Frame Bottom Status Marker */}
                          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[0.62rem] font-mono">
                            <span className={isCurrent ? "text-[#04b093] font-bold" : "text-zinc-500"}>
                              {isCurrent ? "● PROJECTOR ILLUMINATED" : "○ TAP TO FOCUS"}
                            </span>
                            <span className="text-zinc-500">FRAME 0{idx + 1}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM SPROCKET HOLES TRACK (Desktop & Tablet) */}
                <div
                  className="hidden md:block h-6 w-full border-t border-zinc-800/80 bg-zinc-950 cinema-sprocket-h"
                  aria-hidden="true"
                />
              </div>
            </div>

          </div>

          {/* Bottom Stage Footer Info / Pitch Guidelines */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#04b093]" />
              <span>
                Have a podcast, DJ mix, faith series, or cultural talk show? Broadcast live with CBM Radio.
              </span>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 font-bold text-[#04b093] hover:text-white transition-colors uppercase tracking-wider font-mono text-[0.72rem]"
            >
              <span>Review Show Guidelines</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
