"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";
import Daniel from "../../public/cbm_images/daniel.svg";
import Samuel from "../../public/cbm_images/samuel.svg";
import Innocent from "../../public/cbm_images/innocent1.svg";

const slides = [
  {
    image: FeaturedShow,
    kicker: "FEATURED STORY",
    title: "Your world. Your frequency.",
    description:
      "Stories, music and conversations made for the people who make our community what it is.",
    buttonLabel: "Hear the latest",
    href: "/episodes",
  },
  {
    image: Daniel,
    kicker: "COMMUNITY VOICE",
    title: "Voices that challenge and inspire.",
    description:
      "From local conversations to culture-shifting stories, every voice is part of the wider story.",
    buttonLabel: "Meet the team",
    href: "/team",
  },
  {
    image: Samuel,
    kicker: "BEHIND THE SCENES",
    title: "Real stories. Real moments. Real impact.",
    description:
      "A creative process built on trust, presence and the lived realities of the people we serve.",
    buttonLabel: "Explore shows",
    href: "/programs",
  },
  {
    image: Innocent,
    kicker: "LIVE ENERGY",
    title: "Community stories that move with the culture.",
    description:
      "Music, ideas and experiences that carry the heartbeat of our community into the spotlight.",
    buttonLabel: "View gallery",
    href: "/gallery",
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
    <section className="relative overflow-hidden bg-[#0b0a09]">
      <div className="relative mx-auto max-w-[1800px]">
        <div className="grid min-h-[78vh] grid-cols-1 lg:grid-cols-[1.22fr_0.78fr]">
          <div className="relative min-h-[420px] overflow-hidden border-b border-[#d4a54a]/20 bg-black lg:border-b-0 lg:border-r lg:border-[#d4a54a]/20">
            <div className="absolute inset-0">
              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                priority
                className="object-cover scale-105 blur-[1px] brightness-75 contrast-110"
                sizes="(max-width: 1024px) 100vw, 62vw"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_35%,rgba(0,0,0,0.35)_100%)]" />

            <div className="absolute left-0 top-0 z-10 flex h-full w-full items-end p-4 sm:p-6 lg:p-8">
              <div className="max-w-[72%]">
                <div className="mb-2 inline-flex rounded-full border border-[#d4a54a]/40 bg-black/30 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#f1c867] backdrop-blur-sm">
                  {currentSlide.kicker}
                </div>
                <div className="text-[2.8rem] font-black leading-[0.8] tracking-[-0.08em] text-white sm:text-[4.3rem] lg:text-[5.4rem]">
                  {currentSlide.title.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-[#050505] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#d4a54a] sm:text-xs">
                {currentSlide.kicker}
              </p>

              <h1
                id="home-heading"
                className="mt-4 max-w-[520px] text-[2.2rem] font-black leading-[0.88] tracking-[-0.07em] text-[#f8d12d] sm:text-[3.2rem] lg:text-[4.6rem]"
              >
                {currentSlide.title}
              </h1>

              <p className="mt-5 max-w-[530px] text-base leading-7 text-[#f2ebe2] sm:text-lg lg:text-[1.65rem] lg:leading-[1.45]">
                {currentSlide.description}
              </p>

              <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href={currentSlide.href}
                  className="inline-flex min-h-[3.4rem] items-center gap-3 rounded-[0.9rem] bg-[#f4cf2d] px-6 text-base font-black uppercase tracking-[0.02em] text-[#080808] shadow-[0_8px_18px_rgba(244,207,45,0.25)] transition hover:bg-[#f7d85b] sm:min-h-[3.8rem] sm:px-8"
                >
                  <Play size={18} fill="currentColor" aria-hidden="true" />
                  {currentSlide.buttonLabel}
                </Link>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#d4a54a]/20 pt-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() =>
                    setActiveIndex((current) =>
                      current === 0 ? slides.length - 1 : current - 1,
                    )
                  }
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#d4a54a]/40 bg-transparent text-[#f4cf2d] transition hover:bg-[#d4a54a]/10"
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>

                {slides.map((slide, index) => (
                  <button
                    key={`${slide.kicker}-${index}`}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-pressed={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                    className={`h-3.5 w-3.5 rounded-full border transition-all ${
                      index === activeIndex
                        ? "w-9 border-[#f4cf2d] bg-[#f4cf2d]"
                        : "border-[#f4cf2d]/70 bg-transparent"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="grid h-14 w-14 place-items-center rounded-full bg-[#f4cf2d] text-[#090909] transition hover:bg-[#f7d85b]"
              >
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
