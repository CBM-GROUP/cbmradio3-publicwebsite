import { galleryService } from "@/services/gallery.service";
import { GalleryItem, GalleryPageContent } from "@/types/gallery";
import { create } from "zustand";

interface GalleryStore {
  items: GalleryItem[];
  pageContent: GalleryPageContent | null;
  count: number;
  next: string | null;
  previous: string | null;
  hasLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  fetchGalleryData: () => Promise<void>;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  items: [],
  pageContent: null,
  count: 0,
  next: null,
  previous: null,
  hasLoaded: false,
  isLoading: false,
  error: null,
  fetchGalleryData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const [itemsData, contentData] = await Promise.all([
        galleryService.getGalleryItems(),
        galleryService.getGalleryPageContent().catch(() => null),
      ]);

      const activeItems = itemsData.results.filter((item) => item.is_active);
      set({
        items: activeItems,
        pageContent: contentData,
        count: itemsData.count,
        next: itemsData.next,
        previous: itemsData.previous,
        hasLoaded: true,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load gallery data";
      set({
        error: errorMessage || "Failed to load gallery data",
        hasLoaded: true,
        isLoading: false,
      });
    }
  },
}));