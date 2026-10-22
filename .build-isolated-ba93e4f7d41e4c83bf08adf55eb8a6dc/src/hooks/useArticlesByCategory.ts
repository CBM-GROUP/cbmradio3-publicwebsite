import { useNewsStore } from "@/store/news.store";
import { useEffect } from "react";

export const useArticlesByCategory = (category: string) => {
  const { articles, loading, error, fetchArticlesByCategory } = useNewsStore();

  useEffect(() => {
    if (category) {
      fetchArticlesByCategory?.(category);
    }
  }, [category, fetchArticlesByCategory]);

  return {
    articles,
    loading,
    error,
    refresh: () => fetchArticlesByCategory(category),
  };
};
