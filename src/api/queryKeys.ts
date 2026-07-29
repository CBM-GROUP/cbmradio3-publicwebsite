export const queryKeys = {
  hero: ["hero"],
  sponsors: ["sponsors"],
  footer: ["footer"],

  programs: ["programs"],
  featuredPrograms: ["featuredPrograms"],
  program: (id: number) => ["program", id],

  episodes: ["episodes"],
  latestEpisodes: ["latestEpisodes"],
  featuredEpisodes: ["featuredEpisodes"],
  episode: (id: number) => ["episode", id],
  programEpisodes: (id: number) => ["programEpisodes", id],

  articles: ["articles"],
  featuredArticles: ["featuredArticles"],
  article: (slug: string) => ["article", slug],

  gallery: ["gallery"],
  galleryItem: (id: number) => ["gallery", id],

  team: ["team"],
  member: (id: number) => ["member", id],

  comments: ["comments"],
  articleComments: (id: number) => ["articleComments", id],
  episodeComments: (id: number) => ["episodeComments", id],

  about: ["about"],
  mission: ["mission"],
  vision: ["vision"],
  contact: ["contact"],
};