"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";
import Daniel from "../../public/cbm_images/daniel.svg";

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
    <section className="relative isolate -mt-16 min-h-[78svh] overflow-hidden bg-[#090d0c] pt-16 text-white">
      <Image
        src={currentSlide.image}
        alt=""
        fill
        priority
        aria-hidden="true"
        className="-z-20 object-cover object-center"
        sizes="100vw"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,10,9,0.48)_0%,rgba(4,10,9,0.28)_55%,rgba(4,10,9,0.12)_100%)]"
      />

      <div className="mx-auto flex min-h-[78svh] max-w-[1800px] items-center px-4 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
        <div className="w-full max-w-[760px] rounded-lg border border-white/30 bg-[#07100f]/35 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-lg sm:p-8 lg:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#62e6d4]">
            {currentSlide.kicker}
          </p>

          <h1
            id="home-heading"
            className="mt-5 text-3xl font-black leading-[1.08] text-white sm:text-4xl lg:text-5xl"
          >
            {currentSlide.title}
          </h1>

          <p className="mt-4 max-w-[46ch] text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
            {currentSlide.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={currentSlide.href}
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#48d4c1] px-6 text-sm font-extrabold text-[#062521] shadow-[0_8px_24px_rgba(72,212,193,0.16)] transition-colors hover:bg-[#6ae3d1]"
            >
              {currentSlide.buttonLabel}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>

            <Link
              href={currentSlide.secondaryHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 text-sm font-bold text-white transition-colors hover:border-[#48d4c1] hover:bg-white/10 hover:text-[#62e6d4]"
            >
              <Play size={14} fill="currentColor" aria-hidden="true" />
              {currentSlide.secondaryLabel}
            </Link>
          </div>

          <div className="mt-9 flex items-center justify-between border-t border-white/25 pt-5">
            <div className="flex items-center gap-2" aria-label="Choose featured story">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.kicker}-${index}`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}: ${slide.kicker}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-10 bg-[#48d4c1]" : "w-5 bg-white/45 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold tabular-nums text-white/85">
                0{activeIndex + 1} <span className="text-white/55">/</span> 0{slides.length}
              </span>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === 0 ? slides.length - 1 : current - 1,
                  )
                }
                className="grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-white/5 text-white transition-colors hover:border-[#48d4c1] hover:text-[#62e6d4]"
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
      </div>
    </section>
  );
}
