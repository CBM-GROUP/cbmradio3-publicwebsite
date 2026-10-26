"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types/gallery";
import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

const HOMEPAGE_GALLERY_LIMIT = 6;

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isMounted = true;
    galleryService.getGalleryItems({ page: 1 }).then((response) => {
      if (!isMounted) return;
      setItems(
        response.results
          .filter((item) => Boolean(item.image))
          .slice(0, HOMEPAGE_GALLERY_LIMIT),
      );
      setStatus("ready");
    }).catch(() => {
      if (isMounted) setStatus("error");
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="border-y border-white/10 bg-[#111816] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">Gallery</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">CBM Radio Moments</h2></div>
        {status === "loading" && <p className="rounded-lg border border-white/10 bg-black/20 px-5 py-8 text-white/70" aria-live="polite">Loading gallery...</p>}
        <div className="cbm-card mb-6 grid overflow-hidden rounded-2xl border border-white/10 bg-[#090d0c] sm:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-64 sm:min-h-80">
            <Image
              src={StudioImage}
              alt="CBM Radio presenters recording a show together in the studio"
              fill
              sizes="(max-width: 640px) 100vw, 55vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/15" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#48d4c1]">Behind the scenes</p>
            <h3 className="mt-3 text-2xl font-black sm:text-3xl">The people and moments behind CBM Radio.</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Step inside the studio and see the conversations, voices, and teamwork that bring CBM Radio to life.
            </p>
          </div>
        </div>
        {status === "error" && items.length === 0 && (
          <p className="mb-6 rounded-lg border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/65" role="status">
            Gallery updates are temporarily unavailable. You can still explore a moment from inside the studio above.
          </p>
        )}
        {status === "ready" && items.length === 0 && (
          <p className="mb-6 text-sm text-white/60">More CBM Radio moments are coming soon.</p>
        )}
        {items.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <button type="button" key={item.id} onClick={() => setSelectedItem(item)} className="cbm-card group relative aspect-[4/3] overflow-hidden rounded-lg bg-[#090d0c] text-left">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pt-16">{item.category && <span className="mb-2 inline-block rounded-full bg-[#48d4c1] px-3 py-1 text-xs font-bold capitalize text-[#062521]">{item.category}</span>}<h3 className="text-base font-bold text-white sm:text-lg">{item.title}</h3>{item.caption && <p className="mt-1 text-sm text-white/80">{item.caption}</p>}</div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-8"><Link href="/gallery" className="inline-flex min-h-11 items-center rounded-full border border-[#48d4c1]/50 px-5 text-sm font-bold text-[#48d4c1] transition-colors hover:bg-[#48d4c1] hover:text-[#062521]">View the full gallery</Link></div>
      </div>
      {selectedItem && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5" onClick={() => setSelectedItem(null)}><div className="relative w-full max-w-5xl"><button type="button" onClick={() => setSelectedItem(null)} className="absolute -top-12 right-0 text-3xl text-white" aria-label="Close gallery image">&times;</button><Image src={selectedItem.image} alt={selectedItem.title} width={1200} height={800} unoptimized className="max-h-[85vh] w-full rounded-xl object-contain" /></div></div>}
    </section>
  );
}
