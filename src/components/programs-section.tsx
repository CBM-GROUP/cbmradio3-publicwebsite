"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Headphones, Mic2, Sparkles } from "lucide-react";

import homeService from "@/services/home.service";
import type { ProgramSummary } from "@/types/program";

import DanielPortrait from "../../public/cbm_images/daniel.svg";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";

const programArtwork = [DanielPortrait, BrianPortrait, SamuelPortrait];

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    homeService
      .getFeaturedPrograms()
      .then((items) => {
        if (!isMounted) return;
        setPrograms(items);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="shows"
      className="relative scroll-mt-20 border-b-2 border-white/20 bg-black px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header: Zwart + Billboard Broadsheet */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-white/20 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-[#04b093] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-black">
                ORIGINAL ROSTER
              </span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
                PRODUCTIONS & SHOW FRANCHISES
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
              Curated Shows & Cultural Talk Series
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
              CBM produces dedicated talk programs that ask tough questions, celebrate authentic achievements, and connect diverse perspectives.
            </p>
          </div>

          <Link
            href="/programs"
            className="inline-flex items-center gap-2 border-2 border-white bg-transparent px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black w-fit"
          >
            <span>Full Show Directory</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="border-2 border-white/20 bg-[#0d0d0d] p-16 text-center text-zinc-400">
            <p className="text-sm font-black uppercase tracking-wider">RETRIEVING SHOW ROSTER...</p>
          </div>
        )}

        {/* Shows Roster: Zwart Visual Grid */}
        {!loading && programs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program, idx) => {
              const artwork =
                program.cover_image || programArtwork[idx % programArtwork.length];

              return (
                <article
                  key={program.id}
                  className="group relative border-2 border-white/15 bg-[#0d0d0d] p-6 transition-all duration-200 hover:border-[#04b093]"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    
                    {/* Artwork Poster */}
                    <div className="relative aspect-[4/3] w-full sm:w-48 shrink-0 overflow-hidden bg-black border border-white/20">
                      <Image
                        src={artwork}
                        alt={`${program.title} artwork`}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        unoptimized={Boolean(program.cover_image)}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/90 px-2 py-0.5 text-[0.6rem] font-black uppercase text-[#04b093] border border-white/20">
                          SHOW 0{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Show Information */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-wider text-[#04b093]">
                          <Sparkles size={11} />
                          <span>CBM ORIGINAL SHOW</span>
                        </div>

                        <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-white group-hover:text-[#04b093] transition-colors">
                          <Link href={`/episodes?program=${encodeURIComponent(program.slug)}`}>
                            {program.title}
                          </Link>
                        </h3>

                        {program.presenter && (
                          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                            <Mic2 size={13} className="text-[#04b093]" />
                            <span>Hosted by {program.presenter}</span>
                          </p>
                        )}

                        {program.short_description && (
                          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                            {program.short_description}
                          </p>
                        )}
                      </div>

                      {/* Explore Show Episodes CTA */}
                      <div className="mt-5 border-t border-white/10 pt-3 flex items-center justify-between text-xs font-black uppercase">
                        <Link
                          href={`/episodes?program=${encodeURIComponent(program.slug)}`}
                          className="inline-flex items-center gap-1.5 text-[#04b093] hover:text-[#05c6a5] transition"
                        >
                          <Headphones size={13} />
                          <span>Stream Show Episodes</span>
                        </Link>
                        <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white" />
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Fallback Display if no programs returned */}
        {!loading && programs.length === 0 && (
          <article className="border-2 border-white/20 bg-[#0d0d0d] p-8 sm:p-12">
            <div className="max-w-2xl">
              <span className="bg-[#04b093] px-2.5 py-0.5 text-[0.65rem] font-black uppercase text-black">
                PREMIERE SERIES
              </span>
              <h3 className="mt-3 text-2xl font-black uppercase text-white sm:text-3xl">
                My Life, My Purpose
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Transformational conversations on career, purpose, personal growth, and community culture with top guest interviews.
              </p>
              <Link
                href="/episodes"
                className="mt-6 inline-flex items-center gap-2 bg-[#04b093] px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-[#05c6a5]"
              >
                <span>Browse All Episodes</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        )}

        {/* Zwart-Style Co-Creation Pitch Banner */}
        <div className="mt-12 border-2 border-white/20 bg-[#0d0d0d] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="bg-[#04b093]/10 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-[#04b093] border border-[#04b093]/30">
              CO-CREATE WITH US
            </span>
            <h4 className="mt-2 text-base sm:text-lg font-black uppercase tracking-tight text-white">
              Pitch an original concept or propose a guest feature
            </h4>
            <p className="mt-0.5 text-xs text-zinc-400">
              CBM Radio collaborates with producers, writers, and cultural curators across the continent.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border-2 border-white bg-transparent px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black w-fit shrink-0"
          >
            <span>Pitch Your Show</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
