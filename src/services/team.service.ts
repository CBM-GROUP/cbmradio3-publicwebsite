import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { PaginatedResponse } from "@/types/api";
import { TeamMember } from "@/types/team";

interface TeamQuery {
  page?: number;
}

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
};