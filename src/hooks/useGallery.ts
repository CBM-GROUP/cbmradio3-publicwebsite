import { useGalleryStore } from "@/store/galleryStore";
import { useEffect } from "react";

export const useGallery = () => {
  const { items, pageContent, isLoading, error, fetchGalleryData } =
    useGalleryStore();

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  return { items, pageContent, isLoading, error, refetch: fetchGalleryData };
};
