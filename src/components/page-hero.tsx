"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

import { pageHeroService } from "@/services/page-hero.service";
import type { HeroSlide, PageHero as PageHeroData, PageHeroKey } from "@/types/page-hero";
import { buildYouTubeAutoplayEmbedUrl, getYouTubeMedia } from "@/lib/youtube";
import YouTubeDialog from "@/components/media/youtube-dialog";

const SLIDE_INTERVAL_MS = 6000;

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
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    media: NonNullable<ReturnType<typeof getYouTubeMedia>>;
  } | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

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
  const safeIndex = isMultiSlide ? Math.min(activeSlideIndex, slideContents.length - 1) : 0;

  // Automatic preset timer transitions for multi-slide carousel
  useEffect(() => {
    if (!isMultiSlide || slideContents.length <= 1 || activeVideoModal) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slideContents.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isMultiSlide, slideContents.length, activeVideoModal]);

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
  const rowAlignment =
    overlayPosition === "center"
      ? "justify-center"
      : overlayPosition === "right"
      ? "justify-end"
      : "justify-start";

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

  return (
    <section
      className={
        "relative flex min-h-[440px] sm:min-h-[500px] items-center overflow-hidden border-b-2 border-black px-6 pb-16 pt-32 sm:px-12 lg:px-20 transition-colors duration-500 " +
        (hasImage || isVideo ? "bg-black text-white" : "bg-[#04b093] text-black")
      }
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
                  "absolute inset-0 transition-all duration-1000 ease-in-out " +
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

      {/* Configurable Overlay Opacity Layer */}
      {(hasImage || isVideo) && (
        <>
          <div
            className="absolute inset-0 bg-black z-[2] transition-opacity duration-500"
            style={{ opacity: overlay }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-[3] transition-opacity duration-500"
            style={{ opacity: Math.min(1, overlay + 0.15) }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content Container */}
      <div className={"relative z-10 mx-auto flex w-full max-w-5xl flex-col " + textAlignment}>
        {/* Eyebrow / Subtitle */}
        {content.subtitle && (
          <div className={`flex flex-wrap items-center gap-2.5 ${rowAlignment}`}>
            <span
              className={
                "rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] shadow-md transition-all " +
                (hasImage || isVideo ? "bg-[#04b093] text-black" : "bg-black text-[#04b093]")
              }
            >
              {content.subtitle}
            </span>
          </div>
        )}

        {/* Main Title */}
        <h1
          className={
            "mt-4 max-w-4xl text-4xl font-black uppercase tracking-tight sm:text-6xl lg:text-7xl leading-none transition-all duration-500 " +
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
              "mt-5 max-w-3xl text-base sm:text-xl font-bold leading-relaxed transition-all duration-500 " +
              (hasImage || isVideo
                ? "text-zinc-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                : "text-black/90")
            }
          >
            {content.description}
          </p>
        )}

        {/* Action Controls & Interactive Player */}
        <div className={`mt-8 flex flex-wrap items-center gap-4 ${rowAlignment}`}>
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
