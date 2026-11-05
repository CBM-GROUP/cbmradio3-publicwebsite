"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
  Headphones,
  Play,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

import { pageHeroService } from "@/services/page-hero.service";
import type { HeroSlide, PageHero as PageHeroData } from "@/types/page-hero";
import { getYouTubeMedia } from "@/lib/youtube";
import YouTubeDialog from "@/components/media/youtube-dialog";

const FALLBACK_HERO = {
  title: "Moving African Sound, Culture & Faith Forward.",
  subtitle: "CBM RADIO • KAMPALA & WORLDWIDE",
  description:
    "Authentic dialogue, transformative conversations, and community-powered stories created for the people who shape culture every day. Streaming 24/7 online and on demand.",
  ctaLabel: "Stream Episodes",
  ctaUrl: "#episodes",
  image: "/cbm_images/behind-the-scenes-studio.png",
};

function isUsableSlide(slide: HeroSlide | null | undefined): slide is HeroSlide {
  if (!slide || typeof slide !== "object") return false;
  return Boolean(
    slide.is_active &&
      (slide.resolved_image_url || slide.uploaded_image || slide.external_image_url || slide.video_url),
  );
}

function getSafeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return "";
}

function getSafeWebUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return "";
}

export default function HomeHero() {
  const [hero, setHero] = useState<PageHeroData | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    media: NonNullable<ReturnType<typeof getYouTubeMedia>>;
  } | null>(null);

  // Fetch home page hero configured from dashboard
  useEffect(() => {
    let isMounted = true;

    pageHeroService
      .getPageHero("home")
      .then((data) => {
        if (isMounted && data) {
          setHero(data);
        }
      })
      .catch(() => {
        // Fallback used
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter slides if multi-slide
  const slides = useMemo(() => {
    if (!hero || hero.media_type !== "slides" || !Array.isArray(hero.slides)) {
      return [];
    }
    return [...hero.slides]
      .filter(isUsableSlide)
      .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  }, [hero]);

  const hasMultipleSlides = slides.length > 1;
  const safeIndex = slides.length > 0 ? Math.min(activeSlideIndex, slides.length - 1) : 0;
  const activeSlide = slides.length > 0 ? slides[safeIndex] : null;

  // Auto-advance slides only if multiple valid slides exist and user is not paused
  useEffect(() => {
    if (!hasMultipleSlides || isPaused || activeVideoModal) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [hasMultipleSlides, slides.length, isPaused, activeVideoModal]);

  // Derived content
  const title = activeSlide?.title || hero?.title || FALLBACK_HERO.title;
  const subtitle = activeSlide?.subtitle || hero?.subtitle || FALLBACK_HERO.subtitle;
  const description = activeSlide?.description || hero?.description || FALLBACK_HERO.description;
  const ctaLabel = activeSlide?.cta_label || hero?.cta_label || FALLBACK_HERO.ctaLabel;
  const ctaUrl = activeSlide?.cta_url || hero?.cta_url || FALLBACK_HERO.ctaUrl;

  const mediaType: "none" | "image" | "video" =
    hero?.media_type === "slides"
      ? activeSlide?.media_type === "video"
        ? "video"
        : "image"
      : (hero?.media_type as "none" | "image" | "video") || "image";

  const imageUrl =
    hero?.media_type === "slides"
      ? getSafeImageUrl(
          activeSlide?.resolved_image_url ||
            activeSlide?.uploaded_image ||
            activeSlide?.external_image_url,
        )
      : getSafeImageUrl(
          hero?.resolved_image_url || hero?.uploaded_image || hero?.external_image_url,
        ) || FALLBACK_HERO.image;

  const videoUrl =
    hero?.media_type === "slides"
      ? getSafeWebUrl(activeSlide?.video_url)
      : getSafeWebUrl(hero?.video_url);

  const isVideo = mediaType === "video" && Boolean(videoUrl);
  const hasImage = (mediaType === "image" && Boolean(imageUrl)) || (!isVideo && Boolean(imageUrl));
  const youtubeMedia = isVideo ? getYouTubeMedia(videoUrl) : null;
  const directVideoUrl = isVideo && !youtubeMedia ? videoUrl : null;

  // Overlay configuration
  const overlayStrength =
    typeof hero?.overlay_strength === "number" && Number.isFinite(hero.overlay_strength)
      ? hero.overlay_strength
      : 65;
  const overlay = Math.min(95, Math.max(30, overlayStrength)) / 100;

  return (
    <section
      className="relative flex min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex-col justify-between overflow-hidden border-b-2 border-black bg-black text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="CBM Flagship Homepage Hero"
    >
      {/* 1. MEDIA LAYER: Photographic Backdrop */}
      {hasImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            key={imageUrl}
            src={imageUrl}
            alt={title}
            fill
            sizes="100vw"
            priority
            unoptimized={imageUrl.startsWith("http") || imageUrl.startsWith("/api/")}
            className="object-cover object-center transition-all duration-700 ease-out"
          />
        </div>
      )}

      {/* 2. MEDIA LAYER: Direct Video Backdrop (HTML5) */}
      {directVideoUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            key={directVideoUrl}
            src={directVideoUrl}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => setIsVideoMuted(!isVideoMuted)}
            className="absolute bottom-6 left-6 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur border border-white/20 hover:bg-[#04b093] hover:text-black transition-all shadow-lg"
            aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
          >
            {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* 3. MEDIA LAYER: YouTube Ambient Loop */}
      {youtubeMedia && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <iframe
            src={`${youtubeMedia.embedUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeMedia.videoId}&playsinline=1`}
            title={title}
            className="h-[140%] w-[140%] -translate-x-[15%] -translate-y-[15%] object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        </div>
      )}

      {/* 4. MULTI-LAYER CINEMATIC OVERLAYS FOR 100% READABILITY */}
      <div
        className="absolute inset-0 bg-black z-[1] transition-opacity duration-700"
        style={{ opacity: overlay }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-[2]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-[2]"
        aria-hidden="true"
      />

      {/* 5. TOP STATUS & BRANDING STRIP (Clean & Dignified — No frequencies) */}
      <div className="relative z-20 w-full border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2.5">
            <span className="flex size-2 rounded-full bg-[#04b093] animate-pulse" />
            <span className="text-[0.68rem] font-black uppercase tracking-[0.25em] text-[#04b093]">
              CBM DIGITAL RADIO
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400">
              KAMPALA &amp; WORLDWIDE
            </span>
          </div>

          <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-zinc-300">
            <Sparkles size={12} className="text-[#04b093]" />
            <span>24/7 DIGITAL STREAM</span>
          </div>
        </div>
      </div>

      {/* 6. MAIN HERO STAGE CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="max-w-3xl">
          {/* Eyebrow / Kicker */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-[#04b093] px-3.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.25em] text-black shadow-md">
              CBM FLAGSHIP
            </span>

            {subtitle && (
              <span className="text-[0.68rem] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-1.5">
                <span>{subtitle}</span>
              </span>
            )}
          </div>

          {/* Massive Display Headline */}
          <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] text-white drop-shadow-md">
            {title}
          </h1>

          {/* Subtitle / Lead Deck */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-200 font-medium drop-shadow">
            {description}
          </p>

          {/* Call-to-Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Primary Action Button */}
            {ctaUrl ? (
              <a
                href={ctaUrl}
                target={ctaUrl.startsWith("http") ? "_blank" : undefined}
                rel={ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#04b093] px-7 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(4,176,147,0.45)] cursor-pointer"
              >
                <Headphones size={16} />
                <span>{ctaLabel || "Stream Episodes"}</span>
                <ArrowUpRight size={15} />
              </a>
            ) : (
              <a
                href="#episodes"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#04b093] px-7 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(4,176,147,0.45)] cursor-pointer"
              >
                <Headphones size={16} />
                <span>Stream Episodes</span>
              </a>
            )}

            {/* Video Slide Modal Button (if YouTube video present) */}
            {youtubeMedia && (
              <button
                type="button"
                onClick={() =>
                  setActiveVideoModal({
                    title,
                    media: youtubeMedia,
                  })
                }
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-6 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Film size={15} className="text-[#04b093]" />
                <span>Watch Video</span>
              </button>
            )}

            {/* Secondary Link: Shows */}
            <a
              href="#shows"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/30 bg-black/40 backdrop-blur px-6 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Radio size={15} />
              <span>Explore Series</span>
            </a>

            {/* Charts Link */}
            <Link
              href="/charts"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-xs font-black uppercase tracking-wider text-zinc-300 transition-all hover:bg-white/15 hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Music Charts</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 7. SLIDE CONTROLS (Only visible if multiple valid slides exist in DB) */}
      {hasMultipleSlides && (
        <div className="relative z-20 border-t border-white/10 bg-black/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`size-2.5 rounded-full transition-all cursor-pointer ${
                    idx === safeIndex ? "bg-[#04b093] w-7" : "bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
                }
                className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#04b093] hover:text-black transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setActiveSlideIndex((prev) => (prev + 1) % slides.length)}
                className="grid size-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#04b093] hover:text-black transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. YOUTUBE VIDEO DIALOG MODAL */}
      {activeVideoModal && (
        <YouTubeDialog
          title={activeVideoModal.title}
          media={activeVideoModal.media}
          returnFocus={null}
          onClose={() => setActiveVideoModal(null)}
        />
      )}
    </section>
  );
}
