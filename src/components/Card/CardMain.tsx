import { Card } from "../../types";

const CardMain = ({ card }: { card: Card }) => (
  <div className="rounded-lg bg-white shadow text-xs p-3">
    <h3>{card.title}</h3>
  </div>
);

export default CardMain;
