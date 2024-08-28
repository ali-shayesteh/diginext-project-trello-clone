import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../lib/util";
import { Board, List } from "../../types";
import { useMemo, useState } from "react";
import ListMain from "../List/ListMain";
import { Plus } from "lucide-react";
import Button from "../UI/Button";
import AddList from "./AddList";

const BoardMain = () => {
  const { data: boardData, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: () => fetchData("/api/boards"),
  });

  const [boardId, setSelected] = useState(1);

  const { data: lists, isLoading: listLoading } = useQuery({
    queryKey: ["lists" + boardId],
    queryFn: () => fetchData("/api/list/" + boardId),
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
          <header className="p-3 bg-white/40 backdrop-blur-sm">
            <h1 className="font-bold text-lg">
              {isLoading ? <>loading...</> : selectedBoard.title}
            </h1>
          </header>

          {listLoading ? (
            <>loading...</>
          ) : (
            <div className="p-3">
              <div className="flex gap-3">
                {lists &&
                  lists.length > 0 &&
                  lists.map((l: List) => <ListMain key={l.id} data={l} />)}
                <div className="w-72">
                  <AddList />
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
