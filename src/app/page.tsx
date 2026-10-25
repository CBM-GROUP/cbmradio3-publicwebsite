import { ArrowUpRight } from "lucide-react";
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
import CBMTeam from "../../public/cbm_images/take 3.jpeg";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <DynamicPageSections page="home" position="hero" />
        <HeroSection />
        <section className="border-y border-white/10 bg-[#111816] text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12 lg:py-20">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">
                Behind the frequency
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Every voice adds to the story.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                Meet the people bringing community conversations, music and fresh perspectives to CBM Radio.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  href="/team"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#48d4c1] px-6 text-sm font-extrabold text-[#062521] transition-colors hover:bg-[#6ae3d1]"
                >
                  Meet the team <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
                <Link
                  href="/programs"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white/80 transition-colors hover:text-[#48d4c1]"
                >
                  Explore programs <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#090d0c]">
              <Image
                src={CBMTeam}
                alt="CBM Radio presenters and team members"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-[center_30%]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-16">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white">
                  The people behind CBM Radio
                </p>
              </div>
            </div>
          </div>
        </section>
        <DynamicPageSections page="home" position="top" />
        <ProgramsSection />
        <NewsSection />
        <EpisodesSection />
        <HomepageAdditions />
        <DynamicPageSections page="home" position="middle" />
        <TeamMembers limit={6} />
        <Gallery />
        <DynamicPageSections page="home" position="bottom" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
