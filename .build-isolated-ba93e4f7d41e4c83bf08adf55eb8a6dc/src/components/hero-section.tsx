import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";

import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden bg-[#101110] px-5 pb-12 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12 lg:pb-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 -z-10 size-[34rem] rounded-full bg-teal-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 left-[-8rem] -z-10 size-[28rem] rounded-full bg-emerald-500/10 blur-[110px]"
      />

      <div className="mx-auto grid min-h-[min(76vh,760px)] max-w-7xl items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-teal-300 sm:text-sm">
            <span aria-hidden="true" className="h-px w-8 bg-teal-400" />
            The sound of our community
          </p>

          <h1
            id="home-heading"
            className="text-balance text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl xl:text-[5.5rem]"
          >
            Your world.
            <br />
            <span className="text-teal-400">Your frequency.</span>
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Stories, music and conversations made for the people who make our
            community what it is. Find your next favorite voice on CBM Radio.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/episodes"
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-teal-400 px-6 font-bold text-zinc-950 transition hover:bg-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
            >
              <Play size={16} fill="currentColor" aria-hidden="true" />
              Hear the latest
            </Link>
            <Link
              href="/programs"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 font-semibold text-white transition hover:border-teal-300 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
            >
              Explore our shows
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            <span>Music</span>
            <span aria-hidden="true" className="size-1 rounded-full bg-teal-400" />
            <span>News</span>
            <span aria-hidden="true" className="size-1 rounded-full bg-teal-400" />
            <span>Community</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] lg:justify-self-end">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rotate-3 rounded-[2rem] border border-teal-300/30"
          />
          <Link
            href="/programs"
            aria-label="Explore CBM Radio programs"
            className="group relative block aspect-square overflow-hidden rounded-[1.5rem] bg-zinc-900 shadow-2xl shadow-black/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
          >
            <Image
              src={FeaturedShow}
              alt="CBM Radio presenters Jerry Keyz and Kalinzi Louis hosting My Life, My Purpose"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
              <span className="rounded-full border border-white/20 bg-black/65 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:text-xs">
                Featured show
              </span>
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full bg-teal-400 text-zinc-950"
              >
                <ArrowUpRight size={19} />
              </span>
            </div>
        </Link>
          <div className="mt-5 flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            <span>Real voices. Real stories.</span>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-teal-300 transition hover:text-white"
            >
              Find your show
              <ArrowDown size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
