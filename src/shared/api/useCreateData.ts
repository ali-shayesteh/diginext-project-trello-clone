import { useMutation } from "@tanstack/react-query";
import { apiService } from "./apiService";

export default function useCreateData<T>(
  url: string,
  onSuccess: () => void,
  onError: () => void
) {
  const mutateData = useMutation({
    mutationFn: (newData: T) => apiService.createData(url, newData),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: () => {
      if (onError) {
        onError();
      }
    },
  });

  return mutateData;
}
