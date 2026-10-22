const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!configuredBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

export const BASE_URL = configuredBaseUrl.replace(/\/$/, "");

export const API_ENDPOINTS = {
  // Page Sections
  PAGE_SECTIONS: "/api/v1/page-sections/",
  HERO_SECTION: "/api/v1/page-sections/hero/",
  SPONSORS_SECTION: "/api/v1/page-sections/sponsors/",
  FOOTER_SECTION: "/api/v1/page-sections/footer/",
  GALLERY_SECTION: "/api/v1/page-sections/gallery/",
  ABOUT_SECTION: "/api/v1/page-sections/about/",
  MISSION_SECTION: "/api/v1/page-sections/mission/",
  VISION_SECTION: "/api/v1/page-sections/vision/",
  CONTACT_SECTION: "/api/v1/page-sections/contact/",

    // Temporary compatibility aliases
  HERO: "/api/v1/page-sections/hero/",
  SPONSORS: "/api/v1/page-sections/sponsors/",
  FOOTER: "/api/v1/page-sections/footer/",
  ABOUT: "/api/v1/page-sections/about/",
  MISSION: "/api/v1/page-sections/mission/",
  VISION: "/api/v1/page-sections/vision/",
  CONTACT: "/api/v1/page-sections/contact/",

  // Programs
  PROGRAMS: "/api/v1/programs/",
  PROGRAM_BY_ID: (id: number) => `/api/v1/programs/${id}/`,
  PROGRAM_BY_SLUG: (slug: string) =>
    `/api/v1/programs/by-slug/${encodeURIComponent(slug)}/`,
  FEATURED_PROGRAMS: "/api/v1/programs/featured/",

  // Episodes
  EPISODES: "/api/v1/episodes/",
  EPISODE_BY_ID: (id: number) => `/api/v1/episodes/${id}/`,
  EPISODE_BY_SLUG: (slug: string) =>
    `/api/v1/episodes/by-slug/${encodeURIComponent(slug)}/`,
  FEATURED_EPISODES: "/api/v1/episodes/featured/",
  LATEST_EPISODES: "/api/v1/episodes/latest/",
  EPISODES_BY_PROGRAM: (programId: number) =>
    `/api/v1/episodes/by-program/${programId}/`,

  // Articles
  ARTICLES: "/api/v1/articles/",
  ARTICLE_BY_SLUG: (slug: string) =>
    `/api/v1/articles/${encodeURIComponent(slug)}/`,
  FEATURED_ARTICLES: "/api/v1/articles/featured/",
  LATEST_ARTICLES: "/api/v1/articles/latest/",

  // Article Categories
  ARTICLE_CATEGORIES: "/api/v1/articles/categories/",
  ARTICLE_CATEGORY_BY_SLUG: (slug: string) =>
    `/api/v1/articles/categories/${encodeURIComponent(slug)}/`,

  // Gallery
  GALLERY: "/api/v1/gallery/",
  GALLERY_BY_ID: (id: number) => `/api/v1/gallery/${id}/`,

  // Team
  TEAM: "/api/v1/team/",
  TEAM_BY_ID: (id: number) => `/api/v1/team/${id}/`,

  // Comments
  COMMENTS: "/api/v1/comments/",
  COMMENT_BY_ID: (id: number) => `/api/v1/comments/${id}/`,
  COMMENTS_BY_EPISODE: (episodeId: number) =>
    `/api/v1/comments/by-episode/${episodeId}/`,
  COMMENTS_BY_ARTICLE: (articleId: number) =>
    `/api/v1/comments/by-article/${articleId}/`,

  // Site Settings
  SOCIAL_LINKS: "/api/v1/site-settings/social-links/",
  SOCIAL_LINK_BY_ID: (id: number) =>
    `/api/v1/site-settings/social-links/${id}/`,

  SITE_CONTACT: "/api/v1/site-settings/contact/",

  PAGE_HEROES: "/api/v1/site-settings/page-heroes/",
  PAGE_HERO_BY_KEY: (pageKey: string) =>
    `/api/v1/site-settings/page-heroes/${encodeURIComponent(pageKey)}/`,

  HERO_SLIDES: "/api/v1/site-settings/hero-slides/",
  HERO_SLIDE_BY_ID: (id: number) =>
    `/api/v1/site-settings/hero-slides/${id}/`,

  // Charts
  CHARTS: "/api/v1/charts/",
  CHART_BY_SLUG: (slug: string) =>
    `/api/v1/charts/${encodeURIComponent(slug)}/`,
} as const;
