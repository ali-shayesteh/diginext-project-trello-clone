import { useMutation } from "@tanstack/react-query";
import { apiService } from "./apiService";

interface EditDataVariables<T> {
  id: number;
  newData: T;
}

export default function useEditData<T>(
  url: string,
  onSuccess?: (variables: EditDataVariables<T>) => void,
  onMutate?: (variables: {
    id: number;
    newData: T;
  }) => Promise<{ previous: T | undefined }>,
  onError?: (
    error: Error,
    variables: EditDataVariables<T>,
    context: { previous: T | undefined } | undefined
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

    onMutate: async (variables) => {
      if (onMutate) {
        return (await onMutate(variables)) || { previous: undefined };
      }
      return { previous: undefined };
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
