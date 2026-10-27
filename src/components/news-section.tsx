"use client";

import { ArrowUpRight, Clock, Flame, Newspaper, Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { formatPublicationDate, formatTimeAgo } from "@/lib/article-metadata";
import homeService from "@/services/home.service";
import type { ArticleSummary } from "@/types/news";
import NewsroomStudioSet from "../../public/cbm_images/newsroom-studio-set.png";
import BrianPortrait from "../../public/cbm_images/brian.svg";
import SamuelPortrait from "../../public/cbm_images/samuel.svg";

type RequestState = "loading" | "ready" | "error";

export default function NewsSection() {
  const [featuredArticles, setFeaturedArticles] = useState<ArticleSummary[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleSummary[]>([]);
  const [featuredState, setFeaturedState] = useState<RequestState>("loading");
  const [latestState, setLatestState] = useState<RequestState>("loading");

  useEffect(() => {
    let isMounted = true;

    homeService
      .getFeaturedArticles()
      .then((items) => {
        if (!isMounted) return;
        setFeaturedArticles(items);
        setFeaturedState("ready");
      })
      .catch(() => {
        if (isMounted) setFeaturedState("error");
      });

    homeService
      .getLatestArticles()
      .then((items) => {
        if (!isMounted) return;
        setLatestArticles(items);
        setLatestState("ready");
      })
      .catch(() => {
        if (isMounted) setLatestState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = featuredArticles[0];
  const secondaryStories = latestArticles
    .filter((article) => article.id !== featured?.id)
    .slice(0, 3);
  const isEmpty =
    featuredState === "ready" &&
    latestState === "ready" &&
    !featured &&
    secondaryStories.length === 0;

  return (
    <section
      id="news"
      className="relative border-y border-white/10 bg-[#070c0a] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/3 -z-10 h-96 w-96 rounded-full bg-[#00d4a5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        {/* Newsroom Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-[#00d4a5]/10 text-[#00d4a5]">
                <Newspaper size={16} />
              </span>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                FROM THE CBM NEWSROOM
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Community Voices & Stories
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Investigative features, arts & culture perspectives, and station dispatches covering our community.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00d4a5]/40 bg-[#00d4a5]/10 px-5 text-sm font-extrabold text-[#00d4a5] transition-all hover:bg-[#00d4a5] hover:text-[#062521]"
          >
            All News Stories <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        {/* Loading State */}
        {(featuredState === "loading" || latestState === "loading") &&
          !featured &&
          secondaryStories.length === 0 && (
            <p
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center text-white/70"
              aria-live="polite"
            >
              Loading newsroom dispatches...
            </p>
          )}

        {/* Fallback when no live news stories */}
        {!featured &&
          secondaryStories.length === 0 &&
          featuredState !== "loading" &&
          latestState !== "loading" && (
            <div className="cbm-card grid overflow-hidden rounded-2xl border border-white/15 bg-[#0f1715] sm:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-60 sm:min-h-72">
                <Image
                  src={NewsroomStudioSet}
                  alt="CBM Radio newsroom studio set"
                  fill
                  sizes="(max-width: 640px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#00d4a5]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                  <Radio size={13} /> DESK DISPATCH
                </span>
                <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                  Stories That Move Culture Forward
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Stay updated on station developments, regional arts and entertainment, and authentic perspectives from our community.
                </p>
                <Link
                  href="/news"
                  className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#00d4a5] px-6 text-sm font-extrabold text-[#062521] transition hover:bg-[#48d4c1]"
                >
                  Visit The Newsroom <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
                {(isEmpty || featuredState === "error" || latestState === "error") && (
                  <p className="mt-4 text-xs text-white/40">
                    {isEmpty
                      ? "Fresh articles are being drafted. Check back shortly."
                      : "Some news feeds are momentarily offline."}
                  </p>
                )}
              </div>
            </div>
          )}

        {/* Primary Featured Story Hero Card */}
        {featured && (
          <Link
            href={`/news/${featured.slug}`}
            className="cbm-card group relative mb-8 grid overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-[#0c1412] to-[#070b0a] shadow-xl hover:border-[#00d4a5]/50 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="relative min-h-72 lg:min-h-[22rem]">
              <Image
                src={featured.cover_image || NewsroomStudioSet}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized={Boolean(featured.cover_image)}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r" />
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md">
                  <Flame size={13} /> TOP STORY
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              {featured.category && (
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00d4a5]">
                  {featured.category.name}
                </span>
              )}
              <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl group-hover:text-[#00d4a5] transition-colors leading-tight">
                {featured.title}
              </h3>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-t border-white/10 pt-4">
                {featured.author && (
                  <span className="font-bold text-white">By {featured.author}</span>
                )}
                {(featured.published_at || featured.created_at) && (
                  <span className="flex items-center gap-1 text-[#00d4a5]">
                    <Clock size={13} />
                    <span>{formatTimeAgo(featured.published_at || featured.created_at)}</span>
                  </span>
                )}
                {featured.published_at && (
                  <span className="text-zinc-500">
                    {formatPublicationDate(featured.published_at)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Secondary Recent Stories Grid */}
        {secondaryStories.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#00d4a5]">
                More from the wire
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {secondaryStories.map((article, index) => {
                const fallbackImg = index % 2 === 0 ? BrianPortrait : SamuelPortrait;

                return (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="cbm-card group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1614]/80 transition-all hover:border-[#00d4a5]/40 hover:bg-[#111c19]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                      <Image
                        src={article.cover_image || fallbackImg}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={Boolean(article.cover_image)}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {article.category && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#00d4a5] backdrop-blur-sm">
                          {article.category.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h4 className="font-extrabold text-white text-lg group-hover:text-[#00d4a5] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-400">
                        <span className="truncate max-w-[140px]">
                          {article.author ? `By ${article.author}` : "CBM News"}
                        </span>
                        {(article.published_at || article.created_at) && (
                          <span className="flex items-center gap-1 text-[#00d4a5]">
                            <Clock size={12} />
                            <span>{formatTimeAgo(article.published_at || article.created_at)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
