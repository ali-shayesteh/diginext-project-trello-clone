import { List } from "../../../config/types";
import ListMain from "./list/listMain";
import AddList from "./addList";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import useBoardPage from "./useBoardPage";

export const BoardPage = () => {
  const boardId = 1;

  const { loading, boardData, handleDragDrop } = useBoardPage(boardId);

  return (
    <div className="h-full bg-[#92baeb]">
      <>
        <header className="p-3 bg-white/40 backdrop-blur-sm h-14">
          <h1 className="font-bold text-lg">
            {loading || !boardData ? <>loading...</> : boardData.title}
          </h1>
        </header>
        <div className="p-3 flex gap-3">
          <div className="flex gap-3 pb-6 overflow-auto h-[calc(100vh-72px)]">
            {loading || !boardData ? (
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

                        {boardData.lists &&
                          boardData.lists.length > 0 &&
                          boardData.lists.map((list: List, index: number) => {
                            if (!list) {
                              return <>Not Found</>;
                            }
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
                          })}
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
