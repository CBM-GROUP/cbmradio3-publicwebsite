"use client";

import axios from "axios";
import {
  BookOpen,
  Calendar,
  Check,
  Clock,
  Copy,
  Eye,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import { FaFacebook, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
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
  formatPublicationDateTime,
  formatTimeAgo,
  formatViewsCount,
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
      return () => {
        isMounted = false;
      };
    }

    NewsService.getArticleBySlug(slug)
      .then((result) => {
        if (!isMounted) return;
        setArticle(result);
        setLoading(false);
      })
      .catch((error: unknown) => {
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

    return () => {
      isMounted = false;
    };
  }, [retryVersion, slug]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-4 pb-20 pt-32 text-zinc-100 sm:px-6 lg:px-8">
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
    <div
      className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-5 text-center text-zinc-400"
      role="status"
    >
      <p className="text-base text-zinc-300">{message}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {retry && (
          <button
            type="button"
            onClick={retry}
            className="rounded-xl bg-teal-500 px-5 py-2.5 font-semibold text-black transition-all hover:bg-teal-400"
          >
            Retry
          </button>
        )}
        <Link
          href="/news"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 font-semibold text-zinc-200 transition-all hover:bg-zinc-800"
        >
          Back to News
        </Link>
      </div>
    </div>
  );
}

function ArticleContent({ article }: { article: ArticleDetail }) {
  const [copied, setCopied] = useState(false);

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

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://cbmradio.com/news/${article.slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => undefined);
    }
  };

  const uploadTimestamp = article.published_at || article.created_at;

  return (
    <article className="mx-auto max-w-4xl">
      {/* Navigation & Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400 transition-colors hover:text-teal-300"
        >
          &larr; Back to News
        </Link>
        {article.category && (
          <Link
            href={`/news?category=${encodeURIComponent(article.category.slug)}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-400 transition-colors hover:bg-teal-500/20"
          >
            <span>{article.category.name}</span>
          </Link>
        )}
      </div>

      {/* Main Headline */}
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
        {article.title}
      </h1>

      {/* Rich Metadata & Metrics Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-zinc-800/80 py-4 text-xs text-zinc-400 sm:text-sm">
        {article.author && (
          <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold">
              <User className="h-3.5 w-3.5" />
            </span>
            <span>By {article.author}</span>
          </div>
        )}

        <span className="text-zinc-600 hidden sm:inline">•</span>

        {/* Time Since Uploaded / Published */}
        {uploadTimestamp && (
          <div
            className="flex items-center gap-1.5 font-medium text-emerald-400"
            title={`Uploaded: ${formatPublicationDateTime(uploadTimestamp)}`}
          >
            <Clock className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Uploaded {formatTimeAgo(uploadTimestamp)}</span>
          </div>
        )}

        <span className="text-zinc-600 hidden sm:inline">•</span>

        {/* Views Count */}
        <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-bold text-amber-400">
          <Eye className="h-3.5 w-3.5" />
          <span>{formatViewsCount(article.views_count)}</span>
        </div>

        {/* Reading Time */}
        {readingTime && (
          <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            <span>{readingTime} min read</span>
          </div>
        )}

        {/* Exact Date */}
        {uploadTimestamp && (
          <div className="hidden md:flex items-center gap-1.5 text-zinc-500 text-xs ml-auto">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatPublicationDateTime(uploadTimestamp)}</span>
          </div>
        )}
      </div>

      {/* Social Share Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <span className="flex items-center gap-1.5 font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">
          <Share2 className="h-3.5 w-3.5" />
          Share Story:
        </span>
        <div className="flex items-center gap-2">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${article.title} - Read more on CBM Radio: ${currentUrl}`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="Share via WhatsApp"
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              article.title,
            )}&url=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Share on X (Twitter)"
          >
            <FaXTwitter className="h-3.5 w-3.5" />
            <span>Post</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentUrl,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
            title="Share on Facebook"
          >
            <FaFacebook className="h-3.5 w-3.5" />
            <span>Share</span>
          </a>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Copy article link"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feature Cover Image */}
      {article.cover_image && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            unoptimized
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Body Content */}
      <div className="mt-10">
        {structuredDocument ? (
          <ArticleRenderer
            document={structuredDocument}
            articleTitle={article.title}
          />
        ) : paragraphs.length > 0 ? (
          <div className="space-y-6 text-base leading-relaxed text-zinc-300 sm:text-lg sm:leading-8">
            {paragraphs.map((paragraph, index) => (
              <p key={"paragraph-" + index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">This article does not have content yet.</p>
        )}
      </div>

      {/* Article Bottom Sign-off Box */}
      <div className="mt-16 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              CBM Newsroom
            </span>
            <h4 className="mt-1 text-lg font-bold text-white">
              Stay Connected with CBM Radio
            </h4>
            <p className="mt-1 text-xs text-zinc-400">
              Broadcasting gospel anthems, spiritual nourishment, and community news across Uganda and worldwide.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-bold text-black transition-all hover:bg-teal-400 shadow-lg shadow-teal-500/20"
          >
            <span>Explore More News</span>
            <Sparkles className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
