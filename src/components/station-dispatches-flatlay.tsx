"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

// =========================================================================
// 📸 STATION PHOTO PRINTS CONFIGURATION (EXACTLY 4 PHOTO PRINTS)
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
      top: "10%",
      width: "44%",
      rotation: -11,
      zIndex: 10,
      depth: 16,
    },
    mobile: {
      left: "3%",
      top: "6%",
      width: "50%",
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
      left: "35%",
      top: "3%",
      width: "43%",
      rotation: 4,
      zIndex: 15,
      depth: 12,
    },
    mobile: {
      left: "46%",
      top: "8%",
      width: "50%",
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
      left: "49%",
      top: "40%",
      width: "46%",
      rotation: 8,
      zIndex: 25,
      depth: 22,
    },
    mobile: {
      left: "44%",
      top: "48%",
      width: "52%",
      rotation: 7,
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
    desktop: {
      left: "10%",
      top: "49%",
      width: "44%",
      rotation: -5,
      zIndex: 20,
      depth: 18,
    },
    mobile: {
      left: "4%",
      top: "46%",
      width: "50%",
      rotation: -5,
      zIndex: 18,
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

  // Parallax tracking when mouse moves over container
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
      aria-label="Stories, Culture & Station Dispatches"
      className="relative rounded-3xl border-3 border-black bg-[#060c18] text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* =========================================================================
          CSS KEYFRAMES:
          - Realistic drop & bounce entrance
          - Idle breathing oscillation
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

        .breathe-1 { animation: print-breathe-1 6.5s ease-in-out infinite; }
        .breathe-2 { animation: print-breathe-2 7.8s ease-in-out infinite; }
        .breathe-3 { animation: print-breathe-3 5.9s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
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
            THE 4 PRINTED CARDS (CLEAN DISPLAY, NO BACKGROUND TEXTURE)
            ========================================================================= */}
        <div className="lg:col-span-7">
          
          <div
            ref={tableRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group/stage relative w-full aspect-[4/3] sm:aspect-[16/12] max-h-[580px] overflow-hidden cursor-default select-none transition-all duration-300"
          >
            {/* =================================================================
                EXACTLY 4 INSTANT-PRINT PHOTOS (POLAROID STYLE)
                1. Behind the Mic
                2. Culture
                3. Dispatch #12
                4. Stories
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
                    isHovered ? "z-50" : ""
                  }`}
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
                          : "shadow-[0_16px_32px_-4px_rgba(0,0,0,0.8)] border border-[#dcd4c3]"
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
