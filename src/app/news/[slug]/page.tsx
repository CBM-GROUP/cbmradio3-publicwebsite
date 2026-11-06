import axios from "axios";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Newspaper,
  Sparkles,
  User,
} from "lucide-react";

import {
  ArticleRenderer,
  hasRenderableStructuredContent,
  isStructuredArticleDocument,
} from "@/components/article/article-renderer";
import { ArticleShareBar } from "@/components/article/article-share-bar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  estimateArticleReadingTime,
  formatPublicationDateTime,
  formatTimeAgo,
} from "@/lib/article-metadata";
import NewsService, {
  MalformedArticleResponseError,
} from "@/services/news-service";
import type {
  ArticleDetail,
  ArticleListItem,
  StructuredArticleDocument,
} from "@/types/news";
import Logo from "../../../../public/cbmradio.png";

const getArticle = cache(async (slug: string): Promise<ArticleDetail | null> => {
  try {
    return await NewsService.getArticleBySlug(slug);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    if (error instanceof MalformedArticleResponseError) return null;
    return null;
  }
});

const getRelatedArticles = cache(
  async (categorySlug?: string, currentArticleId?: number) => {
    try {
      let related: ArticleListItem[] = [];
      if (categorySlug) {
        const res = await NewsService.getArticles({
          category: categorySlug,
          ordering: "-published_at",
        });
        related = res.results.filter((item) => item.id !== currentArticleId);
      }
      if (related.length < 3) {
        const latest = await NewsService.getLatestArticles();
        const additional = latest.filter(
          (item) =>
            item.id !== currentArticleId &&
            !related.some((r) => r.id === item.id)
        );
        related = [...related, ...additional];
      }
      return related.slice(0, 3);
    } catch {
      return [];
    }
  }
);

type ArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found | CBM Radio" };

  const plainExcerpt =
    article.body.trim().slice(0, 160) ||
    `Read ${article.title} on CBM Radio Newsroom.`;
  const coverUrl = article.cover_image || article.external_cover_image_url;

  return {
    title: `${article.title} | CBM Radio News`,
    description: plainExcerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: plainExcerpt,
      type: "article",
      publishedTime: article.published_at || article.created_at,
      authors: article.author ? [article.author] : ["CBM Radio Newsroom"],
      images: coverUrl ? [coverUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: plainExcerpt,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

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
    .map((val) => val.trim())
    .filter(Boolean);

  const uploadTimestamp = article.published_at || article.created_at;
  const relatedArticles = await getRelatedArticles(
    article.category?.slug,
    article.id
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#04b093] px-3 pb-24 pt-28 text-black sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">



          {/* Broad-sheet Article Header */}
          <header className="overflow-hidden rounded-3xl border-3 border-black bg-black p-6 text-white shadow-[10px_10px_0_0_#000] sm:p-8 md:p-10">
            {article.category && (
              <div className="mb-4">
                <span className="inline-block rounded-md border border-[#04b093]/40 bg-[#04b093]/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#04b093]">
                  {article.category.name}
                </span>
              </div>
            )}

            <h1 className="break-words hyphens-auto text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl [overflow-wrap:anywhere]">
              {article.title}
            </h1>

            {/* Rich Byline & Metrics Toolbar */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-zinc-800 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
              {article.author && (
                <div className="flex items-center gap-2 text-zinc-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#04b093] text-xs font-black text-black">
                    <User className="h-4 w-4" />
                  </span>
                  <span>By {article.author}</span>
                </div>
              )}

              <span className="hidden text-zinc-600 sm:inline">•</span>

              {uploadTimestamp && (
                <div
                  className="flex items-center gap-1.5 text-[#04b093]"
                  title={`Uploaded: ${formatPublicationDateTime(uploadTimestamp)}`}
                >
                  <Clock className="h-4 w-4 shrink-0 text-[#04b093]" />
                  <span>{formatTimeAgo(uploadTimestamp)}</span>
                </div>
              )}

              {readingTime && (
                <>
                  <span className="hidden text-zinc-600 sm:inline">•</span>
                  <div className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300">
                    <BookOpen className="h-3.5 w-3.5 text-[#04b093]" />
                    <span>{readingTime} min read</span>
                  </div>
                </>
              )}

              {article.views_count !== undefined && article.views_count > 0 && (
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300">
                  <Eye className="h-3.5 w-3.5 text-[#04b093]" />
                  <span>{article.views_count} views</span>
                </div>
              )}

              {uploadTimestamp && (
                <div className="ml-auto hidden items-center gap-1.5 text-xs text-zinc-500 md:flex">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatPublicationDateTime(uploadTimestamp)}</span>
                </div>
              )}
            </div>

            {/* Social Share Toolbar */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                Share this article with your community:
              </span>
              <ArticleShareBar title={article.title} slug={article.slug} />
            </div>
          </header>

          {/* Featured Cover Image Stage */}


          {/* Editorial Reading Chamber */}
          <article className="overflow-hidden rounded-3xl border-3 border-black bg-black p-6 text-white shadow-[10px_10px_0_0_#000] sm:p-10 md:p-12 [overflow-wrap:anywhere]">
            {article.cover_image && (
              <div className="relative aspect-video overflow-hidden rounded-3xl border-3 border-black bg-black shadow-[10px_10px_0_0_#000]">
                <Image
                  src={article.cover_image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  unoptimized
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
            <div className="article-body">
              {structuredDocument ? (
                <ArticleRenderer
                  document={structuredDocument}
                  articleTitle={article.title}
                />
              ) : paragraphs.length > 0 ? (
                <div className="space-y-6 text-base leading-relaxed text-zinc-300 break-words [overflow-wrap:anywhere] sm:text-lg sm:leading-8">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={"paragraph-" + index}
                      className="whitespace-pre-line break-words [overflow-wrap:anywhere] leading-relaxed sm:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 italic">
                  This article does not have content yet.
                </p>
              )}
            </div>

            {/* Editorial Sign-off Box */}
            <div className="mt-14 rounded-2xl border-2 border-zinc-800 bg-zinc-950 p-6 sm:mt-16 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="border border-black bg-[#04b093] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                    CBM Newsroom
                  </span>
                  <h4 className="mt-2 text-base font-black uppercase text-white sm:text-lg">
                    Reporting & Editorial by {article.author || "CBM News Team"}
                  </h4>
                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-zinc-400">
                    Broadcasting spiritual nourishment, gospel anthems, and Kingdom news across Uganda and worldwide.
                  </p>
                </div>
                <div className="shrink-0">
                  <ArticleShareBar title={article.title} slug={article.slug} />
                </div>
              </div>
            </div>
          </article>

          {/* Related Dispatches (3-Card Grid) */}
          {relatedArticles.length > 0 && (
            <section className="pt-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-wider text-[#04b093]">
                    More Dispatches
                  </span>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
                    Latest From The Newsroom
                  </h3>
                </div>
                <Link
                  href="/news"
                  className="rounded-xl border-2 border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_0_#000] transition-all hover:bg-white hover:text-black"
                >
                  View All News & Articles &rarr;
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((relArt) => {
                  const relTime = formatTimeAgo(
                    relArt.published_at || relArt.created_at
                  );
                  return (
                    <article
                      key={relArt.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-black bg-black text-white shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]"
                    >
                      <div className="relative aspect-video overflow-hidden bg-zinc-900">
                        <Image
                          src={relArt.cover_image || Logo}
                          alt={relArt.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                          unoptimized={Boolean(relArt.cover_image)}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        {relArt.category && (
                          <span className="absolute left-3 top-3 border border-black/40 bg-[#04b093] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
                            {relArt.category.name}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h4 className="text-base font-black uppercase text-white line-clamp-2 transition-colors group-hover:text-[#04b093]">
                          <Link href={`/news/${encodeURIComponent(relArt.slug)}`}>
                            {relArt.title}
                          </Link>
                        </h4>

                        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                          {relArt.author && (
                            <span className="truncate">By {relArt.author}</span>
                          )}
                          {relTime && <span>{relTime}</span>}
                        </div>

                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800">
                          <Link
                            href={`/news/${encodeURIComponent(relArt.slug)}`}
                            className="text-xs font-black uppercase tracking-wider text-[#04b093] transition-colors hover:text-white"
                          >
                            Read Article &rarr;
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
          {/* Breadcrumb Navigation Bar */}
          <nav
            aria-label="Article breadcrumb"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-black p-4 text-white shadow-[6px_6px_0_0_#000]"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#04b093] px-3.5 py-1.5 text-black shadow-[2px_2px_0_0_#000] transition-all hover:bg-white hover:text-black"
              >
                &larr; Back to News & Articles
              </Link>
              {article.category && (
                <Link
                  href={`/news?category=${encodeURIComponent(article.category.slug)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-[#04b093] transition-colors hover:border-[#04b093]"
                >
                  <span>{article.category.name}</span>
                </Link>
              )}
            </div>

            <div className="hidden items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-400 sm:flex">
              <Newspaper className="h-3.5 w-3.5 text-[#04b093]" />
              <span>CBM Radio Newsroom Dispatch</span>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
