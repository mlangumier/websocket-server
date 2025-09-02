import { WebSocket } from "ws";

type IMessageType = "GAME_START" | "UPDATE" | "GAME_OVER" | "ERROR";
type ISymbol = "X" | "O" | "NONE";

interface IRequest {
  type: "ADD_PLAYER" | "MOVE";
  content: string;
}

interface IPlayer {
  name: string;
  symbol: ISymbol;
}

interface IPlayerClient {
  client: WebSocket;
  player: IPlayer;
}

interface IResponse {
  type: IMessageType;
  players: {
    player1: IPlayer | null;
    player2: IPlayer | null;
  };
  board: (ISymbol | null)[];
  winner?: string;
  currentTurn?: string;
  message?: string;
}

export { IMessageType, ISymbol, IRequest, IPlayer, IPlayerClient, IResponse };
