export interface Article {
  id?: number;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;

  author: {
    name: string;
    avatarUrl?: string;
  };

  body: string;
  content?: string[];

  summary?: string;

  cover_image: string | null;
  imageUrl?: string;
  imageCaption?: string;

  tags: string[];

  readTime: string;
  publishedAt: string;

  is_featured: boolean;
  is_published: boolean;

  previousArticle?: {
    title: string;
    slug: string;
  };

  nextArticle?: {
    title: string;
    slug: string;
  };
}

export interface Comment {
  id: number;
  episode_id?: number;
  article_id?: number;
  author: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}