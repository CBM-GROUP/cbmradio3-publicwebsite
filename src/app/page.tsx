import { ArrowUpRight, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import HeroSection from "../components/hero-section";
import ProgramsSection from "../components/programs-section";
import Header from "../components/header";
import NewsSection from "@/components/news-section";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";
import TeamMembers from "@/components/team-members";
import EpisodesSection from "@/components/episodes-section";
import DynamicPageSections from "@/components/dynamic-page-sections";
import HomepageAdditions from "@/components/homepage-additions";
import HomepageCharts from "@/components/homepage-charts";
import CBMTeam from "../../public/cbm_images/take 3.jpeg";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-[#070a09]">
        <DynamicPageSections page="home" position="hero" />
        
        {/* Redesigned Hero with Live ON AIR Broadcast Console */}
        <HeroSection />

        {/* Priority 1: The CBM Countdown & Ranked Music Charts */}
        <HomepageCharts />

        {/* Priority 3: Broadcast Lineup & Interactive Schedule */}
        <ProgramsSection />

        {/* Brand Frequency Showcase Banner */}
        <section className="relative border-y border-white/10 bg-gradient-to-r from-[#0a1210] via-[#080d0b] to-[#0a1210] text-white overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-[#00d4a5]/10 blur-3xl"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12 lg:py-20">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-[#00d4a5]/10 text-[#00d4a5]">
                  <Users size={16} />
                </span>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                  BEHIND THE FREQUENCY
                </p>
              </div>
              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Every voice adds to our collective story.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300">
                Meet the hosts, journalists, and cultural creators bringing original community discussions, vibrant music, and fresh perspectives to CBM Radio every single day.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/team"
                  className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#00d4a5] px-7 text-sm font-extrabold text-[#062521] shadow-[0_8px_25px_rgba(0,212,165,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#48d4c1] hover:shadow-[0_12px_32px_rgba(0,212,165,0.35)]"
                >
                  Meet The Presenters <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-white transition-all duration-200 hover:border-[#00d4a5] hover:text-[#00d4a5]"
                >
                  Our Mission & Story
                </Link>
              </div>
            </div>

            <div className="cbm-card relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-[#090d0c] shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
              <Image
                src={CBMTeam}
                alt="CBM Radio presenters and team members together"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-[center_28%] transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-6 pb-6 pt-20">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#00d4a5] backdrop-blur-md">
                  <Sparkles size={12} /> CBM RADIO COLLECTIVE
                </span>
                <p className="mt-2 text-sm font-black text-white">
                  Voices that challenge, inspire, and shape culture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Priority 2: Broadcast Newsroom & Community Dispatches */}
        <NewsSection />

        {/* On-Demand Episodes & Podcast Drops */}
        <EpisodesSection />

        {/* Priority 2: Inside The Studio & Moments Gallery */}
        <Gallery />

        {/* Dynamic & Community Additions */}
        <DynamicPageSections page="home" position="top" />
        <HomepageAdditions />
        <DynamicPageSections page="home" position="middle" />

        {/* On-Air Talent Highlights */}
        <TeamMembers limit={6} />
        
        <DynamicPageSections page="home" position="bottom" />
        
        {/* Contact Station */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
