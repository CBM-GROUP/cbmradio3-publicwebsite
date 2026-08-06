import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { PaginatedResponse } from "@/types/api";
import type { EpisodeDetail, EpisodeSummary } from "@/types/program";

export interface EpisodeQuery {
  page?: number;
  program?: number;
  isFeatured?: boolean;
  ordering?: string;
}

const requests = new Map<string, Promise<PaginatedResponse<EpisodeSummary>>>();

export const episodeService = {
  async getEpisodeBySlug(slug: string): Promise<EpisodeDetail> {
    const { data } = await apiClient.get<EpisodeDetail>(
      API_ENDPOINTS.EPISODE_BY_SLUG(slug),
    );
    return data;
  },
  getEpisodes(query: EpisodeQuery = {}) {
    const key = JSON.stringify(query);
    const pending = requests.get(key);
    if (pending) return pending;

    const { isFeatured, ...params } = query;
    const request = apiClient
      .get<PaginatedResponse<EpisodeSummary>>(API_ENDPOINTS.EPISODES, {
        params: {
          ...params,
          is_featured: isFeatured,
        },
      })
      .then(({ data }) => data);

    requests.set(key, request);
    request.then(
      () => { if (requests.get(key) === request) requests.delete(key); },
      () => { if (requests.get(key) === request) requests.delete(key); },
    );
    return request;
  },
};
