import { WebSocket } from "ws";
import { IPlayer, ISymbol, IGame } from "./types.js";

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
let client1: WebSocket | null = null;
let client2: WebSocket | null = null;
let gameData: IGame = {
  type: "PENDING",
  board: board,
  players: {
    player1: null,
    player2: null,
  },
};

/**
 * Initializes the game with the current data when a client enters the page
 * @returns The current state of the game
 */
export const initializeGame = (): IGame => {
  return { ...gameData, type: "UPDATE" };
};

/**
 * When a user arrives on the website, adds them to the list of players if there aren't two players yet
 * @param client WebSocket client of the user
 * @param playerName Name of the user (input)
 * @returns the user's info
 */
export const addPlayer = (client: WebSocket, playerName: string): IGame => {
  let newPlayer: IPlayer;

  if (gameData.players.player1 && gameData.players.player2) {
    client.send(
      JSON.stringify({
        ...gameData,
        type: "ERROR",
        message: "Can't create any new players.",
      })
    );
  }

  // Create player1 & player2 if they don't exist yet
  if (gameData.players.player1 === null) {
    newPlayer = { name: playerName, symbol: "O" };
    gameData.players.player1 = newPlayer;
    client1 = client;
  } else {
    newPlayer = { name: playerName, symbol: "X" };
    gameData.players.player2 = newPlayer;
    client2 = client;
  }

  if (client1 && client2) {
    return {
      ...gameData,
      type: "GAME_START",
      currentTurn: gameData.players.player1.name,
    };
  }
  return {
    ...gameData,
    type: "PLAYER_INFO",
    message: newPlayer,
  };
};

/**
 * Get the user's move, records it and check if it creates a win.
 * @param client WebSocket client of the user
 * @param move Where the user clicked to play their turn
 * @returns the game's information
 */
export const playerMove = (moveId: number): IGame => {
  const { player1, player2 } = gameData.players;

  if (!player1 || !player2) {
    throw new Error("Playing missing. Can't register move.");
  }
  const currentPlayer: IPlayer =
    gameData.currentTurn === player1.name ? player1 : player2;

  // Add move to the board with the player's symbol if box isn't already checked
  if (board[moveId] !== null) {
    board.splice(moveId, 0, currentPlayer.symbol);
  } else {
    throw new Error(`Square ${moveId} already taken`);
  }

  // Check winning combinaison or draw (array length)
  if (calculateWinner()) {
    console.log(`WINNER: ${currentPlayer.name}`);

    return {
      ...gameData,
      type: "GAME_OVER",
      winner: gameData.currentTurn,
      message: { move: moveId },
    };
  }

  // Check if board full & declare draw
  if (isBoardFull()) {
    return {
      ...gameData,
      type: "GAME_OVER",
      message: "Draw!",
    };
  }

  return {
    ...gameData,
    type: "UPDATE",
    currentTurn:
      currentPlayer.name === player1.name ? player2.name : player1.name,
    message: { movie: moveId },
  };
};

/**
 * Deletes the disconnected user from the list of players (if present).
 * @param client WebSocket client of the user
 */
export const removePlayer = (client: WebSocket): IGame | void => {
  if (client === client1) {
    gameData.players.player1 = null;
    return {
      ...gameData,
      type: "GAME_OVER",
      message: "Player1 disconnected from game",
    };
  } else if (client === client2) {
    gameData.players.player2 = null;
    return {
      ...gameData,
      type: "GAME_OVER",
      message: "Player1 disconnected from game",
    };
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
