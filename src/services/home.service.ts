import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";


class HomeService {
  async getHero() {
    const { data } = await apiClient.get(API_ENDPOINTS.HERO);
    return data;
  }

  async getSponsors() {
    const { data } = await apiClient.get(API_ENDPOINTS.SPONSORS);
    return data;
  }

  async getFooter() {
    const { data } = await apiClient.get(API_ENDPOINTS.FOOTER);
    return data;
  }

  async getFeaturedPrograms() {
    const { data } = await apiClient.get(API_ENDPOINTS.FEATURED_PROGRAMS);
    return data;
  }

  async getFeaturedEpisodes() {
    const { data } = await apiClient.get(API_ENDPOINTS.FEATURED_EPISODES);
    return data;
  }

  async getLatestEpisodes() {
    const { data } = await apiClient.get(API_ENDPOINTS.LATEST_EPISODES);
    return data;
  }

  async getFeaturedArticles() {
    const { data } = await apiClient.get(API_ENDPOINTS.FEATURED_ARTICLES);
    return data;
  }
}

const homeService = new HomeService();
export default homeService;