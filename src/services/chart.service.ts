import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Chart } from "@/types/chart";

export const chartService = {
  getCharts: async (): Promise<Chart[]> => {
    try {
      const response = await apiClient.get<Chart[] | PaginatedResponse<Chart>>(
        API_ENDPOINTS.CHARTS,
      );
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.results || [];
    } catch (error) {
      console.error("Error fetching charts:", error);
      return [];
    }
  },

  getChartBySlug: async (slug: string): Promise<Chart | null> => {
    try {
      const response = await apiClient.get<Chart>(
        API_ENDPOINTS.CHART_BY_SLUG(slug),
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching chart ${slug}:`, error);
      return null;
    }
  },
};
