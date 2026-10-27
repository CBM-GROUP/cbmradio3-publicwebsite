"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Headphones,
  Pause,
  Play,
  Radio,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import FeaturedShow from "../../public/cbm_images/radio 2.jpeg";
import Daniel from "../../public/cbm_images/daniel.svg";
import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

const slides = [
  {
    image: FeaturedShow,
    kicker: "LIVE BROADCAST & CULTURE",
    title: "The pulse of community, music, and the creative spirit of Africa.",
    description:
      "Original conversations, vibrant soundscapes, and community-powered stories broadcast 24/7 for you.",
    buttonLabel: "Explore Shows",
    href: "#programs",
    secondaryLabel: "The Countdown",
    secondaryHref: "#charts",
    tag: "NOW STREAMING",
  },
  {
    image: Daniel,
    kicker: "COMMUNITY VOICES",
    title: "Unfiltered voices that inspire, challenge, and elevate culture.",
    description:
      "From grassroots discussions to continental breakthroughs, every voice adds rhythm to our shared frequency.",
    buttonLabel: "Meet the Team",
    href: "/team",
    secondaryLabel: "Our Story",
    secondaryHref: "/about",
    tag: "FEATURED TALENT",
  },
  {
    image: StudioImage,
    kicker: "INSIDE THE STUDIO",
    title: "Behind the microphone with the people shaping the conversations.",
    description:
      "Experience the energy, the passion, and the craft that makes CBM Radio the heartbeat of East Africa.",
    buttonLabel: "Studio Moments",
    href: "/gallery",
    secondaryLabel: "Latest News",
    secondaryHref: "#news",
    tag: "BEHIND THE SCENES",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const rawStreamUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL?.trim();
  const streamUrl =
    rawStreamUrl && (rawStreamUrl.startsWith("http://") || rawStreamUrl.startsWith("https://"))
      ? rawStreamUrl
      : "https://stream.zeno.fm/f3wvbbqmdg8uv"; // Reliable fallback live stream if none configured

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingStream(true);
      setStreamError(false);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingStream(false);
        })
        .catch((err) => {
          console.warn("Stream playback failed or autoplay was blocked:", err);
          setIsPlaying(false);
          setIsLoadingStream(false);
          setStreamError(true);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative isolate -mt-16 min-h-[84svh] overflow-hidden bg-[#070b0a] pt-16 text-white">
      {/* Background slide images with subtle crossfade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.kicker}
          className={`absolute inset-0 -z-20 transition-opacity duration-1000 ease-in-out ${
            idx === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={idx === 0}
            aria-hidden="true"
            className="object-cover object-center filter brightness-[0.7] contrast-[1.05]"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Atmospheric dark gradient overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#040908]/95 via-[#040908]/75 to-[#040908]/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-radial-gradient from-transparent via-[#040908]/50 to-[#040908]/90"
      />

      {/* Hidden audio element for high fidelity playback */}
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="none"
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoadingStream(false);
          setStreamError(false);
        }}
        onWaiting={() => setIsLoadingStream(true)}
        onError={() => {
          setIsLoadingStream(false);
          setIsPlaying(false);
          setStreamError(true);
        }}
      />

      <div className="mx-auto flex min-h-[82svh] max-w-[1800px] flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:gap-12">
          
          {/* Main Glassmorphic Feature Card */}
          <div className="cbm-card relative w-full rounded-2xl border border-white/20 border-t-2 border-t-[#00d4a5] bg-[#07110f]/80 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-9 lg:p-11">
            
            {/* Top Badge & Live Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-red-400">
                  ON AIR
                </span>
                <span className="inline-flex rounded-full border border-[#48d4c1]/30 bg-[#48d4c1]/10 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#62e6d4]">
                  {currentSlide.kicker}
                </span>
              </div>

              <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-zinc-400">
                98.5 FM & DIGITAL STREAM
              </span>
            </div>

            {/* Title */}
            <h1
              id="home-heading"
              className="mt-6 text-3xl font-black leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl"
            >
              {currentSlide.title}
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[48ch] text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              {currentSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause live radio" : "Listen to live radio"}
                className={`inline-flex min-h-12 items-center gap-3 rounded-full px-6 text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 ${
                  isPlaying
                    ? "bg-red-500 text-white shadow-[0_8px_25px_rgba(239,68,68,0.35)] hover:bg-red-600"
                    : "bg-[#00d4a5] text-[#062521] shadow-[0_8px_25px_rgba(0,212,165,0.25)] hover:bg-[#48d4c1] hover:shadow-[0_12px_32px_rgba(0,212,165,0.35)]"
                }`}
              >
                {isLoadingStream ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : isPlaying ? (
                  <Pause size={17} fill="currentColor" aria-hidden="true" />
                ) : (
                  <Play size={17} fill="currentColor" aria-hidden="true" />
                )}
                <span>{isLoadingStream ? "Connecting..." : isPlaying ? "Pause Live Stream" : "Listen Live Now"}</span>
              </button>

              <Link
                href={currentSlide.href}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-6 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#48d4c1] hover:bg-white/10 hover:text-[#62e6d4]"
              >
                {currentSlide.buttonLabel}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>

              <Link
                href={currentSlide.secondaryHref}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-transparent px-4 text-sm font-bold text-white/75 transition-colors hover:text-[#48d4c1]"
              >
                <Zap size={16} className="text-[#00d4a5]" aria-hidden="true" />
                {currentSlide.secondaryLabel}
              </Link>
            </div>

            {/* Slider Navigation Bar */}
            <div className="mt-9 flex items-center justify-between border-t border-white/15 pt-5">
              <div className="flex items-center gap-2" aria-label="Slide selectors">
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.kicker}-${index}`}
                    type="button"
                    aria-label={`Go to slide ${index + 1}: ${slide.kicker}`}
                    aria-pressed={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-10 bg-[#00d4a5]" : "w-4 bg-white/35 hover:bg-white/65"
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
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-all hover:border-[#48d4c1] hover:bg-white/10 hover:text-[#62e6d4]"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#00d4a5] text-[#062521] shadow-[0_6px_20px_rgba(0,212,165,0.2)] transition-all hover:scale-105 hover:bg-[#48d4c1]"
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Dedicated Live Stream Broadcast Console Box */}
          <div className="cbm-card relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#0e1916]/90 to-[#070e0c]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-7">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#00d4a5]/10 text-[#00d4a5]">
                  <Radio size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                    LIVE BROADCAST CONSOLE
                  </p>
                  <h2 className="text-lg font-black text-white">CBM Radio 24/7</h2>
                </div>
              </div>

              {/* Soundwave Equalizer Animation */}
              <div className="flex items-end gap-1 h-6 px-2" aria-hidden="true">
                <span className={`w-1 rounded-full bg-[#00d4a5] ${isPlaying ? "animate-eq-1" : "h-2"}`} />
                <span className={`w-1 rounded-full bg-[#00d4a5] ${isPlaying ? "animate-eq-2" : "h-4"}`} />
                <span className={`w-1 rounded-full bg-[#00d4a5] ${isPlaying ? "animate-eq-3" : "h-3"}`} />
                <span className={`w-1 rounded-full bg-[#00d4a5] ${isPlaying ? "animate-eq-4" : "h-1"}`} />
              </div>
            </div>

            {/* Now Playing Banner */}
            <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#00d4a5]">
                  <Headphones size={13} aria-hidden="true" /> Currently Streaming
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-white/80">
                  HQ 320 KBPS
                </span>
              </div>
              <p className="mt-2 text-base font-extrabold text-white">
                {isPlaying ? "Live Broadcast Stream • East African & Global Sounds" : "Live Stream Ready • Click to Tune In"}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Streaming non-stop conversations, music, culture and perspectives.
              </p>
            </div>

            {/* Audio Controls Bar */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause broadcast" : "Play broadcast"}
                className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-extrabold transition-all ${
                  isPlaying
                    ? "bg-red-500/90 text-white hover:bg-red-600"
                    : "bg-[#00d4a5] text-[#062521] hover:bg-[#48d4c1]"
                }`}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                <span>{isPlaying ? "Pause Audio" : "Play Live Broadcast"}</span>
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-[#00d4a5] hover:text-[#00d4a5]"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            {streamError && (
              <p className="mt-3 text-center text-xs text-amber-300" role="alert">
                Stream unavailable at this moment. Please check back shortly.
              </p>
            )}

            {/* Quick Stats Grid */}
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
              <div className="rounded-lg bg-white/[0.03] p-2.5">
                <p className="text-base font-black text-[#00d4a5]">24/7</p>
                <p className="text-[0.65rem] font-bold uppercase text-white/60">Broadcast</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2.5">
                <p className="text-base font-black text-[#00d4a5]">Top 20</p>
                <p className="text-[0.65rem] font-bold uppercase text-white/60">Countdown</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2.5">
                <p className="text-base font-black text-[#00d4a5]">100%</p>
                <p className="text-[0.65rem] font-bold uppercase text-white/60">Community</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Marquee Broadcast Wire strip */}
      <div className="relative border-y border-white/10 bg-[#060a09] py-2.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-white/70">
          <span className="flex items-center gap-2 text-[#00d4a5]">
            <Radio size={14} aria-hidden="true" /> CBM RADIO BROADCAST WIRE
          </span>
          <span>•</span>
          <span>THE SOUNDTRACK OF OUR CULTURE</span>
          <span>•</span>
          <span className="text-[#48d4c1]">LIVE DISCUSSIONS & COMMUNITY HEARTH</span>
          <span>•</span>
          <span>FIND YOUR FREQUENCY</span>
          <span>•</span>
          <span className="text-red-400">● LIVE ON AIR ACROSS EAST AFRICA & GLOBALLY</span>
          <span>•</span>
          <span>MUSIC • TALK • PODCASTS • REVIEWS</span>
          <span>•</span>
          <span className="flex items-center gap-2 text-[#00d4a5]">
            <Radio size={14} aria-hidden="true" /> CBM RADIO BROADCAST WIRE
          </span>
          <span>•</span>
          <span>THE SOUNDTRACK OF OUR CULTURE</span>
          <span>•</span>
          <span className="text-[#48d4c1]">LIVE DISCUSSIONS & COMMUNITY HEARTH</span>
          <span>•</span>
          <span>FIND YOUR FREQUENCY</span>
          <span>•</span>
          <span className="text-red-400">● LIVE ON AIR ACROSS EAST AFRICA & GLOBALLY</span>
          <span>•</span>
        </div>
      </div>
    </section>
  );
}
