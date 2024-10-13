import { OnDragEndResponder } from "@hello-pangea/dnd";
import { Board, List } from "../../../config/types";
import { useGetData } from "../../../shared/api/useGetData";
import useBoardData from "../api/useBoardData";

interface BoardDataInterface extends Board {
  lists: List[];
}

export default function useBoardPage(boardId: number) {
  const { moveList, editCard, moveCard } = useBoardData(boardId);

  const { data, loading } = useGetData<BoardDataInterface>(
    "/api/boards/" + boardId
  );

  const handleListMove = (sourceIndex: number, destinationIndex: number) => {
    // const reorderedLists = data ? [...data.listsOrder] : [];
    // const [removedItem] = reorderedLists.splice(sourceIndex, 1);
    // reorderedLists.splice(destinationIndex, 0, removedItem);
    // moveList(boardId, reorderedLists, data?.title || "", data?.lists || []);
  };

  const handleCardMoveBetweenLists = (
    sourceIndex: number,
    destinationIndex: number,
    srcListId: number,
    destListId: number
  ) => {
    const reorderedLists = data ? [...data.lists] : [];
    const srcTargetList = reorderedLists.find((l) => l.id === srcListId);
    const destTargetList = reorderedLists.find((l) => l.id === destListId);

    if (!srcTargetList || !destTargetList) return;

    // const [removedItem] = srcTargetList.cardsOrder.splice(sourceIndex, 1);
    // destTargetList.cardsOrder.splice(destinationIndex, 0, removedItem);

    // editCard(Number(removedItem), destListId);

    // moveCard(srcListId, srcTargetList.title, srcTargetList.cardsOrder, boardId);

    moveCard(destListId, destTargetList.title, boardId);
  };

  const handleCardMove = (
    sourceIndex: number,
    destinationIndex: number,
    listId: number
  ) => {
    const reorderedLists = data ? [...data.lists] : [];
    const targetList = reorderedLists.find((l) => l.id === listId);

    if (!targetList) return;

    // const [removedItem] = targetList.cardsOrder.splice(sourceIndex, 1);
    // targetList.cardsOrder.splice(destinationIndex, 0, removedItem);

    // moveCard(listId, targetList.title, targetList.cardsOrder, boardId);
  };

  const handleDragDrop: OnDragEndResponder = (results) => {
    // we get the results from drag and drop
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const srcListId = Number(source.droppableId.split("-").at(1));
    const destListId = Number(destination.droppableId.split("-").at(1));

    if (type === "COLUMN") {
      handleListMove(sourceIndex, destinationIndex);
      return;
    } else {
      if (source.droppableId === destination.droppableId) {
        handleCardMove(sourceIndex, destinationIndex, srcListId);
        return;
      } else {
        handleCardMoveBetweenLists(
          sourceIndex,
          destinationIndex,
          srcListId,
          destListId
        );
        return;
      }
    }
  };

  return {
    boardData: data,
    loading,
    handleDragDrop,
  };
}
