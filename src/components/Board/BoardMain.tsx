import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appAxios, fetchData } from "../../lib/util";
import { List } from "../../types";
import { useState } from "react";
import ListMain from "../List/ListMain";
import AddList from "./AddList";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

const BoardMain = () => {
  const queryClient = useQueryClient();

  const [boardId, setSelected] = useState(1);

  const mutation = useMutation({
    mutationFn: ({
      listsOrder,
      title,
      lists,
    }: {
      listsOrder?: number[];
      title?: string;
      lists?: List[];
    }) => {
      return appAxios.put("api/boards/" + boardId, {
        listsOrder,
        title,
        lists,
      });
    },
    // onSuccess: () => {
    //   // ✅ refetch the comments list for our blog post
    //   queryClient.invalidateQueries({
    //     queryKey: ["boards", boardId],
    //   });
    // },
    onMutate: async (newBoard) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["boards", boardId] });

      // Snapshot the previous value
      const previousBoards = queryClient.getQueryData(["boards", boardId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["boards", boardId], () => newBoard);

      // Return a context object with the snapshotted value
      return { previousBoards };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newBoard, context) => {
      if (context)
        queryClient.setQueryData(["boards", boardId], context.previousBoards);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
  });

  const mutationList = useMutation({
    mutationFn: ({ id, title, cardsOrder }: List) => {
      return appAxios.put("api/lists/" + id, {
        cardsOrder,
        title,
      });
    },

    onSuccess: (data, list) => {
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lists", list.id],
      });
    },
  });

  const mutationCard = useMutation({
    mutationFn: ({ id, listId }: { id: number; listId: number }) => {
      return appAxios.put("api/card/" + id, {
        listId,
      });
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lists", variables.listId],
      });
    },
  });

  const { data: boardData, isLoading } = useQuery({
    queryKey: ["boards", boardId],
    queryFn: () => fetchData("/api/boards/" + boardId),
  });

  const handleListMove = (sourceIndex: number, destinationIndex: number) => {
    const reorderedLists = [...boardData.listsOrder];
    const [removedItem] = reorderedLists.splice(sourceIndex, 1);
    reorderedLists.splice(destinationIndex, 0, removedItem);

    mutation.mutate({
      listsOrder: reorderedLists,
      title: boardData.title,
      lists: boardData.lists,
    });
  };

  const handleCardMove = (
    sourceIndex: number,
    destinationIndex: number,
    listId: number
  ) => {
    const reorderedLists = [...boardData.lists];
    const targetList = reorderedLists.find((l) => l.id === listId);
    const [removedItem] = targetList.cardsOrder.splice(sourceIndex, 1);
    targetList.cardsOrder.splice(destinationIndex, 0, removedItem);

    mutationList.mutate({
      id: listId,
      title: targetList.title,
      cardsOrder: targetList.cardsOrder,
      boardId,
    });
  };

  const handleCardMoveBetween = (
    sourceIndex: number,
    destinationIndex: number,
    srcListId: number,
    destListId: number
  ) => {
    const reorderedLists = [...boardData.lists];
    const srcTargetList = reorderedLists.find((l) => l.id === srcListId);
    const destTargetList = reorderedLists.find((l) => l.id === destListId);

    const [removedItem] = srcTargetList.cardsOrder.splice(sourceIndex, 1);
    destTargetList.cardsOrder.splice(destinationIndex, 0, removedItem);

    mutationCard.mutate({
      id: Number(removedItem),
      listId: destListId,
    });

    mutationList.mutate({
      id: srcListId,
      title: srcTargetList.title,
      cardsOrder: srcTargetList.cardsOrder,
      boardId,
    });

    mutationList.mutate({
      id: destListId,
      title: destTargetList.title,
      cardsOrder: destTargetList.cardsOrder,
      boardId,
    });
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
        handleCardMoveBetween(
          sourceIndex,
          destinationIndex,
          srcListId,
          destListId
        );
        return;
      }
    }
  };

  return (
    <div className="h-full bg-[#92baeb]">
      <>
        <header className="p-3 bg-white/40 backdrop-blur-sm h-14">
          <h1 className="font-bold text-lg">
            {isLoading ? <>loading...</> : boardData.title}
          </h1>
        </header>
        <div className="p-3 flex gap-3">
          <div className="flex gap-3 pb-6 overflow-auto h-[calc(100vh-72px)]">
            {isLoading ? (
              <>loading...</>
            ) : (
              <div className="">
                <DragDropContext onDragEnd={handleDragDrop}>
                  {/* Render Droppable area for lists */}
                  <Droppable
                    droppableId="ROOT"
                    type="COLUMN"
                    direction="horizontal"
                  >
                    {(provided) => (
                      <div
                        className="flex gap-3"
                        // style={{
                        //   width: boardData.listsOrder
                        //     ? boardData.listsOrder.length * 300 - 12
                        //     : "auto",
                        // }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {/* Map through listsOrder to render each list */}

                        {boardData.listsOrder &&
                          boardData.listsOrder.length > 0 &&
                          boardData.listsOrder.map(
                            (listId: number, index: number) => {
                              const list: List = boardData.lists.find(
                                (l: List) => l.id === listId
                              );

                              return (
                                <Draggable
                                  draggableId={"list" + list.id}
                                  key={list.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                    >
                                      <div {...provided.dragHandleProps}>
                                        <ListMain key={list.id} data={list} />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            }
                          )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}

            <div className="w-72">
              <AddList {...{ boardId }} />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default BoardMain;
