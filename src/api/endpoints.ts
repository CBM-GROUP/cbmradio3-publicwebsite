export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  // Page Sections
  HERO: '/api/v1/page-sections/hero/',
  SPONSORS: '/api/v1/page-sections/sponsors/',
  FOOTER: '/api/v1/page-sections/footer/',
  GALLERY_SECTION: '/api/v1/page-sections/gallery/',
  ABOUT: '/api/v1/page-sections/about/',
  MISSION: '/api/v1/page-sections/mission/',
  VISION: '/api/v1/page-sections/vision/',
  CONTACT: '/api/v1/page-sections/contact/',

  // Programs
  PROGRAMS: '/api/v1/programs/',
  PROGRAM_BY_ID: (id: number | string) => `/api/v1/programs/${id}/`,
  FEATURED_PROGRAMS: '/api/v1/programs/featured/',

  // Episodes
  EPISODES: '/api/v1/episodes/',
  EPISODE_BY_ID: (id: number | string) => `/api/v1/episodes/${id}/`,
  FEATURED_EPISODES: '/api/v1/episodes/featured/',
  LATEST_EPISODES: '/api/v1/episodes/latest/',
  EPISODES_BY_PROGRAM: (programId: number | string) => `/api/v1/episodes/by-program/${programId}/`,

  // Articles
  ARTICLES: '/api/v1/articles/',
  ARTICLE_BY_SLUG: (slug: string) => `/api/v1/articles/${slug}/`,
  FEATURED_ARTICLES: '/api/v1/articles/featured/',

  // Gallery
  GALLERY: '/api/v1/gallery/',
  GALLERY_BY_ID: (id: number | string) => `/api/v1/gallery/${id}/`,

  // Team
  TEAM: '/api/v1/team/',
  TEAM_BY_ID: (id: number | string) => `/api/v1/team/${id}/`,

  // Comments
  COMMENTS: '/api/v1/comments/',
  COMMENT_BY_ID: (id: number | string) => `/api/v1/comments/${id}/`,
  COMMENTS_BY_EPISODE: (episodeId: number | string) => `/api/v1/comments/by-episode/${episodeId}/`,
  COMMENTS_BY_ARTICLE: (articleId: number | string) => `/api/v1/comments/by-article/${articleId}/`,
};