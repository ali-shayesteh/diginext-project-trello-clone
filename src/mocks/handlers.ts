import { http, HttpResponse } from "msw";
import { Board, Card, List } from "../types";

const boards: Board[] = [
  {
    id: 1,
    title: "DigiNext Project",
  },
  {
    id: 2,
    title: "DigiNext Project 2",
  },
];

const lists: List[] = [
  {
    id: 1,
    boardId: 1,
    title: "list 1 1",
  },
  {
    id: 2,
    boardId: 1,
    title: "list 1 2",
  },
  {
    id: 3,
    boardId: 1,
    title: "list 1 3",
  },
  {
    id: 4,
    boardId: 2,
    title: "list 2 1",
  },
];

const cards: Card[] = [
  {
    id: 1,
    listId: 1,
    title: "card 1 1",
    desciption: "card 1 1 desc.",
  },
  {
    id: 2,
    listId: 2,
    title: "card 2 1",
    desciption: "card 2 1 desc.",
  },
  {
    id: 3,
    listId: 4,
    title: "card 3 1",
    desciption: "card 3 1 desc.",
  },
];

export const handlers = [
  http.get("/api/boards", () => {
    return HttpResponse.json(boards);
  }),

  http.get("/api/list/:boardId", ({ params }) => {
    const { boardId } = params;

    const result = lists.filter((l) => l.boardId === Number(boardId));

    return HttpResponse.json(result);
  }),

  http.post("/api/lists", async ({ request }) => {
    const { title, boardId } = (await request.json()) as {
      title: string;
      boardId: number;
    };

    const newList: List = { id: lists.length + 1, title, boardId };

    lists.push(newList);

    return HttpResponse.json(newList);
  }),

  http.get("/api/card/:listId", ({ params }) => {
    const { listId } = params;

    const result = cards.filter((c) => c.listId === Number(listId));

    return HttpResponse.json(result);
  }),

  http.post("/api/boards", async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const newBoard: Board = { id: boards.length + 1, title };
    boards.push(newBoard);

    return HttpResponse.json(newBoard);
  }),
];
