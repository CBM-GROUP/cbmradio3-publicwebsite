export interface ProgramSummary {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  presenter: string;
  schedule: string;
  cover_image: string;
  promo_video_url: string;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
}

export interface ProgramDetail extends ProgramSummary {
  description: string;
  external_cover_image_url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Temporary compatibility alias.
 * Existing components and services may currently import Program.
 */
export type Program = ProgramSummary;

export interface EpisodeSummary {
  id: number;
  slug: string;
  program_id: number;
  program_title: string;
  title: string;
  description: string;
  cover_image: string;
  external_cover_image_url: string;
  youtube_link: string;
  youtube_embed_url: string;
  publish_date: string | null;
  is_featured: boolean;
  featured_order: number;
  is_active: boolean;
}

export interface EpisodeDetail {
  id: number;
  slug: string;
  program: ProgramSummary;
  title: string;
  description: string;
  cover_image: string;
  external_cover_image_url: string;
  youtube_link: string;
  youtube_embed_url: string;
  publish_date: string | null;
  is_featured: boolean;
  featured_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Temporary compatibility alias.
 * Existing services may currently import Episode.
 */
export type Episode = EpisodeSummary;
