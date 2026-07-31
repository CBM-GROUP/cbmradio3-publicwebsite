import NewsService from "@/services/news-service";
import { Article } from "@/types/news";
import { create } from "zustand";

interface NewsStore {
  articles: Article[];
  featuredArticles: Article[];
  article: Article | null;

  loading: boolean;
  error: string | null;

  fetchArticles: () => Promise<void>;
  fetchFeaturedArticles: () => Promise<void>;
  fetchArticle: (slug: string) => Promise<void>;
  fetchArticlesByCategory: (category: string) => Promise<void>;
  searchArticles: (query: string) => Promise<void>;
}

export const useNewsStore = create<NewsStore>((set) => ({
  articles: [],
  featuredArticles: [],
  article: null,

  loading: false,
  error: null,

  fetchArticles: async () => {
    try {
      set({ loading: true, error: null });

      const articles = await NewsService.getArticles();
      set({ articles, loading: false });
    } catch (err: unknown) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchFeaturedArticles: async () => {
    try {
      set({ loading: true, error: null });
      const featuredArticles = await NewsService.getFeaturedArticles();
      set({ featuredArticles, loading: false });
    } catch (err: unknown) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchArticle: async (slug: string) => {
    try {
      set({ loading: true, error: null });
      const article = await NewsService.getArticleBySlug(slug);
      set({ article, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchArticlesByCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const articles = await NewsService.getArticlesByCategory(category);
      set({ articles, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  searchArticles: async (query) => {
    try {
      set({ loading: true, error: null });
      const articles = await NewsService.searchArticles(query);
      set({ articles, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
