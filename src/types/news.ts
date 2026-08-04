export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  cover_image: string;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
}

export interface ArticleDetail extends ArticleListItem {
  body: string;
  created_at: string;
  updated_at: string;
  external_cover_image_url: string;
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