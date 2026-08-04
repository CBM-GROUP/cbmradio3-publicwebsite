import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient } from "@/api/client";
import { getAllPages } from "@/api/pagination";
import { PaginatedResponse } from "@/types/api";
import { ArticleDetail, ArticleListItem } from "@/types/news";

export default class NewsService {
  static async getArticles(): Promise<PaginatedResponse<ArticleListItem>> {
    return getAllPages<ArticleListItem>(API_ENDPOINTS.ARTICLES);
  }

  static async getFeaturedArticles(): Promise<ArticleListItem[]> {
    const { data } = await apiClient.get<ArticleListItem[]>(API_ENDPOINTS.FEATURED_ARTICLES);
    return data;
  }

  static async getArticleBySlug(slug: string): Promise<ArticleDetail> {
    const { data } = await apiClient.get<ArticleDetail>(API_ENDPOINTS.ARTICLE_BY_SLUG(slug));
    return data;
  }

  static async getArticlesByCategory(
    category: string,
  ): Promise<PaginatedResponse<ArticleListItem>> {
    return getAllPages<ArticleListItem>(`${API_ENDPOINTS.ARTICLES}?category=${category}`);
  }

  static async searchArticles(query: string): Promise<PaginatedResponse<ArticleListItem>> {
    return getAllPages<ArticleListItem>(`${API_ENDPOINTS.ARTICLES}?search=${query}`);
  }
}