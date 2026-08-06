import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ArticleSummary } from "@/types/news";
import { EpisodeSummary, ProgramSummary } from "@/types/program";
import { PageSection } from "@/types/hero";
import { programService } from "@/services/program.service";

class HomeService {
  private featuredProgramsRequest: Promise<ProgramSummary[]> | null = null;

  async getHero(): Promise<PageSection> {
    const { data } = await apiClient.get<PageSection>(
      API_ENDPOINTS.HERO_SECTION,
    );

    return data;
  }

  async getSponsors(): Promise<PageSection> {
    const { data } = await apiClient.get<PageSection>(
      API_ENDPOINTS.SPONSORS_SECTION,
    );

    return data;
  }

  async getFooterSection(): Promise<PageSection> {
    const { data } = await apiClient.get<PageSection>(
      API_ENDPOINTS.FOOTER_SECTION,
    );

    return data;
  }

  /**
   * Temporary compatibility alias.
   */
  async getFooter(): Promise<PageSection> {
    return this.getFooterSection();
  }

  async getFeaturedPrograms(): Promise<ProgramSummary[]> {
    if (!this.featuredProgramsRequest) {
      const request = programService.getFeaturedPrograms();
      this.featuredProgramsRequest = request;
      request.then(
        () => {
          if (this.featuredProgramsRequest === request) {
            this.featuredProgramsRequest = null;
          }
        },
        () => {
          if (this.featuredProgramsRequest === request) {
            this.featuredProgramsRequest = null;
          }
        },
      );
    }

    return this.featuredProgramsRequest;
  }

  async getFeaturedEpisodes(): Promise<EpisodeSummary[]> {
    const { data } = await apiClient.get<EpisodeSummary[]>(
      API_ENDPOINTS.FEATURED_EPISODES,
    );

    return data;
  }

  async getLatestEpisodes(): Promise<EpisodeSummary[]> {
    const { data } = await apiClient.get<EpisodeSummary[]>(
      API_ENDPOINTS.LATEST_EPISODES,
    );

    return data;
  }

  async getFeaturedArticles(): Promise<ArticleSummary[]> {
    const { data } = await apiClient.get<ArticleSummary[]>(
      API_ENDPOINTS.FEATURED_ARTICLES,
    );

    return data;
  }

  async getLatestArticles(): Promise<ArticleSummary[]> {
    const { data } = await apiClient.get<ArticleSummary[]>(
      API_ENDPOINTS.LATEST_ARTICLES,
    );

    return data;
  }
}

const homeService = new HomeService();

export default homeService;
