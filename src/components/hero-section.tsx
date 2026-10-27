"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  Play,
  Radio,
  Sparkles,
} from "lucide-react";

import YouTubeDialog from "@/components/media/youtube-dialog";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import homeService from "@/services/home.service";
import type { EpisodeSummary } from "@/types/program";

import StudioImage from "../../public/cbm_images/behind-the-scenes-studio.png";

export default function HeroSection() {
  const [spotlightEpisode, setSpotlightEpisode] = useState<EpisodeSummary | null>(null);
  const [activePlayer, setActivePlayer] = useState<{
    episode: EpisodeSummary;
    media: YouTubeMedia;
    trigger: HTMLButtonElement;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      homeService.getFeaturedEpisodes(),
      homeService.getLatestEpisodes(),
    ]).then(([featuredRes, latestRes]) => {
      if (!isMounted) return;
      const featured = featuredRes.status === "fulfilled" ? featuredRes.value : [];
      const latest = latestRes.status === "fulfilled" ? latestRes.value : [];
      const topEpisode = featured[0] ?? latest[0] ?? null;
      setSpotlightEpisode(topEpisode);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const spotlightMedia = spotlightEpisode
    ? getYouTubeMedia(spotlightEpisode.youtube_embed_url || spotlightEpisode.youtube_link)
    : null;

  return (
    <section className="relative isolate overflow-hidden bg-[#060a08] text-white">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(0,212,165,0.18)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      {/* Main Hero Container */}
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Brand Statement & Primary Actions */}
          <div className="lg:col-span-7">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
              <Sparkles size={14} className="text-[#00d4a5]" />
              <span>Original Shows & Podcasts</span>
            </div>

            {/* Headline */}
            <h1
              id="home-heading"
              className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]"
            >
              Moving Stories, Faith & Culture{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4a5] to-[#5eead4]">
                Forward.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              CBM Radio brings you authentic conversations, thought-provoking talk series, and community perspectives. Stream episodes on demand anytime, anywhere.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#episodes"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#00d4a5] px-7 text-sm font-black uppercase tracking-wider text-[#062521] shadow-[0_8px_25px_rgba(0,212,165,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#34e2b8] hover:shadow-[0_12px_32px_rgba(0,212,165,0.45)]"
              >
                <Headphones size={18} aria-hidden="true" />
                <span>Listen to Episodes</span>
              </a>

              <a
                href="#shows"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00d4a5] hover:text-[#00d4a5]"
              >
                <Radio size={16} className="text-[#00d4a5]" aria-hidden="true" />
                <span>Our Shows</span>
              </a>
            </div>

            {/* Highlight Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-xs font-bold text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#00d4a5]" />
                <span>Stream On-Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#00d4a5]" />
                <span>Original Video & Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#00d4a5]" />
                <span>East African Voices</span>
              </div>
            </div>
          </div>

          {/* Right Column: Spotlight Episode Interactive Card */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1c17] to-[#070d0b] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-[#00d4a5]/40">
              
              {/* Media Preview Box */}
              <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black/60">
                <Image
                  src={
                    spotlightEpisode?.cover_image ||
                    spotlightEpisode?.external_cover_image_url ||
                    StudioImage
                  }
                  alt={spotlightEpisode ? spotlightEpisode.title : "CBM Radio Spotlight Episode"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  unoptimized={Boolean(spotlightEpisode?.cover_image)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
                />
                
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Top Badge */}
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d4a5]/50 bg-black/70 px-3 py-1 text-[0.68rem] font-black uppercase tracking-wider text-[#62e6d4] backdrop-blur-md">
                    <Sparkles size={11} />
                    {spotlightEpisode ? "Featured Release" : "Podcast Spotlight"}
                  </span>
                </div>

                {/* Central Play Trigger Button */}
                {spotlightMedia ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      if (spotlightEpisode) {
                        setActivePlayer({
                          episode: spotlightEpisode,
                          media: spotlightMedia,
                          trigger: e.currentTarget,
                        });
                      }
                    }}
                    aria-label={`Play ${spotlightEpisode?.title || "featured episode"}`}
                    className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-[#00d4a5] text-[#062521] shadow-[0_0_30px_rgba(0,212,165,0.6)] transition-all duration-300 hover:scale-110 hover:bg-[#48d4c1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d4a5]"
                  >
                    <Play size={24} className="ml-1 fill-[#062521]" />
                  </button>
                ) : (
                  <a
                    href="#episodes"
                    aria-label="Explore CBM Radio episodes"
                    className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-[#00d4a5] text-[#062521] shadow-[0_0_30px_rgba(0,212,165,0.6)] transition-all duration-300 hover:scale-110 hover:bg-[#48d4c1]"
                  >
                    <Play size={24} className="ml-1 fill-[#062521]" />
                  </a>
                )}
              </div>

              {/* Episode Info Details */}
              <div className="p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00d4a5]">
                  {spotlightEpisode?.program_title || "My Life, My Purpose"}
                </p>

                <h2 className="mt-1.5 text-xl font-black text-white sm:text-2xl line-clamp-2">
                  {spotlightEpisode?.title || "Authentic Purpose & Community Stories"}
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-zinc-300 line-clamp-2">
                  {spotlightEpisode?.description ||
                    "Join insightful conversations exploring purpose, life journeys, and faith-driven impact across our community."}
                </p>

                {/* Actions Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  {spotlightMedia ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        if (spotlightEpisode) {
                          setActivePlayer({
                            episode: spotlightEpisode,
                            media: spotlightMedia,
                            trigger: e.currentTarget,
                          });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00d4a5] hover:text-[#5eead4] transition-colors"
                    >
                      <Play size={13} className="fill-current" />
                      <span>Watch Episode</span>
                    </button>
                  ) : (
                    <a
                      href="#episodes"
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#00d4a5] hover:text-[#5eead4] transition-colors"
                    >
                      <Headphones size={13} />
                      <span>Browse Episodes</span>
                    </a>
                  )}

                  {spotlightEpisode?.slug ? (
                    <Link
                      href={`/episodes/${encodeURIComponent(spotlightEpisode.slug)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white transition-colors"
                    >
                      <span>Episode Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  ) : (
                    <Link
                      href="/episodes"
                      className="inline-flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white transition-colors"
                    >
                      <span>All Episodes</span>
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Feature Pillars Strip (Clean, modern alternative to marquee) */}
      <div className="border-y border-white/10 bg-[#070c0a]/90 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 sm:grid-cols-3">
            
            <div className="flex items-start gap-3.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#00d4a5]/30 bg-[#00d4a5]/10 text-[#00d4a5]">
                <Headphones size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">On-Demand Podcasts</h3>
                <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">
                  Stream high-quality video and audio episodes whenever you want.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#00d4a5]/30 bg-[#00d4a5]/10 text-[#00d4a5]">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Faith & Purpose</h3>
                <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">
                  Deep conversations that inspire, build character, and uplift.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#00d4a5]/30 bg-[#00d4a5]/10 text-[#00d4a5]">
                <Radio size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Authentic Culture</h3>
                <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">
                  Amplifying voices, stories, and creativity across East Africa.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded Video Dialog Player */}
      {activePlayer && (
        <YouTubeDialog
          title={activePlayer.episode.title}
          media={activePlayer.media}
          returnFocus={activePlayer.trigger}
          onClose={() => setActivePlayer(null)}
        />
      )}
    </section>
  );
}
