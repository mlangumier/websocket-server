type IMessageType =
  | "GAME_START"
  | "PLAYER_INFO"
  | "UPDATE"
  | "GAME_OVER"
  | "ERROR"
  | "PENDING";

type ISymbol = "X" | "O" | "NONE";

interface IRequest {
  type: "ADD_PLAYER" | "MOVE";
  content: string;
}

interface IPlayer {
  name: string;
  symbol: ISymbol;
}

interface IGame {
  type: IMessageType;
  players: {
    player1: IPlayer | null;
    player2: IPlayer | null;
  };
  board: (ISymbol | null)[];
  winner?: string;
  currentTurn?: string;
  message?: {};
}

export { IMessageType, ISymbol, IRequest, IPlayer, IGame };
