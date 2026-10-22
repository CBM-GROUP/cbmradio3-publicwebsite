import { queryKeys } from "@/api/queryKeys";
import homeService from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";

export const useFooter = () => {
  useQuery({
    queryKey: queryKeys.footer,
    queryFn: homeService.getFooter,
  });
};
