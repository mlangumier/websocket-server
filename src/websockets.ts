import { WebSocketServer, WebSocket } from "ws";
import { httpServer } from "./http-server.js";
import { addPlayer, playerMove, removePlayer } from "./game.js";
import { IMessage, IPlayer } from "./types.js";

// Create WebSocket connection on the server
export const wss = new WebSocketServer({ server: httpServer });
const clients = new Set<WebSocket>();

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
 * Handles the new client connection: a player arrives on the page
 * @param ws WebSocket client
 */
const handleConnection = (ws: WebSocket) => {
  console.log(`Client connected (currently ${wss.clients.size} players)`);
  clients.add(ws);
  addPlayer(ws, ""); // TODO: auto-creates users -> Remove after testing
};

/**
 * Handles the messages sent by a client and sends it to the others
 * @param ws WebSocket client
 * @param message Message sent by a client, to be notified to the others
 */
const handleMessage = (ws: WebSocket, messageBuffer: Buffer) => {
  const message: IMessage = JSON.parse(messageBuffer.toString());
  let player: IPlayer;

  switch (message.type) {
    case "ADD_PLAYER":
      addPlayer(ws, message.content);
      // sendDataToClients("NEW_PLAYER", player);
      break;
    case "MOVE":
      playerMove(ws, Number(message.content));
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
