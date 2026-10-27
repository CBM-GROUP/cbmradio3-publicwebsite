"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X, ZoomIn } from "lucide-react";

import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types/gallery";

import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";
import OnAirStudio from "../../public/cbm_images/on-air-studio.png";
import RadioShowArtwork from "../../public/cbm_images/radio 2.jpeg";
import CBMTeam from "../../public/cbm_images/take 3.jpeg";

const fallbackGalleryItems = [
  {
    id: 991,
    image: StudioImage,
    title: "Recording 'My Life, My Purpose' in Studio A",
    category: "Studio Sessions",
    caption: "CBM hosts in conversation during an original episode recording session.",
  },
  {
    id: 992,
    image: OnAirStudio,
    title: "Studio Microphone & Production Desk",
    category: "Production",
    caption: "In the studio recording booth capturing inspiring stories and community dialogues.",
  },
  {
    id: 993,
    image: CBMTeam,
    title: "The Presenter & Host Collective",
    category: "Presenters",
    caption: "Our team of cultural curators, journalists, and podcast creators.",
  },
  {
    id: 994,
    image: RadioShowArtwork,
    title: "Sound Design & Audio Engineering",
    category: "Mastering",
    caption: "Audio post-production and mastering in the CBM digital studio.",
  },
];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    galleryService
      .getGalleryItems({ page: 1 })
      .then((response) => {
        if (!isMounted) return;
        setItems(
          response.results
            .filter((item) => Boolean(item.image))
            .slice(0, 4),
        );
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedItem]);

  const displayList = items.length > 0 ? items : fallbackGalleryItems;

  return (
    <section
      id="gallery"
      className="relative scroll-mt-20 border-b border-white/10 bg-[#08090a] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Header Strip */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#00d4a5]">
              <span>INDEX 05</span>
              <span className="text-white/20">/</span>
              <span>VISUAL ARCHIVE</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Inside the Studio Booth
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Behind the microphone: documentary snapshots of recording sessions, host interviews, and creative production.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5] w-fit"
          >
            <span>Full Gallery Archive</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Visual Archive Grid: 4-up Contact Sheet */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayList.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item as GalleryItem)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedItem(item as GalleryItem);
                }
              }}
              role="button"
              tabIndex={0}
              className="group relative cursor-pointer border border-white/10 bg-[#0e1013] overflow-hidden transition-all duration-300 hover:border-[#00d4a5]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-black/60">
                <Image
                  src={item.image}
                  alt={item.title || "Studio archive photo"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Index tag */}
                <div className="absolute left-3 top-3">
                  <span className="bg-black/85 px-2 py-0.5 text-[0.62rem] font-black uppercase tracking-wider text-[#00d4a5] border border-white/10">
                    FRAME 0{idx + 1}
                  </span>
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute right-3 top-3 grid size-8 place-items-center bg-[#00d4a5] text-[#062521] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={14} />
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-[0.65rem] font-black uppercase tracking-wider text-[#00d4a5]">
                    {item.category || "Studio"}
                  </p>
                  <h4 className="mt-0.5 text-sm font-black text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Dialog Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full border border-white/20 bg-[#0e1013] p-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-wider text-[#00d4a5]">
                {selectedItem.category || "STUDIO FRAME"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="grid size-8 place-items-center border border-white/20 text-white hover:border-[#00d4a5] hover:text-[#00d4a5]"
                aria-label="Close image preview"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative mt-4 aspect-video w-full overflow-hidden bg-black">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title || "Gallery frame"}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-black text-white">{selectedItem.title}</h3>
              {selectedItem.caption && (
                <p className="mt-1 text-xs text-zinc-400">{selectedItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
