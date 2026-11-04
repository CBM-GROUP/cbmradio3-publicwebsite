"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Eye, Sparkles, User } from "lucide-react";

import homeService from "@/services/home.service";
import type { ArticleSummary } from "@/types/news";
import {
  formatPublicationDate,
  formatTimeAgo,
  formatViewsCount,
} from "@/lib/article-metadata";

// Curated fallback dispatches if API is hydrating or returns empty
const FALLBACK_DISPATCHES: ArticleSummary[] = [
  {
    id: 3,
    title: "Upcoming Youth Worship Festival & Outreach 2026",
    slug: "draft-upcoming-youth-worship-festival-2026",
    category: {
      id: 3,
      name: "Community & Charity",
      slug: "community-charity",
      description: "Hospital ministry, youth mentorship, and charity initiatives.",
      is_active: true,
      display_order: 3,
    },
    cover_image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    author: "Kawooya Mitzvah",
    views_count: 6,
    is_featured: true,
    is_published: true,
    published_at: "2026-10-22T16:40:59.597000+03:00",
  },
  {
    id: 2,
    title: "Walking in Unshakable Peace: A Devotional on Philippians 4",
    slug: "walking-in-unshakable-peace-philippians-4",
    category: {
      id: 1,
      name: "Faith & Ministry",
      slug: "faith-ministry",
      description: "Inspiring messages, spiritual growth, and daily biblical wisdom.",
      is_active: true,
      display_order: 1,
    },
    cover_image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80",
    author: "Pastor David Ssemwogerere",
    views_count: 7,
    is_featured: false,
    is_published: true,
    published_at: "2026-10-22T16:10:14.516290+03:00",
  },
  {
    id: 1,
    title: "CBM Radio Expands FM Coverage Across Greater Kampala and Jinja",
    slug: "cbm-radio-expands-fm-coverage-kampala-jinja",
    category: {
      id: 2,
      name: "Station Announcements",
      slug: "station-announcements",
      description: "CBM Radio frequencies, upcoming broadcast specials, and community schedules.",
      is_active: true,
      display_order: 2,
    },
    cover_image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    author: "CBM Communications Desk",
    views_count: 2,
    is_featured: true,
    is_published: true,
    published_at: "2026-10-22T16:10:14.007124+03:00",
  },
];

export default function NewsSection() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      homeService.getFeaturedArticles(),
      homeService.getLatestArticles(),
    ])
      .then(([featuredRes, latestRes]) => {
        if (!isMounted) return;

        const featured =
          featuredRes.status === "fulfilled" && Array.isArray(featuredRes.value)
            ? featuredRes.value
            : [];
        const latest =
          latestRes.status === "fulfilled" && Array.isArray(latestRes.value)
            ? latestRes.value
            : [];

        // Combine with featured first, then append latest without duplicates
        const combined = [...featured];
        for (const item of latest) {
          if (!combined.some((a) => a.id === item.id)) {
            combined.push(item);
          }
        }

        if (combined.length > 0) {
          setArticles(combined);
        } else {
          setArticles(FALLBACK_DISPATCHES);
        }
      })
      .catch(() => {
        if (isMounted) {
          setArticles(FALLBACK_DISPATCHES);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayArticles = articles.length > 0 ? articles : FALLBACK_DISPATCHES;
  const leadArticle = displayArticles[0];
  const feedArticles = displayArticles.slice(1, 5);

  return (
    <section
      id="the-wire"
      aria-label="The Wire - Broadcast Newsroom & Dispatches"
      className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-4 py-16 text-black sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <style>{`
        @keyframes ticker-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker-slide 32s linear infinite;
        }

        .group\\/ticker:hover .animate-ticker {
          animation-play-state: paused !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ticker {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl">
        {/* =========================================================================
            01 // LIVE TICKER STRIP (SEAMLESS CONTINUOUS LOOP, PAUSE ON HOVER)
            ========================================================================= */}
        <div className="group/ticker mb-8 overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center">
            {/* Live Wire Badge */}
            <div className="z-10 flex shrink-0 items-center gap-2 border-r-2 border-black bg-[#04b093] px-3.5 py-2 font-mono text-[0.7rem] font-black uppercase tracking-wider text-black">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-black opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-black" />
              </span>
              <span>LIVE WIRE</span>
            </div>

            {/* Seamless Scrolling Headlines from Backend */}
            <div className="relative flex overflow-hidden py-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <div className="animate-ticker flex items-center gap-8 px-4 whitespace-nowrap">
                {[...displayArticles, ...displayArticles].map((art, idx) => (
                  <Link
                    key={`${art.id}-${idx}`}
                    href={`/news/${art.slug}`}
                    className="inline-flex items-center gap-3 transition-colors hover:text-[#04b093]"
                  >
                    <span>{art.title}</span>
                    <span className="text-[#04b093]">◆</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            02 // SECTION HEADER
            ========================================================================= */}
        <div className="mb-10 flex flex-col gap-4 border-b-2 border-black pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-full border border-black bg-black px-3.5 py-1 font-mono text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#04b093] shadow-sm">
                THE WIRE
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black/80">
                DISPATCHES & EDITORIAL JOURNALISM
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl">
              BROADCAST DISPATCHES & THE WIRE
            </h2>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="max-w-md text-xs font-bold leading-relaxed text-black/80 sm:text-sm">
              In-depth reporting, community coverage, faith perspectives, and
              official station communiqués across East Africa.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase tracking-wider text-black hover:text-black/70 hover:underline"
            >
              <span>Browse Full Archive</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            03 // 2-COLUMN BROADCAST NEWSROOM SPREAD (LEAD FEATURE + WIRE FEED)
            ========================================================================= */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Large Lead Editorial Feature (7 cols) */}
          {leadArticle && (
            <Link
              href={`/news/${leadArticle.slug}`}
              className="group flex flex-col justify-between rounded-3xl border-3 border-black bg-black p-6 text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] sm:p-8 lg:col-span-7"
            >
              <div>
                {/* Visual Cover Stage */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-white/10 bg-zinc-900 shadow-inner">
                  {leadArticle.cover_image ? (
                    <Image
                      src={leadArticle.cover_image}
                      alt={leadArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      unoptimized
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-zinc-900 font-mono text-xs text-zinc-500">
                      CBM RADIO WIRE
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Badges Overlay */}
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    {leadArticle.category && (
                      <span className="rounded-full border border-black bg-[#04b093] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow-sm">
                        {leadArticle.category.name}
                      </span>
                    )}
                    <span className="rounded-full border border-white/20 bg-black/80 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      LEAD DISPATCH
                    </span>
                  </div>
                </div>

                {/* Byline & Metadata Row */}
                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-400">
                  {leadArticle.author && (
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <User className="size-3.5 text-[#04b093]" />
                      <span>{leadArticle.author}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-zinc-500" />
                    <span>
                      {formatPublicationDate(
                        leadArticle.published_at || leadArticle.created_at || null,
                      )}
                    </span>
                  </span>
                  {typeof leadArticle.views_count === "number" && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="size-3.5 text-zinc-500" />
                      <span>{formatViewsCount(leadArticle.views_count)}</span>
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h3 className="mt-4 text-2xl font-black uppercase leading-[1.18] tracking-tight text-white transition-colors group-hover:text-[#04b093] sm:text-3xl lg:text-4xl">
                  {leadArticle.title}
                </h3>

                {/* Teaser Excerpt */}
                <p className="mt-3.5 line-clamp-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {leadArticle.category?.description ||
                    "In-depth reporting and official coverage from the CBM Radio editorial desk."}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-[#04b093] transition-transform group-hover:translate-x-1 sm:text-sm">
                  <span>Read Full Dispatch</span>
                  <ArrowUpRight className="size-4" />
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  {formatTimeAgo(leadArticle.published_at || leadArticle.created_at)}
                </span>
              </div>
            </Link>
          )}

          {/* RIGHT COLUMN: The Wire Feed Column (5 cols) */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              {/* Column Header */}
              <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-2.5 font-mono text-xs font-black uppercase tracking-wider text-black">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-black opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-black" />
                  </span>
                  <span>LATEST TRANSMISSIONS</span>
                </div>
                <span className="text-black/70">RADIO WIRE // 104.2 FM</span>
              </div>

              {/* Stack of Companion Wire Cards */}
              <div className="space-y-4">
                {feedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group block rounded-2xl border-2 border-black bg-black p-4 text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:border-zinc-800 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        {/* Meta Category & Time */}
                        <div className="flex flex-wrap items-center gap-2">
                          {article.category && (
                            <span className="rounded border border-black bg-[#04b093] px-2 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                              {article.category.name}
                            </span>
                          )}
                          <span className="font-mono text-[10px] font-bold text-zinc-400">
                            {formatTimeAgo(
                              article.published_at || article.created_at,
                            )}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="mt-2 line-clamp-2 text-sm font-black leading-snug text-white transition-colors group-hover:text-[#04b093] sm:text-base">
                          {article.title}
                        </h4>

                        {/* Byline */}
                        {article.author && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                            <User className="size-3 text-[#04b093]" />
                            <span className="truncate">{article.author}</span>
                          </div>
                        )}
                      </div>

                      {/* Compact Thumbnail (if available) */}
                      {article.cover_image && (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-zinc-900 sm:size-20">
                          <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            sizes="80px"
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom Link Cue */}
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[11px] text-[#04b093]">
                      <span className="uppercase tracking-wider group-hover:underline">
                        Read Dispatch
                      </span>
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Station Dispatch Note */}
            <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-black bg-[#04b093]/40 p-3 font-mono text-xs font-black uppercase tracking-wider text-black">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                <span>FREQUENCY 104.2 FM</span>
              </span>
              <span className="text-black/80">UPDATED LIVE</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            04 // FULL WIRE ARCHIVE CTA BANNER
            ========================================================================= */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-black bg-black p-6 text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] sm:flex-row sm:p-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#04b093]" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#04b093]">
                CBM RADIO EDITORIAL ARCHIVE
              </span>
            </div>
            <p className="mt-1 text-base font-bold text-white sm:text-lg">
              Looking for past features, faith perspectives, or official press communiqués?
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border-2 border-[#04b093] bg-[#04b093] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-black shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black sm:text-sm"
          >
            <span>Browse Full Wire Archive</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
