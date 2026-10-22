import type { ReactNode } from "react";

import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type {
  StructuredArticleDocument,
  StructuredArticleNode,
  StructuredImageNode,
  StructuredTextNode,
  StructuredYouTubeNode,
} from "@/types/news";

const MAX_DOCUMENT_DEPTH = 30;
const MAX_DOCUMENT_NODES = 5000;

export function isStructuredArticleDocument(
  value: unknown,
): value is StructuredArticleDocument {
  if (!value || typeof value !== "object") return false;
  const document = value as Record<string, unknown>;
  if (document.type !== "doc" || !Array.isArray(document.content)) return false;

  let nodesSeen = 0;
  function isUsableNode(node: unknown, depth: number): boolean {
    nodesSeen += 1;
    if (nodesSeen > MAX_DOCUMENT_NODES || depth > MAX_DOCUMENT_DEPTH) return false;
    if (!node || typeof node !== "object") return false;
    const candidate = node as Record<string, unknown>;
    if (typeof candidate.type !== "string") return false;
    if (candidate.type === "text" && typeof candidate.text !== "string") return false;
    if (
      (candidate.type === "image" || candidate.type === "youtube") &&
      (!candidate.attrs || typeof candidate.attrs !== "object")
    ) return false;
    if (candidate.content !== undefined) {
      if (!Array.isArray(candidate.content)) return false;
      return candidate.content.every((child) => isUsableNode(child, depth + 1));
    }
    return true;
  }

  return document.content.every((node) => isUsableNode(node, 1));
}

export function ArticleRenderer({
  document,
  articleTitle,
}: {
  document: StructuredArticleDocument;
  articleTitle: string;
}) {
  return (
    <div className="space-y-6 text-base leading-8 text-zinc-300 sm:text-lg">
      {document.content.map((node, index) =>
        renderNode(node, articleTitle, "root-" + index),
      )}
    </div>
  );
}

export function hasRenderableStructuredContent(
  document: StructuredArticleDocument,
) {
  function isRenderable(node: StructuredArticleNode): boolean {
    if (node.type === "text") return Boolean(node.text.trim());
    if (node.type === "image") return Boolean(getSafeImageUrl(node.attrs.src));
    if (node.type === "youtube") return Boolean(getYouTubeEmbedUrl(node.attrs.url));
    if (node.type === "horizontalRule" || node.type === "hardBreak") return true;
    if ("content" in node && Array.isArray(node.content)) {
      return node.content.some(isRenderable);
    }
    return false;
  }

  return document.content.some(isRenderable);
}

function renderChildren(
  node: { content?: StructuredArticleNode[] },
  articleTitle: string,
  path: string,
) {
  return node.content?.map((child, index) =>
    renderNode(child, articleTitle, path + "-" + index),
  );
}

function renderNode(
  node: StructuredArticleNode,
  articleTitle: string,
  path: string,
): ReactNode {
  switch (node.type) {
    case "text":
      return <span key={path}>{renderText(node)}</span>;
    case "paragraph":
      return <p key={path}>{renderChildren(node, articleTitle, path)}</p>;
    case "heading": {
      const children = renderChildren(node, articleTitle, path);
      const level = node.attrs?.level;
      if (level === 3) return <h3 key={path} className="pt-3 text-2xl font-bold text-white">{children}</h3>;
      if (level && level >= 4) return <h4 key={path} className="pt-2 text-xl font-bold text-white">{children}</h4>;
      return <h2 key={path} className="pt-4 text-3xl font-bold text-white">{children}</h2>;
    }
    case "bulletList":
      return <ul key={path} className="ml-6 list-disc space-y-2">{renderChildren(node, articleTitle, path)}</ul>;
    case "orderedList":
      return <ol key={path} start={node.attrs?.start} className="ml-6 list-decimal space-y-2">{renderChildren(node, articleTitle, path)}</ol>;
    case "listItem":
      return <li key={path} className="[&>p]:inline">{renderChildren(node, articleTitle, path)}</li>;
    case "blockquote":
      return <blockquote key={path} className="border-l-4 border-teal-600 pl-5 italic text-zinc-400">{renderChildren(node, articleTitle, path)}</blockquote>;
    case "image":
      return <StructuredImage key={node.attrs.media_id || path} node={node} articleTitle={articleTitle} />;
    case "youtube":
      return <StructuredYouTube key={node.attrs.media_id || path} node={node} articleTitle={articleTitle} />;
    case "horizontalRule":
      return <hr key={path} className="my-10 border-zinc-700" />;
    case "hardBreak":
      return <br key={path} />;
    default:
      return null;
  }
}

function renderText(node: StructuredTextNode): ReactNode {
  return (node.marks || []).reduce<ReactNode>((content, mark, index) => {
    if (mark.type === "bold") return <strong key={index}>{content}</strong>;
    if (mark.type === "italic") return <em key={index}>{content}</em>;
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? safeTextLink(mark.attrs.href) : null;
      if (href) return <a key={index} href={href} className="text-teal-400 underline hover:text-teal-300">{content}</a>;
    }
    return content;
  }, node.text);
}

function safeTextLink(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try { const url = new URL(value); return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}

function getSafeImageUrl(value: string | undefined) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function StructuredImage({
  node,
  articleTitle,
}: {
  node: StructuredImageNode;
  articleTitle: string;
}) {
  const src = getSafeImageUrl(node.attrs.src);
  if (!src) return null;
  const alt = node.attrs.alt?.trim() || articleTitle;

  return (
    <figure className="my-8">
      {/* Snapshot hosts are dynamic, so a validated native image avoids an unrestricted Next.js allowlist. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-auto w-full rounded-xl object-contain" loading="lazy" />
      {node.attrs.caption?.trim() && (
        <figcaption className="mt-3 text-center text-sm text-zinc-500">
          {node.attrs.caption}
        </figcaption>
      )}
    </figure>
  );
}

function StructuredYouTube({
  node,
  articleTitle,
}: {
  node: StructuredYouTubeNode;
  articleTitle: string;
}) {
  const embedUrl = getYouTubeEmbedUrl(node.attrs.url);
  if (!embedUrl) return null;

  return (
    <div className="relative my-8 aspect-video overflow-hidden rounded-xl bg-black">
      <iframe
        src={embedUrl}
        title={"YouTube video for " + articleTitle}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
