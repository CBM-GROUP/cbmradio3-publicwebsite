import { queryKeys } from "@/api/queryKeys";
import homeService from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";

export const useSponsor = () => {
  useQuery({
    queryKey: queryKeys.sponsors,
    queryFn: homeService.getSponsors,
  });
};
