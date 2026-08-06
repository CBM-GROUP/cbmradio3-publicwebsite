"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <section className="bg-zinc-900 px-6 py-16 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-wide text-emerald-500">Programs</p>
          <h2 className="mt-2 text-2xl font-bold">Our Shows</h2>
          <p className="mt-2 text-gray-400">Tune in to our featured programs for music, news and entertainment.</p>
        </div>
        {status === "loading" && <p className="min-h-40 text-center text-zinc-400" aria-live="polite">Loading featured programs...</p>}
        {status === "error" && <p className="min-h-40 text-center text-zinc-400">Featured programs are temporarily unavailable.</p>}
        {status === "ready" && programs.length === 0 && <p className="min-h-40 text-center text-zinc-400">No featured programs are available right now.</p>}
        {programs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {programs.map((program) => (
              <article key={program.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
                {program.cover_image && <div className="relative aspect-video bg-zinc-950"><Image src={program.cover_image} alt={program.title} fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized className="object-cover" /></div>}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{program.title}</h3>
                  {(program.presenter || program.schedule) && <p className="mt-1 text-sm text-emerald-500">{[program.presenter, program.schedule].filter(Boolean).join(" - ")}</p>}
                  {program.short_description && <p className="mt-2 text-sm text-gray-300">{program.short_description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-8 text-center"><Link href="/programs" className="font-semibold text-emerald-500 hover:text-emerald-400">View all programs</Link></div>
      </div>
    </section>
  );
}
