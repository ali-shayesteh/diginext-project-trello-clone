import { List, Card } from "../../../../config/types";
import CardMain from "../card/cardMain";
import AddCard from "./addCard";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useGetData } from "../../../../shared/api/useGetData";
import { memo } from "react";

export const ListMain = memo(({ data }: { data: List }) => {
  const { id } = data;

  const { data: cards, loading: cardsLoading } = useGetData<Card[]>(
    "/api/lists/" + id + "/cards"
  );

  return (
    <div>
      <div className="w-72 p-2 bg-[#f1f2f4] rounded-xl shadow-sm">
        <header className="py-1.5 px-2">
          <h2 className="text-sm">{data.title}</h2>
        </header>
        <main className="">
          <Droppable
            droppableId={"list-" + id}
            type="CARD"
            direction="vertical"
          >
            {(provided) => (
              <div className="min-h-1">
                <div
                  className="flex flex-col gap-3 min-h-1"
                  // style={{
                  //   height:
                  //     cardsOrder.length > 0
                  //       ? cardsOrder.length * 52 - 12
                  //       : "auto",
                  // }}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {/* Map through listsOrder to render each list */}
                  {cardsLoading ? (
                    <div>loading...</div>
                  ) : (
                    cards &&
                    cards.length > 0 &&
                    cards.map((card: Card, index: number) => {
                      // const card = cards.find((c: Card) => c.id === cardId);

                      return (
                        card && (
                          <Draggable
                            draggableId={"card" + card.id}
                            key={card.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <div {...provided.dragHandleProps}>
                                  <CardMain card={card} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      );
                    })
                  )}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </main>
        <footer className="mt-2">
          {id && data && <AddCard listId={id} boardId={data.board_id} />}
        </footer>
      </div>
    </div>
  );
});
