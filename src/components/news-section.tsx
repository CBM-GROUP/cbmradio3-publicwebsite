"use client";

import {
  Share2,
  Bookmark,
  Clock,
  ChevronRight,
  TrendingUp,
  Loader,
  TriangleAlert,
  ArrowDown,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useArticles } from "@/hooks/useArticles";
import { useFeaturedArticles } from "@/hooks/useFeaturedArticles";
import Logo from "../../public/cbmradio.png";

export default function NewsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(8);

  const { articles, loading, error } = useArticles();
  const {
    featuredArticles,
    loading: featuredLoading,
    error: featuredError,
  } = useFeaturedArticles();
  const featured = featuredArticles[0];
  const topStories = featuredArticles.slice(1, 4);
  const mainFeed = articles.slice(0, visibleCount);

  const trendingTopics = articles
    .flatMap((article) => article.tags)
    .reduce(
      (acc: Record<string, number>, tag: string) => {
        if (tag) {
          acc[tag] = (acc[tag] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

  const trending = Object.entries(trendingTopics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const handleArticleClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("article", slug);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  if (
    !loading &&
    !featuredLoading &&
    articles.length === 0 &&
    featuredArticles.length === 0
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-400">
        <TriangleAlert size={80} color="#f3bc31" />
        <h2 className="text-2xl font-bold text-amber-500 mb-2">
          No News Available
        </h2>
        <p>
          There are no articles or featured stories published at the moment.
          Please check back later.
        </p>
      </div>
    );
  }

  if (error || featuredError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* --- Main Container --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Category Header */}
        <div className="mb-6 sm:mb-8 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            News
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Latest and most important updates from Uganda and around the world.
          </p>
        </div>

        {/* --- Section 1: Top Breaking & Highlights --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-12 lg:mb-16">
          {/* Main Hero Card (2 Columns wide) */}
          {featured && (
            <div
              onClick={() => handleArticleClick(featured.slug)}
              className="lg:col-span-2 group cursor-pointer flex flex-col justify-between">
              <div>
                <div className="relative overflow-hidden rounded-xl aspect-video mb-4 sm:mb-5">
                  <Image
                    src={featured?.cover_image || Logo}
                    alt={featured?.title || "CBM Radio"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-teal-500 text-black text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full tracking-wider capitalize font-medium shadow-sm">
                    {featured?.category || "category"}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-teal-500 group-hover:text-teal-400 transition-colors leading-tight">
                  {featured?.title || "title"}
                </h2>
                <p className="mt-2 sm:mt-3 text-gray-200 text-sm sm:text-base line-clamp-3 sm:line-clamp-2">
                  {featured?.summary || "summary"}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{featured?.readTime || "00:00"}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="p-1.5 hover:bg-gray-800 rounded-full transition">
                    <Bookmark className="w-4 h-4 text-teal-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-800 rounded-full transition">
                    <Share2 className="w-4 h-4 text-teal-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Top Stories (1 Column) */}
          <div className="space-y-4 sm:space-y-6 flex flex-col justify-between">
            <h3 className="text-base sm:text-lg font-bold text-zinc-200 border-l-4 border-teal-700 pl-3">
              Top Headlines
            </h3>

            <div className="divide-y divide-gray-200/20 flex-1 flex flex-col">
              {topStories.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article.slug)}
                  className="py-4 first:pt-0 last:pb-0 group cursor-pointer flex flex-row gap-3 sm:gap-4 items-start">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-xs font-bold text-teal-600 capitalize block mb-1">
                      {article?.category || "category"}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-100 group-hover:text-zinc-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <span className="mt-1.5 sm:mt-2 block text-[10px] sm:text-xs text-gray-400">
                      {article?.readTime || "00:00"}
                    </span>
                  </div>
                  <div className="relative w-28 sm:w-32 lg:w-36 h-20 sm:h-24 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={article?.imageUrl || Logo}
                      alt={article?.title || "CBM Radio"}
                      fill
                      sizes="(max-width: 640px) 112px, 144px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Section 2: Main News Feed & Sidebar --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Article Feed (2 Columns) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <h3 className="text-lg sm:text-xl font-bold text-white border-b border-gray-800 pb-2">
              National News
            </h3>

            <div className="space-y-4 sm:space-y-6">
              {mainFeed.map((article) => (
                <article
                  key={article.slug}
                  className="bg-black border border-zinc-50/10 p-3 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4 sm:gap-6 group cursor-pointer">
                  {/* Image handles full width on mobile, fixed width on tablet+ */}
                  <div className="relative w-full sm:w-44 md:w-56 h-48 sm:h-32 md:h-36 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={article?.imageUrl || Logo}
                      alt={article?.title || "CBM radio"}
                      fill
                      sizes="(max-width: 640px) 100vw, 224px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <span className="inline-block bg-teal-500 text-black text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                        {article?.category || "category"}
                      </span>
                      <h4 className="mt-2 text-base sm:text-lg font-bold text-gray-200 group-hover:text-gray-300 transition-colors leading-snug">
                        {article?.title || "titlr"}
                      </h4>
                      {article.body && (
                        <p className="mt-1.5 text-xs sm:text-sm text-gray-400 line-clamp-2">
                          {article?.summary || "summary"}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[10px] sm:text-xs text-gray-400 pt-2 border-t border-gray-900 sm:border-none sm:pt-0">
                      <span>{article?.readTime || "00:00"}</span>
                      <button className="flex items-center gap-1 font-semibold text-teal-400 cursor-pointer group-hover:translate-x-1 transition-transform">
                        Read More <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Only show the button if there are more articles left to load */}
            {visibleCount < articles.length && (
              <div className="text-center pt-6 pb-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500/80 text-black text-sm font-semibold px-8 py-3 rounded-full transition cursor-pointer">
                    <ArrowDown className="w-4 h-4 inline mr-1 animate-bounce" />
                  Show More
                </button>
              </div>
            )}
          </div>

          {/* Sidebar (1 Column) */}
          <aside className="space-y-6 sm:space-y-8 pt-4 lg:pt-0">
            {/* Trending Tags Widget */}
            <div className="bg-zinc-900/50 p-5 sm:p-6 rounded-xl border border-gray-700/50 backdrop-blur-2xl">
              <div className="flex items-center gap-2 font-semibold mb-5 text-gray-200">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                <span className="text-sm sm:text-base">Trending Topics</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {trending.map(([tag, count]) => (
                  <button
                    key={tag}
                    className="text-[11px] sm:text-xs bg-teal-600/20 text-teal-400 hover:bg-teal-500 hover:text-black px-3 py-1.5 rounded-full transition font-medium">
                    <span className="text-sm text-teal-300 group-hover:text-black">
                      #{tag}
                    </span>

                    <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs text-white">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
