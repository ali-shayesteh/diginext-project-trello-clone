export interface Board {
  id: number;
  title: string;
  listsOrder: number[];
}

export interface List {
  id: number;
  board_id: number;
  title: string;
  cardsOrder: number[];
}

export interface Card {
  id: number;
  list_id: number;
  title: string;
  description: string;
}
