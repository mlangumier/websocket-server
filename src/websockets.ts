import { WebSocketServer, WebSocket } from "ws";
import { httpServer } from "./http-server.js";
import { addPlayer, initializeGame, playerMove, removePlayer } from "./game.js";
import { IRequest } from "./types.js";

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

  switch (message.type) {
    case "ADD_PLAYER":
      return addPlayer(ws, message.content);
    case "MOVE":
      return playerMove(ws, Number(message.content));
    default:
      console.error("Unknown action");
  }

  // Send message to all connected clients except the one who sent the message
};

// const sendDataToClients(type: IDataType, data) {
//     clients.forEach(client => {
//     if (client !== ws && client.readyState === WebSocket.OPEN)
//       // {type, players, board, winner?, currentTurn, message}
//       client.send(JSON.stringify(data));
//   });
// }

/**
 * Handles a client disconnecting from the WebSocket by removing them from the client list.
 * @param ws WebSocket client
 */
const handleClose = (client: WebSocket) => {
  removePlayer(client);
  console.log(`Client disconnected (currently ${wss.clients.size} players)`);
};

/**
 * Handles the error regarding WebSocket
 * @param error Generic error object
 */
const handleError = (error: Error) => {
  console.error(`WebSocket error: ${error?.cause}, ${error.message}`);
};
