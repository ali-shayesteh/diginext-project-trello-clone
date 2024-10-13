import { useQueryClient } from "@tanstack/react-query";
import { Board, Card, List } from "../../../config/types";
import useCreateData from "../../../shared/api/useCreateData";
import useEditData from "../../../shared/api/useEditData";

type BoardVariables = { id: number; newData: Board };

export default function useBoardData(boardId: number) {
  const queryClient = useQueryClient();

  const mutateBoardMutate = async (variables: BoardVariables) => {
    await queryClient.cancelQueries({ queryKey: ["/api/boards/" + boardId] });

    const previous: Board | undefined = queryClient.getQueryData([
      "/api/boards/" + boardId,
    ]);
    queryClient.setQueryData(
      ["/api/boards/" + boardId],
      () => variables.newData
    );

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

  const mutateBoard = useEditData<Board>(
    "api/boards/",
    () => null,
    mutateBoardMutate,
    mutateBoardError,
    mutateBoardSettled
  );

  const mutateListSuccess = (variables: { id: number; newData: List }) => {
    queryClient.invalidateQueries({
      queryKey: ["/api/boards/" + boardId],
    });
    queryClient.invalidateQueries({
      queryKey: ["lists", variables.id],
    });
  };

  const mutateList = useEditData<List>("api/lists/", mutateListSuccess);

  const mutateCardSuccess = (variables: {
    id: number;
    newData: { listId: number };
  }) => {
    queryClient.invalidateQueries({
      queryKey: ["lists", variables.newData.listId],
    });
  };
  const mutateCard = useEditData<{ listId: number }>(
    "api/card/",
    mutateCardSuccess
  );

  const moveList = (
    id: number,
    reorderedLists: number[],
    title: string,
    lists: List[]
  ) => {
    mutateBoard({
      id,
      newData: {
        listsOrder: reorderedLists,
        title,
        lists,
      },
    });
  };

  const moveCard = (id: number, title: string, boardId: number) => {
    mutateList({
      id,
      newData: {
        title,
        board_id: boardId,
      },
    });
  };

  const editCard = (id: number, listId: number) => {
    mutateCard({
      id,
      newData: { listId },
    });
  };

  return {
    editCard,
    moveCard,
    moveList,
    boardId,
  };
}

export function useBoardDataCreateList(boardId: number, onSuccess: () => void) {
  const queryClient = useQueryClient();

  const createList = useCreateData<List>(
    "/api/lists",
    () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["/api/boards/" + boardId],
      });
    },
    () => null
  );

  return createList.mutate;
}

export function useBoardDataCreateCard(
  boardId: number,
  listId: number,
  onSuccess: () => void
) {
  const queryClient = useQueryClient();

  const createList = useCreateData<Card>(
    "/api/cards",
    () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: ["/api/boards/" + boardId],
      });

      queryClient.invalidateQueries({
        queryKey: ["/api/lists/" + listId],
      });
    },
    () => null
  );

  return createList.mutate;
}
