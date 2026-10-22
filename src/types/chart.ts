export interface ChartMovement {
  status: "up" | "down" | "same" | "new";
  diff: number;
  label: string;
}

export interface ChartEntry {
  id: string;
  chart?: string;
  chart_slug?: string;
  rank: number;
  previous_rank: number | null;
  peak_rank: number;
  weeks_on_chart: number;
  title: string;
  artist: string;
  featured_artists?: string;
  album?: string;
  cover_image?: string;
  cover_image_url?: string;
  audio_url?: string;
  youtube_url?: string;
  spotify_url?: string;
  apple_music_url?: string;
  movement?: ChartMovement;
}

export interface Chart {
  id: string;
  title: string;
  slug: string;
  description: string;
  edition_date: string;
  chart_type: string;
  cover_image?: string;
  cover_image_url?: string;
  is_active: boolean;
  display_order: number;
  entries_count?: number;
  entries?: ChartEntry[];
}
