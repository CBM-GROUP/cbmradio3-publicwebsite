export type PageHeroKey =
  | "programs"
  | "episodes"
  | "news"
  | "gallery"
  | "about"
  | "contact"
  | "charts";

export type PageHeroMediaType = "none" | "image" | "video" | "slides";

export type HeroSlideMediaType = "image" | "video";

export type HeroImageSource = "" | "upload" | "external";

export type HeroOverlayPosition = "left" | "center" | "right";

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  media_type: HeroSlideMediaType;
  image_source: HeroImageSource;
  uploaded_image: string;
  external_image_url: string;
  resolved_image_url: string;
  video_url: string;
  cta_label: string;
  cta_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageHero {
  page_key: PageHeroKey;
  title: string;
  subtitle: string;
  description: string;
  media_type: PageHeroMediaType;
  image_source: HeroImageSource;
  uploaded_image: string;
  external_image_url: string;
  resolved_image_url: string;
  video_url: string;
  cta_label: string;
  cta_url: string;
  overlay_strength: number;
  overlay_position: HeroOverlayPosition;
  is_active: boolean;
  slides: HeroSlide[];
  created_at: string;
  updated_at: string;
}