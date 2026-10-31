"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Disc3,
} from "lucide-react";
import { programService } from "@/services/program.service";
import type { ProgramSummary } from "@/types/program";

export interface TrendingItem {
  id: string;
  category: string;
  title: string;
  presenter: string;
  schedule: string;
  description: string;
  accent: string;
  badge: string;
  image: string;
  episodesLink: string;
  scheduleTag: string;
}

const ACCENT_COLORS = ["#04b093", "#eab308", "#ec4899", "#38bdf8", "#a855f7"];
const FALLBACK_IMAGE = "/cbm_images/the-morning-show.jpg";

const DEFAULT_TRENDING_ITEMS: TrendingItem[] = [
  {
    id: "morning",
    category: "NEWS & TALK",
    title: "CBM Morning Drive",
    presenter: "Morning Crew",
    schedule: "Monday – Friday 6:00 AM – 10:00 AM",
    description:
      "Inspirational conversations, prime morning headlines, and early commuter traffic alerts.",
    accent: "#04b093",
    badge: "MORNING FLAGSHIP",
    image: "/cbm_images/the-morning-show.jpg",
    episodesLink: "/episodes",
    scheduleTag: "LIVE • WEEKDAY MORNINGS",
  },
  {
    id: "music",
    category: "MUSIC & CULTURE",
    title: "Midday Mix & Pulse",
    presenter: "DJ Bashi",
    schedule: "Monday – Friday 12:00 PM – 3:00 PM",
    description:
      "The definitive high-energy playlist featuring chart-topping Afrobeats, live studio mixes, and listener shoutouts.",
    accent: "#ec4899",
    badge: "AFTERNOON SPOTLIGHT",
    image: "/cbm_images/dj-music.jpg",
    episodesLink: "/episodes",
    scheduleTag: "LIVE • MIDDAY BROADCAST",
  },
  {
    id: "sports",
    category: "SPORTS",
    title: "CBM Sports Arena",
    presenter: "Sports Desk",
    schedule: "Fridays 5:00 PM – 7:00 PM",
    description:
      "Electric match commentary, tournament action, tactical breakdowns, and passionate sports debates.",
    accent: "#eab308",
    badge: "WEEKEND SPORTS",
    image: "/cbm_images/sports-collections.jpg",
    episodesLink: "/episodes",
    scheduleTag: "LIVE • MATCHDAY ARENA",
  },
];

function mapProgramToTrendingItem(program: ProgramSummary, index: number): TrendingItem {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const image =
    program.cover_image && program.cover_image.trim() !== ""
      ? program.cover_image
      : FALLBACK_IMAGE;

  return {
    id: String(program.id),
    category: program.is_featured ? "FEATURED" : "ON AIR",
    title: program.title,
    presenter: program.presenter || "CBM Voice",
    schedule: program.schedule || "Daily Broadcast",
    description:
      program.short_description ||
      "Tune into authentic conversations, inspiring music, and community voices on CBM Radio.",
    accent,
    badge: program.is_featured ? "HEAD TRENDING SHOW" : "CBM ORIGINAL SHOW",
    image,
    episodesLink: `/episodes?program=${encodeURIComponent(program.slug)}`,
    scheduleTag: program.schedule
      ? `LIVE • ${program.schedule.toUpperCase()}`
      : "CBM DIGITAL STREAM",
  };
}

interface TrendingCircularCarouselProps {
  initialPrograms?: ProgramSummary[];
}

export default function TrendingCircularCarousel({
  initialPrograms,
}: TrendingCircularCarouselProps) {
  const [items, setItems] = useState<TrendingItem[]>(() => {
    if (initialPrograms && initialPrograms.length > 0) {
      return initialPrograms.map(mapProgramToTrendingItem);
    }
    return DEFAULT_TRENDING_ITEMS;
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Load programs dynamically from the backend
  useEffect(() => {
    let isMounted = true;

    async function loadPrograms() {
      try {
        let programs = await programService.getFeaturedPrograms();
        if (!programs || programs.length < 3) {
          const response = await programService.getPrograms({ ordering: "display_order" });
          if (response && response.results) {
            const existingIds = new Set((programs || []).map((p) => p.id));
            const additional = response.results.filter((p) => !existingIds.has(p.id));
            programs = [...(programs || []), ...additional];
          }
        }

        if (!isMounted) return;

        if (programs && programs.length > 0) {
          setItems(programs.map(mapProgramToTrendingItem));
        }
      } catch {
        // Retain fallback items on network error
      }
    }

    if (!initialPrograms || initialPrograms.length === 0) {
      loadPrograms();
    }

    return () => {
      isMounted = false;
    };
  }, [initialPrograms]);

  // Self-rotating circular timer: automatically rotates every 4 seconds
  const resetTimer = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (items.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
  }, [items.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [resetTimer]);

  const handleNext = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
    resetTimer();
  };

  const handlePrev = () => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    resetTimer();
  };

  const handleCardClick = (idx: number) => {
    setCurrentIndex(idx);
    resetTimer();
  };

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b-2 border-black bg-[#04b093] px-4 py-12 text-black sm:px-8 sm:py-16 lg:px-12">
      {/* Decorative Background Geometric Circuit Lines */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-dashed border-black" />
        <div className="absolute left-1/2 top-1/2 h-[750px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Ribbon */}
        <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 border-b-2 border-black pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-black px-4 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#04b093] shadow-md">
                HEAD TRENDING SHOWS
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              {items.length === 3 ? "The Big 3: Featured Shows" : "Featured Shows Spotlight"}
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
              Explore our flagship broadcasts cycling into the spotlight across sports, music, and news.
            </p>
          </div>

          {/* Navigation Controls with curved buttons */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-1 rounded-full border-2 border-black bg-black p-1 shadow-md">
              <button
                onClick={handlePrev}
                aria-label="Previous Trending Card"
                className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:bg-[#04b093] hover:text-black hover:scale-105 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-3 text-xs font-mono font-bold text-[#04b093]">
                {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>

              <button
                onClick={handleNext}
                aria-label="Next Trending Card"
                className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:bg-[#04b093] hover:text-black hover:scale-105 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Quick Indicator Dots */}
            <div className="flex items-center gap-2 bg-black/10 px-3.5 py-2 rounded-full border border-black/20">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleCardClick(idx)}
                  aria-label={`Jump to ${item.title}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? "w-8 bg-black shadow-sm"
                      : "w-2.5 bg-black/40 hover:bg-black/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3D CIRCULAR MOVING CARDS ORBIT
            Self-rotating every 4 seconds; pushes forward into the front at center!
            ========================================================================= */}
        <div className="relative mx-auto mt-6 sm:mt-10 flex min-h-[540px] sm:min-h-[600px] w-full max-w-5xl items-center justify-center [perspective:1400px] pt-4 sm:pt-6 pb-6">
          {/* Circular Orbit Ground Shadow */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />

          {items.map((item, idx) => {
            const offset = (idx - currentIndex + items.length) % items.length;
            const isCenter = offset === 0;
            const isRight = items.length === 2 ? offset === 1 : offset === 1;
            const isLeft = items.length > 2 && offset === items.length - 1;
            const isHidden = !isCenter && !isRight && !isLeft;

            let transformStyle = "translate3d(0%, 50px, -200px) scale(0.6) rotateY(0deg)";
            if (isCenter) {
              transformStyle =
                "translate3d(0%, 10px, 100px) scale(1.06) rotateY(0deg) rotate(0deg)";
            } else if (isRight) {
              transformStyle =
                "translate3d(60%, 36px, -90px) scale(0.82) rotateY(-20deg) rotate(3deg)";
            } else if (isLeft) {
              transformStyle =
                "translate3d(-60%, 36px, -90px) scale(0.82) rotateY(20deg) rotate(-3deg)";
            }

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(idx)}
                className={`absolute w-[88%] sm:w-[430px] cursor-pointer select-none transition-all duration-700 ${
                  isCenter
                    ? "z-30 opacity-100"
                    : isHidden
                    ? "z-0 opacity-0 pointer-events-none"
                    : "z-10 opacity-65 hover:opacity-90"
                }`}
                style={{
                  transition: "all 800ms cubic-bezier(0.34, 1.4, 0.64, 1)",
                  transform: transformStyle,
                }}
              >
                {/* 
                  CARD CONTAINER:
                  When isCenter is true, it pushes forward with dramatic elevation & curved styling 
                */}
                <div
                  className={`group relative overflow-hidden rounded-3xl border-4 border-black bg-black p-5 sm:p-7 text-white transition-all duration-500 ${
                    isCenter
                      ? "shadow-[16px_16px_0_0_rgba(0,0,0,1)] ring-4 ring-white/25"
                      : "shadow-[6px_6px_0_0_rgba(0,0,0,0.6)]"
                  }`}
                >
                  {/* Ambient Backlight */}
                  <div
                    className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full blur-3xl opacity-25"
                    style={{ backgroundColor: item.accent }}
                  />

                  {/* Header Row: Category Badge + CD Indicator */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-black shadow-md font-sans"
                      style={{ backgroundColor: item.accent }}
                    >
                      {item.badge}
                    </span>

                    <span className="flex items-center gap-1.5 text-[0.62rem] font-mono font-bold uppercase text-zinc-400">
                      <Disc3
                        size={14}
                        className={`text-[#04b093] ${isCenter ? "chart-spin" : ""}`}
                      />
                      <span>NO. 0{idx + 1}</span>
                    </span>
                  </div>

                  {/* Media Visual Showcase Box with Pushing CD Disc */}
                  <div className="relative mb-5 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-white/20 bg-zinc-950">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 440px"
                      unoptimized={item.image.startsWith("/media/") || item.image.startsWith("http")}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Compact Disc */}
                    <div
                      className={`chart-spin absolute top-1/2 aspect-square -translate-y-1/2 rounded-full border border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.9)] transition-all duration-700 ${
                        isCenter
                          ? "right-2 sm:right-3 w-32 sm:w-36 opacity-100 scale-100"
                          : "right-6 w-24 opacity-60 scale-85"
                      }`}
                      style={{
                        background: `
                          radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(255,255,255,0.08) 28.5% 29%, transparent 29.5%),
                          conic-gradient(from 0deg, #18181b 0deg, #3f3f46 45deg, #18181b 90deg, #52525b 135deg, #18181b 180deg, #3f3f46 225deg, #18181b 270deg, #52525b 315deg, #18181b 360deg),
                          conic-gradient(from 120deg, transparent 0deg, rgba(4,176,147,0.4) 60deg, rgba(234,179,8,0.35) 120deg, rgba(239,68,68,0.3) 180deg, rgba(59,130,246,0.4) 240deg, transparent 300deg)
                        `,
                      }}
                    >
                      <div className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black">
                        <div className="size-2.5 rounded-full bg-zinc-900 border border-white/80" />
                      </div>
                    </div>

                    {/* Live Broadcast schedule tag on Center Card */}
                    {isCenter ? (
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/90 px-3 py-1 border border-white/20 backdrop-blur-md">
                        <span className="size-2 rounded-full bg-[#04b093] animate-ping" />
                        <span className="text-[0.62rem] font-mono font-bold uppercase text-white tracking-wider">
                          {item.scheduleTag}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute bottom-2 left-2 rounded-full bg-black/80 px-2.5 py-0.5 text-[0.55rem] font-mono text-zinc-400">
                        {item.category}
                      </div>
                    )}
                  </div>

                  {/* Program Title */}
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white line-clamp-1 group-hover:text-[#04b093] transition-colors">
                    {item.title}
                  </h3>

                  {/* Presenter & Airtime */}
                  <div className="mt-2.5 space-y-1 text-xs font-bold text-zinc-300">
                    <p className="truncate">
                      Hosted by <strong className="text-white">{item.presenter}</strong>
                    </p>
                    <p className="text-[#eab308] truncate font-medium">{item.schedule}</p>
                  </div>

                  {/* Program Description */}
                  <p className="mt-3 text-xs leading-relaxed text-zinc-300 line-clamp-2 font-medium">
                    {item.description}
                  </p>

                  {/* Bottom Action Row with Curved Button */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-3.5">
                    <Link
                      href={item.episodesLink}
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isCenter
                          ? "border border-black bg-[#04b093] text-black hover:bg-white hover:scale-105 shadow-md font-bold"
                          : "border border-white/20 bg-white/10 text-white hover:bg-[#04b093] hover:text-black hover:border-black"
                      }`}
                    >
                      <span>{isCenter ? "Tune In Episodes" : "Bring Forward"}</span>
                      <ArrowUpRight size={13} className="ml-1" />
                    </Link>

                    {isCenter ? (
                      <span className="text-[0.65rem] font-mono font-bold uppercase text-[#04b093]">
                        CENTER STAGE
                      </span>
                    ) : (
                      <span className="text-[0.62rem] font-mono font-bold uppercase text-zinc-400 group-hover:text-white">
                        CLICK TO FOCUS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
