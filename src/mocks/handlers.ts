import { http, HttpResponse } from "msw";
import { Board, Card, List } from "../config/types";
// import { v4 as uuidv4 } from "uuid"

const boardsInit = [
  {
    id: 1,
    title: "Diginext Board 1",
    listsOrder: [1, 2],
  },
];

const listsInit = [
  {
    id: 1,
    board_id: 1,
    title: "List 1",
    cardsOrder: [1, 2],
  },
  {
    id: 2,
    board_id: 1,
    title: "List 2",
    cardsOrder: [3, 4],
  },
];

const cardsInit = [
  {
    id: 1,
    list_id: 1,
    title: "Card 1",
    description: "Description 1",
  },
  {
    id: 2,
    list_id: 1,
    title: "Card 2",
    description: "Description 2",
  },
  {
    id: 3,
    list_id: 2,
    title: "Card 3",
    description: "Description 3",
  },
  {
    id: 4,
    list_id: 2,
    title: "Card 4",
    description: "Description 4",
  },
];

// Load initial data from localStorage or set default values
const loadData = (): { boards: Board[]; lists: List[]; cards: Card[] } => {
  const boards = JSON.parse(
    localStorage.getItem("boards") || JSON.stringify(boardsInit)
  ) as Board[];
  const lists = JSON.parse(
    localStorage.getItem("lists") || JSON.stringify(listsInit)
  ) as List[];
  const cards = JSON.parse(
    localStorage.getItem("cards") || JSON.stringify(cardsInit)
  ) as Card[];
  return { boards, lists, cards };
};

let { boards, lists, cards } = loadData();

const saveData = () => {
  localStorage.setItem("boards", JSON.stringify(boards));
  localStorage.setItem("lists", JSON.stringify(lists));
  localStorage.setItem("cards", JSON.stringify(cards));
};

export const handlers = [
  // Boards
  http.get("/api/boards", () => {
    return HttpResponse.json(boards);
  }),

  http.post("/api/boards", async ({ request }) => {
    const { title } = (await request.json()) as Board;
    const newBoard: Board = {
      id: boards.length + 1,
      title,
      listsOrder: [],
    };
    boards.push(newBoard);

    saveData();

    return HttpResponse.json(newBoard);
  }),

  http.get("/api/boards/:id", ({ params }) => {
    const { id } = params;
    const board = boards.find((b) => b.id === Number(id));

    if (!board) {
      return HttpResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return HttpResponse.json(board);
  }),

  http.put("/api/boards/:id", async ({ request, params }) => {
    const { id } = params;
    const { title, listsOrder } = (await request.json()) as Board;

    const board = boards.find((b) => b.id === Number(id));

    if (!board) {
      return HttpResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (title) {
      board.title = title;
    }

    if (listsOrder) {
      board.listsOrder = listsOrder;
    }

    saveData(); // Persist to localStorage

    return HttpResponse.json(board);
  }),

  http.delete("/api/boards/:id", ({ params }) => {
    const { id } = params;
    const boardExists = boards.some((b) => b.id === Number(id));

    if (!boardExists) {
      return HttpResponse.json({ error: "Board not found" }, { status: 404 });
    }

    boards = boards.filter((b) => b.id !== Number(id));
    lists = lists.filter((l) => l.board_id !== Number(id));
    cards = cards.filter((c) => !lists.some((l) => l.id === c.list_id));

    saveData(); // Persist to localStorage
    return HttpResponse.json({ message: "Board deleted" }, { status: 204 });
  }),

  // Lists
  http.get("/api/lists", () => {
    return HttpResponse.json(lists);
  }),

  http.get("/api/boards/:boardId/lists", ({ params }) => {
    const { boardId } = params;

    const board = boards.find((b) => b.id === Number(boardId));

    if (!board) {
      return HttpResponse.json({ error: "Board not found." }, { status: 404 });
    }

    const sortedLists = board.listsOrder.map(
      (id) => lists.find((l) => l.id === id)!
    );

    return HttpResponse.json(sortedLists);
  }),

  http.get("/api/lists/:id", ({ params }) => {
    const { id } = params;

    const list = lists.find((l) => l.id === Number(id));

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    return HttpResponse.json(list);
  }),

  http.post("/api/lists", async ({ request }) => {
    const { title, board_id } = (await request.json()) as List;
    const newId = lists.length + 1;

    const newList: List = {
      id: newId,
      board_id,
      title,
      cardsOrder: [],
    };

    const board = boards.find((b) => b.id === board_id);

    board?.listsOrder.push(newId);

    lists.push(newList);

    saveData(); // Persist to localStorage
    return HttpResponse.json(newList);
  }),

  http.put("/api/lists/:id", async ({ request, params }) => {
    const { id } = params;
    const { title, cardsOrder } = (await request.json()) as List;

    const list: List | undefined = lists.find((l) => l.id === Number(id));

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (title) {
      list.title = title;
    }
    if (cardsOrder) {
      // Check if position is provided
      list.cardsOrder = cardsOrder;
    }

    saveData(); // Persist to localStorage

    return HttpResponse.json(list);
  }),

  http.delete("/api/lists/:id", ({ params }) => {
    const { id } = params;
    const listExists = lists.some((l) => l.id === Number(id));

    if (!listExists) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    lists = lists.filter((l) => l.id !== Number(id));
    cards = cards.filter((c) => c.list_id !== Number(id)); // Remove cards associated with the deleted list
    saveData(); // Persist to localStorage

    return HttpResponse.json({ message: "List deleted" }, { status: 204 });
  }),

  // Cards
  http.get("/api/cards", () => {
    return HttpResponse.json(cards);
  }),

  http.post("/api/cards", async ({ request }) => {
    const { title, list_id, description } = (await request.json()) as Card;
    const newId = cards.length + 1;

    const newCard = {
      id: newId,
      list_id,
      title,
      description,
    };

    const list = lists.find((l) => l.id === list_id);

    list?.cardsOrder.push(newId);

    cards.push(newCard);

    saveData(); // Persist to localStorage
    return HttpResponse.json(newCard);
  }),

  http.get("/api/lists/:listId/cards", ({ params }) => {
    const { listId } = params;

    const list = lists.find((l) => l.id === Number(listId));

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    const sortedCards = list.cardsOrder.map(
      (id) => cards.find((c) => c.id === id)!
    );

    return HttpResponse.json(sortedCards);
  }),

  http.put("/api/cards/:id", async ({ request, params }) => {
    const { id } = params;
    const { title, description, list_id } = (await request.json()) as Card;
    const card = cards.find((c) => c.id === Number(id));

    if (!card) {
      return HttpResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (title) {
      card.title = title;
    }
    if (description) {
      card.description = description;
    }
    if (list_id) {
      card.list_id = list_id;
    }

    saveData(); // Persist to localStorage

    return HttpResponse.json(card);
  }),

  http.delete("/api/cards/:id", ({ params }) => {
    const { id } = params;
    const cardExists = cards.some((c) => c.id === Number(id));

    if (!cardExists) {
      return HttpResponse.json({ error: "Card not found" }, { status: 404 });
    }

    cards = cards.filter((c) => c.id !== Number(id));
    saveData(); // Persist to localStorage

    return HttpResponse.json({ message: "Card deleted" }, { status: 204 });
  }),
];
