"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

import { pageHeroService } from "@/services/page-hero.service";
import type { HeroSlide, PageHero as PageHeroData, PageHeroKey } from "@/types/page-hero";
import { buildYouTubeAutoplayEmbedUrl, getYouTubeMedia } from "@/lib/youtube";
import YouTubeDialog from "@/components/media/youtube-dialog";

interface PageHeroProps {
  pageKey: PageHeroKey;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  fallbackCtaLabel?: string;
  fallbackCtaUrl?: string;
  fallbackOverlayPosition?: "left" | "center" | "right";
}

interface HeroContent {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  mediaType: "none" | "image" | "video";
  imageUrl: string;
  videoUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

export default function PageHero({
  pageKey,
  fallbackTitle,
  fallbackSubtitle = "",
  fallbackDescription = "",
  fallbackImage = "",
  fallbackCtaLabel = "",
  fallbackCtaUrl = "",
  fallbackOverlayPosition = "left",
}: PageHeroProps) {
  const [hero, setHero] = useState<PageHeroData | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    media: NonNullable<ReturnType<typeof getYouTubeMedia>>;
  } | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    pageHeroService
      .getPageHero(pageKey)
      .then((result) => {
        if (isMounted) {
          setHero(isUsableHero(result, pageKey) ? result : null);
          setActiveSlideIndex(0);
        }
      })
      .catch(() => {
        if (isMounted) setHero(null);
      });
    return () => {
      isMounted = false;
    };
  }, [pageKey]);

  // Extract usable slides when hero.media_type is "slides"
  const slides = useMemo(() => {
    if (!hero || hero.media_type !== "slides" || !Array.isArray(hero.slides)) {
      return [];
    }
    return [...hero.slides]
      .filter(isUsableSlide)
      .sort((a, b) => a.display_order - b.display_order || a.id - b.id);
  }, [hero]);

  const slideContents = useMemo(() => {
    if (!hero || !slides.length) return [];
    return slides.map((slide) =>
      contentFromSlide(slide, hero, {
        title: fallbackTitle,
        subtitle: fallbackSubtitle,
        description: fallbackDescription,
        image: fallbackImage,
      }),
    );
  }, [slides, hero, fallbackTitle, fallbackSubtitle, fallbackDescription, fallbackImage]);

  const isMultiSlide = hero?.media_type === "slides" && slideContents.length > 0;

  // Active slide index safety clamp
  const safeIndex = isMultiSlide ? Math.min(activeSlideIndex, slideContents.length - 1) : 0;

  const nextSlide = useCallback(() => {
    if (slideContents.length <= 1) return;
    setActiveSlideIndex((prev) => (prev + 1) % slideContents.length);
  }, [slideContents.length]);

  const prevSlide = useCallback(() => {
    if (slideContents.length <= 1) return;
    setActiveSlideIndex((prev) => (prev - 1 + slideContents.length) % slideContents.length);
  }, [slideContents.length]);

  // Auto-advance multi-slide carousel every 6 seconds (if not paused by hover or modal)
  useEffect(() => {
    if (!isMultiSlide || slideContents.length <= 1 || isPaused || activeVideoModal) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slideContents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isMultiSlide, slideContents.length, isPaused, activeVideoModal]);

  // Resolve active slide content or fallback content
  const content = useMemo((): HeroContent => {
    if (isMultiSlide) {
      return slideContents[safeIndex];
    }

    if (!hero) {
      return {
        title: fallbackTitle,
        subtitle: fallbackSubtitle,
        description: fallbackDescription,
        mediaType: fallbackImage ? "image" : "none",
        imageUrl: fallbackImage,
        videoUrl: "",
        ctaLabel: fallbackCtaLabel,
        ctaUrl: fallbackCtaUrl,
      };
    }

    const heroImage =
      getSafeImageUrl(
        hero.resolved_image_url || hero.uploaded_image || hero.external_image_url,
      ) || (hero.media_type === "slides" ? fallbackImage : "");

    return {
      title: hero.title || fallbackTitle,
      subtitle: hero.subtitle || fallbackSubtitle,
      description: hero.description || fallbackDescription,
      mediaType:
        hero.media_type === "slides"
          ? heroImage
            ? "image"
            : "none"
          : hero.media_type,
      imageUrl: heroImage,
      videoUrl: getSafeWebUrl(hero.video_url),
      ctaLabel: hero.cta_label || fallbackCtaLabel,
      ctaUrl: hero.cta_url || fallbackCtaUrl,
    };
  }, [
    isMultiSlide,
    slideContents,
    safeIndex,
    hero,
    fallbackTitle,
    fallbackSubtitle,
    fallbackDescription,
    fallbackImage,
    fallbackCtaLabel,
    fallbackCtaUrl,
  ]);

  const overlayPosition = hero?.overlay_position ?? fallbackOverlayPosition;
  const imagePosition =
    overlayPosition === "left"
      ? "object-left"
      : overlayPosition === "right"
      ? "object-right"
      : "object-center";
  const textAlignment =
    overlayPosition === "center"
      ? "items-center text-center"
      : overlayPosition === "right"
      ? "items-end text-right"
      : "items-start text-left";

  const overlayStrength =
    typeof hero?.overlay_strength === "number" &&
    Number.isFinite(hero.overlay_strength)
      ? hero.overlay_strength
      : 70;
  const overlay = Math.min(100, Math.max(0, overlayStrength)) / 100;

  const hasImage = content.mediaType === "image" && Boolean(content.imageUrl);
  const isVideo = content.mediaType === "video" && Boolean(content.videoUrl);
  const youtubeMedia = isVideo ? getYouTubeMedia(content.videoUrl) : null;
  const directVideoUrl = isVideo && !youtubeMedia ? content.videoUrl : null;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (slideContents.length <= 1) return;
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (slideContents.length <= 1 || touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <section
      className={
        "relative flex min-h-[440px] sm:min-h-[500px] items-center overflow-hidden border-b-2 border-black px-6 pb-20 pt-32 sm:px-12 lg:px-20 transition-colors duration-500 " +
        (hasImage || isVideo ? "bg-black text-white" : "bg-[#04b093] text-black")
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription={isMultiSlide ? "carousel" : undefined}
      aria-label={`${content.title} Hero Section`}
    >
      {/* 1. Background Media Layer (Layered Crossfade for Multi-Slide Carousels) */}
      {isMultiSlide ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slideContents.map((slideItem, idx) => {
            const isSlideActive = idx === safeIndex;
            const slideHasImage =
              slideItem.mediaType === "image" && Boolean(slideItem.imageUrl);

            if (!slideHasImage) return null;

            return (
              <div
                key={slideItem.id ?? idx}
                aria-hidden={!isSlideActive}
                className={
                  "absolute inset-0 transition-all duration-700 ease-out " +
                  (isSlideActive
                    ? "opacity-100 scale-100 z-[1]"
                    : "opacity-0 scale-105 z-0 pointer-events-none")
                }
              >
                <Image
                  src={slideItem.imageUrl}
                  alt={slideItem.title}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  unoptimized
                  className={"object-cover " + imagePosition}
                />
              </div>
            );
          })}
        </div>
      ) : (
        hasImage && (
          <div className="absolute inset-0 z-0">
            <Image
              key={content.imageUrl}
              src={content.imageUrl}
              alt={content.title}
              fill
              sizes="100vw"
              priority
              unoptimized
              className={"object-cover transition-opacity duration-700 " + imagePosition}
            />
          </div>
        )
      )}

      {/* 2. Background Direct HTML5 Video Media (e.g. mp4, webm) */}
      {directVideoUrl && (
        <div className="absolute inset-0 z-[1] overflow-hidden">
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
            className="absolute bottom-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 hover:bg-[#04b093] hover:text-black transition-all shadow-lg"
            aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
          >
            {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* 3. Background YouTube Video Ambient / Poster Media */}
      {youtubeMedia && (
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none opacity-45">
          <iframe
            key={youtubeMedia.videoId}
            src={buildYouTubeAutoplayEmbedUrl(youtubeMedia)}
            title={content.title}
            className="h-[140%] w-[140%] -translate-x-[15%] -translate-y-[15%] object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        </div>
      )}

      {/* Deep Multi-Layer Vignette for 100% Readability */}
      {(hasImage || isVideo) && (
        <>
          <div
            className="absolute inset-0 bg-black z-[2] transition-opacity duration-500"
            style={{ opacity: overlay }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40 z-[3]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90 z-[3]"
            aria-hidden="true"
          />
        </>
      )}

      {/* Content Container */}
      <div className={"relative z-10 mx-auto flex w-full max-w-5xl flex-col " + textAlignment}>
        {/* Eyebrow / Media Type Badge & Carousel Counter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {content.subtitle && (
            <span
              className={
                "rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] shadow-md transition-all " +
                (hasImage || isVideo ? "bg-[#04b093] text-black" : "bg-black text-[#04b093]")
              }
            >
              {content.subtitle}
            </span>
          )}

          {isMultiSlide && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
              {content.mediaType === "video" ? (
                <>
                  <Film className="h-3 w-3 text-[#04b093]" />
                  <span>VIDEO SLIDE</span>
                </>
              ) : content.mediaType === "image" ? (
                <>
                  <ImageIcon className="h-3 w-3 text-[#04b093]" />
                  <span>PHOTO SLIDE</span>
                </>
              ) : null}
              <span className="text-zinc-400 ml-1">
                {safeIndex + 1}/{slideContents.length}
              </span>
            </div>
          )}
        </div>

        {/* Main Title */}
        <h1
          className={
            "mt-4 max-w-4xl text-4xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl leading-none transition-all duration-300 " +
            (hasImage || isVideo
              ? "text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)]"
              : "text-black")
          }
        >
          {content.title}
        </h1>

        {/* Narrative Description */}
        {content.description && (
          <p
            className={
              "mt-5 max-w-3xl text-base sm:text-xl font-bold leading-relaxed transition-all duration-300 " +
              (hasImage || isVideo
                ? "text-zinc-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                : "text-black/90")
            }
          >
            {content.description}
          </p>
        )}

        {/* Action Controls & Interactive Player */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <SafeHeroAction label={content.ctaLabel} url={content.ctaUrl} />

          {isVideo && (
            <button
              type="button"
              onClick={() => {
                if (youtubeMedia) {
                  setActiveVideoModal({
                    title: content.title,
                    media: youtubeMedia,
                  });
                } else if (content.videoUrl) {
                  window.open(content.videoUrl, "_blank", "noopener,noreferrer");
                }
              }}
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <Play className="h-4 w-4 fill-current text-[#04b093]" />
              <span>Watch Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Slide Carousel Controls (Arrows, Indicators, Auto-play indicator) */}
      {isMultiSlide && slideContents.length > 1 && (
        <>
          {/* Previous / Next Arrow Controls */}
          <div className="absolute inset-y-0 left-3 sm:left-6 z-20 flex items-center pointer-events-none">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="pointer-events-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-[#04b093] hover:text-black hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-3 sm:right-6 z-20 flex items-center pointer-events-none">
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="pointer-events-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-[#04b093] hover:text-black hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Pagination Strip & Media Type Indicators */}
          <div className="absolute bottom-5 inset-x-0 z-20 flex flex-col items-center gap-2 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-black/70 backdrop-blur-md px-4 py-2 shadow-xl">
              {slides.map((s, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${s.title || "Slide"}`}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "group flex items-center gap-1.5 rounded-full transition-all duration-300 py-1 cursor-pointer " +
                      (isActive
                        ? "bg-[#04b093] text-black px-3 font-black text-xs shadow-md"
                        : "text-zinc-400 hover:text-white px-2 text-[11px]")
                    }
                  >
                    {s.media_type === "video" ? (
                      <Film className={`h-3 w-3 ${isActive ? "text-black" : "text-zinc-400"}`} />
                    ) : (
                      <ImageIcon className={`h-3 w-3 ${isActive ? "text-black" : "text-zinc-400"}`} />
                    )}
                    <span>{idx + 1}</span>
                    {isActive && (
                      <span className="hidden sm:inline-block max-w-[120px] truncate uppercase text-[10px] tracking-wider">
                        {s.title || `Item ${idx + 1}`}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="h-3 w-[1px] bg-white/20 mx-1" />

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "Resume auto play" : "Pause auto play"}
                className="text-zinc-300 hover:text-white transition-colors p-1 cursor-pointer"
                title={isPaused ? "Carousel paused (click to play)" : "Carousel running (click to pause)"}
              >
                {isPaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Video Modal Player (if user clicked Watch Video on a YouTube slide) */}
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

function isUsableHero(
  hero: PageHeroData | null,
  pageKey: PageHeroKey,
): hero is PageHeroData {
  return Boolean(
    hero &&
      hero.is_active &&
      hero.page_key === pageKey &&
      typeof hero.title === "string" &&
      typeof hero.subtitle === "string" &&
      typeof hero.description === "string" &&
      typeof hero.cta_label === "string" &&
      typeof hero.cta_url === "string" &&
      ["none", "image", "video", "slides"].includes(hero.media_type) &&
      (hero.media_type !== "slides" || Array.isArray(hero.slides)),
  );
}

function contentFromSlide(
  slide: HeroSlide,
  hero: PageHeroData,
  fallback: { title: string; subtitle: string; description: string; image: string },
): HeroContent {
  const resolvedSlideImage =
    getSafeImageUrl(
      slide.resolved_image_url || slide.uploaded_image || slide.external_image_url,
    ) ||
    getSafeImageUrl(
      hero.resolved_image_url || hero.uploaded_image || hero.external_image_url,
    ) ||
    fallback.image;

  return {
    id: slide.id,
    title: slide.title || hero.title || fallback.title,
    subtitle: slide.subtitle || hero.subtitle || fallback.subtitle,
    description: slide.description || hero.description || fallback.description,
    mediaType: slide.media_type,
    imageUrl: resolvedSlideImage,
    videoUrl: getSafeWebUrl(slide.video_url),
    ctaLabel: slide.cta_label || hero.cta_label || "",
    ctaUrl: slide.cta_url || hero.cta_url || "",
  };
}

function isUsableSlide(value: unknown): value is HeroSlide {
  if (!value || typeof value !== "object") return false;
  const slide = value as Record<string, unknown>;
  return (
    slide.is_active === true &&
    typeof slide.id === "number" &&
    typeof slide.display_order === "number" &&
    typeof slide.title === "string" &&
    typeof slide.subtitle === "string" &&
    typeof slide.description === "string" &&
    typeof slide.cta_label === "string" &&
    typeof slide.cta_url === "string" &&
    (slide.media_type === "image" || slide.media_type === "video")
  );
}

function getSafeImageUrl(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

function getSafeWebUrl(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

function parseSafeAction(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) {
    return { href: value, kind: "internal" as const };
  }
  if (value.startsWith("#")) {
    return { href: value, kind: "anchor" as const };
  }
  try {
    const parsed = new URL(value);
    if (["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
      return {
        href: parsed.href,
        kind:
          parsed.protocol === "http:" || parsed.protocol === "https:"
            ? ("external" as const)
            : ("protocol" as const),
      };
    }
  } catch {
    return null;
  }
  return null;
}

function SafeHeroAction({ label, url }: { label: string; url: string }) {
  if (typeof label !== "string" || typeof url !== "string" || !label.trim()) return null;
  const action = parseSafeAction(url);
  if (!action) return null;

  const className =
    "inline-flex items-center justify-center rounded-full border-2 border-black bg-[#04b093] px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[0_8px_25px_rgba(4,176,147,0.45)] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer";

  return action.kind === "external" ? (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  ) : action.kind === "internal" ? (
    <Link href={action.href} className={className}>{label}</Link>
  ) : (
    <a href={action.href} className={className}>{label}</a>
  );
}
