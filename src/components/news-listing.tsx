"use client";

import axios from "axios";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Flame,
  Search,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  formatPublicationDate,
  formatTimeAgo,
} from "@/lib/article-metadata";
import NewsService from "@/services/news-service";
import type { PaginatedResponse } from "@/types/api";
import type { ArticleCategory, ArticleListItem } from "@/types/news";
import NewsroomStudioSet from "../../public/cbm_images/newsroom-studio-set.png";
import Logo from "../../public/cbmradio.png";

type RequestState = "loading" | "ready" | "error";

const EMPTY_PAGE: PaginatedResponse<ArticleListItem> = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

function parsePage(value: string | null) {
  if (!value || !/^\d+$/.test(value)) return 1;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function NewsListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category")?.trim() || "";
  const searchQuery = searchParams.get("search")?.trim() || "";
  const page = parsePage(searchParams.get("page"));

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setSearchInput(searchQuery);
  }

  const [articles, setArticles] = useState(EMPTY_PAGE);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<ArticleListItem[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleListItem[]>([]);
  const [articlesState, setArticlesState] = useState<RequestState>("loading");
  const [categoriesState, setCategoriesState] = useState<RequestState>("loading");
  const [articleRequestVersion, setArticleRequestVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;
    NewsService.getArticleCategories({ page: 1 })
      .then((response) => {
        if (!isMounted) return;
        setCategories(response.results);
        setCategoriesState("ready");
      })
      .catch(() => {
        if (isMounted) setCategoriesState("error");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    NewsService.getFeaturedArticles()
      .then((items) => {
        if (!isMounted) return;
        setFeaturedArticles(items);
      })
      .catch(() => undefined);

    NewsService.getLatestArticles()
      .then((items) => {
        if (!isMounted) return;
        setLatestArticles(items);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setArticlesState("loading");
    });

    NewsService.getArticles({
      page,
      category: category || undefined,
      search: searchQuery || undefined,
    })
      .then((response) => {
        if (!isMounted) return;
        setArticles(response);
        setArticlesState("ready");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        if (page > 1 && axios.isAxiosError(error) && error.response?.status === 404) {
          setArticles(EMPTY_PAGE);
          setArticlesState("ready");
        } else {
          setArticlesState("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [articleRequestVersion, category, page, searchQuery]);

  const navigate = useCallback(
    (updates: { category?: string | null; search?: string | null; page?: number }) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (updates.category !== undefined) {
        if (updates.category) nextParams.set("category", updates.category);
        else nextParams.delete("category");
      }

      if (updates.search !== undefined) {
        if (updates.search) nextParams.set("search", updates.search);
        else nextParams.delete("search");
      }

      if (updates.page === undefined || updates.page <= 1) nextParams.delete("page");
      else nextParams.set("page", String(updates.page));

      const query = nextParams.toString();
      router.push(query ? pathname + "?" + query : pathname, { scroll: false });
      window.requestAnimationFrame(() => {
        document.getElementById("news-content")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [pathname, router, searchParams],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: searchInput.trim() || null, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    navigate({ search: null, page: 1 });
  };

  // Hierarchy for frontpage layout (when not actively searching)
  const isSearchActive = Boolean(searchQuery);

  const leadArticle = useMemo(() => {
    if (isSearchActive) return null;
    return featuredArticles[0] || latestArticles[0] || articles.results[0] || null;
  }, [featuredArticles, latestArticles, articles.results, isSearchActive]);

  const wireArticles = useMemo(() => {
    if (isSearchActive || !leadArticle) return [];
    return latestArticles.filter((item) => item.id !== leadArticle.id).slice(0, 4);
  }, [latestArticles, leadArticle, isSearchActive]);

  const promotedIds = useMemo(() => {
    const ids = new Set<number>();
    if (leadArticle) ids.add(leadArticle.id);
    wireArticles.forEach((a) => ids.add(a.id));
    return ids;
  }, [leadArticle, wireArticles]);

  // Remaining articles for spotlight duo & archive grid
  const remainingArticles = useMemo(() => {
    if (isSearchActive) return articles.results;
    return articles.results.filter((item) => !promotedIds.has(item.id));
  }, [articles.results, promotedIds, isSearchActive]);

  const spotlightArticles = useMemo(() => {
    if (isSearchActive) return [];
    return remainingArticles.slice(0, 2);
  }, [remainingArticles, isSearchActive]);

  const gridArticles = useMemo(() => {
    if (isSearchActive) return remainingArticles;
    return remainingArticles.slice(spotlightArticles.length);
  }, [remainingArticles, spotlightArticles.length, isSearchActive]);

  const invalidCategory = Boolean(
    category &&
      categoriesState === "ready" &&
      !categories.some((item) => item.slug === category),
  );

  return (
    <section id="news-content" className="scroll-mt-20 bg-[#04b093] text-black">
      {/* 01 // The Live Wire Strip With Category Stickers (Pills Replaced) */}
      <div className="sticky top-16 z-30 border-b-2 border-black bg-black px-4 py-3 text-white shadow-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Live Wire Indicator + Category Stickers Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="flex shrink-0 items-center gap-2 border-2 border-black bg-[#04b093] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_0px_#ffffff]">
              <span className="size-2 animate-ping rounded-full bg-red-600" />
              <span>LIVE WIRE</span>
            </span>

            {/* Category Stickers Bar */}
            <nav aria-label="Live wire categories" className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => navigate({ category: null, page: 1 })}
                aria-pressed={!category}
                className={
                  "shrink-0 border-2 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all " +
                  (!category
                    ? "border-black bg-[#04b093] text-black shadow-[2px_2px_0px_0px_#ffffff]"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-[#04b093] hover:text-[#04b093]")
                }
              >
                [ ALL STORIES ]
              </button>

              {categories.map((item) => {
                const isActive = category === item.slug;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => navigate({ category: item.slug, page: 1 })}
                    aria-pressed={isActive}
                    className={
                      "shrink-0 border-2 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all " +
                      (isActive
                        ? "border-black bg-[#04b093] text-black shadow-[2px_2px_0px_0px_#ffffff]"
                        : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-[#04b093] hover:text-[#04b093]")
                    }
                  >
                    {item.name}
                  </button>
                );
              })}

              {categoriesState === "loading" && (
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-zinc-500" aria-live="polite">
                  Loading topics...
                </span>
              )}
            </nav>
          </div>

          {/* Quick Newsroom Search in the Live Wire Strip */}
          <form onSubmit={handleSearchSubmit} className="relative w-full shrink-0 lg:w-72">
            <label htmlFor="news-search" className="sr-only">
              Search news stories
            </label>
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#04b093]"
                aria-hidden="true"
              />
              <input
                id="news-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="SEARCH STORIES..."
                className="w-full border-2 border-zinc-700 bg-zinc-900 py-1.5 pl-9 pr-8 text-xs font-bold uppercase tracking-wider text-white placeholder:text-zinc-500 focus:border-[#04b093] focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  aria-label="Clear search query"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Warning: Invalid Category */}
        {invalidCategory && (
          <div className="mb-8 border-2 border-black bg-black p-4 text-xs font-bold uppercase tracking-wider text-[#04b093] shadow-xl">
            This category is unavailable.{" "}
            <button
              type="button"
              onClick={() => navigate({ category: null, page: 1 })}
              className="text-white underline hover:text-[#04b093]"
            >
              Show all stories
            </button>
          </div>
        )}

        {/* Active Search Notification Banner */}
        {isSearchActive && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-2 border-black bg-black p-5 text-white shadow-xl">
            <div>
              <span className="inline-block border-2 border-black bg-[#04b093] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#fff]">
                SEARCH RESULTS
              </span>
              <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-white">
                Stories matching &ldquo;{searchQuery}&rdquo;
              </h2>
              <p className="mt-1 text-xs font-bold text-zinc-400">
                {articles.count} {articles.count === 1 ? "story" : "stories"} found
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearSearch}
              className="border-2 border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-zinc-200 transition hover:border-[#04b093] hover:text-[#04b093]"
            >
              Reset Search
            </button>
          </div>
        )}

        {/* 02 // Billboard Hot Lead Broadsheet Showcase (When not searching & has lead) */}
        {!isSearchActive && leadArticle && (
          <div className="mb-14 grid gap-8 lg:grid-cols-12">
            {/* Left: Lead Headline Feature (7 Cols) */}
            <article className="cbm-card group flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 lg:col-span-7">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-black bg-zinc-900">
                  <Image
                    src={leadArticle.cover_image || NewsroomStudioSet}
                    alt={leadArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    unoptimized={Boolean(leadArticle.cover_image)}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                  {/* Category Stickers Overlay */}
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    {leadArticle.category ? (
                      <span className="border-2 border-black bg-[#04b093] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                        {leadArticle.category.name}
                      </span>
                    ) : (
                      <span className="border-2 border-black bg-[#04b093] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                        LEAD FEATURE
                      </span>
                    )}

                    <span className="flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                      <Sparkles size={11} className="text-[#04b093]" />
                      <span>SPOTLIGHT</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Byline metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {leadArticle.author && (
                      <span className="flex items-center gap-1.5 text-zinc-200">
                        <User size={13} className="text-[#04b093]" />
                        <span>By {leadArticle.author}</span>
                      </span>
                    )}
                    {(leadArticle.published_at || leadArticle.created_at) && (
                      <span className="flex items-center gap-1.5 text-[#04b093]">
                        <Clock size={13} />
                        <span>{formatTimeAgo(leadArticle.published_at || leadArticle.created_at || "")}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-black uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#04b093] sm:text-3xl lg:text-4xl">
                    <Link href={`/news/${leadArticle.slug}`}>{leadArticle.title}</Link>
                  </h2>
                </div>
              </div>

              <div className="border-t border-zinc-800 p-6 sm:p-8 pt-4">
                <Link
                  href={`/news/${leadArticle.slug}`}
                  className="inline-flex items-center gap-2 border-2 border-black bg-[#04b093] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-white hover:text-black"
                >
                  <span>Read Full Story</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>

            {/* Right: The Wire Top Stories (5 Cols) */}
            <aside className="cbm-card flex flex-col justify-between rounded-2xl border-2 border-black bg-black p-6 text-white shadow-2xl sm:p-8 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#04b093]">
                    <Flame size={15} />
                    <span>THE WIRE</span>
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    TOP DISPATCHES
                  </span>
                </div>

                <div className="divide-y divide-zinc-800/80">
                  {wireArticles.length > 0 ? (
                    wireArticles.map((story, index) => (
                      <Link
                        key={story.id}
                        href={`/news/${story.slug}`}
                        className="group/wire flex items-start gap-4 py-4 transition-colors hover:bg-zinc-950/60"
                      >
                        <span className="shrink-0 font-mono text-2xl font-black text-[#04b093]">
                          0{index + 1}
                        </span>
                        <div className="flex-1">
                          {story.category && (
                            <span className="inline-block border border-black/40 bg-[#04b093]/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#04b093]">
                              {story.category.name}
                            </span>
                          )}
                          <h3 className="mt-1 line-clamp-2 text-sm font-black uppercase leading-snug tracking-tight text-white transition-colors group-hover/wire:text-[#04b093]">
                            {story.title}
                          </h3>
                          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                            <Clock size={11} className="text-[#04b093]" />
                            <span>
                              {formatTimeAgo(story.published_at || story.created_at || "")}
                            </span>
                          </p>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-zinc-600 transition-colors group-hover/wire:text-[#04b093]"
                        />
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs font-bold text-zinc-500">
                      Additional wire dispatches will be displayed here as stories are published.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-800 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Updated around the clock from the CBM Radio newsroom.
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* 03 // Secondary Spotlight Duo (If available) */}
        {!isSearchActive && spotlightArticles.length > 0 && (
          <div className="mb-14">
            <div className="mb-6 flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="inline-block border-2 border-black bg-black px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#04b093] shadow-[2px_2px_0px_0px_#000]">
                  Spotlight Features
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  In-Depth Reporting
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {spotlightArticles.map((article) => (
                <SpotlightCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* 04 // The Archive Feed Header */}
        <div className="mb-6 mt-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <span className="inline-block border-2 border-black bg-black px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#04b093] shadow-[2px_2px_0px_0px_#000]">
              {category && !invalidCategory
                ? categories.find((c) => c.slug === category)?.name || "Category"
                : "News Archive"}
            </span>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-black sm:text-4xl">
              {category && !invalidCategory
                ? categories.find((c) => c.slug === category)?.name || "Category Stories"
                : "All Dispatches & Features"}
            </h2>
          </div>
          {articles.count > 0 && (
            <p className="text-xs font-black uppercase tracking-wider text-black/80">
              {articles.count} total {articles.count === 1 ? "story" : "stories"}
            </p>
          )}
        </div>

        {/* Loading State */}
        {articlesState === "loading" && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border-2 border-black bg-black p-12 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-[#04b093]" aria-live="polite">
              Loading newsroom articles...
            </p>
          </div>
        )}

        {/* Error State */}
        {articlesState === "error" && (
          <div className="min-h-64 rounded-2xl border-2 border-black bg-black p-12 text-center font-bold text-white shadow-2xl" role="alert">
            <p className="text-lg">Articles are temporarily unavailable.</p>
            <button
              type="button"
              onClick={() => setArticleRequestVersion((value) => value + 1)}
              className="mt-4 border-2 border-black bg-[#04b093] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-white hover:text-black"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {articlesState === "ready" && articles.results.length === 0 && (
          <div className="min-h-64 rounded-2xl border-2 border-black bg-black p-12 text-center font-bold text-white shadow-2xl">
            <p className="text-lg">
              {page > 1
                ? "No articles are available on this page."
                : searchQuery
                  ? `No stories match "${searchQuery}".`
                  : category
                    ? "No stories found in this category."
                    : "No news articles are available yet."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {page > 1 && (
                <button
                  type="button"
                  onClick={() => navigate({ page: 1 })}
                  className="border-2 border-black bg-[#04b093] px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] hover:bg-white"
                >
                  Return to Page 1
                </button>
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="border-2 border-black bg-[#04b093] px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] hover:bg-white"
                >
                  Clear Search
                </button>
              )}
              {category && (
                <button
                  type="button"
                  onClick={() => navigate({ category: null, page: 1 })}
                  className="border-2 border-zinc-700 bg-zinc-900 px-5 py-2 text-xs font-black uppercase tracking-wider text-zinc-200 hover:border-[#04b093] hover:text-[#04b093]"
                >
                  Show All Stories
                </button>
              )}
            </div>
          </div>
        )}

        {/* Already Highlighted Notice */}
        {articlesState === "ready" && articles.results.length > 0 && gridArticles.length === 0 && (
          <div className="my-8 rounded-2xl border-2 border-black bg-black p-8 text-center text-xs font-bold uppercase tracking-wider text-[#04b093]">
            All available stories on this page are featured above in the Lead and Wire spotlights.
          </div>
        )}

        {/* Grid Stories (3 Columns) */}
        {gridArticles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* 05 // Newsroom Tip-Off / Story Pitch Banner (Billboard Style) */}
        <section className="cbm-card mt-16 overflow-hidden rounded-2xl border-2 border-black bg-black p-8 text-white shadow-2xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-block border-2 border-black bg-[#04b093] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                CBM NEWS DESK &bull; TIPS
              </span>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Have A Gospel Music Scoop Or Community Story?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                Connect with the CBM Radio editorial desk. We welcome song releases, ministry milestones, testimonies, and cultural dispatches from across Uganda and beyond.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 border-2 border-black bg-[#04b093] px-6 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-white hover:text-black"
            >
              <span>Submit Story Tip</span>
              <Send size={14} />
            </Link>
          </div>
        </section>

        {/* 06 // Pagination Navigation */}
        {articlesState === "ready" && (articles.previous || articles.next) && (
          <nav aria-label="Article pagination" className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={!articles.previous}
              onClick={() => navigate({ page: Math.max(1, page - 1) })}
              className="border-2 border-black bg-black px-5 py-2 text-xs font-black uppercase tracking-wider text-[#04b093] shadow-[2px_2px_0px_0px_#000] transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              &larr; Previous
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-black" aria-current="page">
              Page {page}
            </span>
            <button
              type="button"
              disabled={!articles.next}
              onClick={() => navigate({ page: page + 1 })}
              className="border-2 border-black bg-black px-5 py-2 text-xs font-black uppercase tracking-wider text-[#04b093] shadow-[2px_2px_0px_0px_#000] transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next &rarr;
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

function SpotlightCard({ article }: { article: ArticleListItem }) {
  const uploadTimestamp = article.published_at || article.created_at;

  return (
    <Link
      href={`/news/${article.slug}`}
      className="cbm-card group grid overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:grid-cols-12"
    >
      <div className="relative aspect-video sm:aspect-auto sm:col-span-5 bg-zinc-900 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
        <Image
          src={article.cover_image || NewsroomStudioSet}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          unoptimized={Boolean(article.cover_image)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {article.category && (
          <div className="absolute left-3 top-3 sm:hidden">
            <span className="border border-black bg-[#04b093] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_0px_#000]">
              {article.category.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between p-6 sm:col-span-7">
        <div>
          {article.category && (
            <span className="hidden sm:inline-block border border-black bg-[#04b093] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-[1px_1px_0px_0px_#000]">
              {article.category.name}
            </span>
          )}
          <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-[#04b093] line-clamp-3">
            {article.title}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-400">
          {article.author && <p className="font-bold text-zinc-300">By {article.author}</p>}
          {uploadTimestamp && (
            <p className="mt-1 flex items-center gap-1.5 font-bold text-[#04b093] text-[11px]">
              <Clock size={12} />
              <span>{formatTimeAgo(uploadTimestamp)}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: ArticleListItem }) {
  const uploadTimestamp = article.published_at || article.created_at;

  return (
    <Link
      href={`/news/${article.slug}`}
      className="cbm-card group flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div>
        <div className="relative aspect-video border-b-2 border-black bg-zinc-900">
          <Image
            src={article.cover_image || Logo}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={Boolean(article.cover_image)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {article.category && (
            <div className="absolute left-3 top-3">
              <span className="border-2 border-black bg-[#04b093] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                {article.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-black uppercase leading-snug tracking-tight text-white transition-colors group-hover:text-[#04b093] line-clamp-2">
            {article.title}
          </h3>
        </div>
      </div>

      <div className="border-t border-zinc-800 p-6 pt-3">
        {article.author && (
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            By {article.author}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between text-xs">
          {uploadTimestamp && (
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#04b093]">
              <Clock size={12} aria-hidden="true" />
              <span>{formatTimeAgo(uploadTimestamp)}</span>
            </span>
          )}
          {article.published_at && (
            <span className="text-[11px] font-semibold text-zinc-500">
              {formatPublicationDate(article.published_at)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
