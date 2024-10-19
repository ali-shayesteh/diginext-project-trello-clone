import { useMutation } from "@tanstack/react-query";
import { apiService } from "./apiService";

interface MutateDataVariables<T> {
  id: number;
  data: Partial<T>;
}

interface UseMutateDataInterface<T> {
  url: string;
  id?: number;
  type: "create" | "edit";
  onSuccess?: (variables: MutateDataVariables<T>) => void;
  onMutate?: (
    variables: MutateDataVariables<T>
  ) => Promise<{ previous: T | undefined }>;
  onError?: (
    context: { previous: T | undefined } | undefined,
    error?: Error,
    variables?: MutateDataVariables<T>
  ) => void;
  onSettled?: () => void;
}

export default function useMutateData<T>({
  url,
  type,
  onSuccess,
  onMutate,
  onError,
  onSettled,
}: UseMutateDataInterface<T>) {
  const mutateData = useMutation({
    mutationFn: (data: MutateDataVariables<T>) => {
      if (type === "create") {
        return apiService.createData<T>(url, data.data);
      }
      return apiService.editData<T>(url + data.id, data.data);
    },

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
