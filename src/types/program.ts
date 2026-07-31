export interface Program {
  id?: number;
  title: string;
  description: string;
  presenter: string;
  cover_image?: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export interface Episode {
  id?: number;
  program_id: number;
  title: string;
  description: string;
  cover_image?: string | null;
  youtube_link: string;
  publish_date: string;
  is_featured: boolean;
  is_active: boolean;
}