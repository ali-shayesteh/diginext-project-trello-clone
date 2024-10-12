import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../shared/api/apiService";
import { Board, List } from "../../../config/types";
import useCreateData from "../../../shared/api/useCreateData";
import useEditData from "../../../shared/api/useEditData";

export default function useBoardData(boardId: number) {
  const queryClient = useQueryClient();

  type boardVariables =  {id: number, newData: Board}

  const mutateBoardMutate = async (variables : boardVariables) => {

      await queryClient.cancelQueries({ queryKey: ["/api/boards/" + boardId] });

      const previous : Board | undefined = queryClient.getQueryData([
        "/api/boards/" + boardId,
      ]);
      queryClient.setQueryData(["/api/boards/" + boardId], () => variables.newData);

      return { previous };
    }


    const mutateBoardError = (error: Error, variables : boardVariables, context : (previous: Board) => void| undefined) => {
      if (context)
        queryClient.setQueryData(
          ["/api/boards/" + boardId],
          context.previous
        );
    }

  //   // Always refetch after error or success:
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/boards/" + boardId] });
  //   },
  


  const mutateBoard = useEditData<Board>("api/boards/", () => null, mutateBoardMutate, mutateBoardError )

  // const mutateBoard = useMutation({
  //   mutationFn: ({
  //     listsOrder,
  //     title,
  //     lists,
  //   }: {
  //     listsOrder?: number[];
  //     title?: string;
  //     lists?: List[];
  //   }) => {
  //     return axiosInstance.put("api/boards/" + boardId, {
  //       listsOrder,
  //       title,
  //       lists,
  //     });
  //   },
  //   // onSuccess: () => {
  //   //   // ✅ refetch the comments list for our blog post
  //   //   queryClient.invalidateQueries({
  //   //     queryKey: ["boards", boardId],
  //   //   });
  //   // },
  //   onMutate: async (newBoard) => {
  //     // Cancel any outgoing refetches
  //     // (so they don't overwrite our optimistic update)
  //     await queryClient.cancelQueries({ queryKey: ["/api/boards/" + boardId] });

  //     // Snapshot the previous value
  //     const previousBoards = queryClient.getQueryData([
  //       "/api/boards/" + boardId,
  //     ]);

  //     // Optimistically update to the new value
  //     queryClient.setQueryData(["/api/boards/" + boardId], () => newBoard);

  //     // Return a context object with the snapshotted value
  //     return { previousBoards };
  //   },
  //   // If the mutation fails,
  //   // use the context returned from onMutate to roll back
  //   onError: (err, newBoard, context) => {
  //     if (context)
  //       queryClient.setQueryData(
  //         ["/api/boards/" + boardId],
  //         context.previousBoards
  //       );
  //   },
  //   // Always refetch after error or success:
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/boards/" + boardId] });
  //   },
  // });

  const mutateListSuccess = (variables: { id: number; newData: List }) => {
    queryClient.invalidateQueries({
      queryKey: ["/api/boards/" + boardId],
    });
    queryClient.invalidateQueries({
      queryKey: ["lists", variables.id],
    });
  };

  const mutateList = useEditData<List>(
    "api/lists/",
    mutateListSuccess
  );

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

  const moveList = (reorderedLists: number[], title: string, lists: List[]) => {
    mutateBoard.mutate({
      listsOrder: reorderedLists,
      title,
      lists,
    });
  };

  const moveCard = (
    id: number,
    title: string,
    cardsOrder: number[],
    boardId: number
  ) => {
    mutateList({
      id,
      newData: {
        title,
        cardsOrder,
        boardId,
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
    mutateBoard,
    mutateList,
    mutateCard,
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
