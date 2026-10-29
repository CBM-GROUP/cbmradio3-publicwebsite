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

interface TrendingItem {
  id: string;
  category: "SPORTS" | "MUSIC" | "NEWS";
  title: string;
  presenter: string;
  schedule: string;
  description: string;
  accent: string;
  badge: string;
  image: string;
  episodesLink: string;
  frequencyTag: string;
}

const TRENDING_ITEMS: TrendingItem[] = [
  {
    id: "sports",
    category: "SPORTS",
    title: "CBM Sports Matchday Arena",
    presenter: "Sports Desk",
    schedule: "Fridays 5:00 PM – 6:00 PM",
    description:
      "Electric Premier League commentary, real-time match breakdowns, East African tournament action, and passionate pitch debates.",
    accent: "#eab308", // Golden Yellow
    badge: "HEAD TRENDING IN SPORTS",
    image: "/cbm_images/sports-collections.jpg",
    episodesLink: "/episodes?program=sports",
    frequencyTag: "FM 92.4 • MATCHDAY LIVE",
  },
  {
    id: "music",
    category: "MUSIC",
    title: "Midday Mix & Afrobeats Pulse",
    presenter: "DJ Bashi",
    schedule: "Monday – Friday 12:00 PM – 3:00 PM",
    description:
      "The definitive high-energy playlist featuring chart-topping Afrobeats, Amapiano, live studio mixes, and listener shoutouts.",
    accent: "#ec4899", // Neon Pink
    badge: "HEAD TRENDING IN MUSIC",
    image: "/cbm_images/dj-music.jpg",
    episodesLink: "/episodes?program=midday-mix",
    frequencyTag: "FM 98.1 • HIT COUNTDOWN",
  },
  {
    id: "news",
    category: "NEWS",
    title: "CBM Morning Drive & News Brief",
    presenter: "Audu & The Newsroom",
    schedule: "Monday – Friday 4:00 AM – 5:00 AM",
    description:
      "Crucial investigative news, prime morning headlines, early commuter traffic alerts, and market briefings.",
    accent: "#04b093", // CBM Emerald
    badge: "HEAD TRENDING IN NEWS",
    image: "/cbm_images/the-morning-show.jpg",
    episodesLink: "/episodes?program=cbm-morning-drive",
    frequencyTag: "FM 88.5 • PRIME DISPATCH",
  },
];

export default function TrendingCircularCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Self-rotating circular timer: automatically rotates every 3.5 seconds
  const resetTimer = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TRENDING_ITEMS.length);
    }, 3500);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [resetTimer]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRENDING_ITEMS.length);
    resetTimer();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TRENDING_ITEMS.length) % TRENDING_ITEMS.length);
    resetTimer();
  };

  const handleCardClick = (idx: number) => {
    setCurrentIndex(idx);
    resetTimer();
  };

  return (
    <section className="relative overflow-hidden border-b-2 border-black bg-[#04b093] px-4 py-12 text-black sm:px-8 sm:py-16 lg:px-12">
      {/* Decorative Background Geometric Circuit Lines */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-dashed border-black" />
        <div className="absolute left-1/2 top-1/2 h-[750px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Ribbon */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 border-b-2 border-black pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-black px-4 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#04b093] shadow-md">
                HEAD TRENDING CHANNELS
              </span>
              <span className="rounded-full bg-black/15 px-3 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-black border border-black/30">
                3D CIRCULAR CAROUSEL
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              The Big 3: Sports, Music &amp; News
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
              Watch the 3 flagship pillars cycle along the orbit: as each show arrives at the center, it{" "}
              <span className="rounded-full bg-black px-2.5 py-0.5 text-[#04b093] font-black uppercase">
                pushes itself in front
              </span>{" "}
              into full broadcast spotlight.
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
                0{currentIndex + 1} / 03
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
              {TRENDING_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleCardClick(idx)}
                  aria-label={`Jump to ${item.category}`}
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
            Self-rotating every 3.5 seconds; pushes forward into the front at center!
            ========================================================================= */}
        <div className="relative mx-auto flex min-h-[480px] sm:min-h-[530px] w-full max-w-5xl items-center justify-center [perspective:1400px]">
          
          {/* Circular Orbit Ground Shadow */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />

          {TRENDING_ITEMS.map((item, idx) => {
            const offset = (idx - currentIndex + 3) % 3;
            const isCenter = offset === 0;
            const isRight = offset === 1;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(idx)}
                className={`absolute w-[88%] sm:w-[430px] cursor-pointer select-none ${
                  isCenter
                    ? "z-30 opacity-100"
                    : "z-10 opacity-65 hover:opacity-90"
                }`}
                style={{
                  transition: "all 800ms cubic-bezier(0.34, 1.4, 0.64, 1)",
                  transform: isCenter
                    ? "translate3d(0%, -18px, 100px) scale(1.08) rotateY(0deg) rotate(0deg)"
                    : isRight
                    ? "translate3d(60%, 20px, -90px) scale(0.82) rotateY(-20deg) rotate(3deg)"
                    : "translate3d(-60%, 20px, -90px) scale(0.82) rotateY(20deg) rotate(-3deg)",
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

                    {/* Frequency pill on Center Card */}
                    {isCenter ? (
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/90 px-3 py-1 border border-white/20 backdrop-blur-md">
                        <span className="size-2 rounded-full bg-[#04b093] animate-ping" />
                        <span className="text-[0.62rem] font-mono font-bold uppercase text-white tracking-wider">
                          {item.frequencyTag}
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
                    <p className="truncate">Hosted by <strong className="text-white">{item.presenter}</strong></p>
                    <p className="text-[#eab308] truncate font-medium">{item.schedule}</p>
                  </div>

                  {/* Program Description */}
                  <p className="mt-3 text-xs leading-relaxed text-zinc-300 line-clamp-2 font-medium">
                    {item.description}
                  </p>

                  {/* Bottom Action Row with Nice Curved Button */}
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

        {/* Orbit Footer Caption */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold text-black/85">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-black animate-pulse" />
            Automatic 3D Rotation Active: Cards advance every 3.5s automatically
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Click any card to focus immediately</span>
        </div>

      </div>
    </section>
  );
}
