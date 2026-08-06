import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { PaginatedResponse } from "@/types/api";
import { SiteContact, SocialLink } from "@/types/site-settings";

let siteContactRequest: Promise<SiteContact> | null = null;
const socialLinkRequests = new Map<number, Promise<PaginatedResponse<SocialLink>>>();

export const siteSettingsService = {
  getSocialLinks: (
    page = 1,
  ): Promise<PaginatedResponse<SocialLink>> => {
    const pending = socialLinkRequests.get(page);
    if (pending) return pending;
    const request = apiClient
      .get<PaginatedResponse<SocialLink>>(API_ENDPOINTS.SOCIAL_LINKS, {
        params: { page },
      })
      .then(({ data }) => data);

    socialLinkRequests.set(page, request);
    request.then(
      () => { if (socialLinkRequests.get(page) === request) socialLinkRequests.delete(page); },
      () => { if (socialLinkRequests.get(page) === request) socialLinkRequests.delete(page); },
    );
    return request;
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
