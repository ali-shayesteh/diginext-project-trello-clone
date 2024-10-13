export interface Board {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export interface List {
  id: number;
  board_id: number;
  title: string;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface Card {
  id: number;
  list_id: number;
  title: string;
  description: string;
  position: number;
  created_at: Date;
  updated_at: Date;
}
