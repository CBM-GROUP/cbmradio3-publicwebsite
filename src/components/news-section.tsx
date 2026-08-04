"use client";

import { Clock, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useArticles } from "@/hooks/useArticles";
import { useFeaturedArticles } from "@/hooks/useFeaturedArticles";
import { formatPublicationDate } from "@/lib/article-metadata";
import Logo from "../../public/cbmradio.png";

export default function NewsSection() {
  const router = useRouter();
  const { articles, loading, error } = useArticles();
  const { featuredArticles, loading: featuredLoading, error: featuredError } =
    useFeaturedArticles();
  const featured = featuredArticles[0];

  if (loading || featuredLoading) {
    return <div className="min-h-80 flex items-center justify-center text-zinc-400">Loading news...</div>;
  }

  if (error || featuredError) {
    return <div className="min-h-80 flex items-center justify-center text-red-500">Unable to load news.</div>;
  }

  if (articles.length === 0 && featuredArticles.length === 0) {
    return (
      <div className="min-h-80 flex flex-col items-center justify-center text-zinc-400">
        <TriangleAlert size={64} color="#f3bc31" />
        <h2 className="mt-4 text-2xl font-bold text-amber-500">No News Available</h2>
        <p>There are no published articles at the moment.</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-8">News</h1>
      {featured && (
        <button
          type="button"
          onClick={() => router.push(`/news/${featured.slug}`)}
          className="w-full text-left grid gap-6 lg:grid-cols-2 mb-10 cursor-pointer"
        >
          <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
            <Image src={featured.cover_image || Logo} alt={featured.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-500">Featured</span>
            <h2 className="mt-3 text-3xl font-bold text-white">{featured.title}</h2>
            <p className="mt-4 text-sm text-zinc-400">By {featured.author}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
              <Clock size={16} /> {formatPublicationDate(featured.published_at)}
            </p>
          </div>
        </button>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <button
            type="button"
            key={article.id}
            onClick={() => router.push(`/news/${article.slug}`)}
            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-left cursor-pointer"
          >
            <div className="relative aspect-video bg-zinc-900">
              <Image src={article.cover_image || Logo} alt={article.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-white">{article.title}</h3>
              <p className="mt-3 text-sm text-zinc-400">By {article.author}</p>
              <p className="mt-2 text-xs text-zinc-500">{formatPublicationDate(article.published_at)}</p>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}