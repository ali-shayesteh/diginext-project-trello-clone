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
}

export interface Board {
  id: number;
  title: string;
}
