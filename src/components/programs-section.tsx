"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import homeService from "@/services/home.service";
import type { ProgramSummary } from "@/types/program";

const HOMEPAGE_PROGRAM_LIMIT = 3;

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isMounted = true;
    homeService.getFeaturedPrograms().then((items) => {
      if (!isMounted) return;
      setPrograms(items.slice(0, HOMEPAGE_PROGRAM_LIMIT));
      setStatus("ready");
    }).catch(() => {
      if (isMounted) setStatus("error");
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="programs" className="border-y border-white/10 bg-[#111816] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">The CBM lineup</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Find your frequency</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">Good music, big conversations and fresh perspectives from the voices of our community.</p>
          </div>
          <Link href="/programs" className="inline-flex min-h-11 items-center gap-2 font-bold text-[#48d4c1] transition hover:text-white">
            All programs <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        {status === "loading" && <p className="rounded-lg border border-white/10 bg-black/20 px-5 py-8 text-center text-white/70" aria-live="polite">Loading featured programs...</p>}
        {status === "error" && <p className="rounded-lg border border-white/10 bg-black/20 px-5 py-8 text-center text-white/75">Featured programs are temporarily unavailable.</p>}
        {status === "ready" && programs.length === 0 && <p className="rounded-lg border border-white/10 bg-black/20 px-5 py-8 text-center text-white/75">No featured programs are available right now.</p>}
        {programs.length > 0 && (
          <div className="border-y border-white/10">
            {programs.map((program, index) => (
              <article key={program.id} className="grid items-center gap-x-5 gap-y-4 border-b border-white/10 py-5 last:border-b-0 sm:grid-cols-[4.25rem_8rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-6">
                <span aria-label={`Featured show ${index + 1}`} className="text-4xl font-black leading-none tracking-tighter text-teal-300/80 sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative col-start-2 row-start-1 aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 sm:col-start-auto sm:row-auto">
                  <Image
                    src={program.cover_image || "/cbmradio.png"}
                    alt={program.cover_image ? program.title : "CBM Radio"}
                    fill
                    sizes="(max-width: 640px) 42vw, 128px"
                    unoptimized={Boolean(program.cover_image)}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="col-span-2 min-w-0 sm:col-span-1">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-500">Featured show</p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{program.title}</h3>
                  {(program.presenter || program.schedule) && <p className="mt-2 text-sm font-medium text-teal-300">{[program.presenter, program.schedule].filter(Boolean).join(" · ")}</p>}
                  {program.short_description && <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{program.short_description}</p>}
                </div>
                <Link href="/programs" aria-label={`Explore ${program.title} and all CBM programs`} className="hidden size-11 items-center justify-center rounded-full border border-white/15 text-teal-300 transition hover:border-teal-300 hover:bg-teal-300 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300 sm:flex">
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
