/**
 * Legacy homepage presentation type.
 * This is not the backend PageHero contract.
 */
export interface HeroSection {
  title: string;
  subtitle: string;
  text: string;
  image?: string;
  cta_label?: string;
  cta_link?: string;
}

/**
 * Django PageSection API response.
 */
export interface PageSection {
  id: number;
  section_key: string;
  page?: string;
  position?: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  external_image_url: string;
  cta_label: string;
  cta_url: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Temporary compatibility alias.
 */
export type PageSectionData = PageSection;