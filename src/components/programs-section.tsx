"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mic2,
  Radio,
  Sparkles,
} from "lucide-react";
import homeService from "@/services/home.service";
import type { ProgramSummary } from "@/types/program";
import DanielPortrait from "../../public/cbm_images/daniel.svg";
import ArtistSpotlightArtwork from "../../public/cbm_images/artist-spotlight.png";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";

const programArtwork = [DanielPortrait, BrianPortrait, SamuelPortrait];
const scheduleFilterTabs = [
  "All Lineup",
  "Today's Shows",
  "Morning Prime",
  "Midday Drive",
  "Evening Pulse",
];

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeTab, setActiveTab] = useState(scheduleFilterTabs[0]);

  useEffect(() => {
    let isMounted = true;
    homeService
      .getFeaturedPrograms()
      .then((items) => {
        if (!isMounted) return;
        setPrograms(items);
        setStatus("ready");
      })
      .catch(() => {
        if (isMounted) setStatus("error");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter shows based on schedule string or tab
  const filteredPrograms = programs.filter((program) => {
    if (activeTab === "All Lineup") return true;
    const schedule = (program.schedule || "").toLowerCase();
    const title = (program.title || "").toLowerCase();

    if (activeTab === "Today's Shows") return true; // Show all when looking at today
    if (activeTab === "Morning Prime")
      return schedule.includes("am") || title.includes("breakfast") || title.includes("morning");
    if (activeTab === "Midday Drive")
      return schedule.includes("12:") || schedule.includes("1:") || schedule.includes("2:") || schedule.includes("midday");
    if (activeTab === "Evening Pulse")
      return schedule.includes("pm") || schedule.includes("drive") || schedule.includes("night");
    return true;
  });

  const displayPrograms = filteredPrograms.length > 0 ? filteredPrograms : programs;

  return (
    <section
      id="programs"
      className="relative border-y border-white/10 bg-[#090e0c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#00d4a5]/10 text-[#00d4a5]">
                <Radio size={16} />
              </span>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                BROADCAST LINEUP & SCHEDULE
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Find Your Frequency
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Original talk, prime community conversations, and pure African rhythms hosted by your favorite station voices.
            </p>
          </div>

          <Link
            href="/programs"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 text-sm font-extrabold text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521]"
          >
            Full Show Guide <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        {/* Schedule Filter Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {scheduleFilterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#00d4a5] text-[#062521] shadow-[0_0_15px_rgba(0,212,165,0.35)]"
                  : "border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <p
            className="rounded-2xl border border-white/10 bg-black/20 px-5 py-12 text-center text-white/70"
            aria-live="polite"
          >
            Loading broadcast lineup...
          </p>
        )}

        {/* Empty / Error Fallback Feature Card */}
        {(status === "error" || (status === "ready" && programs.length === 0)) && (
          <article className="cbm-card grid overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-[#0d1614] to-[#070b09] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="relative min-h-64 sm:min-h-80">
              <Image
                src={ArtistSpotlightArtwork}
                alt="Artist spotlight show"
                fill
                sizes="(max-width: 640px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00d4a5]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                <Sparkles size={13} /> SHOW SPOTLIGHT
              </span>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                My Life, My Purpose
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Transformational conversations on career, purpose, personal growth, and community culture with top guest interviews.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#00d4a5]">
                <Clock size={16} />
                <span>Thursdays · 4:00 PM – 5:00 PM EAT</span>
              </div>
              <Link
                href="/programs"
                className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-sm font-extrabold text-[#062521] transition hover:bg-[#48d4c1]"
              >
                Explore Complete Lineup <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
        )}

        {/* Program Cards Grid */}
        {programs.length > 0 && (
          <div className="space-y-4">
            {displayPrograms.map((program, index) => {
              const isFirst = index === 0;
              const artwork =
                program.cover_image || programArtwork[index % programArtwork.length];

              return (
                <article
                  key={program.id}
                  className="cbm-card group relative grid items-center gap-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0c1411]/80 p-4 transition-all duration-300 hover:border-[#00d4a5]/40 hover:bg-[#101b17] sm:grid-cols-[4rem_9rem_minmax(0,1fr)_auto] sm:gap-6 sm:p-5"
                >
                  {/* Show Sequence / On Air Indicator */}
                  <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:justify-center">
                    <span
                      aria-label={`Show ${index + 1}`}
                      className="text-3xl font-black tabular-nums tracking-tighter text-[#00d4a5]/80 sm:text-4xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {isFirst && (
                      <span className="inline-flex items-center gap-1 rounded bg-[#00d4a5]/20 px-2 py-0.5 text-[0.6rem] font-black uppercase text-[#00d4a5]">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Show Artwork */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/40 border border-white/10">
                    <Image
                      src={artwork}
                      alt={`${program.title} show cover`}
                      fill
                      sizes="(max-width: 640px) 100vw, 144px"
                      unoptimized={Boolean(program.cover_image)}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Program Info */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#00d4a5]">
                        {isFirst ? "FEATURED SHOW" : "SCHEDULED SHOW"}
                      </span>
                      {program.schedule && (
                        <span className="inline-flex items-center gap-1 text-xs text-white/60">
                          <Clock size={12} className="text-[#00d4a5]" />
                          <span>{program.schedule}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1.5 text-xl font-black text-white sm:text-2xl group-hover:text-[#00d4a5] transition-colors">
                      {program.title}
                    </h3>

                    {program.presenter && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-white/80">
                        <Mic2 size={13} className="text-[#00d4a5]" />
                        <span>Hosted by {program.presenter}</span>
                      </p>
                    )}

                    {program.short_description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400 sm:text-sm">
                        {program.short_description}
                      </p>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-end sm:justify-center">
                    <Link
                      href={`/programs#${program.slug || program.id}`}
                      aria-label={`Tune into ${program.title}`}
                      className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#00d4a5] shadow-sm transition-all duration-200 group-hover:border-[#00d4a5] group-hover:bg-[#00d4a5] group-hover:text-[#062521] group-hover:scale-110"
                    >
                      <ArrowUpRight size={19} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Presenter Callout Footer Banner */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0d1512]/60 p-6 sm:flex sm:items-center sm:justify-between sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#00d4a5]/10 text-[#00d4a5]">
              <Mic2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-black text-white">
                Interested in hosting or proposing a show?
              </h4>
              <p className="text-xs text-zinc-400">
                Join our roster of creators, journalists, and cultural curators.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5] sm:mt-0"
          >
            Pitch a Program <ArrowUpRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
