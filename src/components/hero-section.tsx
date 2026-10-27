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
    title: "Moving Africa's creative future forward through authentic sound.",
    description:
      "Original conversations, vibrant soundscapes, and community-powered stories created for the people who shape our culture every day.",
    buttonLabel: "Explore Lineup",
    href: "#programs",
    secondaryLabel: "The Countdown",
    secondaryHref: "#charts",
  },
  {
    image: Daniel,
    kicker: "COMMUNITY PERSPECTIVES",
    title: "Voices that challenge, inspire, and shape the continental narrative.",
    description:
      "From grassroots dialogue to breakthrough ideas, every conversation adds rhythm and depth to our shared East African frequency.",
    buttonLabel: "Meet Presenters",
    href: "/team",
    secondaryLabel: "Our Mission",
    secondaryHref: "/about",
  },
  {
    image: StudioImage,
    kicker: "INSIDE THE STUDIO",
    title: "Behind the microphone with the people driving the culture forward.",
    description:
      "Experience the craft, dedication, and creative authenticity that make CBM Radio the true cultural heartbeat of the community.",
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
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative isolate min-h-[85svh] overflow-hidden bg-[#060a08] text-white flex flex-col justify-between">
      {/* Background slide images with cinematic crossfade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.kicker}
          className={`absolute inset-0 -z-20 transition-all duration-1000 ease-out ${
            idx === activeIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={idx === 0}
            aria-hidden="true"
            className="object-cover object-center filter brightness-[0.5] contrast-[1.1]"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Atmospheric depth gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#040807]/95 via-[#040807]/70 to-[#040807]/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,212,165,0.15)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060a08] via-transparent to-transparent"
      />

      {/* Main Hero Container */}
      <div className="mx-auto flex flex-1 w-full max-w-7xl items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
        <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#08120e]/80 p-7 shadow-[0_32px_100px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-10 lg:p-12 transition-all duration-300 hover:border-white/25">
          
          {/* Subtle top edge glow */}
          <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#00d4a5]/80 to-transparent" />

          {/* Top Kicker & 3D Floating Frequency Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#62e6d4]">
              <Sparkles size={13} /> {currentSlide.kicker}
            </span>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
              <span className="size-2 rounded-full bg-[#00d4a5] shadow-[0_0_8px_#00d4a5]" />
              <span>CBM DIGITAL STEREO</span>
            </div>
          </div>

          {/* Headline */}
          <h1
            id="home-heading"
            className="mt-6 text-3xl font-black leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {currentSlide.title}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {currentSlide.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={currentSlide.href}
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#00d4a5] px-7 text-sm font-black uppercase tracking-wider text-[#062521] shadow-[0_8px_25px_rgba(0,212,165,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#34e2b8] hover:shadow-[0_12px_32px_rgba(0,212,165,0.45)]"
            >
              <span>{currentSlide.buttonLabel}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>

            <Link
              href={currentSlide.secondaryHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00d4a5] hover:text-[#00d4a5]"
            >
              <Compass size={16} className="text-[#00d4a5]" aria-hidden="true" />
              <span>{currentSlide.secondaryLabel}</span>
            </Link>
          </div>

          {/* Slide Navigation Pagination */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5">
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
                      ? "w-10 bg-[#00d4a5] shadow-[0_0_8px_rgba(0,212,165,0.5)]"
                      : "w-4 bg-white/20 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black tabular-nums tracking-widest text-white/60">
                0{activeIndex + 1} <span className="text-white/30">/</span> 0{slides.length}
              </span>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === 0 ? slides.length - 1 : current - 1,
                  )
                }
                className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm transition-all hover:border-[#00d4a5] hover:text-[#00d4a5] hover:scale-105"
              >
                <ArrowLeft size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() =>
                  setActiveIndex((current) => (current + 1) % slides.length)
                }
                className="grid size-9 place-items-center rounded-full bg-[#00d4a5] text-[#062521] shadow-[0_4px_16px_rgba(0,212,165,0.25)] transition-all hover:scale-105 hover:bg-[#34e2b8]"
              >
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Station Ticker */}
      <div className="relative border-y border-white/10 bg-[#050807]/90 py-3.5 backdrop-blur-md overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-white/65">
          <span className="flex items-center gap-2 text-[#00d4a5]">
            <Radio size={14} aria-hidden="true" /> CBM RADIO FREQUENCY
          </span>
          <span className="text-white/30">•</span>
          <span>THE SOUNDTRACK OF OUR CULTURE</span>
          <span className="text-white/30">•</span>
          <span className="text-[#00d4a5]">STORIES, MUSIC & CONVERSATIONS</span>
          <span className="text-white/30">•</span>
          <span>COMMUNITY VOICES ACROSS EAST AFRICA & BEYOND</span>
          <span className="text-white/30">•</span>
          <span>MEDIA • ENTERTAINMENT • TECHNOLOGY • ARTS</span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-2 text-[#00d4a5]">
            <Radio size={14} aria-hidden="true" /> CBM RADIO FREQUENCY
          </span>
          <span className="text-white/30">•</span>
          <span>THE SOUNDTRACK OF OUR CULTURE</span>
          <span className="text-white/30">•</span>
          <span className="text-[#00d4a5]">STORIES, MUSIC & CONVERSATIONS</span>
          <span className="text-white/30">•</span>
          <span>COMMUNITY VOICES ACROSS EAST AFRICA & BEYOND</span>
          <span className="text-white/30">•</span>
          <span>MEDIA • ENTERTAINMENT • TECHNOLOGY • ARTS</span>
          <span className="text-white/30">•</span>
        </div>
      </div>
    </section>
  );
}
