import NewsService from "@/services/news-service";
import { PaginatedResponse } from "@/types/api";
import { ArticleDetail, ArticleListItem } from "@/types/news";
import { create } from "zustand";

interface NewsStore {
  articles: ArticleListItem[];
  featuredArticles: ArticleListItem[];
  article: ArticleDetail | null;
  articlesPagination: Omit<PaginatedResponse<ArticleListItem>, "results">;
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
  articlesPagination: { count: 0, next: null, previous: null },
  loading: false,
  error: null,

  fetchArticles: async () => {
    try {
      set({ loading: true, error: null });
      const response = await NewsService.getArticles();
      const { results, ...articlesPagination } = response;
      set({ articles: results, articlesPagination, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchFeaturedArticles: async () => {
    try {
      set({ loading: true, error: null });
      const featuredArticles = await NewsService.getFeaturedArticles();
      set({ featuredArticles, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchArticle: async (slug: string) => {
    try {
      set({ article: null, loading: true, error: null });
      const article = await NewsService.getArticleBySlug(slug);
      set({ article, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchArticlesByCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const response = await NewsService.getArticlesByCategory(category);
      const { results, ...articlesPagination } = response;
      set({ articles: results, articlesPagination, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  searchArticles: async (query) => {
    try {
      set({ loading: true, error: null });
      const response = await NewsService.searchArticles(query);
      const { results, ...articlesPagination } = response;
      set({ articles: results, articlesPagination, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));