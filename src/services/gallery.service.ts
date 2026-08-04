import axios from "axios";
import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getAllPages } from "@/api/pagination";
import { PaginatedResponse } from "@/types/api";
import { GalleryItem, GalleryPageContent } from "@/types/gallery";

export const galleryService = {
  getGalleryItems: async (): Promise<PaginatedResponse<GalleryItem>> => {
    return getAllPages<GalleryItem>(API_ENDPOINTS.GALLERY);
  },

  getGalleryItemById: async (id: number | string): Promise<GalleryItem> => {
    const response = await apiClient.get(API_ENDPOINTS.GALLERY_BY_ID(id));
    return response.data;
  },

  getGalleryPageContent: async (): Promise<GalleryPageContent | null> => {
    try {
      const response = await apiClient.get<{
        title: string;
        body: string;
      }>(API_ENDPOINTS.GALLERY_SECTION);
      return {
        heading: response.data.title,
        intro_content: response.data.body,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};