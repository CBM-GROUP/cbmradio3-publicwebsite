"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Radio,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";
import Daniel from "../../public/cbm_images/daniel.svg";
import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

const slides = [
  {
    image: FeaturedShow,
    kicker: "MEDIA, ENTERTAINMENT & TECH",
    title: "We bring media, entertainment, technology, and entrepreneurship together to move Africa's creative future forward.",
    description:
      "Original conversations, vibrant soundscapes, and community-powered stories made for the people who make our culture what it is.",
    buttonLabel: "Explore Lineup",
    href: "#programs",
    secondaryLabel: "The Countdown",
    secondaryHref: "#charts",
  },
  {
    image: Daniel,
    kicker: "COMMUNITY PERSPECTIVES",
    title: "Voices that challenge, inspire, and shape the narrative of our society.",
    description:
      "From grassroots discussions to continental breakthroughs, every voice adds rhythm to our shared frequency.",
    buttonLabel: "Meet The Team",
    href: "/team",
    secondaryLabel: "Our Mission",
    secondaryHref: "/about",
  },
  {
    image: StudioImage,
    kicker: "INSIDE THE STUDIO",
    title: "Behind the microphone with the people driving the culture forward.",
    description:
      "Experience the passion, authenticity, and creative craft that make CBM Radio the heartbeat of our community.",
    buttonLabel: "Studio Moments",
    href: "/gallery",
    secondaryLabel: "Latest News",
    secondaryHref: "#news",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative isolate min-h-[82svh] overflow-hidden bg-[#070b0a] text-white flex flex-col justify-between">
      {/* Background slide images with smooth crossfade transition */}
      {slides.map((slide, idx) => (
        <div
          key={slide.kicker}
          className={`absolute inset-0 -z-20 transition-opacity duration-1000 ease-in-out ${
            idx === activeIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={idx === 0}
            aria-hidden="true"
            className="object-cover object-center filter brightness-[0.65] contrast-[1.05]"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Atmospheric dark gradient overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#040908]/95 via-[#040908]/75 to-[#040908]/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(4,9,8,0.8)_85%)]"
      />

      {/* Main Hero Container */}
      <div className="mx-auto flex flex-1 w-full max-w-7xl items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="cbm-card relative w-full max-w-3xl rounded-3xl border border-white/20 border-t-2 border-t-[#00d4a5] bg-[#07110f]/85 p-7 shadow-[0_32px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-10 lg:p-12">
          
          {/* Top Kicker & Station Frequency */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#62e6d4]">
              <Sparkles size={13} /> {currentSlide.kicker}
            </span>

            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/50">
              CBM DIGITAL FREQUENCY
            </span>
          </div>

          {/* Headline */}
          <h1
            id="home-heading"
            className="mt-6 text-3xl font-black leading-[1.1] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl"
          >
            {currentSlide.title}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
            {currentSlide.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={currentSlide.href}
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#00d4a5] px-7 text-sm font-extrabold text-[#062521] shadow-[0_8px_25px_rgba(0,212,165,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#48d4c1] hover:shadow-[0_12px_32px_rgba(0,212,165,0.35)]"
            >
              <span>{currentSlide.buttonLabel}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>

            <Link
              href={currentSlide.secondaryHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00d4a5] hover:text-[#00d4a5]"
            >
              <Compass size={16} className="text-[#00d4a5]" aria-hidden="true" />
              <span>{currentSlide.secondaryLabel}</span>
            </Link>
          </div>

          {/* Slide Navigation Pagination */}
          <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-5">
            <div className="flex items-center gap-2.5" aria-label="Slide indicators">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.kicker}-${index}`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}: ${slide.kicker}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-10 bg-[#00d4a5]"
                      : "w-4 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold tabular-nums text-white/80">
                0{activeIndex + 1} <span className="text-white/40">/</span> 0{slides.length}
              </span>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === 0 ? slides.length - 1 : current - 1,
                  )
                }
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all hover:border-[#00d4a5] hover:text-[#00d4a5]"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() =>
                  setActiveIndex((current) => (current + 1) % slides.length)
                }
                className="grid h-10 w-10 place-items-center rounded-full bg-[#00d4a5] text-[#062521] shadow-[0_6px_20px_rgba(0,212,165,0.2)] transition-all hover:scale-105 hover:bg-[#48d4c1]"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cultural Station Ticker (Clean, without intrusive 'Live on Air' tags) */}
      <div className="relative border-y border-white/10 bg-[#060a09] py-3 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-white/70">
          <span className="flex items-center gap-2 text-[#00d4a5]">
            <Radio size={14} aria-hidden="true" /> CBM RADIO FREQUENCY
          </span>
          <span>•</span>
          <span>THE SOUNDTRACK OF OUR CULTURE</span>
          <span>•</span>
          <span className="text-[#48d4c1]">STORIES, MUSIC & CONVERSATIONS</span>
          <span>•</span>
          <span>COMMUNITY VOICES ACROSS EAST AFRICA & BEYOND</span>
          <span>•</span>
          <span>MEDIA • ENTERTAINMENT • TECHNOLOGY • ARTS</span>
          <span>•</span>
          <span className="flex items-center gap-2 text-[#00d4a5]">
            <Radio size={14} aria-hidden="true" /> CBM RADIO FREQUENCY
          </span>
          <span>•</span>
          <span>THE SOUNDTRACK OF OUR CULTURE</span>
          <span>•</span>
          <span className="text-[#48d4c1]">STORIES, MUSIC & CONVERSATIONS</span>
          <span>•</span>
          <span>COMMUNITY VOICES ACROSS EAST AFRICA & BEYOND</span>
          <span>•</span>
          <span>MEDIA • ENTERTAINMENT • TECHNOLOGY • ARTS</span>
          <span>•</span>
        </div>
      </div>
    </section>
  );
}
