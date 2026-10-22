"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types/gallery";

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
    <section className="bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Gallery</p><h2 className="mt-3 text-3xl font-bold">CBM Radio Moments</h2></div>
        {status === "loading" && <p className="min-h-64 text-center text-zinc-400" aria-live="polite">Loading gallery...</p>}
        {status === "error" && <p className="min-h-64 text-center text-zinc-400">The gallery is temporarily unavailable.</p>}
        {status === "ready" && items.length === 0 && <p className="min-h-64 text-center text-zinc-400">No gallery images are available right now.</p>}
        {items.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <button type="button" key={item.id} onClick={() => setSelectedItem(item)} className="overflow-hidden rounded-2xl bg-zinc-800 text-left shadow-sm shadow-gray-400/20 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-80"><Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized className="object-cover" /><div className="absolute inset-x-0 bottom-0 bg-black/60 p-5 backdrop-blur-xs">{item.category && <span className="mb-3 inline-block rounded-full bg-emerald-400 px-3 py-1 text-xs capitalize text-black">{item.category}</span>}<h3 className="text-lg font-bold text-gray-100">{item.title}</h3>{item.caption && <p className="mt-2 text-sm text-gray-300">{item.caption}</p>}</div></div>
              </button>
            ))}
          </div>
        )}
        <div className="mt-10 text-center"><Link href="/gallery" className="font-semibold text-emerald-500 hover:text-emerald-400">View the full gallery</Link></div>
      </div>
      {selectedItem && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5" onClick={() => setSelectedItem(null)}><div className="relative w-full max-w-5xl"><button type="button" onClick={() => setSelectedItem(null)} className="absolute -top-12 right-0 text-3xl text-white" aria-label="Close gallery image">&times;</button><Image src={selectedItem.image} alt={selectedItem.title} width={1200} height={800} unoptimized className="max-h-[85vh] w-full rounded-xl object-contain" /></div></div>}
    </section>
  );
}
