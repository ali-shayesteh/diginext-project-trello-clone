import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../lib/util";
import { Board, List } from "../../types";
import { useMemo, useState } from "react";
import ListMain from "../List/ListMain";
import AddList from "./AddList";

const BoardMain = () => {
  const { data: boardData, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: () => fetchData("/api/boards"),
  });

  const [boardId, setSelected] = useState(1);

  const { data: lists, isLoading: listLoading } = useQuery({
    queryKey: ["board" + boardId],
    queryFn: () => fetchData("/api/board/" + boardId),
  });

  const selectedBoard = useMemo(
    () =>
      boardData ? boardData.find((b: Board) => b.id === boardId) : undefined,
    [boardData, boardId]
  );

  return (
    <div className="h-full bg-[#92baeb]">
      {
        <>
          <header className="h-14 p-3 bg-white/40 backdrop-blur-sm">
            <h1 className="font-bold text-lg">
              {isLoading ? <>loading...</> : selectedBoard.title}
            </h1>
          </header>

          {listLoading ? (
            <>loading...</>
          ) : (
            <div className="p-3 h-[calc(100%-56px)]">
              <div className="flex gap-3 overflow-auto h-full pb-3">
                {lists &&
                  lists.lists.length > 0 &&
                  lists?.lists.map((l: List) => (
                    <ListMain key={l.id} data={l} />
                  ))}
                <div className="w-72">
                  <AddList {...{ boardId }} />
                </div>
              </div>
            </div>
          )}
        </>
      }
    </div>
  );
};

export default BoardMain;
