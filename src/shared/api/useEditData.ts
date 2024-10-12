import { QueryFunctionContext, useMutation } from "@tanstack/react-query";
import { apiService } from "./apiService";

export default function useEditData<T>(
  url: string,
  onSuccess?: (variables: { id: number; newData: T }) => void,
  onMutate?: (variables: {
    id: number;
    newData: T;
  }) => Promise<{ previous: T | undefined }>,
  onError?: (
    error: Error,
    variables: { id: number; newData: T },
    context: QueryFunctionContext
  ) => void,
  onSettled?: () => void
) {
  const mutateData = useMutation({
    mutationFn: ({ id, newData }: { id: number; newData: T }) =>
      apiService.editData(url + id, newData),

    onSuccess: (data, variables) => {
      if (onSuccess) {
        onSuccess(variables);
      }
    },

    onMutate: (variables) => {
      if (onMutate) {
        onMutate(variables);
      }
    },
    onError: (error, variables, context) => {
      if (onError) {
        onError(error, variables, context);
      }
    },
    onSettled: () => {
      if (onSettled) {
        onSettled();
      }
    },
  });

  return mutateData.mutate;
}
