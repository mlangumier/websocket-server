type ISymbol = "X" | "O" | "NONE";

interface IMessage {
  type: "PLAYER_NAME" | "MOVE";
}

interface IPlayer {
  name: string;
  symbol: "X" | "O" | "NONE";
  isPlaying: boolean;
}

interface IMove {
  col: string;
  row: string;
  symbol: ISymbol;
}

interface IRequest {}
interface IResponse {}

export { IMessage, IPlayer, IMove };
