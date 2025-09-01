import { WebSocket } from "ws";
import { IPlayer } from "./types.js";

//TODO: create game moves variable ()
//TODO: note winning moves
const players = new Map<WebSocket, IPlayer>();

/**
 * When a user arrives on the website, adds them to the list of players if there aren't two players yet
 * @param playerName Name the player entered when entering the app
 * @returns the player's info
 */
const addPlayer = (client: WebSocket, playerName: string): IPlayer => {
  const player: IPlayer = {
    name: playerName,
    isPlaying: players.size !== 0,
    symbol: players.size === 0 ? "O" : "X",
  };

  players.set(client, player);
  return player;
};

//TODO: playerMove(IMove)
//TODO: checkIfWinningMove (from gameMoves >= 3)

const removePlayer = (client: WebSocket): void => {
  if (players.get(client)) {
    players.delete(client);
  }
};

export { addPlayer, removePlayer };
