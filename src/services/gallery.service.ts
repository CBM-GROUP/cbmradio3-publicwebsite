import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  GalleryCategory,
  GalleryItem,
  GalleryPageContent,
} from "@/types/gallery";

export const galleryService = {
  // Get all gallery items
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.GALLERY);
    return response.data;
  },

  // Get gallery item by id
  getGalleryItemById: async (id: number | string): Promise<GalleryItem> => {
    const response = await apiClient.get(API_ENDPOINTS.GALLERY_BY_ID(id));
    return response.data;
  },

  getGalleryCategory: async (): Promise<GalleryCategory> => {
    const response = await apiClient.get<GalleryCategory>(
      API_ENDPOINTS.GALLERY,
    );
    return response.data;
  },

  getGalleryPageContent: async (): Promise<GalleryPageContent> => {
    const response = await apiClient.get(API_ENDPOINTS.GALLERY);
    return response.data;
  },
};
