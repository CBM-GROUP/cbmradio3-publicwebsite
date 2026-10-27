"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Headphones,
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

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

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

  return (
    <section
      id="shows"
      className="relative scroll-mt-20 border-b border-white/10 bg-[#070b09] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              <Radio size={14} />
              <span>Original Series</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Our Shows & Series
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Original conversations, insightful series, and cultural discussions hosted by your favorite CBM voices.
            </p>
          </div>

          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521] w-fit"
          >
            <span>Full Show Directory</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <div
            className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-16 text-center text-zinc-400"
            aria-live="polite"
          >
            Loading shows from CBM Radio...
          </div>
        )}

        {/* Empty / Error Fallback Feature Card */}
        {(status === "error" || (status === "ready" && programs.length === 0)) && (
          <article className="cbm-card grid overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#0d1614] to-[#070b09] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="relative min-h-64 sm:min-h-80">
              <Image
                src={ArtistSpotlightArtwork}
                alt="My Life, My Purpose show showcase"
                fill
                sizes="(max-width: 640px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00d4a5]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                <Sparkles size={13} /> SHOWCASE SERIES
              </span>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                My Life, My Purpose
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                Transformational conversations on career, purpose, personal growth, and community culture with top guest interviews.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/programs"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-xs font-black uppercase tracking-wider text-[#062521] transition hover:bg-[#34e2b8]"
                >
                  <span>Explore Shows</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/episodes"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5]"
                >
                  <Headphones size={15} />
                  <span>Stream Episodes</span>
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* Shows Cards Grid */}
        {programs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => {
              const artwork =
                program.cover_image || programArtwork[index % programArtwork.length];

              return (
                <article
                  key={program.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#09120f]/80 p-5 transition-all duration-300 hover:border-[#00d4a5]/40 hover:bg-[#0c1814] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
                >
                  <div>
                    {/* Show Artwork */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 shadow-sm">
                      <Image
                        src={artwork}
                        alt={`${program.title} show cover`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={Boolean(program.cover_image)}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {program.presenter && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[0.68rem] font-bold text-white/90 backdrop-blur-md">
                          <Mic2 size={11} className="text-[#00d4a5]" />
                          <span>{program.presenter}</span>
                        </div>
                      )}
                    </div>

                    {/* Program Information */}
                    <div className="mt-4">
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#00d4a5]">
                        CBM ORIGINAL SERIES
                      </span>

                      <h3 className="mt-1 text-xl font-black text-white group-hover:text-[#00d4a5] transition-colors">
                        <Link href={`/episodes?program=${encodeURIComponent(program.slug)}`}>
                          {program.title}
                        </Link>
                      </h3>

                      {program.short_description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                          {program.short_description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Show Footer Links */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <Link
                      href={`/episodes?program=${encodeURIComponent(program.slug)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00d4a5] hover:text-[#5eead4] transition-colors"
                    >
                      <Headphones size={13} />
                      <span>Listen to Episodes</span>
                    </Link>

                    <Link
                      href={`/programs#${program.slug || program.id}`}
                      aria-label={`Show guide for ${program.title}`}
                      className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all group-hover:border-[#00d4a5] group-hover:bg-[#00d4a5] group-hover:text-[#062521]"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Creator / Proposal Banner */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#08120e]/60 p-6 sm:flex sm:items-center sm:justify-between sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#00d4a5]/10 text-[#00d4a5]">
              <Mic2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-black text-white">
                Interested in hosting or collaborating on a show?
              </h4>
              <p className="text-xs text-zinc-400">
                Partner with CBM Radio to bring authentic, high-impact stories to our audience.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 text-xs font-black uppercase tracking-wider text-[#00d4a5] transition hover:bg-[#00d4a5] hover:text-[#062521] sm:mt-0"
          >
            <span>Pitch a Program</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
