export interface Program {
  id?: number;
  title: string;
  description: string;
  presenter: string;
  cover_image?: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export interface Episode {
  id?: number;
  program_id: number;
  title: string;
  description: string;
  cover_image?: string | null;
  youtube_link: string;
  publish_date: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface Article {
  id?: number;
  title: string;
  slug?: string;
  body: string;
  cover_image?: string | null;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
}

export interface GalleryItem {
  id?: number;
  title: string;
  image: string;
  caption: string;
  category: 'events' | 'studio' | 'team' | 'general';
  is_active: boolean;
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

// Page Section Interfaces
export interface HeroSection {
  title: string;
  subtitle: string;
  text: string;
  image?: string;
  cta_label?: string;
  cta_link?: string;
}

export interface PageSectionData {
  [key: string]: unknown;
}