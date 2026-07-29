export interface Program {
  id?: number;
  title: string;
  description: string;
  presenter: string;
  cover_image?: string | null;
  is_featured: boolean;
  is_active: boolean;
}