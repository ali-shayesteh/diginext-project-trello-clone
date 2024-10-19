import { useQueryClient } from "@tanstack/react-query";
import { Board, Card, List } from "../../../config/types";
import useMutateData from "../../../shared/api/useMutateData";

type BoardVariables = { id: number; data: Partial<Board> };

export default function useBoardData(boardId: number) {
  const queryClient = useQueryClient();

  const mutateBoardMutate = async (variables: BoardVariables) => {
    await queryClient.cancelQueries({ queryKey: ["/api/boards/" + boardId] });

    const previous: Board | undefined = queryClient.getQueryData([
      "/api/boards/" + boardId,
    ]);
    queryClient.setQueryData(["/api/boards/" + boardId], () => variables.data);

    return { previous };
  };

  const mutateBoardError = (
    context: { previous: Board | undefined } | undefined
  ) => {
    if (context)
      queryClient.setQueryData(["/api/boards/" + boardId], context.previous);
  };

  // Always refetch after error or success:
  const mutateBoardSettled = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/boards/" + boardId] });
  };

  const mutateBoard = useMutateData<Board>({
    url: "api/boards/",
    type: "edit",
    onMutate: mutateBoardMutate,
    onError: mutateBoardError,
    onSettled: mutateBoardSettled,
  });

  const editBoard = (data: Partial<Board>) => {
    mutateBoard({ data, id: boardId });
  };

  return {
    editBoard,
  };
}

export function useBoardDataInvalidateQuery(key: string) {
  const queryClient = useQueryClient();

  const invalidateQuery = (param?: string) => {
    queryClient.invalidateQueries({
      queryKey: param ? [key + param] : [key],
    });
  };

  return invalidateQuery;
}

export function useBoardDataCreateList(boardId: number, onSuccess: () => void) {
  const invalidateBoardData = useBoardDataInvalidateQuery(
    "/api/boards/" + boardId + "/lists"
  );

  const createList = useMutateData<List>({
    type: "create",
    url: "/api/lists/",
    onSuccess: () => {
      onSuccess();
      invalidateBoardData();
    },
  });

  return createList;
}

export function useBoardDataEditList(onSuccess: () => void) {
  const invalidateListData = useBoardDataInvalidateQuery("/api/lists/");

  const mutateList = useMutateData<List>({
    type: "edit",
    url: "/api/lists/",
    onSuccess: (variables) => {
      onSuccess();
      invalidateListData(variables.id + "/cards");
    },
  });

  const editList = ({
    data,
    listId,
  }: {
    data: Partial<List>;
    listId: number;
  }) => {
    mutateList({ data, id: listId });
  };

  return editList;
}

export function useBoardDataCreateCard(
  listId: number,
  boardId: number,
  onSuccess: () => void
) {
  const invalidateListData = useBoardDataInvalidateQuery(
    "/api/lists/" + listId + "/cards"
  );

  const invalidateBoardData = useBoardDataInvalidateQuery(
    "/api/boards/" + boardId + "/lists"
  );

  const mutateCard = useMutateData<Card>({
    url: "/api/cards/",
    type: "create",
    onSuccess: () => {
      onSuccess();
      invalidateListData();
      invalidateBoardData();
    },
  });

  const createCard = (data: Partial<List>) => {
    mutateCard({ data, id: listId });
  };

  return createCard;
}
