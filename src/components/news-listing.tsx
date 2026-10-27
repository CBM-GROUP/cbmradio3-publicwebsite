"use client";

import axios from "axios";
import { Clock } from "lucide-react";
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
  const page = parsePage(searchParams.get("page"));

  const [articles, setArticles] = useState(EMPTY_PAGE);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<ArticleListItem[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleListItem[]>([]);
  const [articlesState, setArticlesState] = useState<RequestState>("loading");
  const [categoriesState, setCategoriesState] = useState<RequestState>("loading");
  const [featuredState, setFeaturedState] = useState<RequestState>("loading");
  const [latestState, setLatestState] = useState<RequestState>("loading");
  const [articleRequestVersion, setArticleRequestVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;
    NewsService.getArticleCategories({ page: 1 }).then((response) => {
      if (!isMounted) return;
      setCategories(response.results);
      setCategoriesState("ready");
    }).catch(() => {
      if (isMounted) setCategoriesState("error");
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    NewsService.getFeaturedArticles().then((items) => {
      if (!isMounted) return;
      setFeaturedArticles(items);
      setFeaturedState("ready");
    }).catch(() => {
      if (isMounted) setFeaturedState("error");
    });
    NewsService.getLatestArticles().then((items) => {
      if (!isMounted) return;
      setLatestArticles(items);
      setLatestState("ready");
    }).catch(() => {
      if (isMounted) setLatestState("error");
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setArticlesState("loading");
    });
    NewsService.getArticles({ page, category: category || undefined }).then((response) => {
      if (!isMounted) return;
      setArticles(response);
      setArticlesState("ready");
    }).catch((error: unknown) => {
      if (!isMounted) return;
      if (page > 1 && axios.isAxiosError(error) && error.response?.status === 404) {
        setArticles(EMPTY_PAGE);
        setArticlesState("ready");
      } else {
        setArticlesState("error");
      }
    });
    return () => { isMounted = false; };
  }, [articleRequestVersion, category, page]);

  const navigate = useCallback((updates: { category?: string | null; page?: number }) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (updates.category !== undefined) {
      if (updates.category) nextParams.set("category", updates.category);
      else nextParams.delete("category");
    }
    if (updates.page === undefined || updates.page <= 1) nextParams.delete("page");
    else nextParams.set("page", String(updates.page));
    const query = nextParams.toString();
    router.push(query ? pathname + "?" + query : pathname, { scroll: false });
    window.requestAnimationFrame(() => {
      document.getElementById("news-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname, router, searchParams]);

  const featured = featuredArticles[0];
  const latest = latestArticles.find((article) => article.id !== featured?.id);
  const promotedIds = useMemo(
    () => new Set([featured?.id, latest?.id].filter((id): id is number => id !== undefined)),
    [featured?.id, latest?.id],
  );
  const gridArticles = articles.results.filter((article) => !promotedIds.has(article.id));
  const invalidCategory = Boolean(
    category &&
      categoriesState === "ready" &&
      !categories.some((item) => item.slug === category),
  );

  return (
    <section id="news-content" className="scroll-mt-24 bg-[#04b093] px-4 pb-20 pt-16 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:text-left">
          <span className="inline-block rounded-full bg-black px-4 py-1 text-xs font-black uppercase tracking-wider text-[#04b093]">
            News
          </span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-black sm:text-5xl">CBM Radio News</h1>
          <p className="mt-3 max-w-2xl font-bold text-black/80">Read our featured coverage and latest published stories.</p>
        </div>

        <nav aria-label="News categories" className="mb-10 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => navigate({ category: null, page: 1 })}
            aria-pressed={!category}
            className={"rounded-full border-2 border-black px-5 py-2 text-xs font-black uppercase tracking-wider transition-all " + (!category ? "bg-black text-[#04b093] shadow-md" : "bg-black/10 text-black hover:border-black hover:bg-black hover:text-white")}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => navigate({ category: item.slug, page: 1 })}
              aria-pressed={category === item.slug}
              className={"rounded-full border-2 border-black px-5 py-2 text-xs font-black uppercase tracking-wider transition-all " + (category === item.slug ? "bg-black text-[#04b093] shadow-md" : "bg-black/10 text-black hover:border-black hover:bg-black hover:text-white")}
            >
              {item.name}
            </button>
          ))}
          {categoriesState === "loading" && <span className="self-center text-xs font-black uppercase tracking-wider text-black/70" aria-live="polite">Loading categories...</span>}
          {categoriesState === "error" && <span className="self-center text-xs font-black uppercase tracking-wider text-black/70">Categories are unavailable.</span>}
        </nav>

        {invalidCategory && (
          <div className="mb-8 rounded-2xl border-2 border-black bg-black p-4 text-xs font-bold uppercase tracking-wider text-[#04b093]">
            This category is unavailable. <button type="button" onClick={() => navigate({ category: null, page: 1 })} className="underline text-white hover:text-[#04b093]">Show all news</button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {featured && <PromotedArticle article={featured} label="Featured" />}
          {latest && <PromotedArticle article={latest} label="Latest" />}
        </div>
        {featuredState === "error" && <p className="mt-4 text-xs font-black uppercase tracking-wider text-black/70">Featured coverage is temporarily unavailable.</p>}
        {latestState === "error" && <p className="mt-4 text-xs font-black uppercase tracking-wider text-black/70">Latest coverage is temporarily unavailable.</p>}
        {(featuredState === "loading" || latestState === "loading") && !featured && !latest && <p className="min-h-20 text-xs font-black uppercase tracking-wider text-black/70" aria-live="polite">Loading featured coverage...</p>}

        <div className="mb-6 mt-14 flex items-end justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <span className="inline-block rounded-full bg-black px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#04b093]">More News</span>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-black">{category && !invalidCategory ? categories.find((item) => item.slug === category)?.name || "News" : "All Articles"}</h2>
          </div>
          {articles.count > 0 && <p className="text-xs font-black uppercase tracking-wider text-black/80">{articles.count} article{articles.count === 1 ? "" : "s"}</p>}
        </div>

        {articlesState === "loading" && <p className="min-h-64 text-center font-black uppercase tracking-wider text-black/70" aria-live="polite">Loading articles...</p>}
        {articlesState === "error" && (
          <div className="min-h-64 text-center font-bold text-black"><p className="text-lg">Articles are temporarily unavailable.</p><button type="button" onClick={() => setArticleRequestVersion((value) => value + 1)} className="mt-4 rounded-full border-2 border-black bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black">Retry</button></div>
        )}
        {articlesState === "ready" && articles.results.length === 0 && (
          <div className="min-h-64 text-center font-bold text-black">
            <p>{page > 1 ? "No articles are available on this page." : category ? "No articles are available in this category." : "No news articles are available yet."}</p>
            {page > 1 && <button type="button" onClick={() => navigate({ page: 1 })} className="mt-4 font-black uppercase text-black underline underline-offset-4">Return to page 1</button>}
          </div>
        )}
        {articlesState === "ready" && articles.results.length > 0 && gridArticles.length === 0 && <p className="min-h-32 text-center font-bold text-black/80">All articles on this page are already highlighted above.</p>}
        {gridArticles.length > 0 && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{gridArticles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}

        {articlesState === "ready" && (articles.previous || articles.next) && (
          <nav aria-label="Article pagination" className="mt-12 flex items-center justify-center gap-4">
            <button type="button" disabled={!articles.previous} onClick={() => navigate({ page: Math.max(1, page - 1) })} className="rounded-full border-2 border-black bg-black px-5 py-2 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <span className="text-xs font-black uppercase tracking-wider text-black" aria-current="page">Page {page}</span>
            <button type="button" disabled={!articles.next} onClick={() => navigate({ page: page + 1 })} className="rounded-full border-2 border-black bg-black px-5 py-2 text-xs font-black uppercase tracking-wider text-[#04b093] transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </nav>
        )}
      </div>
    </section>
  );
}

function PromotedArticle({ article, label }: { article: ArticleListItem; label: "Featured" | "Latest" }) {
  return (
    <Link href={"/news/" + article.slug} className="cbm-card group grid overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-2xl sm:grid-cols-2">
      <ArticleImage article={article} />
      <ArticleMetadata article={article} label={label} />
    </Link>
  );
}

function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <Link href={"/news/" + article.slug} className="cbm-card group flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-xl">
      <ArticleImage article={article} />
      <ArticleMetadata article={article} />
    </Link>
  );
}

function ArticleImage({ article }: { article: ArticleListItem }) {
  return <div className="relative aspect-video border-b-2 border-black/80 bg-zinc-900"><Image src={article.cover_image || Logo} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={Boolean(article.cover_image)} className="object-cover" /></div>;
}

function ArticleMetadata({ article, label }: { article: ArticleListItem; label?: string }) {
  const uploadTimestamp = article.published_at || article.created_at;

  return (
    <div className="flex flex-1 flex-col justify-between p-6">
      <div>
        {label ? (
          <span className="inline-block rounded-full bg-[#04b093] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black">{label}</span>
        ) : article.category ? (
          <span className="inline-block rounded-full bg-[#04b093] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black">{article.category.name}</span>
        ) : (
          <span className="inline-block rounded-full bg-zinc-800 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-zinc-300">News</span>
        )}
        <h3 className="mt-3 text-lg font-black uppercase leading-tight tracking-tight text-white group-hover:text-[#04b093] transition-colors line-clamp-2">
          {article.title}
        </h3>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800">
        {article.author && <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">By {article.author}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {uploadTimestamp && (
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#04b093]">
              <Clock size={13} aria-hidden="true" />
              <span>{formatTimeAgo(uploadTimestamp)}</span>
            </span>
          )}
          {article.published_at && (
            <span className="text-zinc-500 text-[11px] font-semibold">
              • {formatPublicationDate(article.published_at)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
