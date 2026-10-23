"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";
import Daniel from "../../public/cbm_images/daniel.svg";
import Samuel from "../../public/cbm_images/samuel.svg";
import Innocent from "../../public/cbm_images/innocent1.svg";

const slides = [
  {
    image: FeaturedShow,
    kicker: "FEATURED STORY",
    title: "We bring media, entertainment, technology, and entrepreneurship together to move Africa's creative future forward.",
    description:
      "Stories, music and conversations made for the people who make our community what it is.",
    buttonLabel: "Explore our brands",
    href: "/programs",
    secondaryLabel: "Discover CBM",
    secondaryHref: "/about",
  },
  {
    image: Daniel,
    kicker: "COMMUNITY VOICE",
    title: "Voices that challenge and inspire.",
    description:
      "From local conversations to culture-shifting stories, every voice is part of the wider story.",
    buttonLabel: "Meet the team",
    href: "/team",
    secondaryLabel: "Discover CBM",
    secondaryHref: "/about",
  },
  {
    image: Samuel,
    kicker: "BEHIND THE SCENES",
    title: "Real stories. Real moments. Real impact.",
    description:
      "A creative process built on trust, presence and the lived realities of the people we serve.",
    buttonLabel: "Explore shows",
    href: "/programs",
    secondaryLabel: "Discover CBM",
    secondaryHref: "/about",
  },
  {
    image: Innocent,
    kicker: "LIVE ENERGY",
    title: "Community stories that move with the culture.",
    description:
      "Music, ideas and experiences that carry the heartbeat of our community into the spotlight.",
    buttonLabel: "View gallery",
    href: "/gallery",
    secondaryLabel: "Discover CBM",
    secondaryHref: "/about",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeIndex];

  return (
    <section className="overflow-hidden bg-[#090d0c] text-white">
      <div className="mx-auto grid min-h-[78svh] max-w-[1800px] grid-cols-1 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="order-2 flex flex-col justify-center px-5 pb-8 pt-3 sm:px-10 sm:py-10 lg:order-1 lg:px-16 lg:py-16 xl:px-24">
          <div className="max-w-[620px]">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#48d4c1]">
              <span className="h-px w-8 bg-[#48d4c1]" aria-hidden="true" />
              {currentSlide.kicker}
            </p>

            <h1
              id="home-heading"
              className="mt-5 text-3xl font-black leading-[1.04] text-white sm:text-4xl lg:text-5xl"
            >
              {currentSlide.title}
            </h1>

            <p className="mt-4 max-w-[46ch] text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              {currentSlide.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={currentSlide.href}
                className="inline-flex min-h-12 items-center gap-3 rounded-sm bg-[#48d4c1] px-5 text-sm font-bold text-[#0a0d0c] transition-colors hover:bg-[#6ae3d1]"
              >
                {currentSlide.buttonLabel}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>

              <Link
                href={currentSlide.secondaryHref}
                className="inline-flex min-h-12 items-center gap-2 rounded-sm border border-white/20 px-5 text-sm font-bold text-white transition-colors hover:border-[#48d4c1] hover:text-[#48d4c1]"
              >
                <Play size={14} fill="currentColor" aria-hidden="true" />
                {currentSlide.secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="mt-9 flex max-w-[620px] items-center justify-between border-t border-white/15 pt-5">
            <div className="flex items-center gap-2" aria-label="Choose featured story">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.kicker}-${index}`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}: ${slide.kicker}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-10 bg-[#48d4c1]" : "w-5 bg-white/25 hover:bg-white/55"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tabular-nums text-white/50">
                0{activeIndex + 1} <span className="text-white/25">/</span> 0{slides.length}
              </span>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === 0 ? slides.length - 1 : current - 1,
                  )
                }
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[#48d4c1] hover:text-[#48d4c1]"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#48d4c1] text-[#0a0d0c] transition-colors hover:bg-[#6ae3d1]"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative order-1 mx-4 mt-4 aspect-[4/3] min-h-64 max-h-[46svh] overflow-hidden border border-white/10 bg-[#111816] sm:mx-10 sm:mt-8 lg:order-2 lg:mx-0 lg:mt-0 lg:aspect-auto lg:min-h-[78svh] lg:max-h-none">
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            priority
            className="object-contain p-3 sm:p-6 lg:p-10"
            sizes="(max-width: 1024px) 100vw, 56vw"
          />
          <div className="absolute left-3 top-3 bg-[#48d4c1] px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#0a0d0c] sm:left-5 sm:top-5">
            {currentSlide.kicker}
          </div>
        </div>
      </div>
    </section>
  );
}
