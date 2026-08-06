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

export interface ProgramFilterResult {
  programs: ProgramSummary[];
  isPartial: boolean;
}

const MAX_PROGRAM_FILTER_PAGES = 25;
const programRequests = new Map<string, Promise<PaginatedResponse<ProgramSummary>>>();
let programFilterRequest: Promise<ProgramFilterResult> | null = null;

export const programService = {
  async getPrograms(
    query: ProgramQuery = {},
  ): Promise<PaginatedResponse<ProgramSummary>> {
    const key = JSON.stringify(query);
    const pending = programRequests.get(key);
    if (pending) return pending;

    const { isFeatured, ...params } = query;
    const request = apiClient
      .get<PaginatedResponse<ProgramSummary>>(
        API_ENDPOINTS.PROGRAMS,
        {
          params: {
            ...params,
            is_featured: isFeatured,
          },
        },
      )
      .then(({ data }) => data);

    programRequests.set(key, request);
    request.then(
      () => { if (programRequests.get(key) === request) programRequests.delete(key); },
      () => { if (programRequests.get(key) === request) programRequests.delete(key); },
    );
    return request;
  },

  getActiveProgramsForFilters(): Promise<ProgramFilterResult> {
    if (programFilterRequest) return programFilterRequest;
    const request = loadActiveProgramsForFilters();
    programFilterRequest = request;
    request.then(
      () => { if (programFilterRequest === request) programFilterRequest = null; },
      () => { if (programFilterRequest === request) programFilterRequest = null; },
    );
    return request;
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

async function loadActiveProgramsForFilters(): Promise<ProgramFilterResult> {
  const programs: ProgramSummary[] = [];
  const ids = new Set<number>();
  const slugs = new Set<string>();
  const nextUrls = new Set<string>();
  let page = 1;
  let isPartial = false;

  while (page <= MAX_PROGRAM_FILTER_PAGES) {
    let response: PaginatedResponse<ProgramSummary>;
    try {
      response = await programService.getPrograms({ page, ordering: "display_order" });
    } catch (error) {
      if (page === 1) throw error;
      isPartial = true;
      break;
    }

    for (const program of response.results) {
      if (ids.has(program.id) || slugs.has(program.slug)) continue;
      ids.add(program.id);
      slugs.add(program.slug);
      programs.push(program);
    }

    if (!response.next) break;
    if (nextUrls.has(response.next)) {
      isPartial = true;
      break;
    }
    nextUrls.add(response.next);
    page += 1;
  }

  if (page > MAX_PROGRAM_FILTER_PAGES) isPartial = true;
  return { programs, isPartial };
}
