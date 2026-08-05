import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Article } from "@/types/news";

type PaginatedResponse<T> = {
    results: T[];
};

type ListResponse<T> = T[] | PaginatedResponse<T>;

const getResults = <T>(data: ListResponse<T>): T[] => {
  const results = Array.isArray(data) ? data : data.results;

  if (!Array.isArray(results)) {
    throw new Error("The news API returned an invalid article list.");
  }

  return results;
};

export default class NewsService {
  static async getArticles(): Promise<Article[]> {
    const { data } = await apiClient.get<ListResponse<Article>>(
      API_ENDPOINTS.ARTICLES,
    );
    return getResults(data);
  }

  static async getFeaturedArticles(): Promise<Article[]> {
    const { data } = await apiClient.get<ListResponse<Article>>(
      API_ENDPOINTS.FEATURED_ARTICLES,
    );
    return getResults(data);
  }

    static async getArticleBySlug(slug: string){
        const {data} = await apiClient.get<Article>(API_ENDPOINTS.ARTICLE_BY_SLUG(slug));
        return data;
    }

  static async getArticlesByCategory(category: string): Promise<Article[]> {
    const { data } = await apiClient.get<ListResponse<Article>>(
      `${API_ENDPOINTS.ARTICLES}?category=${encodeURIComponent(category)}`,
    );
    return getResults(data);
  }

  static async searchArticles(query: string): Promise<Article[]> {
    const { data } = await apiClient.get<ListResponse<Article>>(
      `${API_ENDPOINTS.ARTICLES}?search=${encodeURIComponent(query)}`,
    );
    return getResults(data);
  }
}
