"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Maximize2,
  Pause,
  Play,
  Volume2,
  X,
} from "lucide-react";

import YouTubeDialog from "@/components/media/youtube-dialog";
import { useEpisodePlayerStore } from "@/store/episodePlayerStore";
import DanielPortrait from "../../../public/cbm_images/daniel.svg";

export default function FloatingPlayerDock() {
  const {
    currentEpisode,
    media,
    isPlaying,
    isDockOpen,
    isVideoModalOpen,
    togglePlay,
    openVideoModal,
    closeVideoModal,
    closeDock,
  } = useEpisodePlayerStore();

  const [progress, setProgress] = useState(15);

  // Simulated playback scrubber timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? 10 : prev + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isDockOpen || !currentEpisode) return null;

  return (
    <>
      {/* Floating Bottom Console Dock */}
      <div className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="border border-[#04b093]/30 bg-[#0a0c0f]/95 p-3.5 sm:p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          
          {/* Top Progress Track */}
          <div className="relative mb-3 h-1 w-full overflow-hidden bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#04b093] to-[#5eead4] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Track Information */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-12 shrink-0 overflow-hidden bg-black/60 border border-white/15">
                <Image
                  src={
                    currentEpisode.cover_image ||
                    currentEpisode.external_cover_image_url ||
                    DanielPortrait
                  }
                  alt={currentEpisode.title}
                  fill
                  sizes="48px"
                  unoptimized={Boolean(currentEpisode.cover_image)}
                  className="object-cover"
                />
                
                {/* Live equalizer indicator */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-0.5">
                    <span className="w-1 bg-[#04b093] h-3 animate-eq-1" />
                    <span className="w-1 bg-[#04b093] h-4 animate-eq-2" />
                    <span className="w-1 bg-[#04b093] h-2.5 animate-eq-3" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[0.65rem] font-black uppercase tracking-wider text-[#04b093] truncate">
                    {currentEpisode.program_title || "CBM Original"}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[0.65rem] font-bold text-zinc-400">
                    <Volume2 size={11} className="text-[#04b093]" />
                    <span>NOW STREAMING</span>
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                  <Link
                    href={`/episodes/${encodeURIComponent(currentEpisode.slug)}`}
                    className="hover:text-[#04b093] transition-colors"
                  >
                    {currentEpisode.title}
                  </Link>
                </h4>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause audio preview" : "Play audio preview"}
                className="grid size-9 place-items-center bg-[#04b093] text-[#062521] shadow-md transition hover:scale-105 hover:bg-[#05c6a5]"
              >
                {isPlaying ? (
                  <Pause size={15} className="fill-[#062521]" />
                ) : (
                  <Play size={15} className="ml-0.5 fill-[#062521]" />
                )}
              </button>

              {/* Open Video Player Modal */}
              {media && (
                <button
                  type="button"
                  onClick={openVideoModal}
                  aria-label="Open full video modal"
                  className="hidden sm:inline-flex items-center gap-1.5 border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:border-[#04b093] hover:text-[#04b093] transition"
                >
                  <Maximize2 size={13} />
                  <span>Watch Video</span>
                </button>
              )}

              {/* View Episode Page Link */}
              <Link
                href={`/episodes/${encodeURIComponent(currentEpisode.slug)}`}
                aria-label="View episode details"
                className="hidden md:inline-flex items-center gap-1 border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition"
              >
                <span>Details</span>
                <ExternalLink size={12} />
              </Link>

              {/* Close Dock */}
              <button
                type="button"
                onClick={closeDock}
                aria-label="Close audio player dock"
                className="grid size-8 place-items-center text-zinc-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Embedded Video Dialog Player */}
      {isVideoModalOpen && media && (
        <YouTubeDialog
          title={currentEpisode.title}
          media={media}
          returnFocus={null}
          onClose={closeVideoModal}
        />
      )}
    </>
  );
}
