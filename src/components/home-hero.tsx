"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Headphones,
  Image as ImageIcon,
  Pause,
  Play,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

import { pageHeroService } from "@/services/page-hero.service";
import homeService from "@/services/home.service";
import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import type { HeroSlide, PageHero as PageHeroData } from "@/types/page-hero";
import type { EpisodeSummary } from "@/types/program";
import { getYouTubeMedia } from "@/lib/youtube";
import YouTubeDialog from "@/components/media/youtube-dialog";

const FALLBACK_HERO = {
  title: "Moving African Sound, Culture & Faith Forward.",
  subtitle: "CBM RADIO 91.4 FM • KAMPALA & WORLDWIDE",
  description:
    "Authentic dialogue, transformative conversations, and community-powered stories created for the people who shape culture every day. Broadcasting 24/7 on 91.4 FM and streaming on demand.",
  ctaLabel: "Listen Live",
  ctaUrl: "#episodes",
  image: "/cbm_images/behind-the-scenes-studio.png",
};

const SLIDE_DURATION_MS = 6500;

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
  const [latestEpisodes, setLatestEpisodes] = useState<EpisodeSummary[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    media: NonNullable<ReturnType<typeof getYouTubeMedia>>;
  } | null>(null);

  const { playEpisode, isPlaying, currentEpisode } = useEpisodePlayerStore();

  // Load hero and latest episode
  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      pageHeroService.getPageHero("home"),
      homeService.getLatestEpisodes(),
    ]).then(([heroRes, epsRes]) => {
      if (!isMounted) return;

      if (heroRes.status === "fulfilled" && heroRes.value) {
        setHero(heroRes.value);
      }
      if (epsRes.status === "fulfilled" && Array.isArray(epsRes.value)) {
        setLatestEpisodes(epsRes.value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter valid slides
  const slides = useMemo(() => {
    if (!hero || hero.media_type !== "slides" || !Array.isArray(hero.slides)) {
      return [];
    }
    return [...hero.slides]
      .filter(isUsableSlide)
      .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  }, [hero]);

  const isMultiSlide = hero?.media_type === "slides" && slides.length > 0;
  const safeIndex = isMultiSlide ? Math.min(activeSlideIndex, slides.length - 1) : 0;

  // Slide navigation
  const nextSlide = useCallback(() => {
    if (!slides.length) return;
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    setSlideProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (!slides.length) return;
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setSlideProgress(0);
  }, [slides.length]);

  const goToSlide = useCallback((idx: number) => {
    setActiveSlideIndex(idx);
    setSlideProgress(0);
  }, []);

  // Auto-advance multi-slide carousel with smooth progress tracking
  useEffect(() => {
    if (!isMultiSlide || slides.length <= 1 || isPaused || activeVideoModal) {
      setSlideProgress(0);
      return;
    }

    const intervalTime = 100;
    const step = (intervalTime / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev + step >= 100) {
          setActiveSlideIndex((current) => (current + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isMultiSlide, slides.length, isPaused, activeVideoModal]);

  // Current display content
  const activeSlide = isMultiSlide ? slides[safeIndex] : null;

  const title =
    activeSlide?.title ||
    hero?.title ||
    FALLBACK_HERO.title;

  const subtitle =
    activeSlide?.subtitle ||
    hero?.subtitle ||
    FALLBACK_HERO.subtitle;

  const description =
    activeSlide?.description ||
    hero?.description ||
    FALLBACK_HERO.description;

  const ctaLabel =
    activeSlide?.cta_label ||
    hero?.cta_label ||
    FALLBACK_HERO.ctaLabel;

  const ctaUrl =
    activeSlide?.cta_url ||
    hero?.cta_url ||
    FALLBACK_HERO.ctaUrl;

  const mediaType: "none" | "image" | "video" = isMultiSlide
    ? activeSlide?.media_type === "video"
      ? "video"
      : "image"
    : hero?.media_type === "slides"
    ? "none"
    : (hero?.media_type as "none" | "image" | "video") || "image";

  const imageUrl = isMultiSlide
    ? getSafeImageUrl(
        activeSlide?.resolved_image_url ||
          activeSlide?.uploaded_image ||
          activeSlide?.external_image_url,
      )
    : getSafeImageUrl(hero?.resolved_image_url || hero?.uploaded_image || hero?.external_image_url) ||
      FALLBACK_HERO.image;

  const videoUrl = isMultiSlide
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

  // Handle Play Live / Stream
  const handleListenLive = () => {
    if (latestEpisodes.length > 0) {
      playEpisode(latestEpisodes[0], true);
    } else {
      const episodesElem = document.getElementById("episodes");
      if (episodesElem) {
        episodesElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      className="relative flex min-h-[600px] sm:min-h-[660px] lg:min-h-[720px] flex-col justify-between overflow-hidden border-b-2 border-black bg-black text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="CBM Radio Flagship Broadcast Hero"
    >
      {/* 1. MEDIA LAYER: High-Resolution Photographic Backdrop */}
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
            className="object-cover object-center scale-100 transition-all duration-1000 ease-out"
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
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-45">
          <iframe
            src={`${youtubeMedia.embedUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeMedia.videoId}&playsinline=1`}
            title={title}
            className="h-[140%] w-[140%] -translate-x-[15%] -translate-y-[15%] object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        </div>
      )}

      {/* 4. MULTI-LAYER CINEMATIC OVERLAYS FOR 100% TYPOGRAPHIC READABILITY */}
      <div
        className="absolute inset-0 bg-black z-[1] transition-opacity duration-700"
        style={{ opacity: overlay }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-[2]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-[2]"
        aria-hidden="true"
      />

      {/* 5. TOP BROADCAST HUD BAR (Unique to Homepage Hero) */}
      <div className="relative z-20 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
          {/* Live Frequency & Status Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-white shadow-lg animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>LIVE ON AIR</span>
            </div>

            <span className="rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#04b093] border border-white/10">
              91.4 FM • KAMPALA
            </span>

            {/* Live Audio Equalizer Waves */}
            <div
              className="hidden sm:flex items-end gap-1 h-3.5 px-2 py-0.5 rounded-full bg-black/40 border border-white/10"
              title="Broadcast Signal Active"
            >
              <span className="w-1 bg-[#04b093] rounded-full animate-eq-1 h-full"></span>
              <span className="w-1 bg-[#04b093] rounded-full animate-eq-2 h-full"></span>
              <span className="w-1 bg-[#04b093] rounded-full animate-eq-3 h-full"></span>
              <span className="w-1 bg-[#04b093] rounded-full animate-eq-4 h-full"></span>
            </div>
          </div>

          {/* Network Motto & Global Stream Indicator */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex text-[0.68rem] font-black uppercase tracking-[0.2em] text-zinc-300">
              EAST AFRICA SOUND, CULTURE & FAITH
            </span>
            <div className="flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-widest text-[#04b093]">
              <Sparkles size={12} />
              <span>24/7 STREAM</span>
            </div>
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

          {/* Primary Action Row */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Primary Action Button */}
            {ctaUrl && ctaUrl !== "#episodes" && !ctaUrl.startsWith("#") ? (
              <a
                href={ctaUrl}
                target={ctaUrl.startsWith("http") ? "_blank" : undefined}
                rel={ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#04b093] px-8 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] cursor-pointer"
              >
                <span>{ctaLabel || "Tune In Live"}</span>
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleListenLive}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#04b093] px-8 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} className="fill-black" />
                    <span>Now Playing Live</span>
                  </>
                ) : (
                  <>
                    <Play size={16} className="fill-black" />
                    <span>{ctaLabel || "Listen Live"}</span>
                  </>
                )}
              </button>
            )}

            {/* Video Slide Modal Button */}
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
                <span>Watch Stream Video</span>
              </button>
            )}

            {/* Secondary Link: Shows */}
            <a
              href="#shows"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/30 bg-black/40 backdrop-blur px-6 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Radio size={15} />
              <span>Broadcast Schedule</span>
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

      {/* 7. BOTTOM INTERACTIVE SLIDE DECK / CONTROLS (When Slides Are Active) */}
      {isMultiSlide && slides.length > 1 && (
        <div className="relative z-20 border-t border-white/10 bg-black/75 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
            
            {/* Interactive Slide Selector Tabs with Live Progress Bars */}
            <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {slides.map((slide, idx) => {
                const isActive = idx === safeIndex;
                const slideTitle = slide.title || `Feature 0${idx + 1}`;

                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border px-3.5 py-2 text-left transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "border-[#04b093] bg-[#04b093]/15 text-white ring-1 ring-[#04b093]/40 min-w-[130px] sm:min-w-[160px]"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/30 hover:bg-white/10 min-w-[110px] sm:min-w-[140px]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[0.62rem] font-black uppercase tracking-widest">
                      <span className={isActive ? "text-[#04b093]" : "text-zinc-500"}>
                        0{idx + 1}
                      </span>
                      {slide.media_type === "video" ? (
                        <Film size={11} className={isActive ? "text-[#04b093]" : "text-zinc-500"} />
                      ) : (
                        <ImageIcon size={11} className={isActive ? "text-[#04b093]" : "text-zinc-500"} />
                      )}
                    </div>

                    <p className="mt-1 truncate text-xs font-bold text-white max-w-[140px]">
                      {slideTitle}
                    </p>

                    {/* Active Timer Progress Bar */}
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-[#04b093] transition-all duration-100 ease-linear"
                        style={{
                          width: isActive ? `${slideProgress}%` : "0%",
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Chevrons & Pause Indicator */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <span className="text-[0.65rem] font-bold text-zinc-400 uppercase tracking-widest mr-2">
                {safeIndex + 1} / {slides.length}
              </span>

              <button
                type="button"
                onClick={prevSlide}
                className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#04b093] hover:text-black transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#04b093] hover:text-black transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
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
