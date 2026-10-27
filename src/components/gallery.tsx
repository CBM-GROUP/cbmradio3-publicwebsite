"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, X, ZoomIn } from "lucide-react";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types/gallery";
import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";
import OnAirStudio from "../../public/cbm_images/on-air-studio.png";
import RadioShowArtwork from "../../public/cbm_images/radio 2.jpeg";
import CBMTeam from "../../public/cbm_images/take 3.jpeg";

const HOMEPAGE_GALLERY_LIMIT = 6;
const galleryFilterCategories = ["All Moments", "Studio Sessions", "Presenters", "Events"];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All Moments");

  useEffect(() => {
    let isMounted = true;
    galleryService
      .getGalleryItems({ page: 1 })
      .then((response) => {
        if (!isMounted) return;
        setItems(
          response.results
            .filter((item) => Boolean(item.image))
            .slice(0, HOMEPAGE_GALLERY_LIMIT),
        );
      })
      .catch(() => {
        // Fallback items will display automatically
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard escape for lightbox
  useEffect(() => {
    if (!selectedItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedItem]);

  // Fallback items if API is empty or offline
  const fallbackGalleryItems = [
    {
      id: 991,
      image: StudioImage,
      title: "Recording 'My Life, My Purpose' in Studio A",
      category: "Studio Sessions",
      caption: "CBM Radio hosts deep in conversation during a live broadcast.",
    },
    {
      id: 992,
      image: OnAirStudio,
      title: "Studio Microphone & Live ON AIR Indicator",
      category: "On Air",
      caption: "Broadcasting live frequency across East Africa 24/7.",
    },
    {
      id: 993,
      image: CBMTeam,
      title: "The Presenter Collective",
      category: "Presenters",
      caption: "Our team of cultural curators, journalists, and radio personalities.",
    },
    {
      id: 994,
      image: RadioShowArtwork,
      title: "Behind The Frequency & Music Mix",
      category: "Studio Sessions",
      caption: "Curating the weekly Top 20 countdown and listener requests.",
    },
  ];

  const galleryList = items.length > 0 ? items : fallbackGalleryItems;

  const filteredItems = galleryList.filter((item) => {
    if (activeCategory === "All Moments") return true;
    return item.category?.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4));
  });

  const displayList = filteredItems.length > 0 ? filteredItems : galleryList;

  return (
    <section
      id="gallery"
      className="relative border-y border-white/10 bg-[#060a08] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#00d4a5]/10 text-[#00d4a5]">
                <Camera size={16} />
              </span>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                INSIDE CBM RADIO
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Studio Moments & Culture
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Step behind the microphone to see the real conversations, recording sessions, and teamwork bringing the station to life.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 text-sm font-extrabold text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521]"
          >
            Explore Full Gallery <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        {/* Studio Spotlight Feature Banner */}
        <div className="cbm-card mb-8 grid overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-[#0c1513] to-[#070b09] shadow-xl sm:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-72 sm:min-h-96">
            <Image
              src={StudioImage}
              alt="CBM Radio presenters recording together in studio"
              fill
              sizes="(max-width: 640px) 100vw, 55vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#070b09]/80" />
            <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#00d4a5] backdrop-blur-md">
              STUDIO A · RECORDING SESSION
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              BEHIND THE MICROPHONE
            </span>
            <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl lg:text-4xl leading-tight">
              Where Voices Become Movement.
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Every day at CBM Radio is fueled by energy, authentic debates, laughter, and high-impact dialogue designed to amplify African stories.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/team"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-sm font-extrabold text-[#062521] transition hover:bg-[#48d4c1]"
              >
                Meet The Presenters <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-bold text-white hover:border-[#00d4a5] hover:text-[#00d4a5] transition-colors"
              >
                Our Mission
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {galleryFilterCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#00d4a5] text-[#062521] shadow-[0_0_12px_rgba(0,212,165,0.35)]"
                  : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Visual Media Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setSelectedItem(item as GalleryItem)}
              className="cbm-card group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#090f0d] text-left transition-all hover:border-[#00d4a5]/50 shadow-md"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized={typeof item.image === "string"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-5 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  {item.category && (
                    <span className="rounded-full bg-[#00d4a5] px-2.5 py-0.5 text-[0.65rem] font-black uppercase text-[#062521]">
                      {item.category}
                    </span>
                  )}
                  <span className="size-8 grid place-items-center rounded-full bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={15} />
                  </span>
                </div>
                <h4 className="mt-2 text-base font-black text-white sm:text-lg group-hover:text-[#00d4a5] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="mt-1 text-xs text-white/70 line-clamp-1">
                    {item.caption}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Interactive Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-2xl overflow-hidden border border-white/20 bg-[#0a1210] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-black/70 text-white hover:bg-[#00d4a5] hover:text-[#062521] transition-colors"
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>

            <div className="relative aspect-video w-full max-h-[75vh] bg-black">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                unoptimized={typeof selectedItem.image === "string"}
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-[#0c1513] border-t border-white/10">
              {selectedItem.category && (
                <span className="rounded-full bg-[#00d4a5]/20 px-2.5 py-0.5 text-xs font-bold text-[#00d4a5]">
                  {selectedItem.category}
                </span>
              )}
              <h3 className="mt-2 text-xl font-black text-white">
                {selectedItem.title}
              </h3>
              {selectedItem.caption && (
                <p className="mt-1 text-sm text-zinc-300">
                  {selectedItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
