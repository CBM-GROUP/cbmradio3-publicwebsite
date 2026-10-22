"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { pageHeroService } from "@/services/page-hero.service";
import type { HeroSlide, PageHero as PageHeroData, PageHeroKey } from "@/types/page-hero";

interface PageHeroProps {
  pageKey: PageHeroKey;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
}

interface HeroContent {
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
}: PageHeroProps) {
  const [hero, setHero] = useState<PageHeroData | null>(null);

  useEffect(() => {
    let isMounted = true;
    pageHeroService.getPageHero(pageKey).then((result) => {
      if (isMounted && isUsableHero(result, pageKey)) setHero(result);
    }).catch(() => {
      if (isMounted) setHero(null);
    });
    return () => { isMounted = false; };
  }, [pageKey]);

  const content = useMemo(
    () => resolveHeroContent(hero, {
      title: fallbackTitle,
      subtitle: fallbackSubtitle,
      description: fallbackDescription,
      image: fallbackImage,
    }),
    [fallbackDescription, fallbackImage, fallbackSubtitle, fallbackTitle, hero],
  );
  const imagePosition =
    hero?.overlay_position === "left"
      ? "object-left"
      : hero?.overlay_position === "right"
        ? "object-right"
        : "object-center";
  const textAlignment =
    hero?.overlay_position === "center"
      ? "items-center text-center"
      : hero?.overlay_position === "right"
        ? "items-end text-right"
        : "items-start text-left";
  const overlayStrength =
    typeof hero?.overlay_strength === "number" &&
    Number.isFinite(hero.overlay_strength)
      ? hero.overlay_strength
      : 65;
  const overlay = Math.min(100, Math.max(0, overlayStrength)) / 100;

  return (
    <section className="relative flex min-h-96 items-center overflow-hidden bg-linear-to-r from-zinc-900 to-black px-6 pb-16 pt-32 text-white sm:px-12 lg:px-20">
      {content.mediaType === "image" && content.imageUrl && (
        <Image
          src={content.imageUrl}
          alt={content.title}
          fill
          sizes="100vw"
          priority
          unoptimized
          className={"object-cover " + imagePosition}
        />
      )}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: content.mediaType === "image" ? overlay : 0.2 }}
        aria-hidden="true"
      />
      <div className={"relative z-10 mx-auto flex w-full max-w-7xl flex-col " + textAlignment}>
        {content.subtitle && (
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-400">
            {content.subtitle}
          </p>
        )}
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold sm:text-5xl lg:text-6xl">
          {content.title}
        </h1>
        {content.description && (
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-200 sm:text-lg">
            {content.description}
          </p>
        )}
        <div className="mt-7 flex flex-wrap gap-4">
          <SafeHeroAction label={content.ctaLabel} url={content.ctaUrl} />
          {content.mediaType === "video" && (
            <SafeHeroAction label="Play video" url={content.videoUrl} />
          )}
        </div>
      </div>
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

function resolveHeroContent(
  hero: PageHeroData | null,
  fallback: { title: string; subtitle: string; description: string; image: string },
): HeroContent {
  if (!hero) {
    return {
      title: fallback.title,
      subtitle: fallback.subtitle,
      description: fallback.description,
      mediaType: fallback.image ? "image" : "none",
      imageUrl: fallback.image,
      videoUrl: "",
      ctaLabel: "",
      ctaUrl: "",
    };
  }

  const slide =
    hero.media_type === "slides"
      ? [...hero.slides]
          .filter(isUsableSlide)
          .sort((a, b) => a.display_order - b.display_order || a.id - b.id)[0]
      : undefined;

  return slide
    ? contentFromSlide(slide, hero, fallback)
    : {
        title: hero.title || fallback.title,
        subtitle: hero.subtitle || fallback.subtitle,
        description: hero.description || fallback.description,
        mediaType: hero.media_type === "slides" ? "none" : hero.media_type,
        imageUrl: getSafeImageUrl(hero.resolved_image_url),
        videoUrl: getSafeWebUrl(hero.video_url),
        ctaLabel: hero.cta_label || "",
        ctaUrl: hero.cta_url || "",
      };
}

function contentFromSlide(
  slide: HeroSlide,
  hero: PageHeroData,
  fallback: { title: string; subtitle: string; description: string },
): HeroContent {
  return {
    title: slide.title || hero.title || fallback.title,
    subtitle: slide.subtitle || hero.subtitle || fallback.subtitle,
    description: slide.description || hero.description || fallback.description,
    mediaType: slide.media_type,
    imageUrl: getSafeImageUrl(slide.resolved_image_url),
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
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

function getSafeWebUrl(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

function parseSafeAction(url: string) {
  const value = url.trim();
  if (!value) return null;
  if ((value.startsWith("/") && !value.startsWith("//")) || value.startsWith("#")) {
    return { href: value, kind: "internal" as const };
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
  const className = "rounded-lg bg-teal-500 px-6 py-3 font-semibold text-black transition hover:bg-teal-400";
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
