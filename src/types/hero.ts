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