import { galleryService } from "@/services/gallery.service";
import { GalleryItem, GalleryPageContent } from "@/types/gallery";
import { create } from "zustand";

interface GalleryStore {
  items: GalleryItem[];
  pageContent: GalleryPageContent | null;
  isLoading: boolean;
  error: string | null;
  fetchGalleryData: () => Promise<void>;
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  items: [],
  pageContent: null,
  isLoading: false,
  error: null,
  fetchGalleryData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [itemsData, contentData] = await Promise.all([
        galleryService.getGalleryItems(),
        galleryService.getGalleryPageContent().catch(() => null),
      ]);

      const activeItems = itemsData.filter((item) => item.is_active);
      set({
        items: activeItems,
        pageContent: contentData,
        isLoading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load gallery data";
      set({
        error: errorMessage || "Failed to load gallery data",
        isLoading: false,
      });
    }
  },
}));
