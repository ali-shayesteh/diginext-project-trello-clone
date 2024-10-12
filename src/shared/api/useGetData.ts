import { useQuery } from "@tanstack/react-query";
import { apiService } from "./apiService";

export function useGetData<T>(url: string): {
  loading: boolean;
  data?: T;
  refetchData: () => void;
} {
  const query = useQuery<T, Error>({
    queryKey: [url],
    queryFn: () => apiService.getData(url),
  });

  const loading = query.isLoading || query.isRefetching || query.isPending;
  const data = query.data;

  const refetchData = async () => {
    await query.refetch();
  };

  return { loading, data, refetchData };
}
