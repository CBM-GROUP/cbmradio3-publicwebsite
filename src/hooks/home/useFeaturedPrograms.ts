import { queryKeys } from "@/api/queryKeys";
import homeService from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";

export const useFeaturedPrograms = () => {
  useQuery({
    queryKey: queryKeys.featuredPrograms,
    queryFn: homeService.getFeaturedPrograms,
  });
};
