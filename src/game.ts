import { WebSocket } from "ws";
import { IPlayer, ISymbol, IPlayerClient } from "./types.js";

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let board = new Array<ISymbol | null>(9).fill(null);
let player1: IPlayerClient | null = null;
let player2: IPlayerClient | null = null;

const createPlayer = (
  ws: WebSocket,
  name: string,
  symbol: ISymbol
): IPlayerClient => {
  return {
    client: ws,
    player: { name: name, symbol: symbol },
  };
};
/**
 * When a user arrives on the website, adds them to the list of players if there aren't two players yet
 * @param client WebSocket client of the user
 * @param playerName Name of the user (input)
 * @returns the user's info
 */
const addPlayer = (client: WebSocket, playerName: string): IPlayer => {
  if (player1 && player2) {
    client.send(
      JSON.stringify({
        type: "ERROR",
        message: "Can't create any new players.",
      })
    );
  }
  const playerInfo: IPlayerClient = createPlayer(
    client,
    playerName,
    player1 !== null ? "O" : "X"
  );

  // Create player1 & player2 if they don't exist yet
  if (player1 === null) {
    player1 = playerInfo;
  } else player2 ??= playerInfo;

  // Send message to client with player's game info
  client.send(
    JSON.stringify({ type: "PLAYER_INFO", message: playerInfo.player })
  );

  return playerInfo.player;
};

/**
 * Get the user's move, records it and check if it creates a win.
 * @param client WebSocket client of the user
 * @param move Where the user clicked to play their turn
 * @returns (TBD)
 */
const playerMove = (client: WebSocket, moveId: number) => {
  let playerInfo: IPlayerClient;

  if (client === player1?.client) playerInfo = player1;
  else if (client === player2?.client) playerInfo = player2;
  else throw new Error("Player not found");

  if (!playerInfo) {
    console.error("No player found");
    throw new Error("Client doesn't match any existing player.");
  }

  // Add move to the board with the player's symbol if box isn't already checked
  if (board[moveId] !== null) {
    board.splice(moveId, 0, playerInfo.player.symbol);
  } else {
    console.log(`Wrong box`);
    return;
  }

  // Check winning combinaison or draw (array length)
  const isWinner: boolean = calculateWinner();

  if (isWinner) {
    console.log(`WINNER: ${playerInfo.player.name}`);
    return {
      players: { player1, player2 },
      moveId,
      board,
      isWinner: playerInfo.player.name,
    };
  }

  // Check if board full & declare draw
  if (isBoardFull()) {
    console.log(`DRAW!`);
  }

  return {
    type: "",
    board,
    winner: isWinner ?? playerInfo.player.name,
    currentTurn:
      playerInfo === player1 ? player2?.player.name : player1?.player.name,
    message: moveId,
  };
};

/**
 * Deletes the disconnected user from the list of players (if present).
 * @param client WebSocket client of the user
 */
const removePlayer = (client: WebSocket) => {
  if (player1 && player2) {
    if (player1.client === client) {
      player1 = null;
      return "Player has left the game";
    } else if (player2.client === client) {
      player2 = null;
      return "Player has left the game";
    }
  }
};

/**
 * Checks the board and the last player move to determine if it the player has won.
 * @returns true if the player played a winning move
 */
const calculateWinner = () => {
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // return board[a];
      console.log("Winner: " + board[a]);
      return true;
    }
  }
  return false;
};

/**
 * Checks if the board is full (no more moves possible)
 * @returns true if the board is full
 */
const isBoardFull = () => {
  return board.every(cell => cell !== null);
};

//TODO: message type "GAME_START" -> 2 players ready, game can start
//TODO: message type "UPDATE" ->
export { addPlayer, removePlayer, playerMove };
