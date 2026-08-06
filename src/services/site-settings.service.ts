import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { PaginatedResponse } from "@/types/api";
import { SiteContact, SocialLink } from "@/types/site-settings";

let siteContactRequest: Promise<SiteContact> | null = null;

export const siteSettingsService = {
  getSocialLinks: async (
    page = 1,
  ): Promise<PaginatedResponse<SocialLink>> => {
    const response = await apiClient.get<PaginatedResponse<SocialLink>>(
      API_ENDPOINTS.SOCIAL_LINKS,
      {
        params: { page },
      },
    );

    return response.data;
  },

  getSiteContact: async (): Promise<SiteContact> => {
    if (!siteContactRequest) {
      const request = apiClient
        .get<SiteContact>(API_ENDPOINTS.SITE_CONTACT)
        .then(({ data }) => data);
      siteContactRequest = request;
      request.then(
        () => {
          if (siteContactRequest === request) siteContactRequest = null;
        },
        () => {
          if (siteContactRequest === request) siteContactRequest = null;
        },
      );
    }

    return siteContactRequest;
  },
};
