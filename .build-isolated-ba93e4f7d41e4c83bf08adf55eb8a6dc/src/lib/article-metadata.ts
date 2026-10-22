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
