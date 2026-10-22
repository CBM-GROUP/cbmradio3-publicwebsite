import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { PaginatedResponse } from "@/types/api";
import type {
  PublicComment,
  SubmitEpisodeCommentPayload,
  SubmittedComment,
} from "@/types/comment";

const requests = new Map<string, Promise<PaginatedResponse<PublicComment>>>();

export const commentService = {
  getEpisodeComments(episodeId: number, page = 1) {
    const key = `${episodeId}:${page}`;
    const pending = requests.get(key);
    if (pending) return pending;
    const request = apiClient
      .get<PaginatedResponse<PublicComment>>(
        API_ENDPOINTS.COMMENTS_BY_EPISODE(episodeId),
        { params: { page } },
      )
      .then(({ data }) => data);
    requests.set(key, request);
    request.then(
      () => { if (requests.get(key) === request) requests.delete(key); },
      () => { if (requests.get(key) === request) requests.delete(key); },
    );
    return request;
  },

  async submitEpisodeComment(payload: SubmitEpisodeCommentPayload) {
    const { data } = await apiClient.post<SubmittedComment>(
      API_ENDPOINTS.COMMENTS,
      payload,
    );
    return data;
  },
};
