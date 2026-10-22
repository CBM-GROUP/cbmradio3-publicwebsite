import { useNewsStore } from "@/store/news.store";
import { useEffect } from "react";

export const useFeaturedArticles = () => {
  const { featuredArticles, fetchFeaturedArticles, loading, error } =
    useNewsStore();

  useEffect(() => {
    fetchFeaturedArticles();
  }, [fetchFeaturedArticles]);

  return { featuredArticles, loading, error, refresh: fetchFeaturedArticles };
};
