import { http, HttpResponse } from "msw";
import { Board, Card, List } from "../config/types";
// import { v4 as uuidv4 } from "uuid"

// Load initial data from localStorage or set default values
const loadData = (): { boards: Board[]; lists: List[]; cards: Card[] } => {
  const boards = JSON.parse(
    localStorage.getItem("boards") ||
      JSON.stringify([
        { id: 1, title: "Diginext Board 1", created_at: "", updated_at: "" },
      ])
  ) as Board[];
  const lists = JSON.parse(localStorage.getItem("lists") || "[]") as List[];
  const cards = JSON.parse(localStorage.getItem("cards") || "[]") as Card[];
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
      created_at: new Date(),
      updated_at: new Date(),
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

    const boardLists = lists.filter((l) => l.board_id === Number(id));
    const sortedLists = boardLists.sort((a, b) => a.position - b.position);

    return HttpResponse.json({ ...board, lists: sortedLists });
  }),

  http.put("/api/boards/:id", async ({ request, params }) => {
    const { id } = params;
    const { title } = (await request.json()) as Board;

    const board = boards.find((b) => b.id === Number(id));

    if (!board) {
      return HttpResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (title) {
      board.title = title;
    }
    board.updated_at = new Date(); // Update timestamp
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
    const sortedLists = lists.sort((a, b) => a.position - b.position);
    return HttpResponse.json(sortedLists);
  }),

  http.get("/api/lists/:id", ({ params }) => {
    const { id } = params;

    const list = lists.find((l) => l.id === Number(id));

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    const listCards = cards.filter((c) => c.list_id === Number(id));
    const sortedCards = listCards.sort((a, b) => a.position - b.position);

    return HttpResponse.json({ ...list, cards: sortedCards });
  }),

  http.post("/api/lists", async ({ request }) => {
    const { title, board_id, position } = (await request.json()) as List;
    const newList: List = {
      id: lists.length + 1,
      board_id,
      title,
      position,
      created_at: new Date(),
      updated_at: new Date(),
    };
    lists.push(newList);
    saveData(); // Persist to localStorage
    return HttpResponse.json(newList);
  }),

  http.put("/api/lists/:id", async ({ request, params }) => {
    const { id } = params;
    const { title, position } = (await request.json()) as List;

    const list: List | undefined = lists.find((l) => l.id === Number(id));

    if (!list) {
      return HttpResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (title) {
      list.title = title;
    }
    if (position !== undefined) {
      // Check if position is provided
      list.position = position;
    }
    list.updated_at = new Date(); // Update timestamp
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
    const sortedCards = cards.sort((a, b) => a.position - b.position);
    return HttpResponse.json(sortedCards);
  }),

  http.post("/api/cards", async ({ request }) => {
    const { title, list_id, description, position } =
      (await request.json()) as Card;
    const newCard = {
      id: cards.length + 1,
      list_id,
      title,
      description,
      position,
      created_at: new Date(),
      updated_at: new Date(),
    };
    cards.push(newCard);
    saveData(); // Persist to localStorage
    return HttpResponse.json(newCard);
  }),

  http.put("/api/cards/:id", async ({ request, params }) => {
    const { id } = params;
    const { title, description, position } = (await request.json()) as Card;
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
    if (position !== undefined) {
      // Check if position is provided
      card.position = position;
    }
    card.updated_at = new Date(); // Update timestamp
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

// const listsInit: List[] = [
//   {
//     id: 1,
//     boardId: 1,
//     title: "list 1 1",
//     cardsOrder: [1, 4],
//   },
//   {
//     id: 2,
//     boardId: 1,
//     title: "list 1 2",
//     cardsOrder: [2],
//   },
//   {
//     id: 3,
//     boardId: 1,
//     title: "list 1 3",
//     cardsOrder: [],
//   },
//   {
//     id: 4,
//     boardId: 2,
//     title: "list 2 1",
//     cardsOrder: [],
//   },
// ];

// const listStorage = localStorage.getItem("lists");

// if (!listStorage) {
//   localStorage.setItem("lists", JSON.stringify(listsInit));
// }

// const lists = listStorage !== null ? JSON.parse(listStorage) : listsInit;

// const boardsInit: Board[] = [
//   {
//     id: 1,
//     title: "DigiNext Project",
//     listsOrder: [2, 1, 3],
//     lists: listsInit.filter((l) => l.boardId === 1),
//   },
//   {
//     id: 2,
//     title: "DigiNext Project 2",
//     listsOrder: [4],
//     lists: listsInit.filter((l) => l.boardId === 2),
//   },
// ];

// const boardStorage = localStorage.getItem("boards");

// if (!boardStorage) {
//   localStorage.setItem("boards", JSON.stringify(boardsInit));
// }

// const boards = boardStorage !== null ? JSON.parse(boardStorage) : boardsInit;

// const cardsInit: Card[] = [
//   {
//     id: 1,
//     listId: 1,
//     title: "card 1 1",
//     desciption: "card 1 1 desc.",
//   },
//   {
//     id: 2,
//     listId: 2,
//     title: "card 2 1",
//     desciption: "card 2 1 desc.",
//   },
//   {
//     id: 3,
//     listId: 4,
//     title: "card 3 1",
//     desciption: "card 3 1 desc.",
//   },
//   {
//     id: 4,
//     listId: 1,
//     title: "card 1 2",
//     desciption: "card 1 1 desc.",
//   },
// ];

// const cardStorage = localStorage.getItem("cards");

// if (!cardStorage) {
//   localStorage.setItem("cards", JSON.stringify(cardsInit));
// }

// const cards = cardStorage !== null ? JSON.parse(cardStorage) : cardsInit;

// const updateLocalStorage = () => {
//   localStorage.setItem("boards", JSON.stringify(boards));
//   localStorage.setItem("lists", JSON.stringify(lists));
//   localStorage.setItem("cards", JSON.stringify(cards));
// };

// export const handlers = [
//   http.get("/api/boards", () => {
//     return HttpResponse.json(boards);
//   }),

//   http.post("/api/boards", async ({ request }) => {
//     const { title } = (await request.json()) as { title: string };
//     const newBoard: Board = {
//       id: uuidv4(),
//       title,
//       listsOrder: [],
//       lists: [],
//     };
//     boards.push(newBoard);

//     updateLocalStorage();

//     return HttpResponse.json(newBoard);
//   }),

//   http.get("/api/boards/:id", ({ params }) => {
//     const { id } = params;

//     const board = boards.find((b: Board) => b.id === Number(id));

//     if (!board) {
//       return HttpResponse.json({ error: "Board not found" }, { status: 404 });
//     }

//     const list = lists.filter((l: List) => l.boardId === Number(id));

//     const result = { ...board, lists: list };

//     return HttpResponse.json(result);
//   }),

//   http.put("/api/boards/:id", async ({ request, params }) => {
//     const { id } = params;

//     const { title, listsOrder } = (await request.json()) as {
//       title: string;
//       listsOrder: number[];
//     };

//     const result = boards.find((b: Board) => b.id === Number(id));

//     if (result) {
//       result.title = title;
//       result.listsOrder = listsOrder;
//     }

//     updateLocalStorage();

//     return HttpResponse.json(result);
//   }),

//   http.post("/api/lists", async ({ request }) => {
//     const { title, boardId, cardsOrder } = (await request.json()) as {
//       title: string;
//       boardId: number;
//       cardsOrder: number[];
//     };

//     const id = lists.length + 1;

//     const newList: List = {
//       id,
//       title,
//       boardId,
//       cardsOrder,
//     };

//     lists.push(newList);

//     const targetBoard = boards.find((b: Board) => b.id === Number(boardId));

//     targetBoard.listsOrder.push(id);

//     updateLocalStorage();

//     return HttpResponse.json(newList);
//   }),

//   http.get("/api/list/:listId", ({ params }) => {
//     const { listId } = params;

//     const result = cards.filter((c: Card) => c.listId === Number(listId));

//     return HttpResponse.json(result);
//   }),

//   http.put("/api/lists/:listId", async ({ request, params }) => {
//     const { listId } = params;

//     const { title, cardsOrder } = (await request.json()) as {
//       title: string;
//       cardsOrder: number[];
//     };

//     const result = lists.find((l: List) => l.id === Number(listId));

//     if (result) {
//       result.title = title;
//       result.cardsOrder = cardsOrder;
//     }

//     updateLocalStorage();

//     return HttpResponse.json(result);
//   }),

//   http.post("/api/cards", async ({ request }) => {
//     const { title, listId } = (await request.json()) as {
//       title: string;
//       listId: number;
//     };

//     const id = cards.length + 1;

//     const newCard: Card = { id, title, listId };

//     cards.push(newCard);

//     const targetList = lists.find((l: List) => l.id === newCard.listId);
//     targetList.cardsOrder.push(newCard.id);

//     updateLocalStorage();

//     return HttpResponse.json(newCard);
//   }),

//   http.put("/api/card/:cardId", async ({ request, params }) => {
//     const { cardId } = params;

//     const { listId } = (await request.json()) as {
//       listId: number;
//     };

//     const result = cards.find((c: Card) => c.id === Number(cardId));

//     if (result) {
//       result.listId = listId;
//     }

//     updateLocalStorage();

//     return HttpResponse.json(result);
//   }),
// ];
