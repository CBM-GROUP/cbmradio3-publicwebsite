"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { formatPublicationDate } from "@/lib/article-metadata";
import homeService from "@/services/home.service";
import type { ArticleSummary } from "@/types/news";
import Logo from "../../public/cbmradio.png";

type RequestState = "loading" | "ready" | "error";

export default function NewsSection() {
  const [featuredArticles, setFeaturedArticles] = useState<ArticleSummary[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleSummary[]>([]);
  const [featuredState, setFeaturedState] = useState<RequestState>("loading");
  const [latestState, setLatestState] = useState<RequestState>("loading");

  useEffect(() => {
    let isMounted = true;

    homeService.getFeaturedArticles().then((items) => {
      if (!isMounted) return;
      setFeaturedArticles(items);
      setFeaturedState("ready");
    }).catch(() => {
      if (isMounted) setFeaturedState("error");
    });

    homeService.getLatestArticles().then((items) => {
      if (!isMounted) return;
      setLatestArticles(items);
      setLatestState("ready");
    }).catch(() => {
      if (isMounted) setLatestState("error");
    });

    return () => { isMounted = false; };
  }, []);

  const featured = featuredArticles[0];
  const latest = latestArticles.find((article) => article.id !== featured?.id);
  const isEmpty = featuredState === "ready" && latestState === "ready" && !featured && !latest;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-500">News</p>
          <h2 className="mt-2 text-3xl font-extrabold text-white">From the newsroom</h2>
        </div>
        <Link href="/news" className="font-semibold text-teal-500 hover:text-teal-400">View all news</Link>
      </div>

      {(featuredState === "loading" || latestState === "loading") && !featured && !latest && (
        <p className="min-h-80 text-center text-zinc-400" aria-live="polite">Loading news...</p>
      )}
      {isEmpty && <p className="min-h-80 text-center text-zinc-400">No published news is available right now.</p>}
      {featuredState === "error" && latestState === "error" && (
        <p className="min-h-80 text-center text-zinc-400">News is temporarily unavailable.</p>
      )}

      {featured && (
        <ArticleCard article={featured} label="Featured" featured />
      )}
      {featuredState === "error" && latest && (
        <p className="mb-4 text-sm text-zinc-500">Featured news is temporarily unavailable.</p>
      )}

      {latest && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-teal-500">Latest</p>
          <ArticleCard article={latest} label="Latest" />
        </div>
      )}
      {latestState === "error" && featured && (
        <p className="mt-6 text-sm text-zinc-500">Latest news is temporarily unavailable.</p>
      )}
    </section>
  );
}

function ArticleCard({ article, label, featured = false }: { article: ArticleSummary; label: string; featured?: boolean }) {
  return (
    <Link href={"/news/" + article.slug} className={"grid overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 " + (featured ? "gap-6 lg:grid-cols-2" : "gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]")}>
      <div className="relative aspect-video bg-zinc-900">
        <Image
          src={article.cover_image || Logo}
          alt={article.title}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, 34vw"}
          unoptimized={Boolean(article.cover_image)}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-500">{label}</span>
        {article.category && <span className="mt-2 text-xs uppercase text-zinc-500">{article.category.name}</span>}
        <h3 className={"mt-2 font-bold text-white " + (featured ? "text-3xl" : "text-xl")}>{article.title}</h3>
        {article.author && <p className="mt-4 text-sm text-zinc-400">By {article.author}</p>}
        {article.published_at && <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400"><Clock size={16} /> {formatPublicationDate(article.published_at)}</p>}
      </div>
    </Link>
  );
}
