export interface PublicComment {
  id: number;
  name: string;
  body: string;
  article: number | null;
  episode: number | null;
  admin_reply: string;
  created_at: string;
}

export interface SubmitEpisodeCommentPayload {
  name: string;
  email: string;
  body: string;
  episode: number;
}

export interface SubmittedComment {
  id: number;
  name: string;
  body: string;
  article: number | null;
  episode: number;
  created_at: string;
}
