import { WebSocketServer, WebSocket } from "ws";
import { httpServer } from "./http-server.js";
import { addPlayer, initializeGame, playerMove, removePlayer } from "./game.js";
import { IGame, IRequest } from "./types.js";

// Create WebSocket connection on the server
export const wss = new WebSocketServer({ server: httpServer });

// Manages the events of the WebSocket
wss.on("connection", (ws: WebSocket) => {
  handleConnection(ws);

  ws.on("message", (message: Buffer) => {
    handleMessage(ws, message);
  });

  ws.on("close", () => {
    handleClose(ws);
  });

  ws.on("error", (error: Error) => {
    handleError(error);
  });
});

/**
 * Handles the new client connection: sends the current game info to the client
 * @param ws WebSocket client
 */
const handleConnection = (ws: WebSocket) => {
  console.log(`Client connected (Current clients: ${wss.clients.size})`);
  const gameData = initializeGame();
  ws.send(JSON.stringify(gameData));
};

/**
 * Handles the messages sent by a client and sends it to the others
 * @param ws WebSocket client
 * @param message Message sent by a client, to be notified to the others
 */
const handleMessage = (ws: WebSocket, messageBuffer: Buffer) => {
  const message: IRequest = JSON.parse(messageBuffer.toString());
  console.log(message);
  let gameData: IGame;

  switch (message.type) {
    case "ADD_PLAYER":
      gameData = addPlayer(ws, message.content);
      ws.send(JSON.stringify(gameData)); // Send message to player with their player info

      delete gameData.message;
      sendDataToClients(ws, gameData, "EXCEPT_SENDER");
      break;
    case "MOVE":
      gameData = playerMove(Number(message.content));
      sendDataToClients(ws, gameData, "EVERYONE");
      break;
    default:
      throw new Error("Unknown action type");
  }
};

/**
 * Handles a client disconnecting from the WebSocket by removing them from the client list.
 * @param ws WebSocket client
 */
const handleClose = (client: WebSocket) => {
  const gameData: IGame | void = removePlayer(client);
  if (gameData) {
    sendDataToClients(client, gameData, "EVERYONE");
  }
  console.log(`Client disconnected (current clients: ${wss.clients.size})`);
};

/**
 * Handles the error regarding WebSocket
 * @param error Generic error object
 */
const handleError = (error: Error) => {
  console.error(`WebSocket error: ${error?.cause}, ${error.message}`);
};

/**
 * Sends data to all clients except the one who sent the action
 * @param ws Client who sent the message/action
 * @param data
 */
const sendDataToClients = (
  ws: WebSocket,
  gameData: IGame,
  sendTo: "EVERYONE" | "EXCEPT_SENDER"
) => {
wss.clients.forEach(client => {
  if (client.readyState !== WebSocket.OPEN) return;

  if (sendTo === "EXCEPT_SENDER" && client === ws) return; 

  client.send(JSON.stringify(gameData));
});

};
