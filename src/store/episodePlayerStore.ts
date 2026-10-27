import { create } from "zustand";
import { getYouTubeMedia, type YouTubeMedia } from "@/lib/youtube";
import type { EpisodeSummary } from "@/types/program";

interface EpisodePlayerState {
  currentEpisode: EpisodeSummary | null;
  media: YouTubeMedia | null;
  isPlaying: boolean;
  isDockOpen: boolean;
  isVideoModalOpen: boolean;
  
  // Actions
  playEpisode: (episode: EpisodeSummary, openModal?: boolean) => void;
  togglePlay: () => void;
  openVideoModal: () => void;
  closeVideoModal: () => void;
  closeDock: () => void;
}

export const useEpisodePlayerStore = create<EpisodePlayerState>((set) => ({
  currentEpisode: null,
  media: null,
  isPlaying: false,
  isDockOpen: false,
  isVideoModalOpen: false,

  playEpisode: (episode: EpisodeSummary, openModal = false) => {
    const media = getYouTubeMedia(episode.youtube_embed_url || episode.youtube_link);
    set({
      currentEpisode: episode,
      media,
      isPlaying: true,
      isDockOpen: true,
      isVideoModalOpen: openModal,
    });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  openVideoModal: () => {
    set({ isVideoModalOpen: true });
  },

  closeVideoModal: () => {
    set({ isVideoModalOpen: false });
  },

  closeDock: () => {
    set({ isDockOpen: false, isPlaying: false, isVideoModalOpen: false });
  },
}));
