import axios from "axios";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { getStrictYouTubeEmbedUrl } from "@/lib/youtube";
import { episodeService } from "@/services/episode.service";
import Logo from "../../../../public/cbmradio.png";

const getEpisode = cache(async (slug: string) => {
  try {
    return await episodeService.getEpisodeBySlug(slug);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
});

type EpisodePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) return { title: "Episode not found | CBM Radio" };
  const description = episode.description.trim().slice(0, 160) || `Listen to ${episode.title} from ${episode.program.title}.`;
  return {
    title: `${episode.title} | CBM Radio`,
    description,
    alternates: { canonical: `/episodes/${episode.slug}` },
    openGraph: {
      title: episode.title,
      description,
      type: "article",
      images: episode.cover_image ? [episode.cover_image] : undefined,
    },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) notFound();
  const embedUrl = getStrictYouTubeEmbedUrl(episode.youtube_embed_url);
  const published = formatEpisodeDate(episode.publish_date);

  return <>
    <Header />
    <main className="min-h-screen bg-[#04b093] px-4 pb-20 pt-32 text-black sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl rounded-2xl border-2 border-black bg-black p-6 sm:p-10 text-white shadow-2xl">
        <nav aria-label="Episode navigation" className="flex flex-wrap gap-x-3 gap-y-3 text-xs font-black uppercase">
          <Link href="/episodes" className="rounded-full border-2 border-black bg-[#04b093] px-4 py-1.5 text-black transition-colors hover:bg-white hover:text-black">&larr; All episodes</Link>
          <Link href={`/episodes?program=${encodeURIComponent(episode.program.slug)}`} className="rounded-full border-2 border-zinc-700 bg-zinc-900 px-4 py-1.5 text-zinc-300 transition-colors hover:border-[#04b093] hover:text-[#04b093]">More from {episode.program.title}</Link>
        </nav>
        <div className="mt-8">
          <span className="inline-block rounded-full bg-[#04b093] px-3 py-1 text-xs font-black uppercase tracking-wider text-black">
            {episode.program.title}
          </span>
        </div>
        <h1 className="mt-4 break-words text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">{episode.title}</h1>
        {published && <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-zinc-400"><time dateTime={episode.publish_date || undefined}>{published}</time></p>}
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl border-2 border-black/60 bg-zinc-900 shadow-lg">
          <Image src={episode.cover_image || Logo} alt={episode.cover_image ? episode.title : "CBM Radio"} fill sizes="(max-width: 1024px) 100vw, 1024px" unoptimized={Boolean(episode.cover_image)} className="object-cover" priority />
        </div>
        <section aria-labelledby="episode-description" className="mt-10 border-t border-zinc-800 pt-8">
          <h2 id="episode-description" className="text-xl font-black uppercase tracking-tight text-[#04b093]">About this episode</h2>
          {episode.description.trim() ? <div className="mt-4 space-y-4 whitespace-pre-line break-words leading-relaxed text-zinc-300">{episode.description}</div> : <p className="mt-4 text-zinc-400">No description is available for this episode.</p>}
        </section>
        <section aria-labelledby="episode-player" className="mt-10 border-t border-zinc-800 pt-8">
          <h2 id="episode-player" className="text-xl font-black uppercase tracking-tight text-[#04b093]">Listen and watch</h2>
          {embedUrl ? <div className="mt-4 aspect-video overflow-hidden rounded-xl border-2 border-black bg-black"><iframe src={embedUrl} title={`${episode.title} video`} className="h-full w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div> : <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">Video playback is unavailable for this episode.</p>}
        </section>
      </article>
    </main>
    <Footer />
  </>;
}

function formatEpisodeDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat("en-UG", { dateStyle: "long", timeZone: "Africa/Kampala" }).format(date);
}
