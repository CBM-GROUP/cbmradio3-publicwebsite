"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

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
    .slice(0, 3);

  return (
    <section
      id="news"
      className="relative scroll-mt-20 border-b border-white/10 bg-[#08090a] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Header Strip */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#00d4a5]">
              <span>INDEX 04</span>
              <span className="text-white/20">/</span>
              <span>EDITORIAL & JOURNAL</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Dispatches & Perspectives
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Cultural reporting, arts and entertainment, and reflective commentary from the CBM newsroom.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#00d4a5] hover:text-[#00d4a5] w-fit"
          >
            <span>All Articles</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="border border-white/10 bg-[#0e1013] p-16 text-center text-zinc-400">
            <p className="text-sm font-semibold tracking-wider">LOADING NEWSROOM DISPATCHES...</p>
          </div>
        )}

        {/* Broadsheet Editorial Spread */}
        {!loading && leadArticle && (
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Left: Lead Article Broadsheet Column */}
            <article className="lg:col-span-7 border border-white/10 bg-[#0e1013] p-6 sm:p-8 flex flex-col justify-between group hover:border-[#00d4a5] transition-colors">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 border border-white/10">
                  <Image
                    src={leadArticle.cover_image || NewsroomStudioSet}
                    alt={leadArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    unoptimized={Boolean(leadArticle.cover_image)}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {leadArticle.category && (
                    <div className="absolute left-4 top-4">
                      <span className="bg-black/85 px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#00d4a5] border border-white/10">
                        {leadArticle.category.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-4 text-[0.68rem] text-zinc-400">
                  {leadArticle.author && (
                    <span className="font-bold text-white uppercase tracking-wider">
                      BY {leadArticle.author}
                    </span>
                  )}
                  {(leadArticle.published_at || leadArticle.created_at) && (
                    <span className="flex items-center gap-1 text-[#00d4a5]">
                      <Clock size={11} />
                      <span>{formatTimeAgo(leadArticle.published_at || leadArticle.created_at)}</span>
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl leading-snug group-hover:text-[#00d4a5] transition-colors">
                  <Link href={`/news/${leadArticle.slug}`}>
                    {leadArticle.title}
                  </Link>
                </h3>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs font-bold">
                <Link
                  href={`/news/${leadArticle.slug}`}
                  className="inline-flex items-center gap-1.5 text-[#00d4a5] hover:underline"
                >
                  <span>Read Full Dispatch</span>
                  <ArrowUpRight size={14} />
                </Link>
                <span className="text-zinc-500 text-[0.68rem] uppercase tracking-wider">
                  EDITORIAL DESK
                </span>
              </div>
            </article>

            {/* Right: Secondary Dispatches List */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="border border-white/10 bg-[#0e1013] p-6 divide-y divide-white/10">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-zinc-500 pb-4">
                  MORE STORIES // RECENT WIRE
                </p>

                {secondaryArticles.map((article, idx) => (
                  <article key={article.id} className="py-5 group">
                    <div className="flex items-center justify-between text-[0.65rem] text-zinc-500">
                      <span className="font-black uppercase tracking-wider text-[#00d4a5]">
                        {article.category?.name || `WIRE 0${idx + 1}`}
                      </span>
                      {(article.published_at || article.created_at) && (
                        <span>{formatTimeAgo(article.published_at || article.created_at)}</span>
                      )}
                    </div>

                    <h4 className="mt-1.5 text-base font-black text-white group-hover:text-[#00d4a5] transition-colors line-clamp-2">
                      <Link href={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h4>

                    <Link
                      href={`/news/${article.slug}`}
                      className="mt-2.5 inline-flex items-center gap-1 text-[0.7rem] font-bold text-zinc-400 hover:text-white transition"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </article>
                ))}

                {secondaryArticles.length === 0 && (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    Additional articles being published from the newsroom.
                  </div>
                )}
              </div>

              {/* Newsroom Wire Footer */}
              <div className="border border-white/10 bg-[#0c0e11] p-5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-white">
                    CBM Editorial Pressroom
                  </h5>
                  <p className="text-[0.68rem] text-zinc-400">
                    Stories covering East African culture, sound, and dialogue.
                  </p>
                </div>
                <Link
                  href="/news"
                  className="text-xs font-black uppercase tracking-wider text-[#00d4a5] hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
