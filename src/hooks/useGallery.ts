import { useGalleryStore } from "@/store/galleryStore";
import { useEffect } from "react";

export const useGallery = () => {
  const { items, pageContent, isLoading, error, fetchGalleryData } =
    useGalleryStore();

  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      fetchGalleryData();
    }
  }, [items.length, isLoading, fetchGalleryData]);

  return { items, pageContent, isLoading, error, refetch: fetchGalleryData };
};
