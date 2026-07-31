import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  GalleryItem,
  GalleryListResponse,
  GalleryPageContent,
  GallerySectionResponse,
} from "@/types/gallery";

const isGalleryListResponse = (
  data: GalleryItem[] | GalleryListResponse,
): data is GalleryListResponse => !Array.isArray(data);

export const galleryService = {
  // Get the current gallery page. Additional pages should only be requested
  // in response to explicit user pagination, not eagerly on mount.
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    const response = await apiClient.get<GalleryItem[] | GalleryListResponse>(
      API_ENDPOINTS.GALLERY,
    );
    return isGalleryListResponse(response.data)
      ? response.data.results
      : response.data;
  },

  // Get gallery item by id
  getGalleryItemById: async (id: number | string): Promise<GalleryItem> => {
    const response = await apiClient.get(API_ENDPOINTS.GALLERY_BY_ID(id));
    return response.data;
  },

  getGalleryPageContent: async (): Promise<GalleryPageContent> => {
    const response = await apiClient.get<GallerySectionResponse>(
      API_ENDPOINTS.GALLERY_SECTION,
    );
    return {
      heading: response.data.title,
      intro_content: response.data.body,
    };
  },
};
