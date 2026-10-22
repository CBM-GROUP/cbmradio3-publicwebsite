import { useNewsStore } from "@/store/news.store";

export const useSearchArticle = () => {
  const { searchArticles, loading, error, articles } = useNewsStore();

  return {
    articles,
    loading,
    error,
    search: searchArticles,
  };
};
