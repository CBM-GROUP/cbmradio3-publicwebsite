"use client";

import axios from "axios";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArticleRenderer,
  hasRenderableStructuredContent,
  isStructuredArticleDocument,
} from "@/components/article/article-renderer";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  estimateArticleReadingTime,
  formatPublicationDate,
} from "@/lib/article-metadata";
import NewsService, {
  MalformedArticleResponseError,
} from "@/services/news-service";
import type { ArticleDetail, StructuredArticleDocument } from "@/types/news";

type FailureKind = "not-found" | "request" | "malformed";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<FailureKind | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      setLoading(true);
      setFailure(null);
    });

    if (!slug) {
      queueMicrotask(() => {
        if (!isMounted) return;
        setFailure("not-found");
        setLoading(false);
      });
      return () => { isMounted = false; };
    }

    NewsService.getArticleBySlug(slug).then((result) => {
      if (!isMounted) return;
      setArticle(result);
      setLoading(false);
    }).catch((error: unknown) => {
      if (!isMounted) return;
      setArticle(null);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setFailure("not-found");
      } else if (error instanceof MalformedArticleResponseError) {
        setFailure("malformed");
      } else {
        setFailure("request");
      }
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [retryVersion, slug]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-4 pb-16 pt-32 text-zinc-100 sm:px-6">
        {loading && <ArticleState message="Loading article..." />}
        {!loading && failure === "not-found" && (
          <ArticleState message="This article could not be found." />
        )}
        {!loading && (failure === "request" || failure === "malformed") && (
          <ArticleState
            message={
              failure === "malformed"
                ? "This article could not be displayed because its response was unexpected."
                : "The article is temporarily unavailable."
            }
            retry={() => setRetryVersion((value) => value + 1)}
          />
        )}
        {!loading && article && <ArticleContent article={article} />}
      </main>
      <Footer />
    </>
  );
}

function ArticleState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-5 text-center text-zinc-400" role="status">
      <p>{message}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {retry && <button type="button" onClick={retry} className="rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-black">Retry</button>}
        <Link href="/news" className="rounded-lg border border-zinc-700 px-5 py-2.5 font-semibold text-teal-500">Back to News</Link>
      </div>
    </div>
  );
}

function ArticleContent({ article }: { article: ArticleDetail }) {
  const structuredDocument: StructuredArticleDocument | null =
    article.content_schema_version === 1 &&
    isStructuredArticleDocument(article.content_json) &&
    hasRenderableStructuredContent(article.content_json)
      ? article.content_json
      : null;
  const readingTime = estimateArticleReadingTime({
    document: structuredDocument,
    body: article.body,
  });
  const paragraphs = article.body
    .split(/\r?\n\s*\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-4xl">
      <Link href="/news" className="text-sm font-medium text-teal-500 hover:text-teal-400">&larr; Back to News</Link>
      {article.category && <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-teal-500">{article.category.name}</p>}
      <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">{article.title}</h1>
      <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
        {article.author && <span>By {article.author}</span>}
        {article.published_at && <span>{formatPublicationDate(article.published_at)}</span>}
        {readingTime && <span className="flex items-center gap-1"><Clock size={16} aria-hidden="true" /> {readingTime} min read</span>}
      </div>
      {article.cover_image && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-zinc-900">
          <Image src={article.cover_image} alt={article.title} fill sizes="(max-width: 896px) 100vw, 896px" unoptimized className="object-cover" />
        </div>
      )}
      <div className="mt-10">
        {structuredDocument ? (
          <ArticleRenderer document={structuredDocument} articleTitle={article.title} />
        ) : paragraphs.length > 0 ? (
          <div className="space-y-6 text-base leading-8 text-zinc-300 sm:text-lg">
            {paragraphs.map((paragraph, index) => <p key={"paragraph-" + index} className="whitespace-pre-line">{paragraph}</p>)}
          </div>
        ) : (
          <p className="text-zinc-400">This article does not have content yet.</p>
        )}
      </div>
    </article>
  );
}
