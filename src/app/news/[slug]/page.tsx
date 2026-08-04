"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { useArticle } from "@/hooks/useArticle";
import { estimateReadingTime, formatPublicationDate } from "@/lib/article-metadata";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { article, loading, error } = useArticle(slug);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Article not found.</p>
        <Link href="/news" className="text-teal-600">Return to news</Link>
      </div>
    );
  }

  const paragraphs = article.body.split(/\r?\n\s*\r?\n/).map((value) => value.trim()).filter(Boolean);

  return (
    <>
      <Header />
      <article className="min-h-screen bg-zinc-950 text-zinc-100 pt-28 pb-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/news" className="text-sm text-teal-500">← Back to news</Link>
          <h1 className="mt-6 text-3xl sm:text-5xl font-bold leading-tight">{article.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
            <span>By {article.author}</span>
            <span>{formatPublicationDate(article.published_at)}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {estimateReadingTime(article.body)} min read</span>
          </div>
          {article.cover_image && (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-zinc-900">
              <Image src={article.cover_image} alt={article.title} fill unoptimized className="object-cover" />
            </div>
          )}
          <div className="mt-10 space-y-6 text-base sm:text-lg leading-8 text-zinc-300">
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </main>
      </article>
      <Footer />
    </>
  );
}