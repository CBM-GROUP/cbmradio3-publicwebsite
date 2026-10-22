import { useGalleryStore } from "@/store/galleryStore";
import { useEffect } from "react";

export const useGallery = () => {
  const { items, pageContent, isLoading, error, hasLoaded, fetchGalleryData } =
    useGalleryStore();

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      fetchGalleryData();
    }
  }, [hasLoaded, isLoading, fetchGalleryData]);

  return { items, pageContent, isLoading, error, refetch: fetchGalleryData };
};
