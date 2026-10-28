import type {
  StructuredArticleDocument,
  StructuredArticleNode,
} from "@/types/news";

export function estimateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return words > 0 ? Math.max(1, Math.ceil(words / 200)) : null;
}

function collectNodeText(node: StructuredArticleNode): string {
  if (node.type === "text") return node.text;
  if ("content" in node && Array.isArray(node.content)) {
    return node.content.map(collectNodeText).join(" ");
  }
  return "";
}

export function extractStructuredArticleText(
  document: StructuredArticleDocument,
) {
  return document.content.map(collectNodeText).join(" ").trim();
}

export function estimateArticleReadingTime({
  document,
  body,
}: {
  document: StructuredArticleDocument | null;
  body: string;
}) {
  const source = document ? extractStructuredArticleText(document) : body;
  return estimateReadingTime(source);
}

export function formatPublicationDate(value: string | null) {
  if (!value) return "Publication date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Publication date unavailable";
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "long",
    timeZone: "Africa/Kampala",
  }).format(date);
}

export function formatPublicationDateTime(value: string | null) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kampala",
  }).format(date);
}

export function formatTimeAgo(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (Number.isNaN(diffInSeconds) || diffInSeconds < 0) return "Just now";
  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "mins"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
}

export function formatViewsCount(count?: number | null): string {
  const views = count ?? 0;
  if (views === 1) return "1 view";
  if (views < 1000) return `${views.toLocaleString()} views`;
  if (views < 1000000) {
    return `${(views / 1000).toFixed(1).replace(/\.0$/, "")}k views`;
  }
  return `${(views / 1000000).toFixed(1).replace(/\.0$/, "")}M views`;
}
