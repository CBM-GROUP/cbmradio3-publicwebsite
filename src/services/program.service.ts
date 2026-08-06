import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { PaginatedResponse } from "@/types/api";
import type { ProgramDetail, ProgramSummary } from "@/types/program";

export interface ProgramQuery {
  page?: number;
  search?: string;
  ordering?: string;
  isFeatured?: boolean;
}

export const programService = {
  async getPrograms(
    query: ProgramQuery = {},
  ): Promise<PaginatedResponse<ProgramSummary>> {
    const { isFeatured, ...params } = query;
    const { data } = await apiClient.get<PaginatedResponse<ProgramSummary>>(
      API_ENDPOINTS.PROGRAMS,
      {
        params: {
          ...params,
          is_featured: isFeatured,
        },
      },
    );

    return data;
  },

  async getFeaturedPrograms(): Promise<ProgramSummary[]> {
    const { data } = await apiClient.get<ProgramSummary[]>(
      API_ENDPOINTS.FEATURED_PROGRAMS,
    );

    return data;
  },

  async getProgramById(id: number): Promise<ProgramDetail> {
    const { data } = await apiClient.get<ProgramDetail>(
      API_ENDPOINTS.PROGRAM_BY_ID(id),
    );

    return data;
  },

  async getProgramBySlug(slug: string): Promise<ProgramDetail> {
    const { data } = await apiClient.get<ProgramDetail>(
      API_ENDPOINTS.PROGRAM_BY_SLUG(slug),
    );

    return data;
  },
};
