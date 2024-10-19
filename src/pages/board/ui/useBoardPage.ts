import { OnDragEndResponder } from "@hello-pangea/dnd";
import { Board, List } from "../../../config/types";
import { useGetData } from "../../../shared/api/useGetData";
import useBoardData, { useBoardDataEditList } from "../api/useBoardData";

export default function useBoardPage(boardId: number) {
  const { editBoard } = useBoardData(boardId);

  const editList = useBoardDataEditList(() => null);

  const { data, loading } = useGetData<Board>("/api/boards/" + boardId);

  const { data: lists, loading: listsLoading } = useGetData<List[]>(
    "/api/boards/" + boardId + "/lists"
  );

  const handleListMove = (sourceIndex: number, destinationIndex: number) => {
    if (!data) return;

    const temp = data?.listsOrder[sourceIndex];

    data.listsOrder[sourceIndex] = data.listsOrder[destinationIndex];
    data.listsOrder[destinationIndex] = temp;

    editBoard({ listsOrder: data.listsOrder });
  };

  const handleCardMoveBetweenLists = (
    srcListId: number,
    destListId: number
  ) => {
    // editBoard
    // const reorderedLists = data ? [...data.lists] : [];
    // const srcTargetList = reorderedLists.find((l) => l.id === srcListId);
    // const destTargetList = reorderedLists.find((l) => l.id === destListId);
    // if (!srcTargetList || !destTargetList) return;
    // // const [removedItem] = srcTargetList.cardsOrder.splice(sourceIndex, 1);
    // // destTargetList.cardsOrder.splice(destinationIndex, 0, removedItem);
    // // editCard(Number(removedItem), destListId);
    // // moveCard(srcListId, srcTargetList.title, srcTargetList.cardsOrder, boardId);
    // moveCard(destListId, destTargetList.title, boardId);
  };

  const handleCardMove = (
    sourceIndex: number,
    destinationIndex: number,
    listId: number
  ) => {
    const reorderedLists = lists ? [...lists] : [];
    const targetList = reorderedLists.find((l) => l.id === listId);

    if (!targetList) return;

    // Create a new cardsOrder array to avoid mutation
    const newCardsOrder = [...targetList.cardsOrder];
    const [movedCard] = newCardsOrder.splice(sourceIndex, 1); // Remove the card from the source index
    newCardsOrder.splice(destinationIndex, 0, movedCard); // Insert the card at the destination index

    editList({ listId, data: { cardsOrder: newCardsOrder } });
  };

  const handleDragDrop: OnDragEndResponder = (results) => {
    // we get the results from drag and drop
    const { source, destination, type } = results;

    // console.log(results);

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
      handleListMove(sourceIndex, destinationIndex, srcListId, destListId);
      return;
    } else {
      if (source.droppableId === destination.droppableId) {
        handleCardMove(sourceIndex, destinationIndex, srcListId);
        return;
      } else {
        handleCardMoveBetweenLists(sourceIndex, destinationIndex);
        return;
      }
    }
  };

  return {
    boardData: data,
    loading,
    lists,
    listsLoading,
    handleDragDrop,
  };
}
