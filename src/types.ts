export interface Card {
  id: number;
  title: string;
  desciption?: string;
  listId: number;
}

export interface List {
  id: number;
  title: string;
  boardId: number;
  cardsOrder: number[];
}

export interface Board {
  id: number;
  title: string;
  listsOrder: number[];
}
