import { http, HttpResponse } from "msw";
import { Board, Card, List } from "../types";

const boardsInit: Board[] = [
  {
    id: 1,
    title: "DigiNext Project",
    listsOrder: [2, 1, 3],
  },
  {
    id: 2,
    title: "DigiNext Project 2",
    listsOrder: [4],
  },
];

const boardStorage = localStorage.getItem("boards");

if (!boardStorage) {
  localStorage.setItem("boards", JSON.stringify(boardsInit));
}

const boards = boardStorage !== null ? JSON.parse(boardStorage) : boardsInit;

const listsInit: List[] = [
  {
    id: 1,
    boardId: 1,
    title: "list 1 1",
    cardsOrder: [1, 4],
  },
  {
    id: 2,
    boardId: 1,
    title: "list 1 2",
    cardsOrder: [2],
  },
  {
    id: 3,
    boardId: 1,
    title: "list 1 3",
    cardsOrder: [],
  },
  {
    id: 4,
    boardId: 2,
    title: "list 2 1",
    cardsOrder: [],
  },
];

const listStorage = localStorage.getItem("lists");

if (!listStorage) {
  localStorage.setItem("lists", JSON.stringify(listsInit));
}

const lists = listStorage !== null ? JSON.parse(listStorage) : listsInit;

const cardsInit: Card[] = [
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
  {
    id: 4,
    listId: 1,
    title: "card 1 2",
    desciption: "card 1 1 desc.",
  },
];

const cardStorage = localStorage.getItem("cards");

if (!cardStorage) {
  localStorage.setItem("cards", JSON.stringify(cardsInit));
}

const cards = cardStorage !== null ? JSON.parse(cardStorage) : cardsInit;

export const handlers = [
  http.get("/api/boards", () => {
    return HttpResponse.json(boards);
  }),

  http.post("/api/boards", async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const newBoard: Board = { id: boards.length + 1, title, listsOrder: [] };
    boards.push(newBoard);

    localStorage.setItem("boards", JSON.stringify(boards));

    return HttpResponse.json(newBoard);
  }),

  http.get("/api/boards/:id", ({ params }) => {
    const { id } = params;

    const board = boards.find((b: Board) => b.id === Number(id));
    const list = lists.filter((l: List) => l.boardId === Number(id));

    const result = { ...board, lists: list };

    return HttpResponse.json(result);
  }),

  http.put("/api/boards/:id", async ({ request, params }) => {
    const { id } = params;

    const { title, listsOrder } = (await request.json()) as {
      title: string;
      listsOrder: number[];
    };

    const result = boards.find((b: Board) => b.id === Number(id));

    if (result) {
      result.title = title;
      result.listsOrder = listsOrder;
    }

    localStorage.setItem("boards", JSON.stringify(boards));

    return HttpResponse.json(result);
  }),

  http.post("/api/lists", async ({ request }) => {
    const { title, boardId, cardsOrder } = (await request.json()) as {
      title: string;
      boardId: number;
      cardsOrder: number[];
    };

    const id = lists.length + 1;

    const newList: List = {
      id,
      title,
      boardId,
      cardsOrder,
    };

    lists.push(newList);

    const targetBoard = boards.find((b: Board) => b.id === Number(boardId));

    targetBoard.listsOrder.push(id);

    localStorage.setItem("lists", JSON.stringify(lists));
    localStorage.setItem("boards", JSON.stringify(boards));

    return HttpResponse.json(newList);
  }),

  http.get("/api/list/:listId", ({ params }) => {
    const { listId } = params;

    const result = cards.filter((c: Card) => c.listId === Number(listId));

    return HttpResponse.json(result);
  }),

  http.put("/api/lists/:listId", async ({ request, params }) => {
    const { listId } = params;

    const { title, cardsOrder } = (await request.json()) as {
      title: string;
      cardsOrder: number[];
    };

    const result = lists.find((l: List) => l.id === Number(listId));

    if (result) {
      result.title = title;
      result.cardsOrder = cardsOrder;
    }

    localStorage.setItem("lists", JSON.stringify(lists));

    return HttpResponse.json(result);
  }),

  http.post("/api/cards", async ({ request }) => {
    const { title, listId } = (await request.json()) as {
      title: string;
      listId: number;
    };

    const id = cards.length + 1;

    const newCard: Card = { id, title, listId };

    cards.push(newCard);

    const targetList = lists.find((l: List) => l.id === newCard.listId);
    targetList.cardsOrder.push(newCard.id);

    localStorage.setItem("lists", JSON.stringify(lists));

    localStorage.setItem("cards", JSON.stringify(cards));

    return HttpResponse.json(newCard);
  }),

  http.put("/api/card/:cardId", async ({ request, params }) => {
    const { cardId } = params;

    const { listId } = (await request.json()) as {
      listId: number;
    };

    const result = cards.find((c: Card) => c.id === Number(cardId));

    if (result) {
      result.listId = listId;
    }

    localStorage.setItem("cards", JSON.stringify(cards));

    return HttpResponse.json(result);
  }),
];
