import { useMutation } from "@tanstack/react-query";
import { apiService } from "./apiService";

interface EditDataVariables<T> {
  id: number;
  newData: T;
}

export default function useEditData<T>(
  url: string,
  onSuccess?: (variables: EditDataVariables<T>, data: T) => void,
  onMutate?: (variables: {
    id: number;
    newData: T;
  }) => Promise<{ previous: T | undefined }>,
  onError?: (
    context: { previous: T | undefined } | undefined,
    error?: Error,
    variables?: EditDataVariables<T>
  ) => void,
  onSettled?: () => void
) {
  const mutateData = useMutation({
    mutationFn: ({ id, newData }: { id: number; newData: T }) =>
      apiService.editData(url + id, newData),

    onSuccess: (data, variables) => {
      if (onSuccess) {
        onSuccess(variables, data);
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
        onError(context, error, variables);
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
