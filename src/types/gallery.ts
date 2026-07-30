export type GalleryCategory = 'events' | 'studio' | 'team' | 'general';

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  caption: string;
  category: GalleryCategory;
  is_active: boolean;
} 

export interface GalleryPageContent {
  heading: string;
  intro_content: string;
}