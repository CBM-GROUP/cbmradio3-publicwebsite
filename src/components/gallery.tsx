"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

// =========================================================================
// DARKROOM HONEYCOMB CARDS CONFIGURATION
// Edit cards (title, subtitle, image, link) and center featured item below:
// =========================================================================
export interface DarkroomCard {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
}

export const DARKROOM_CARDS: DarkroomCard[] = [
  {
    id: 1,
    title: "STUDIO RECORDINGS",
    subtitle: "Behind the Mic",
    image: "/cbm_images/behind-the-scenes-studio.png",
    link: "/gallery",
  },
  {
    id: 2,
    title: "LIVE ON-AIR",
    subtitle: "Broadcast Stage",
    image: "/cbm_images/on-air-studio.png",
    link: "/gallery",
  },
  {
    id: 3,
    title: "CULTURAL VOICES",
    subtitle: "Host Collective",
    image: "/cbm_images/take 3.jpeg",
    link: "/gallery",
  },
  {
    id: 4,
    title: "SOUND DESIGN",
    subtitle: "Audio Mastering",
    image: "/cbm_images/radio 2.jpeg",
    link: "/gallery",
  },
  {
    id: 5,
    title: "EVENING SESSIONS",
    subtitle: "Drive Time Show",
    image: "/cbm_images/evening-drive.jpg",
    link: "/gallery",
  },
  {
    id: 6,
    title: "ARTIST SPOTLIGHT",
    subtitle: "Guest Interviews",
    image: "/cbm_images/artist-spotlight.png",
    link: "/gallery",
  },
];

export const DARKROOM_CENTER_FEATURE = {
  id: "center-featured",
  title: "CBM DARKROOM",
  subtitle: "VISUAL ARCHIVE",
  ctaText: "EXPLORE ALL",
  image: "/cbm_images/newsroom-studio-set.png",
  link: "/gallery",
};

const HEX_CLIP_PATH =
  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

function DecorativeEmptyHex({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none transition-opacity duration-700 ${className}`}
      style={{
        width: "var(--hex-size)",
        height: "var(--hex-h)",
      }}
    >
      <svg
        viewBox="0 0 100 86.6"
        className="h-full w-full text-black/25"
        fill="none"
      >
        <polygon
          points="25,0 75,0 100,43.3 75,86.6 25,86.6 0,43.3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 3"
        />
      </svg>
    </div>
  );
}

export default function Gallery() {
  // Entrance animation observer
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const card1 = DARKROOM_CARDS[0]; // Top-Left
  const card2 = DARKROOM_CARDS[1]; // Top-Right
  const card3 = DARKROOM_CARDS[2]; // Middle-Left
  const card4 = DARKROOM_CARDS[3]; // Middle-Right
  const card5 = DARKROOM_CARDS[4]; // Bottom-Left
  const card6 = DARKROOM_CARDS[5]; // Bottom-Right
  const centerCard = DARKROOM_CENTER_FEATURE;

  const renderHexCard = (
    card: DarkroomCard,
    delayMs: number,
    customAria?: string
  ) => {
    return (
      <div
        className="relative transition-all duration-300"
        style={{
          width: "var(--hex-size)",
          height: "var(--hex-h)",
          filter: "drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45))",
        }}
      >
        <Link
          href={card.link || "/gallery"}
          aria-label={customAria || card.title}
          className="group relative block h-full w-full overflow-hidden bg-zinc-950 transition-all duration-300 hover:scale-[1.05] hover:brightness-110 hover:z-30 cursor-pointer select-none"
          style={{
            clipPath: HEX_CLIP_PATH,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.8)",
            transition: `opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, filter 250ms ease`,
          }}
        >
          {/* Hexagon Background Image */}
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 640px) 120px, (max-width: 1024px) 200px, 240px"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110 group-hover:contrast-115"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 transition-colors duration-300 group-hover:bg-black/40" />

          {/* Centered Title & Subtitle in White, Uppercase, Light Letter Spacing */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-2.5 sm:p-5 text-center">
            <h3 className="max-w-[85%] text-[8px] sm:text-xs md:text-sm lg:text-base font-black uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white leading-tight drop-shadow-md transition-all duration-300 group-hover:tracking-[0.2em] group-hover:text-[#04b093] group-hover:scale-105">
              {card.title}
            </h3>
            {card.subtitle && (
              <p className="mt-1 hidden max-w-[80%] text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 drop-shadow sm:block">
                {card.subtitle}
              </p>
            )}
          </div>

          {/* Soft Rounded-looking Contour Stroke */}
          <svg
            viewBox="0 0 100 86.6"
            className="pointer-events-none absolute inset-0 h-full w-full z-20"
            fill="none"
          >
            <polygon
              points="25,0 75,0 100,43.3 75,86.6 25,86.6 0,43.3"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
              className="transition-colors duration-300 group-hover:stroke-[#04b093]"
            />
          </svg>
        </Link>
      </div>
    );
  };

  return (
    <section
      id="gallery"
      className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-4 py-16 text-black sm:px-8 sm:py-20 lg:px-12 lg:py-24 overflow-hidden"
    >
      {/* Dynamic Honeycomb Responsive Variables */}
      <style>{`
        .honeycomb-section {
          --hex-size: 80px;
          --hex-gap: 4px;
          --hex-h: calc(var(--hex-size) * 0.866);
          --row-overlap: calc(var(--hex-h) * -0.5 + var(--hex-gap));
          --hex-row-gap: calc(var(--hex-size) * 0.5 + var(--hex-gap));
        }
        @media (min-width: 480px) {
          .honeycomb-section {
            --hex-size: 102px;
            --hex-gap: 5px;
          }
        }
        @media (min-width: 640px) {
          .honeycomb-section {
            --hex-size: 135px;
            --hex-gap: 6px;
          }
        }
        @media (min-width: 768px) {
          .honeycomb-section {
            --hex-size: 165px;
            --hex-gap: 7px;
          }
        }
        @media (min-width: 1024px) {
          .honeycomb-section {
            --hex-size: 195px;
            --hex-gap: 8px;
          }
        }
        @media (min-width: 1280px) {
          .honeycomb-section {
            --hex-size: 215px;
            --hex-gap: 8px;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* Section Header: Zwart Visual Studio Archive */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-black pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-black px-4 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093] shadow-md">
                DARKROOM
              </span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-black/75">
                BEHIND THE SCENES
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              Inside the Studio Booth & Archives
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/80 font-medium">
              Documentary photography capturing host conversations, guest recordings, and the authentic energy of CBM Radio.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer w-fit"
          >
            <span>Full Gallery</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* ======================================================== */}
        {/* 7-HEXAGON HONEYCOMB FLOWER MATRIX                        */}
        {/* ======================================================== */}
        <div
          ref={containerRef}
          className="honeycomb-section relative mx-auto my-6 flex flex-col items-center justify-center py-4 select-none"
        >
          {/* Optional Outer Lattice Outline (Top Crown) */}
          <div className="hidden lg:flex justify-center opacity-30 pointer-events-none mb-[calc(var(--hex-h)*-0.5+var(--hex-gap))]">
            <DecorativeEmptyHex />
          </div>

          {/* TOP ROW: 2 Hexagons (sitting in gaps above middle row) */}
          <div
            className="flex items-center justify-center"
            style={{ gap: "var(--hex-row-gap)" }}
          >
            <DecorativeEmptyHex className="hidden md:block opacity-35" />
            {renderHexCard(card1, 100)}
            {renderHexCard(card2, 170)}
            <DecorativeEmptyHex className="hidden md:block opacity-35" />
          </div>

          {/* MIDDLE ROW: 3 Hexagons (Middle-Left, Center Featured, Middle-Right) */}
          <div
            className="flex items-center justify-center"
            style={{
              gap: "var(--hex-row-gap)",
              marginTop: "var(--row-overlap)",
            }}
          >
            <DecorativeEmptyHex className="hidden lg:block opacity-25" />
            {renderHexCard(card3, 450)}

            {/* Featured Center Hexagon (Dark, Brand Emblem & CTA) */}
            <div
              className="relative transition-all duration-300"
              style={{
                width: "var(--hex-size)",
                height: "var(--hex-h)",
                filter: "drop-shadow(0 10px 24px rgba(0, 0, 0, 0.6))",
              }}
            >
              <Link
                href={centerCard.link || "/gallery"}
                aria-label={centerCard.title}
                className="group relative block h-full w-full overflow-hidden bg-black transition-all duration-300 hover:scale-[1.06] hover:brightness-110 hover:z-30 cursor-pointer select-none"
                style={{
                  clipPath: HEX_CLIP_PATH,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.8)",
                  transition:
                    "opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) 0ms, transform 650ms cubic-bezier(0.16, 1, 0.3, 1) 0ms, filter 250ms ease",
                }}
              >
                {/* Background image preview */}
                <Image
                  src={centerCard.image}
                  alt={centerCard.title}
                  fill
                  sizes="(max-width: 640px) 140px, (max-width: 1024px) 220px, 260px"
                  className="object-cover object-center opacity-40 transition-transform duration-700 group-hover:scale-115 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/75" />

                {/* Center Content */}
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-2.5 sm:p-5 text-center">
                  <div className="mb-1 sm:mb-2 grid size-6 sm:size-9 md:size-11 place-items-center rounded-full bg-[#04b093] text-black shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Sparkles size={16} className="fill-black hidden sm:block" />
                    <span className="sm:hidden text-[8px] font-black">CBM</span>
                  </div>

                  <span className="text-[6.5px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] text-[#04b093]">
                    {centerCard.subtitle}
                  </span>

                  <h3 className="mt-0.5 max-w-[85%] text-[9px] sm:text-sm md:text-base lg:text-lg font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white leading-tight">
                    {centerCard.title}
                  </h3>

                  <span className="mt-1 sm:mt-2 inline-flex items-center gap-1 rounded-full border border-[#04b093] bg-[#04b093]/20 px-2 sm:px-3 py-0.5 text-[7px] sm:text-[10px] font-black uppercase tracking-wider text-[#04b093] transition-all duration-300 group-hover:bg-[#04b093] group-hover:text-black">
                    <span>{centerCard.ctaText}</span>
                    <ArrowUpRight size={10} />
                  </span>
                </div>

                {/* Center Hexagon Highlight Stroke */}
                <svg
                  viewBox="0 0 100 86.6"
                  className="pointer-events-none absolute inset-0 h-full w-full z-20"
                  fill="none"
                >
                  <polygon
                    points="25,0 75,0 100,43.3 75,86.6 25,86.6 0,43.3"
                    stroke="#04b093"
                    strokeWidth="2"
                    className="opacity-75 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </svg>
              </Link>
            </div>

            {renderHexCard(card4, 240)}
            <DecorativeEmptyHex className="hidden lg:block opacity-25" />
          </div>

          {/* BOTTOM ROW: 2 Hexagons (mirroring top) */}
          <div
            className="flex items-center justify-center"
            style={{
              gap: "var(--hex-row-gap)",
              marginTop: "var(--row-overlap)",
            }}
          >
            <DecorativeEmptyHex className="hidden md:block opacity-35" />
            {renderHexCard(card5, 380)}
            {renderHexCard(card6, 310)}
            <DecorativeEmptyHex className="hidden md:block opacity-35" />
          </div>

          {/* Optional Outer Lattice Outline (Bottom Root) */}
          <div className="hidden lg:flex justify-center opacity-30 pointer-events-none mt-[calc(var(--hex-h)*-0.5+var(--hex-gap))]">
            <DecorativeEmptyHex />
          </div>
        </div>
      </div>
    </section>
  );
}
