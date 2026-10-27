"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Headphones,
  Play,
  Volume2,
} from "lucide-react";

import homeService from "@/services/home.service";
import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import type { EpisodeSummary } from "@/types/program";

import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

export default function HeroSection() {
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

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
      setEpisodes(combined.slice(0, 4));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeEpisode = episodes[selectedIndex] || null;

  const handleCopyLink = () => {
    if (!activeEpisode) return;
    const url = `${window.location.origin}/episodes/${encodeURIComponent(activeEpisode.slug)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <section className="relative border-b border-white/10 bg-[#08090a] text-white">
      {/* Top Architectural Meta Strip */}
      <div className="border-b border-white/10 bg-[#0c0d10] text-[0.68rem] font-bold tracking-[0.2em] text-zinc-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-2 px-5 py-2.5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="text-[#00d4a5]">INDEX 01</span>
            <span className="text-white/20">/</span>
            <span className="text-white/90">COVER FEATURE</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-white/50">
            <span>CBM AUDIO NETWORK</span>
            <span>·</span>
            <span>EAST AFRICA & BEYOND</span>
            <span>·</span>
            <span className="text-[#00d4a5] flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#00d4a5]" />
              ON-DEMAND STREAMING
            </span>
          </div>
        </div>
      </div>

      {/* Hero Editorial Canvas */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          
          {/* Left: Editorial Broadsheet Headline & Interactive Scrubber */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#00d4a5]">
                <span>THE DIGITAL TALK & PODCAST PLATFORM</span>
              </div>

              <h1 className="mt-5 font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-white">
                Conversations that shape{" "}
                <span className="underline decoration-[#00d4a5] decoration-2 underline-offset-8">
                  culture
                </span>
                , faith & purpose.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Original talk series, in-depth cultural discussions, and community voices created for thinkers, creators, and everyday leaders. Stream every episode on demand.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#episodes"
                  className="inline-flex min-h-12 items-center gap-2.5 bg-[#00d4a5] px-7 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]"
                >
                  <Headphones size={16} />
                  <span>Explore Episode Archive</span>
                </a>

                <a
                  href="#shows"
                  className="inline-flex min-h-12 items-center gap-2 border border-white/20 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                >
                  <span>Our Shows</span>
                  <ArrowDownRight size={15} />
                </a>
              </div>
            </div>

            {/* Interactive Episode Switcher Bar */}
            {episodes.length > 0 && (
              <div className="mt-12 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    FEATURED DROPS · SELECT TO PREVIEW
                  </p>
                  <span className="text-[0.68rem] font-bold text-[#00d4a5]">
                    0{selectedIndex + 1} / 0{episodes.slice(0, 3).length}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {episodes.slice(0, 3).map((ep, idx) => (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`text-left p-3 border transition-all ${
                        selectedIndex === idx
                          ? "border-[#00d4a5] bg-[#0c1613] text-white shadow-[0_0_15px_rgba(0,212,165,0.15)]"
                          : "border-white/10 bg-[#0e1013] text-zinc-400 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[0.65rem] font-black tracking-wider text-[#00d4a5]">
                        <span>DROP 0{idx + 1}</span>
                        {selectedIndex === idx && <span className="size-1.5 rounded-full bg-[#00d4a5]" />}
                      </div>
                      <p className="mt-1 text-xs font-bold line-clamp-1 text-white">
                        {ep.title}
                      </p>
                      <p className="text-[0.68rem] text-zinc-500 line-clamp-1">
                        {ep.program_title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: The Studio Master Stage Card */}
          <div className="lg:col-span-5">
            <div className="border border-white/15 bg-[#0e1013] p-4 sm:p-6 shadow-2xl">
              
              {/* Card Meta Bar */}
              <div className="mb-4 flex items-center justify-between text-[0.68rem] font-black uppercase tracking-wider text-zinc-400 border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-[#00d4a5]">
                  <Volume2 size={13} />
                  <span>ON AIR // MASTER TAPE</span>
                </span>
                <span>
                  {activeEpisode?.publish_date
                    ? formatReleaseDate(activeEpisode.publish_date)
                    : "STUDIO RECORDING"}
                </span>
              </div>

              {/* Artwork Container */}
              <div className="group relative aspect-video w-full overflow-hidden bg-black/60 border border-white/10">
                <Image
                  src={
                    activeEpisode?.cover_image ||
                    activeEpisode?.external_cover_image_url ||
                    StudioImage
                  }
                  alt={activeEpisode ? activeEpisode.title : "CBM Radio Featured"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  unoptimized={Boolean(activeEpisode?.cover_image)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Animated Equalizer Waveform in Corner */}
                <div className="absolute bottom-3 right-3 flex items-end gap-1 h-4 px-2 py-1 bg-black/70 backdrop-blur-sm border border-white/10">
                  <span className="w-1 bg-[#00d4a5] h-3 animate-eq-1" />
                  <span className="w-1 bg-[#00d4a5] h-4 animate-eq-2" />
                  <span className="w-1 bg-[#00d4a5] h-2 animate-eq-3" />
                  <span className="w-1 bg-[#00d4a5] h-3.5 animate-eq-4" />
                </div>

                {/* Center Play Trigger */}
                {activeEpisode ? (
                  <button
                    type="button"
                    onClick={() => playEpisode(activeEpisode, true)}
                    aria-label={`Play ${activeEpisode.title}`}
                    className="absolute inset-0 m-auto grid size-16 place-items-center bg-[#00d4a5] text-[#062521] shadow-2xl transition hover:scale-110 hover:bg-[#34e2b8]"
                  >
                    <Play size={22} className="ml-1 fill-[#062521]" />
                  </button>
                ) : (
                  <a
                    href="#episodes"
                    className="absolute inset-0 m-auto grid size-16 place-items-center bg-[#00d4a5] text-[#062521] shadow-2xl transition hover:scale-110 hover:bg-[#34e2b8]"
                  >
                    <Play size={22} className="ml-1 fill-[#062521]" />
                  </a>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="mt-5">
                <span className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                  {activeEpisode?.program_title || "My Life, My Purpose"}
                </span>

                <h2 className="mt-1 text-xl font-black text-white sm:text-2xl leading-tight line-clamp-2">
                  {activeEpisode?.title || "Conversations on Purpose & Community"}
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                  {activeEpisode?.description ||
                    "Stream full episode discussions with our hosts on life, faith, and cultural identity."}
                </p>

                {/* Card Action Controls */}
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  {activeEpisode ? (
                    <button
                      type="button"
                      onClick={() => playEpisode(activeEpisode, true)}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00d4a5] hover:text-[#5eead4] transition"
                    >
                      <Play size={13} className="fill-current" />
                      <span>Stream Master</span>
                    </button>
                  ) : (
                    <a
                      href="#episodes"
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00d4a5] hover:text-[#5eead4] transition"
                    >
                      <Headphones size={13} />
                      <span>Listen to Audio</span>
                    </a>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Share / Copy Link Button */}
                    {activeEpisode && (
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        aria-label="Copy episode link"
                        className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-zinc-400 hover:text-[#00d4a5] transition"
                      >
                        {copiedLink ? (
                          <>
                            <Check size={12} className="text-[#00d4a5]" />
                            <span className="text-[#00d4a5]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    )}

                    {activeEpisode?.slug ? (
                      <Link
                        href={`/episodes/${encodeURIComponent(activeEpisode.slug)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-white transition"
                      >
                        <span>Details</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    ) : (
                      <Link
                        href="/episodes"
                        className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-white transition"
                      >
                        <span>All</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Ledger Architecture Strip */}
      <div className="border-t border-white/10 bg-[#060708] text-xs">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="border-l border-[#00d4a5]/40 pl-3">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">FORMAT</p>
              <p className="font-bold text-white text-xs mt-0.5">Original On-Demand Series</p>
            </div>
            <div className="border-l border-[#00d4a5]/40 pl-3">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">NETWORK</p>
              <p className="font-bold text-white text-xs mt-0.5">CBM Digital Media Desk</p>
            </div>
            <div className="border-l border-[#00d4a5]/40 pl-3">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">REGION</p>
              <p className="font-bold text-white text-xs mt-0.5">East Africa & Continental</p>
            </div>
            <div className="border-l border-[#00d4a5]/40 pl-3">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-zinc-500">ACCESS</p>
              <p className="font-bold text-white text-xs mt-0.5">100% Free Public Audio/Video</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatReleaseDate(value: string | null) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-UG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d);
}
