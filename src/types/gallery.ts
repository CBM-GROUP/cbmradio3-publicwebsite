export type GalleryCategory = 'events' | 'studio' | 'team' | 'general';

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  caption: string;
  category: GalleryCategory;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryPageContent {
  heading: string;
  intro_content: string;
}

export interface GalleryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GalleryItem[];
}

export interface GallerySectionResponse {
  title: string;
  body: string;
}
