import axios from "axios";

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { PageSection } from "@/types/hero";

export type PageSectionKey = "about" | "mission" | "vision" | "gallery" | "contact";

const sectionEndpoints: Record<PageSectionKey, string> = {
  about: API_ENDPOINTS.ABOUT_SECTION,
  mission: API_ENDPOINTS.MISSION_SECTION,
  vision: API_ENDPOINTS.VISION_SECTION,
  gallery: API_ENDPOINTS.GALLERY_SECTION,
  contact: API_ENDPOINTS.CONTACT_SECTION,
};

export const pageSectionService = {
  async getPageSection(sectionKey: PageSectionKey): Promise<PageSection | null> {
    try {
      const { data } = await apiClient.get<PageSection>(
        sectionEndpoints[sectionKey],
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },

  getAboutSection: () => pageSectionService.getPageSection("about"),
  getMissionSection: () => pageSectionService.getPageSection("mission"),
  getVisionSection: () => pageSectionService.getPageSection("vision"),
  getGallerySection: () => pageSectionService.getPageSection("gallery"),
};
