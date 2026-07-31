import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Article } from "@/types/news";

export default class NewsService {
    static async getArticles(){
       const {data} = await apiClient.get<Article[]>(API_ENDPOINTS.ARTICLES);
       return data;
    }

    static async getFeaturedArticles(){
        const {data} = await apiClient.get<Article[]>(API_ENDPOINTS.FEATURED_ARTICLES);
        return data;
    }

    static async getArticleBySlug(slug: string){
        const {data} = await apiClient.get<Article>(API_ENDPOINTS.ARTICLE_BY_SLUG(slug));
        return data;
    }

    static async getArticlesByCategory(category: string){
        const {data} = await apiClient.get<Article[]>(`${API_ENDPOINTS.ARTICLES}?category=${category}`);
        return data;
    }

    static async searchArticles(query: string){
        const {data} = await apiClient.get<Article[]>(`${API_ENDPOINTS.ARTICLES}?search=${query}`);
        return data;
    }
}