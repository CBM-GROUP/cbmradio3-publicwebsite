"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Newspaper } from "lucide-react";

import { formatTimeAgo } from "@/lib/article-metadata";
import homeService from "@/services/home.service";
import type { ArticleSummary } from "@/types/news";

import NewsroomStudioSet from "../../public/cbm_images/newsroom-studio-set.png";

export default function NewsSection() {
  const [featuredArticles, setFeaturedArticles] = useState<ArticleSummary[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      homeService.getFeaturedArticles(),
      homeService.getLatestArticles(),
    ]).then(([featuredRes, latestRes]) => {
      if (!isMounted) return;
      if (featuredRes.status === "fulfilled") {
        setFeaturedArticles(featuredRes.value);
      }
      if (latestRes.status === "fulfilled") {
        setLatestArticles(latestRes.value);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const leadArticle = featuredArticles[0] || latestArticles[0] || null;
  const secondaryArticles = latestArticles
    .filter((a) => a.id !== leadArticle?.id)
    .slice(0, 4);

  return (
    <section
      id="news"
      className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-5 py-16 text-black sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header: Billboard Broadsheet Wire */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-black pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-black px-4 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#04b093] shadow-md">
                THE WIRE
              </span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-black">
                DISPATCHES & CULTURAL JOURNALISM
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              Stories, Culture & Station Dispatches
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-black/85">
              In-depth features on East African creators, arts, faith perspectives, and station developments.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer w-fit"
          >
            <span>All Articles</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-3xl border-3 border-black bg-black p-16 text-center text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <p className="text-sm font-black uppercase tracking-wider">RETRIEVING DISPATCHES WIRE...</p>
          </div>
        )}

        {/* Broadsheet Editorial Wire Layout */}
        {!loading && leadArticle && (
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Left: Lead Article Column */}
            <article className="lg:col-span-7 rounded-3xl border-3 border-black bg-black p-6 sm:p-8 flex flex-col justify-between text-white group shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black border border-white/20 shadow-md">
                  <Image
                    src={leadArticle.cover_image || NewsroomStudioSet}
                    alt={leadArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    unoptimized={Boolean(leadArticle.cover_image)}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {leadArticle.category && (
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-[#04b093] px-3.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-black shadow-md">
                        {leadArticle.category.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-4 text-[0.68rem] text-zinc-400">
                  {leadArticle.author && (
                    <span className="font-black uppercase tracking-wider text-white">
                      BY {leadArticle.author}
                    </span>
                  )}
                  {(leadArticle.published_at || leadArticle.created_at) && (
                    <span className="flex items-center gap-1 text-[#04b093]">
                      <Clock size={11} />
                      <span>{formatTimeAgo(leadArticle.published_at || leadArticle.created_at)}</span>
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight group-hover:text-[#04b093] transition-colors">
                  <Link href={`/news/${leadArticle.slug}`}>
                    {leadArticle.title}
                  </Link>
                </h3>
              </div>

              <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-black uppercase">
                <Link
                  href={`/news/${leadArticle.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#04b093] px-4 py-2 text-black font-black uppercase text-xs hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span>Read Full Story</span>
                  <ArrowUpRight size={14} />
                </Link>
                <span className="text-zinc-500 text-[0.68rem]">
                  CBM NEWSROOM
                </span>
              </div>
            </article>

            {/* Right: Billboard Wire Ranked List */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="rounded-3xl border-3 border-black bg-black p-6 sm:p-7 divide-y divide-white/10 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between pb-4">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#04b093]">
                    LATEST WIRE STORIES
                  </p>
                  <Newspaper size={14} className="text-zinc-400" />
                </div>

                {secondaryArticles.map((article, idx) => (
                  <article key={article.id} className="py-4 group">
                    <div className="flex items-center justify-between text-[0.65rem] text-zinc-400">
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-black uppercase tracking-wider text-[#04b093]">
                        {article.category?.name || "WIRE"}
                      </span>
                      {(article.published_at || article.created_at) && (
                        <span>{formatTimeAgo(article.published_at || article.created_at)}</span>
                      )}
                    </div>

                    <div className="mt-1 flex items-baseline gap-3">
                      <span className="text-lg font-black tabular-nums tracking-tighter text-zinc-500 group-hover:text-[#04b093] transition-colors">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-black uppercase text-white group-hover:text-[#04b093] transition-colors line-clamp-2">
                        <Link href={`/news/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h4>
                    </div>

                    <div className="mt-2 text-right">
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[0.68rem] font-black uppercase text-zinc-300 hover:text-black hover:bg-[#04b093] hover:border-[#04b093] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        <span>Read</span>
                        <ArrowUpRight size={11} />
                      </Link>
                    </div>
                  </article>
                ))}

                {secondaryArticles.length === 0 && (
                  <div className="py-8 text-center text-xs text-zinc-500 uppercase">
                    More articles coming from the newsroom.
                  </div>
                )}
              </div>

              {/* Billboard Wire Footer Callout */}
              <div className="rounded-2xl border-3 border-black bg-black p-5 flex items-center justify-between text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-white">
                    Cultural Perspectives & Essays
                  </h5>
                  <p className="text-[0.68rem] text-zinc-400">
                    Amplifying journalism by and for our community.
                  </p>
                </div>
                <Link
                  href="/news"
                  className="rounded-full bg-[#04b093] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  All Wire &rarr;
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
