export type GalleryCategory = "events" | "studio" | "team" | "general";

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  external_image_url: string;
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