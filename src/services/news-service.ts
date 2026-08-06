import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient } from "@/api/client";
import type { PaginatedResponse } from "@/types/api";
import type {
  ArticleCategory,
  ArticleDetail,
  ArticleListItem,
} from "@/types/news";

export interface ArticleQuery {
  page?: number;
  category?: string;
  search?: string;
  ordering?: string;
}

export interface ArticleCategoryQuery {
  page?: number;
}

export class MalformedArticleResponseError extends Error {
  constructor() {
    super("Malformed article response");
    this.name = "MalformedArticleResponseError";
  }
}

function isArticleDetail(value: unknown): value is ArticleDetail {
  if (!value || typeof value !== "object") return false;
  const article = value as Record<string, unknown>;
  return (
    typeof article.id === "number" &&
    typeof article.title === "string" &&
    typeof article.slug === "string" &&
    typeof article.body === "string" &&
    typeof article.content_schema_version === "number" &&
    (article.content_json === null || typeof article.content_json === "object")
  );
}

export default class NewsService {
  private static detailRequests = new Map<string, Promise<ArticleDetail>>();

  static async getArticles(
    params: ArticleQuery = {},
  ): Promise<PaginatedResponse<ArticleListItem>> {
    const { data } = await apiClient.get<PaginatedResponse<ArticleListItem>>(
      API_ENDPOINTS.ARTICLES,
      { params },
    );

    return data;
  }

  static async getFeaturedArticles(): Promise<ArticleListItem[]> {
    const { data } = await apiClient.get<ArticleListItem[]>(
      API_ENDPOINTS.FEATURED_ARTICLES,
    );

    return data;
  }

  static async getLatestArticles(): Promise<ArticleListItem[]> {
    const { data } = await apiClient.get<ArticleListItem[]>(
      API_ENDPOINTS.LATEST_ARTICLES,
    );

    return data;
  }

  static async getArticleCategories(
    params: ArticleCategoryQuery = {},
  ): Promise<PaginatedResponse<ArticleCategory>> {
    const { data } = await apiClient.get<PaginatedResponse<ArticleCategory>>(
      API_ENDPOINTS.ARTICLE_CATEGORIES,
      { params },
    );

    return data;
  }

  static getArticleBySlug(slug: string): Promise<ArticleDetail> {
    const existingRequest = this.detailRequests.get(slug);
    if (existingRequest) return existingRequest;

    const request = apiClient
      .get<unknown>(API_ENDPOINTS.ARTICLE_BY_SLUG(slug))
      .then(({ data }) => {
        if (!isArticleDetail(data)) throw new MalformedArticleResponseError();
        return data;
      });

    this.detailRequests.set(slug, request);
    request.then(
      () => {
        if (this.detailRequests.get(slug) === request) {
          this.detailRequests.delete(slug);
        }
      },
      () => {
        if (this.detailRequests.get(slug) === request) {
          this.detailRequests.delete(slug);
        }
      },
    );
    return request;
  }

  static getArticlesByCategory(
    category: string,
  ): Promise<PaginatedResponse<ArticleListItem>> {
    return this.getArticles({ category });
  }

  static searchArticles(
    search: string,
  ): Promise<PaginatedResponse<ArticleListItem>> {
    return this.getArticles({ search });
  }
}
