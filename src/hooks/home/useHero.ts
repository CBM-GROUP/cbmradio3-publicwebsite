import { queryKeys } from "@/api/queryKeys";
import homeService from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";

export const useHero = () => {
  useQuery({
    queryKey: queryKeys.hero,
    queryFn: homeService.getHero,
  });
};
