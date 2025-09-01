import { WebSocket } from "ws";

interface IMessage {
  type: "PLAYER_NAME" | "MOVE";
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

const EMessageType = {
  gameStart: "GAME_START",
  update: "UPDATE",
  gameOver: "GAME_OVER",
  error: "ERROR",
};

type ISymbol = "X" | "O" | "NONE";

export { EMessageType, ISymbol, IMessage, IPlayer, IPlayerClient };
