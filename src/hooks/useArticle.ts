import { useNewsStore } from "@/store/news.store";
import { useEffect } from "react";

export const useArticle = (slug: string) => {
  const { fetchArticle, article, loading, error } = useNewsStore();

  useEffect(() => {
    if (slug) {
      fetchArticle?.(slug);
    }
  }, [slug, fetchArticle]);

  return { article, loading, error, refresh: () => fetchArticle(slug) };
};
