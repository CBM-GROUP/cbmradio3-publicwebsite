"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Headphones, Mic2 } from "lucide-react";

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
      className="relative scroll-mt-20 border-b border-white/10 bg-[#08090a] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Header Strip */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#00d4a5]">
              <span>INDEX 03</span>
              <span className="text-white/20">/</span>
              <span>SERIES ANTHOLOGY</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Original Shows & Talk Series
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Explore CBM’s ongoing broadcast franchises covering purpose, regional arts, faith, and cultural dialogue.
            </p>
          </div>

          <Link
            href="/programs"
            className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5] w-fit"
          >
            <span>Full Program Directory</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="border border-white/10 bg-[#0e1013] p-16 text-center text-zinc-400">
            <p className="text-sm font-semibold tracking-wider">RETRIEVING SHOW ROSTER...</p>
          </div>
        )}

        {/* Shows Roster: Architectural Ledger Grid */}
        {!loading && programs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((program, idx) => {
              const artwork =
                program.cover_image || programArtwork[idx % programArtwork.length];

              return (
                <article
                  key={program.id}
                  className="group relative border border-white/10 bg-[#0e1013] p-6 transition-all duration-200 hover:border-[#00d4a5]"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    
                    {/* Artwork Poster */}
                    <div className="relative aspect-[4/3] w-full sm:w-44 shrink-0 overflow-hidden bg-black/60 border border-white/10">
                      <Image
                        src={artwork}
                        alt={`${program.title} artwork`}
                        fill
                        sizes="(max-width: 640px) 100vw, 176px"
                        unoptimized={Boolean(program.cover_image)}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Show Information */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                          <span>SHOW // 0{idx + 1}</span>
                          {program.schedule && (
                            <span className="text-zinc-500">{program.schedule}</span>
                          )}
                        </div>

                        <h3 className="mt-1.5 text-xl font-black text-white group-hover:text-[#00d4a5] transition-colors">
                          <Link href={`/episodes?program=${encodeURIComponent(program.slug)}`}>
                            {program.title}
                          </Link>
                        </h3>

                        {program.presenter && (
                          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                            <Mic2 size={12} className="text-[#00d4a5]" />
                            <span>{program.presenter}</span>
                          </p>
                        )}

                        {program.short_description && (
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                            {program.short_description}
                          </p>
                        )}
                      </div>

                      {/* Explore Show Episodes CTA */}
                      <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between text-xs">
                        <Link
                          href={`/episodes?program=${encodeURIComponent(program.slug)}`}
                          className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider text-[#00d4a5] hover:underline"
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
          <article className="border border-white/10 bg-[#0e1013] p-8 sm:p-12">
            <div className="max-w-2xl">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                PREMIERE SERIES
              </span>
              <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                My Life, My Purpose
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Transformational conversations on career, purpose, personal growth, and community culture with top guest interviews.
              </p>
              <Link
                href="/episodes"
                className="mt-6 inline-flex items-center gap-2 bg-[#00d4a5] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#062521] hover:bg-[#34e2b8]"
              >
                <span>Browse All Episodes</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        )}

        {/* Creative Pitch Banner */}
        <div className="mt-12 border border-white/10 bg-[#0c0e11] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              STUDIO COLLABORATION
            </p>
            <h4 className="mt-1 text-base font-black text-white">
              Pitch an original talk concept or guest feature
            </h4>
            <p className="mt-0.5 text-xs text-zinc-400">
              CBM Radio collaborates with producers, writers, and cultural voices.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5] w-fit shrink-0"
          >
            <span>Submit Proposal</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
