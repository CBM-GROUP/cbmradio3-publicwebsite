import { useNewsStore } from "@/store/news.store";
import { useEffect } from "react";

export const useArticles = () => {
  const { articles, fetchArticles, loading, error } = useNewsStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, refresh: fetchArticles };
};
