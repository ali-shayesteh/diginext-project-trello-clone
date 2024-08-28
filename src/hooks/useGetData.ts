import { useQuery } from "@tanstack/react-query";

const useFetchData = (queryKey: string[], queryFn: () => void) => {
  return useQuery({ queryKey, queryFn });
};

export default useFetchData;
