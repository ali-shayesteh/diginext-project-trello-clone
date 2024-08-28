import { useQuery } from "@tanstack/react-query";
import { List, Card } from "../../types";
import { fetchData } from "../../lib/util";
import CardMain from "../Card/CardMain";
import AddCard from "./AddCard";

const ListMain = ({ data }: { data: List }) => {
  const { id } = data;

  const { data: cards, isLoading: cardLoading } = useQuery({
    queryKey: ["cards" + id],
    queryFn: () => fetchData("/api/card/" + id),
  });

  if (cardLoading) <>loading...</>;

  return (
    <div>
      <div className="w-72 p-2 bg-[#f1f2f4] rounded-xl shadow-sm">
        <header className="py-1.5 px-2">
          <h2 className="text-sm">{data.title}</h2>
        </header>
        <main className="flex flex-col gap-2">
          {cards &&
            cards.map((card: Card) => <CardMain key={card.id} card={card} />)}
        </main>
        <footer className="mt-2">
          <AddCard />
        </footer>
      </div>
    </div>
  );
};

export default ListMain;
