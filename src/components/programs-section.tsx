"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import homeService from "@/services/home.service";
import type { ProgramSummary } from "@/types/program";
import DanielPortrait from "../../public/cbm_images/daniel.svg";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";

const programArtwork = [DanielPortrait, BrianPortrait, SamuelPortrait];

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
        {(status === "error" || (status === "ready" && programs.length === 0)) && (
          <article className="grid overflow-hidden rounded-xl border border-white/10 bg-[#090d0c]/70 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="relative min-h-56 sm:min-h-72">
              <Image
                src={DanielPortrait}
                alt="CBM Radio presenter Daniel Moses"
                fill
                sizes="(max-width: 640px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">Show spotlight</p>
              <h3 className="mt-3 text-2xl font-black sm:text-3xl">My Life, My Purpose</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-300">
                Thoughtful conversations about purpose, personal growth, and the stories that shape our community.
              </p>
              <p className="mt-4 text-sm font-semibold text-[#48d4c1]">Thursdays · 4:00–5:00 PM</p>
              <Link href="/programs" className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#48d4c1]/50 px-5 text-sm font-bold text-[#48d4c1] transition-colors hover:bg-[#48d4c1] hover:text-[#062521]">
                Explore the lineup <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              {status === "error" && <p className="mt-4 text-xs text-white/45">Live program listings are temporarily unavailable.</p>}
            </div>
          </article>
        )}
        {programs.length > 0 && (
          <div className="space-y-3">
            {programs.map((program, index) => (
              <article key={program.id} className="grid items-center gap-x-5 gap-y-4 rounded-xl border border-white/10 bg-[#090d0c]/70 p-4 transition-colors hover:border-[#48d4c1]/35 sm:grid-cols-[4.25rem_8rem_minmax(0,1fr)_auto] sm:gap-6 sm:p-5">
                <span aria-label={`Featured show ${index + 1}`} className="text-4xl font-black leading-none tracking-tighter text-teal-300/80 sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative col-start-2 row-start-1 aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 sm:col-start-auto sm:row-auto">
                  <Image
                    src={program.cover_image || programArtwork[index % programArtwork.length]}
                    alt={program.cover_image ? `${program.title} show artwork` : "CBM Radio presenter artwork"}
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
