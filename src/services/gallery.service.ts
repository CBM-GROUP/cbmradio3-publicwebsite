import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AxiosResponse } from "axios";
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
  // Get all gallery items
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    const items: GalleryItem[] = [];
    let url: string | null = API_ENDPOINTS.GALLERY;

    while (url) {
      const response: AxiosResponse<GalleryItem[] | GalleryListResponse> =
        await apiClient.get(url);

      if (!isGalleryListResponse(response.data)) {
        return response.data;
      }

      items.push(...response.data.results);
      url = response.data.next;
    }

    return items;
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
