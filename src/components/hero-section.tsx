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
    <section className="relative overflow-hidden bg-[#0a0d0c]">
      <div className="relative mx-auto max-w-[1800px]">
        <div className="grid min-h-[78vh] grid-cols-1 lg:grid-cols-[1.28fr_0.72fr]">
          <div className="relative min-h-[420px] overflow-hidden bg-black">
            <div className="absolute inset-0">
              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                priority
                className="object-cover brightness-75 contrast-110"
                sizes="(max-width: 1024px) 100vw, 62vw"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.15)_100%)]" />
          </div>

          <div className="flex flex-col justify-center bg-[#0a0d0c] px-5 py-7 sm:px-8 lg:px-10">
            <div className="max-w-[620px]">
              <h1
                id="home-heading"
                className="text-[2.1rem] font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-[2.9rem] lg:text-[4.8rem]"
              >
                {currentSlide.title}
              </h1>

              <p className="mt-5 text-base leading-7 text-[#dfeae7] sm:text-lg lg:text-[1.32rem] lg:leading-[1.45]">
                {currentSlide.description}
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  href={currentSlide.buttonLabel === "Explore our brands" ? "/programs" : currentSlide.href}
                  className="inline-flex min-h-[3.2rem] items-center gap-3 rounded-full bg-[#48d4c1] px-7 text-base font-bold text-[#0a0d0c] transition hover:bg-[#6ae3d1] sm:min-h-[3.5rem] sm:text-lg"
                >
                  {currentSlide.buttonLabel === "Explore our brands" ? (
                    <span className="inline-flex items-center gap-3">
                      <span>Explore our brands</span>
                      <span aria-hidden="true" className="text-xl">↗</span>
                    </span>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" aria-hidden="true" />
                      {currentSlide.buttonLabel}
                    </>
                  )}
                </Link>

                <Link
                  href={currentSlide.secondaryHref}
                  className="inline-flex min-h-[3.2rem] items-center gap-3 rounded-full border border-white/20 bg-transparent px-7 text-base font-bold text-white transition hover:border-[#48d4c1] hover:text-[#48d4c1] sm:min-h-[3.5rem] sm:text-lg"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#48d4c1] text-[#0a0d0c]">
                    <Play size={12} fill="currentColor" aria-hidden="true" />
                  </span>
                  {currentSlide.secondaryLabel}
                </Link>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() =>
                    setActiveIndex((current) =>
                      current === 0 ? slides.length - 1 : current - 1,
                    )
                  }
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-transparent text-white transition hover:border-[#48d4c1] hover:text-[#48d4c1]"
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
                        ? "w-8 border-[#48d4c1] bg-[#48d4c1]"
                        : "border-white/60 bg-transparent"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="grid h-12 w-12 place-items-center rounded-full bg-[#48d4c1] text-[#0a0d0c] transition hover:bg-[#6ae3d1]"
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
