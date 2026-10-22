import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { PaginatedResponse } from "@/types/api";
import { TeamMember } from "@/types/team";

interface TeamQuery {
  page?: number;
}

export interface TeamDirectoryResult {
  members: TeamMember[];
  isPartial: boolean;
}

const MAX_TEAM_DIRECTORY_PAGES = 25;

export const teamService = {
  getTeamMembers: async (
    query: TeamQuery = {},
  ): Promise<PaginatedResponse<TeamMember>> => {
    const response = await apiClient.get<PaginatedResponse<TeamMember>>(
      API_ENDPOINTS.TEAM,
      {
        params: {
          page: query.page,
        },
      },
    );

    return response.data;
  },

  getTeamMemberById: async (id: number): Promise<TeamMember> => {
    const response = await apiClient.get<TeamMember>(
      API_ENDPOINTS.TEAM_BY_ID(id),
    );

    return response.data;
  },

  getTeamDirectory: async (): Promise<TeamDirectoryResult> => {
    const members: TeamMember[] = [];
    const ids = new Set<number>();
    const nextUrls = new Set<string>();
    let isPartial = false;
    let page = 1;
    while (page <= MAX_TEAM_DIRECTORY_PAGES) {
      let response: PaginatedResponse<TeamMember>;
      try {
        response = await teamService.getTeamMembers({ page });
      } catch (error) {
        if (page === 1) throw error;
        isPartial = true;
        break;
      }
      for (const member of response.results) {
        if (!ids.has(member.id)) { ids.add(member.id); members.push(member); }
      }
      if (!response.next) break;
      if (nextUrls.has(response.next)) { isPartial = true; break; }
      nextUrls.add(response.next);
      page += 1;
    }
    if (page > MAX_TEAM_DIRECTORY_PAGES) isPartial = true;
    return { members, isPartial };
  },
};
