import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden bg-[#0b0f0f] px-5 pb-20 pt-20 text-white sm:px-8 lg:px-12 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6rem] top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-teal-400/10 blur-[120px] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-gradient-to-b from-transparent via-teal-400/70 to-transparent lg:block"
      />

      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-[1170px]">
          <p className="mb-6 inline-flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.32em] text-teal-300 sm:text-xs lg:text-sm">
            <span aria-hidden="true" className="h-px w-10 bg-teal-400 sm:w-12" />
            THE SOUND OF OUR COMMUNITY
          </p>

          <h1
            id="home-heading"
            className="font-black leading-[0.82] tracking-[-0.07em] text-white text-[3.2rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[8.7rem]"
          >
            <span className="block">Your world.</span>
            <span className="block text-teal-400">Your frequency.</span>
          </h1>

          <p className="mt-7 max-w-[980px] text-base leading-7 text-zinc-300 sm:text-xl sm:leading-9 lg:text-[1.7rem] lg:leading-[1.5]">
            Stories, music and conversations made for the people who make our
            community what it is. Find your next favorite voice on CBM Radio.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/episodes"
              className="inline-flex min-h-[3.4rem] items-center gap-3 rounded-full bg-teal-400 px-7 text-base font-bold text-zinc-950 transition hover:bg-teal-300 sm:min-h-[3.8rem] sm:text-lg"
            >
              <Play size={18} fill="currentColor" aria-hidden="true" />
              Hear the latest
            </Link>
            <Link
              href="/programs"
              className="inline-flex min-h-[3.4rem] items-center gap-2 rounded-full border border-white/30 bg-transparent px-7 text-base font-semibold text-white transition hover:border-teal-300 hover:text-teal-300 sm:min-h-[3.8rem] sm:text-lg"
            >
              Explore our shows
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
