export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface StructuredTextMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface StructuredTextNode {
  type: "text";
  text: string;
  marks?: StructuredTextMark[];
}

export interface StructuredParagraphNode {
  type: "paragraph";
  content?: StructuredArticleNode[];
}

export interface StructuredHeadingNode {
  type: "heading";
  attrs?: {
    level?: number;
  };
  content?: StructuredArticleNode[];
}

export interface StructuredBulletListNode {
  type: "bulletList";
  content?: StructuredArticleNode[];
}

export interface StructuredOrderedListNode {
  type: "orderedList";
  attrs?: {
    start?: number;
  };
  content?: StructuredArticleNode[];
}

export interface StructuredListItemNode {
  type: "listItem";
  content?: StructuredArticleNode[];
}

export interface StructuredBlockquoteNode {
  type: "blockquote";
  content?: StructuredArticleNode[];
}

export interface StructuredImageNode {
  type: "image";
  attrs: {
    media_id: string;
    src?: string;
    alt?: string;
    caption?: string;
  };
}

export interface StructuredYouTubeNode {
  type: "youtube";
  attrs: {
    media_id: string;
    url?: string;
  };
}

export interface StructuredHorizontalRuleNode {
  type: "horizontalRule";
}

export interface StructuredHardBreakNode {
  type: "hardBreak";
}

export type StructuredArticleNode =
  | StructuredTextNode
  | StructuredParagraphNode
  | StructuredHeadingNode
  | StructuredBulletListNode
  | StructuredOrderedListNode
  | StructuredListItemNode
  | StructuredBlockquoteNode
  | StructuredImageNode
  | StructuredYouTubeNode
  | StructuredHorizontalRuleNode
  | StructuredHardBreakNode;

export interface StructuredArticleDocument {
  type: "doc";
  content: StructuredArticleNode[];
}

export interface ArticleSummary {
  id: number;
  slug: string;
  title: string;
  category: ArticleCategory | null;
  cover_image: string;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
}

export interface ArticleDetail extends ArticleSummary {
  body: string;
  content_json: StructuredArticleDocument | null;
  content_schema_version: number;
  external_cover_image_url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Temporary compatibility alias.
 * Existing public components currently import ArticleListItem.
 */
export type ArticleListItem = ArticleSummary;

export interface Comment {
  id: number;
  article: number | null;
  episode: number | null;
  name: string;
  email?: string;
  body: string;
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
}