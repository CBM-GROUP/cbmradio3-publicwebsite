"use client";

import axios from "axios";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import PageHero from "@/components/page-hero";
import DynamicPageSections from "@/components/dynamic-page-sections";
import { galleryService } from "@/services/gallery.service";
import type { PaginatedResponse } from "@/types/api";
import type { GalleryItem } from "@/types/gallery";
import type { PageSection } from "@/types/hero";
import Radio2 from "../../../public/cbm_images/radio 2.jpeg";

type RequestState = "loading" | "ready" | "error";

const EMPTY_GALLERY: PaginatedResponse<GalleryItem> = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function parsePage(value: string | null) {
  if (!value || !/^\d+$/.test(value)) return 1;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

function isSafeGalleryImage(value: string) {
  if (!value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 pt-32 text-center text-zinc-400">Loading gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}

function GalleryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const [gallery, setGallery] = useState(EMPTY_GALLERY);
  const [section, setSection] = useState<PageSection | null>(null);
  const [collectionState, setCollectionState] = useState<RequestState>("loading");
  const [retryVersion, setRetryVersion] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    galleryService.getGallerySection().then((value) => {
      if (isMounted) setSection(value);
    }).catch(() => undefined);
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setCollectionState("loading");
    });
    galleryService.getGalleryItems({ page }).then((response) => {
      if (!isMounted) return;
      setGallery({
        ...response,
        results: response.results.filter((item) => isSafeGalleryImage(item.image)),
      });
      setCollectionState("ready");
    }).catch((error: unknown) => {
      if (!isMounted) return;
      if (page > 1 && axios.isAxiosError(error) && error.response?.status === 404) {
        setGallery(EMPTY_GALLERY);
        setCollectionState("ready");
      } else {
        setCollectionState("error");
      }
    });
    return () => { isMounted = false; };
  }, [page, retryVersion]);

  useEffect(() => {
    if (!selectedImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedImage]);

  const navigateToPage = useCallback((nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) nextParams.delete("page");
    else nextParams.set("page", String(nextPage));
    const query = nextParams.toString();
    router.push(query ? pathname + "?" + query : pathname, { scroll: false });
    window.requestAnimationFrame(() => {
      document.getElementById("gallery-content")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [pathname, router, searchParams]);

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-zinc-950 pb-20">
        <PageHero
          pageKey="gallery"
          fallbackTitle="CBM Radio Moments"
          fallbackSubtitle="Gallery"
          fallbackDescription="A glimpse into the energy, events and creativity behind the CBM Radio experience."
          fallbackImage={Radio2.src}
        />

        <DynamicPageSections page="gallery" position="top" />

        <section id="gallery-content" className="scroll-mt-24">
          <div className="mx-auto max-w-4xl px-6 py-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-500">Inside CBM Radio</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{section?.title || "Explore Our Gallery"}</h2>
            {section?.subtitle && <p className="mt-3 text-lg text-teal-300">{section.subtitle}</p>}
            <p className="mt-5 whitespace-pre-line leading-7 text-zinc-400">
              {section?.body || "Explore broadcasts, events, presenters and memorable moments from CBM Radio."}
            </p>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {collectionState === "loading" && (
              <div className="flex min-h-64 items-center justify-center gap-4 text-zinc-400" aria-live="polite">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-hidden="true" />
                <p>Loading gallery...</p>
              </div>
            )}
            {collectionState === "error" && (
              <div className="min-h-64 text-center text-zinc-400" role="alert">
                <p>The gallery is temporarily unavailable.</p>
                <button type="button" onClick={() => setRetryVersion((value) => value + 1)} className="mt-4 rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-black">Retry</button>
              </div>
            )}
            {collectionState === "ready" && gallery.results.length === 0 && (
              <div className="min-h-64 text-center text-zinc-400">
                <p>{page > 1 ? "No gallery items are available on this page." : "No gallery items are available yet."}</p>
                {page > 1 && <button type="button" onClick={() => navigateToPage(1)} className="mt-4 font-semibold text-teal-500 underline">Return to page 1</button>}
              </div>
            )}

            {collectionState === "ready" && gallery.results.length > 0 && (
              <motion.div key={page} variants={containerVariants} initial="hidden" animate="show" className="grid auto-rows-48 grid-cols-2 gap-3 sm:grid-cols-3 sm:auto-rows-56 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {gallery.results.map((item, index) => (
                    <motion.button
                      type="button"
                      layout
                      variants={itemVariants}
                      key={item.id}
                      onClick={() => setSelectedImage(item)}
                      className={"group relative overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900 text-left transition hover:border-teal-500/50 " + (index % 7 === 0 ? "col-span-2 row-span-2" : "")}
                      aria-label={"Open " + (item.title || "gallery image")}
                    >
                      <Image
                        src={item.image}
                        alt={item.title || "CBM Radio gallery moment"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={index < 4 ? "eager" : "lazy"}
                      />
                      {(item.title || item.caption) && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/65 p-4 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                          {item.title && <h3 className="font-bold text-white">{item.title}</h3>}
                          {item.caption && <p className="mt-1 line-clamp-2 text-sm text-zinc-300">{item.caption}</p>}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {collectionState === "ready" && (gallery.previous || gallery.next) && (
              <nav aria-label="Gallery pagination" className="mt-12 flex items-center justify-center gap-4">
                <button type="button" disabled={!gallery.previous} onClick={() => navigateToPage(Math.max(1, page - 1))} className="rounded-lg border border-zinc-700 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <span className="text-sm text-zinc-400" aria-current="page">Page {page}</span>
                <button type="button" disabled={!gallery.next} onClick={() => navigateToPage(page + 1)} className="rounded-lg border border-zinc-700 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
              </nav>
            )}
          </div>
        </section>
        <DynamicPageSections page="gallery" position="middle" />
        <DynamicPageSections page="gallery" position="bottom" />
      </main>
      <Footer />

      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={selectedImage.title || "Gallery image"}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="absolute inset-0 cursor-pointer bg-black/95 backdrop-blur-md" />
            <button type="button" onClick={() => setSelectedImage(null)} className="absolute right-4 top-4 z-60 rounded-full bg-white/10 p-2 text-white transition hover:bg-teal-500 hover:text-black sm:right-8 sm:top-8" aria-label="Close gallery image"><X size={28} /></button>
            <motion.figure initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(event) => event.stopPropagation()} className="relative z-60 flex h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl sm:h-[90vh]">
              <div className="relative flex-1"><Image src={selectedImage.image} alt={selectedImage.title || "Expanded CBM Radio moment"} fill sizes="100vw" unoptimized className="object-contain" /></div>
              {(selectedImage.title || selectedImage.caption) && <figcaption className="bg-black/70 p-4 sm:p-6">{selectedImage.title && <h3 className="text-lg font-bold text-white sm:text-xl">{selectedImage.title}</h3>}{selectedImage.caption && <p className="mt-2 text-sm text-zinc-300 sm:text-base">{selectedImage.caption}</p>}</figcaption>}
            </motion.figure>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
