import axios from "axios";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Mic2,
  Radio,
  Sparkles,
  Volume2,
} from "lucide-react";

import {
  EpisodeActionToolbar,
  RelatedEpisodeCard,
} from "@/components/episodes/episode-detail-client";
import EpisodeComments from "@/components/comments/episode-comments";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { getStrictYouTubeEmbedUrl } from "@/lib/youtube";
import { episodeService } from "@/services/episode.service";
import type { EpisodeSummary } from "@/types/program";
import Logo from "../../../../public/cbmradio.png";

const getEpisode = cache(async (slug: string) => {
  try {
    return await episodeService.getEpisodeBySlug(slug);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    return null;
  }
});

const getRelatedEpisodes = cache(async (programId?: number, currentEpisodeId?: number) => {
  try {
    let related: EpisodeSummary[] = [];
    if (programId) {
      const res = await episodeService.getEpisodes({
        program: programId,
        ordering: "-publish_date",
      });
      related = res.results.filter((ep) => ep.id !== currentEpisodeId);
    }
    // If not enough from the same program, backfill with recent station episodes
    if (related.length < 3) {
      const fallbackRes = await episodeService.getEpisodes({
        ordering: "-publish_date",
      });
      const additional = fallbackRes.results.filter(
        (ep) => ep.id !== currentEpisodeId && !related.some((r) => r.id === ep.id)
      );
      related = [...related, ...additional];
    }
    return related.slice(0, 3);
  } catch {
    return [];
  }
});

type EpisodePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) return { title: "Episode Not Found | CBM Radio" };

  const description =
    episode.description.trim().slice(0, 160) ||
    `Listen to ${episode.title} from ${episode.program?.title || "CBM Radio"}.`;

  const coverUrl = episode.cover_image || episode.external_cover_image_url;

  return {
    title: `${episode.title} | ${episode.program?.title || "CBM Radio"}`,
    description,
    alternates: { canonical: `/episodes/${episode.slug}` },
    openGraph: {
      title: `${episode.title} | CBM Radio`,
      description,
      type: "video.other",
      images: coverUrl ? [coverUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${episode.title} | CBM Radio`,
      description,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) notFound();

  const embedUrl = getStrictYouTubeEmbedUrl(
    episode.youtube_embed_url || episode.youtube_link
  );
  const publishedDate = formatEpisodeDate(episode.publish_date);
  const relatedEpisodes = await getRelatedEpisodes(episode.program?.id, episode.id);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#04b093] px-3 pb-24 pt-28 text-black sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* Breadcrumb Navigation Bar */}
          <nav
            aria-label="Episode breadcrumb"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-black p-4 text-white shadow-[6px_6px_0_0_#000]"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase">
              <Link
                href="/episodes"
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#04b093] px-3.5 py-1.5 text-black shadow-[2px_2px_0_0_#000] transition-all hover:bg-white hover:text-black"
              >
                &larr; All Episodes
              </Link>
              {episode.program && (
                <Link
                  href={`/episodes?program=${encodeURIComponent(episode.program.slug)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-zinc-300 transition-colors hover:border-[#04b093] hover:text-[#04b093]"
                >
                  <span>More from {episode.program.title}</span>
                </Link>
              )}
            </div>

            <div className="hidden items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-400 sm:flex">
              <span className="flex h-2 w-2 rounded-full bg-[#04b093] animate-pulse" />
              <span>Broadcast Archive</span>
            </div>
          </nav>

          {/* Hero Broadcast Showcase (2-Column Split) */}
          <section className="overflow-hidden rounded-3xl border-3 border-black bg-black p-6 text-white shadow-[10px_10px_0_0_#000] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              
              {/* Left Column: Metadata & Controls */}
              <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-7">
                {episode.program && (
                  <div className="mb-3">
                    <span className="inline-block rounded-md border border-[#04b093]/40 bg-[#04b093]/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#04b093]">
                      {episode.program.title}
                    </span>
                  </div>
                )}

                <h1 className="break-words text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  {episode.title}
                </h1>

                {/* Host & Air Date Metadata Strip */}
                <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {episode.program?.presenter && (
                    <div className="flex items-center gap-1.5 text-zinc-200">
                      <Mic2 className="h-4 w-4 text-[#04b093]" />
                      <span>Hosted by {episode.program.presenter}</span>
                    </div>
                  )}

                  {publishedDate && (
                    <div className="flex items-center gap-1.5 text-[#04b093]">
                      <CalendarDays className="h-4 w-4 text-[#04b093]" />
                      <time dateTime={episode.publish_date || undefined}>
                        {publishedDate}
                      </time>
                    </div>
                  )}

                  {episode.program?.schedule && (
                    <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[11px] text-zinc-300">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>{episode.program.schedule}</span>
                    </div>
                  )}
                </div>

                {/* Interactive Player & Share Action Bar */}
                <div className="mt-8 border-t border-zinc-800/80 pt-6">
                  <EpisodeActionToolbar
                    episode={episode}
                    hasVideo={Boolean(embedUrl)}
                  />
                </div>
              </div>

              {/* Right Column: Hero Media Theater / Cover */}
              <div className="lg:col-span-6 xl:col-span-5">
                <div
                  id="episode-video-stage"
                  className="relative aspect-video overflow-hidden rounded-2xl border-2 border-zinc-800 bg-zinc-950 shadow-2xl"
                >
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={`${episode.title} Video Broadcast`}
                      className="h-full w-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <div className="group relative h-full w-full">
                      <Image
                        src={episode.cover_image || Logo}
                        alt={episode.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized={Boolean(episode.cover_image)}
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 font-bold backdrop-blur">
                          <Volume2 className="h-3.5 w-3.5 text-[#04b093]" />
                          Audio Broadcast
                        </span>
                        <span className="font-mono text-[11px] text-zinc-400">
                          CBM Radio Kampala
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* Body Section: Show Notes & Host Details Grid */}
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Left 8 Columns: Detailed Show Notes & Comments */}
            <div className="space-y-8 lg:col-span-8">
              
              {/* Show Notes Card */}
              <section
                aria-labelledby="episode-notes-heading"
                className="rounded-3xl border-2 border-black bg-black p-6 text-white shadow-[8px_8px_0_0_#000] sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <h2
                    id="episode-notes-heading"
                    className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-[#04b093] sm:text-2xl"
                  >
                    <span>About This Broadcast</span>
                  </h2>
                  <span className="text-xs font-mono font-bold uppercase text-zinc-500">
                    CBM SHOW NOTES
                  </span>
                </div>

                <div className="mt-6">
                  {episode.description.trim() ? (
                    <div className="space-y-4 whitespace-pre-line break-words text-base leading-relaxed text-zinc-300 sm:text-lg sm:leading-8">
                      {episode.description}
                    </div>
                  ) : (
                    <p className="text-zinc-400 italic">
                      No additional description was provided for this broadcast.
                    </p>
                  )}
                </div>
              </section>

              {/* Community Comments Section */}
              <div className="rounded-3xl border-2 border-black bg-black p-6 text-white shadow-[8px_8px_0_0_#000] sm:p-8">
                <EpisodeComments episodeId={episode.id} />
              </div>

            </div>

            {/* Right 4 Columns: Host / Program Dossier & Station Card */}
            <aside className="space-y-8 lg:col-span-4">
              
              {/* Program & Presenter Dossier Card */}
              {episode.program && (
                <div className="overflow-hidden rounded-3xl border-2 border-black bg-black p-6 text-white shadow-[8px_8px_0_0_#000]">
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                    <Image
                      src={episode.program.cover_image || Logo}
                      alt={episode.program.title}
                      fill
                      sizes="350px"
                      unoptimized={Boolean(episode.program.cover_image)}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 border border-black bg-[#04b093] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                      Official Show
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xl font-black uppercase text-white">
                      {episode.program.title}
                    </h3>

                    {episode.program.presenter && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#04b093]">
                        Hosted by {episode.program.presenter}
                      </p>
                    )}

                    {episode.program.schedule && (
                      <p className="mt-2 text-xs font-semibold text-zinc-400">
                        Schedule: <span className="text-zinc-200">{episode.program.schedule}</span>
                      </p>
                    )}

                    {episode.program.short_description && (
                      <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                        {episode.program.short_description}
                      </p>
                    )}

                    <div className="mt-6 border-t border-zinc-800 pt-4">
                      <Link
                        href={`/episodes?program=${encodeURIComponent(episode.program.slug)}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#04b093] py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0_0_#000] transition-all hover:bg-white hover:text-black"
                      >
                        <span>View All Program Episodes</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Station Dial Card */}
              <div className="rounded-3xl border-2 border-black bg-zinc-950 p-6 text-white shadow-[8px_8px_0_0_#000]">
                <div className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-[#04b093]" />
                  <span className="border border-black bg-[#04b093] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                    Live Broadcast
                  </span>
                </div>

                <h4 className="mt-3 text-lg font-black uppercase text-white">
                  CBM Radio 24/7 Stream
                </h4>

                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  Uplifting gospel sounds, life-transforming sermons, and community talk shows direct from Kampala to the world.
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs font-mono text-zinc-400">
                  <span>Frequency: Online / FM</span>
                  <span className="font-bold text-[#04b093]">ON AIR</span>
                </div>
              </div>

            </aside>
          </div>

          {/* More Episodes from CBM Radio (Related Grid) */}
          {relatedEpisodes.length > 0 && (
            <section className="pt-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-wider text-[#04b093]">
                    Tune In Next
                  </span>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
                    More Broadcasts You Might Like
                  </h3>
                </div>
                <Link
                  href="/episodes"
                  className="rounded-xl border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_0_#000] transition-all hover:bg-white hover:text-black"
                >
                  Explore All Episodes &rarr;
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedEpisodes.map((relEp) => (
                  <RelatedEpisodeCard key={relEp.id} episode={relEp} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

function formatEpisodeDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("en-UG", { dateStyle: "long", timeZone: "Africa/Kampala" }).format(date);
}
