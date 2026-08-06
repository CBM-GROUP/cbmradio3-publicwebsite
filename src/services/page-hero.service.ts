import axios from "axios";

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  HeroSlide,
  PageHero,
  PageHeroKey,
} from "@/types/page-hero";

export const pageHeroService = {
  getPageHeroes: async (
    page = 1,
  ): Promise<PaginatedResponse<PageHero>> => {
    const response = await apiClient.get<PaginatedResponse<PageHero>>(
      API_ENDPOINTS.PAGE_HEROES,
      {
        params: { page },
      },
    );

    return response.data;
  },

  getPageHero: async (pageKey: PageHeroKey): Promise<PageHero | null> => {
    try {
      const response = await apiClient.get<PageHero>(
        API_ENDPOINTS.PAGE_HERO_BY_KEY(pageKey),
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  getHeroSlides: async (
    page = 1,
  ): Promise<PaginatedResponse<HeroSlide>> => {
    const response = await apiClient.get<PaginatedResponse<HeroSlide>>(
      API_ENDPOINTS.HERO_SLIDES,
      {
        params: { page },
      },
    );

    return response.data;
  },

  getHeroSlideById: async (id: number): Promise<HeroSlide> => {
    const response = await apiClient.get<HeroSlide>(
      API_ENDPOINTS.HERO_SLIDE_BY_ID(id),
    );

    return response.data;
  },
};