import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { pageSectionService } from "@/services/page-section.service";
import { PaginatedResponse } from "@/types/api";
import { GalleryItem, GalleryPageContent } from "@/types/gallery";
import { PageSection } from "@/types/hero";

interface GalleryQuery {
  page?: number;
  category?: string;
}

export const galleryService = {
  getGalleryItems: async (
    query: GalleryQuery = {},
  ): Promise<PaginatedResponse<GalleryItem>> => {
    const response = await apiClient.get<PaginatedResponse<GalleryItem>>(
      API_ENDPOINTS.GALLERY,
      {
        params: {
          page: query.page,
          category: query.category,
        },
      },
    );

    return response.data;
  },

  getGalleryItemById: async (id: number): Promise<GalleryItem> => {
    const response = await apiClient.get<GalleryItem>(
      API_ENDPOINTS.GALLERY_BY_ID(id),
    );

    return response.data;
  },

  getGallerySection: async (): Promise<PageSection | null> => {
    return pageSectionService.getGallerySection();
  },

  /**
   * Temporary compatibility method for the current Gallery page.
   */
  getGalleryPageContent: async (): Promise<GalleryPageContent | null> => {
    const section = await galleryService.getGallerySection();

    if (!section) {
      return null;
    }

    return {
      heading: section.title,
      intro_content: section.body,
    };
  },
};
