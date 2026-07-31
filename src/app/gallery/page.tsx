"use client";

import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Radio2 from "../../../public/cbm_images/radio 2.jpeg";
import logo from "../../../public/cbmradio.png";
import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useMedia } from "@/hooks/useMedia";
import { galleryTabs } from "@/api/gallery_tabs";
import { GalleryItem } from "@/types/gallery";
import { useGallery } from "@/hooks/useGallery";

type TabType = (typeof galleryTabs)[number]["id"];

// Explicitly type as Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
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

export default function GalleryPage() {
  const isMobile = useMedia("(max-width: 639px)");
  const [visibleCount, setVisibleCount] = useState(25);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const { items, pageContent, isLoading, error } = useGallery();

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 25);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setVisibleCount(25);
  };

  const filteredImages = items.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const displayedImages = filteredImages.slice(0, visibleCount);

  const baseTabClass =
    "px-6 text-lg sm:text-xl py-2 capitalize rounded-lg font-medium cursor-pointer flex flex-row gap-2 sm:gap-3 items-center justify-start transition-all duration-300";
  const activeTabClass = `${baseTabClass} text-black bg-teal-500 border-none`;
  const inactiveTabClass = `${baseTabClass} text-zinc-400 border border-zinc-300/30 hover:bg-zinc-400/10 bg-transparent`;

  return (
    <>
      <Header />
      <div className="min-h-screen mt-24 pb-20 overflow-hidden">
        {/* Animated Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-16 h-96 flex flex-col items-center justify-center text-center px-6 overflow-hidden w-full">
          <Image
            src={Radio2}
            alt="CBM Radio News Background"
            fill
            className="object-cover absolute inset-0 z-0"
            priority
          />
          <div className="absolute inset-0 bg-black/70 z-10"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              bounce: 0.4,
            }}
            className="text-center sm:text-left w-full py-10 px-6 md:px-12 lg:px-20 relative z-20 mt-12">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-teal-500">
              Gallery
            </p>
            <h1 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {pageContent?.heading || "CBM Radio Moments"}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-3xl text-sm sm:text-base lg:text-lg text-zinc-300 mx-auto sm:mx-0">
              {pageContent?.intro_content ||
                "A glimpse into the energy, events and creativity behind the CBM Radio experience."}
            </p>
          </motion.div>
        </motion.div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {galleryTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabChange(id as TabType)}
                className={`flex min-w-27.5 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200 sm:flex-none ${activeTab === id ? activeTabClass : inactiveTabClass}`}>
                <Icon size={18} className="shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </motion.div>

          {/* Loading and Error States */}
          {isLoading && (
            <div className="flex flex-row items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
              <p className="text-zinc-500">Loading gallery...</p>
            </div>
          )}

          {error && (
            <div className="py-20 text-center text-red-500 text-lg">
              Failed to load gallery: {error}
            </div>
          )}

          {!isLoading && !error && filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-zinc-500 text-lg">
              No {activeTab}s found.
            </motion.div>
          )}

          {/* Animated Grid Container - Uses activeTab as key to re-trigger stagger on tab switch */}
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-8 sm:mt-10 lg:mt-12 grid grid-flow-dense auto-rows-30 xs:auto-rows-[150px] sm:auto-rows-45 md:auto-rows-50 lg:auto-rows-55 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            <AnimatePresence mode="popLayout">
              {displayedImages.map((item, index) => {
                let colSpan = "col-span-1";
                let rowSpan = "row-span-1";

                if (index % 8 === 0) {
                  colSpan = "col-span-2 sm:col-span-2 lg:col-span-2";
                  rowSpan = "row-span-2 sm:row-span-2 lg:row-span-2";
                } else if (index % 8 === 1) {
                  colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
                  rowSpan = "row-span-1 sm:row-span-1 lg:row-span-1";
                } else if (index % 8 === 2) {
                  colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
                  rowSpan = "row-span-2 sm:row-span-2 lg:row-span-2";
                } else if (index % 8 === 3) {
                  colSpan =
                    "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3";
                  rowSpan = "row-span-1 sm:row-span-1 lg:row-span-1";
                } else if (index % 8 === 4) {
                  colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
                  rowSpan = "row-span-1 sm:row-span-1 lg:row-span-1";
                } else if (index % 8 === 5) {
                  colSpan = "col-span-2 sm:col-span-2 lg:col-span-2";
                  rowSpan = "row-span-1 sm:row-span-2 lg:row-span-2";
                } else if (index % 8 === 6) {
                  colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
                  rowSpan = "row-span-1 sm:row-span-1 lg:row-span-1";
                } else if (index % 8 === 7) {
                  colSpan = "col-span-1 sm:col-span-1 lg:col-span-1";
                  rowSpan = "row-span-1 sm:row-span-1 lg:row-span-1";
                }

                const getGridClasses = () => {
                  if (isMobile) {
                    // Mobile-specific layout logic
                    return index < 2
                      ? "col-span-2 row-span-2"
                      : index % 3 === 0
                        ? "col-span-1 row-span-2"
                        : "col-span-1 row-span-1";
                  }

                  return `${colSpan} ${rowSpan}`;
                };

                // const isVideo = item.type === "video";

                return (
                  <motion.div
                    layout // This makes items smoothly glide to new positions when tabs change
                    variants={itemVariants}
                    key={item.id} // Must be a unique ID for layout animations to work correctly
                    onClick={() => setSelectedImage(item)}
                    className={`relative ${getGridClasses()} rounded-xl break-inside-avoid overflow-hidden border border-zinc-700/30 sm:border-zinc-700/50 group hover:border-teal-500/50 transition-colors duration-300 cursor-pointer`}>
                    <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
                      <Image
                        src={item.image}
                        alt={`CBM Radio Moment ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        unoptimized
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading={index < 6 ? "eager" : "lazy"}
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-teal-950/80 sm:from-teal-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* {isVideo && (
                        <div className="absolute z-20 opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300">
                          <PlayCircle size={48} className="text-white drop-shadow-md" />
                        </div>
                      )} */}

                      <Image
                        src={logo}
                        width={100}
                        height={100}
                        alt="CBM Radio Logo"
                        priority
                        className="object-cover w-12 h-12"
                        sizes="100px"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Animated Load More Button */}
          {visibleCount < filteredImages.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 sm:mt-16 text-center">
              <button
                onClick={handleLoadMore}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-black font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-0.5 cursor-pointer">
                Load More {activeTab === "all" ? "Moments" : `${activeTab}s`}
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />

      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-pointer"
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-60 p-2 rounded-full bg-white/10 text-white hover:bg-teal-500 hover:text-black transition-colors border-none cursor-pointer">
              <X size={28} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-60 w-full max-w-5xl h-[80vh] sm:h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-black flex flex-col items-center justify-center bg-zinc-900">
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title || "Expanded CBM Radio Moment"}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              {/* Display Caption if available */}
              {(selectedImage.title || selectedImage.caption) && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-4 sm:p-6">
                  <h3 className="text-white text-lg sm:text-xl font-bold">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.caption && (
                    <p className="text-zinc-300 mt-2 text-sm sm:text-base">
                      {selectedImage.caption}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
