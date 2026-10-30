"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Headphones,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import homeService from "@/services/home.service";
import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import type { EpisodeSummary } from "@/types/program";

import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";
import DanielPortrait from "../../public/cbm_images/daniel.svg";

export default function HeroSection() {
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { playEpisode } = useEpisodePlayerStore();

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

  const activeEpisode = episodes[selectedIndex] || null;

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
                  className="inline-flex min-h-12 items-center gap-2.5 bg-black px-6 sm:px-7 text-xs font-black uppercase tracking-wider text-[#04b093] transition hover:bg-white hover:text-black hover:scale-[1.02] shadow-xl"
                >
                  <Headphones size={16} />
                  <span>Stream Episodes</span>
                </a>

                <a
                  href="#shows"
                  className="inline-flex min-h-12 items-center gap-2 border-2 border-black bg-transparent px-5 sm:px-6 text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
                >
                  <span>Explore Series</span>
                  <ArrowUpRight size={15} />
                </a>

                <Link
                  href="/charts"
                  className="inline-flex min-h-12 items-center gap-2 border-2 border-black bg-white/20 px-5 sm:px-6 text-xs font-black uppercase tracking-wider text-black transition hover:bg-black hover:text-[#04b093]"
                >
                  <span>Music Charts</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            {/* Spotlight Video Tile (The Zwart/Billboard Lead Media Card) */}
            <div className="mt-10 border-2 border-black bg-black p-4 text-white shadow-2xl">
              <div className="group relative aspect-video w-full overflow-hidden bg-black">
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
                  <span className="bg-black/90 px-3 py-1 text-[0.62rem] font-black uppercase tracking-widest text-[#04b093] border border-white/20">
                    ★ NOW FEATURED // {activeEpisode?.program_title || "ORIGINAL SERIES"}
                  </span>
                </div>

                {/* Central Play Trigger Button */}
                {activeEpisode ? (
                  <button
                    type="button"
                    onClick={() => playEpisode(activeEpisode, true)}
                    aria-label={`Play ${activeEpisode.title}`}
                    className="absolute inset-0 m-auto grid size-16 place-items-center bg-[#04b093] text-black shadow-2xl transition hover:scale-110 hover:bg-[#05c6a5]"
                  >
                    <Play size={24} className="ml-1 fill-black" />
                  </button>
                ) : (
                  <a
                    href="#episodes"
                    className="absolute inset-0 m-auto grid size-16 place-items-center bg-[#04b093] text-black shadow-2xl transition hover:scale-110 hover:bg-[#05c6a5]"
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
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#04b093] hover:bg-[#04b093] hover:text-black transition shrink-0"
                  >
                    <Play size={12} className="fill-current" />
                    <span>Watch / Listen</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): The Billboard Hot Drops Leaderboard */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="border-2 border-black bg-black p-5 sm:p-7 text-white shadow-2xl">
              
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
                <div className="flex items-center gap-2 text-white">
                  <TrendingUp size={18} className="text-[#04b093]" />
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                    Billboard Hot Drops
                  </h3>
                </div>
                <span className="bg-[#04b093] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-black">
                  TOP RELEASES
                </span>
              </div>

              {/* Hot Drops List */}
              <div className="mt-4 divide-y divide-white/10">
                {episodes.map((ep, idx) => {
                  const isSelected = selectedIndex === idx;

                  return (
                    <article
                      key={ep.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`group flex items-center justify-between gap-4 py-4 cursor-pointer transition-colors ${
                        isSelected ? "bg-white/[0.08]" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Billboard Rank Numeral */}
                        <span
                          className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tighter ${
                            idx === 0
                              ? "text-[#04b093]"
                              : isSelected
                              ? "text-white"
                              : "text-zinc-500 group-hover:text-white"
                          }`}
                        >
                          0{idx + 1}
                        </span>

                        {/* Thumbnail with hover play overlay */}
                        <div className="relative size-14 shrink-0 overflow-hidden bg-black border border-white/20">
                          <Image
                            src={
                              ep.cover_image ||
                              ep.external_cover_image_url ||
                              DanielPortrait
                            }
                            alt={ep.title}
                            fill
                            sizes="56px"
                            unoptimized={Boolean(ep.cover_image)}
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playEpisode(ep, true);
                            }}
                            aria-label={`Play ${ep.title}`}
                            className="absolute inset-0 m-auto grid size-7 place-items-center bg-[#04b093] text-black opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Play size={12} className="ml-0.5 fill-black" />
                          </button>
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0">
                          <p className="text-[0.65rem] font-black uppercase tracking-wider text-[#04b093] truncate">
                            {ep.program_title}
                          </p>
                          <h4 className="mt-0.5 text-xs sm:text-sm font-black uppercase text-white truncate max-w-xs group-hover:text-[#04b093] transition-colors">
                            {ep.title}
                          </h4>
                          {ep.publish_date && (
                            <p className="text-[0.65rem] text-zinc-400">
                              {ep.publish_date}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Play action icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playEpisode(ep, true);
                        }}
                        aria-label={`Stream ${ep.title}`}
                        className="grid size-8 place-items-center border border-white/20 text-zinc-400 group-hover:border-[#04b093] group-hover:bg-[#04b093] group-hover:text-black transition shrink-0"
                      >
                        <Play size={12} className="ml-0.5 fill-current" />
                      </button>
                    </article>
                  );
                })}

                {episodes.length === 0 && (
                  <p className="py-8 text-center text-xs text-zinc-500 uppercase tracking-wider">
                    Loading Hot Drops...
                  </p>
                )}
              </div>

              {/* Leaderboard Footer */}
              <div className="mt-6 border-t-2 border-white/20 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400 text-[0.68rem] uppercase font-bold">
                  UPDATED REGULARLY BY CBM EDITORS
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href="/episodes"
                    className="font-black uppercase tracking-wider text-white hover:text-[#04b093] transition flex items-center gap-1"
                  >
                    <span>All Episodes</span>
                    <ArrowUpRight size={13} />
                  </Link>
                  <span className="text-white/20">&bull;</span>
                  <Link
                    href="/charts"
                    className="font-black uppercase tracking-wider text-[#04b093] hover:underline flex items-center gap-1"
                  >
                    <span>Charts</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
