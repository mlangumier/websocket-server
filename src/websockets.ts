import { WebSocketServer, WebSocket } from "ws";
import { httpServer } from "./http-server.js";

// Create WebSocket connection on the server
export const wss = new WebSocketServer({ server: httpServer });

// Manages the events of the WebSocket
wss.on("connection", ws => {
  handleConnection();

  ws.on("message", (message: Buffer) => {
    handleMessage(ws, message);
  });

  ws.on("close", () => {
    handleClose();
  });

  ws.on("error", (error: Error) => {
    handleError(error);
  });
});

/**
 * Handles the new client connection.
 * @param ws WebSocket client
 */
const handleConnection = () => {
  console.log(`Client connected (currently ${wss.clients.size} players)`);
};

/**
 * Handles the messages sent by a client and sends it to the others
 * @param ws WebSocket client
 * @param message Message sent by a client, to be notified to the others
 */
const handleMessage = (ws: WebSocket, message: Buffer) => {
  console.log(`Received message: ${message}`);
  // TODO: Setup a message type for SWITCH/CASE & functions for each type of message (game move, chat message, etc.)

  const text = message.toString();

  // Send message to all connected clients except the one who sent the message
  wss.clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN)
      client.send(`Echo: ${text}`);
  });
};

/**
 * Handles a client disconnecting from the WebSocket by removing them from the client list.
 * @param ws WebSocket client
 */
const handleClose = () => {
  console.log(`Client disconnected (currently ${wss.clients.size} players)`);
};

/**
 * Handles the error regarding WebSocket
 * @param error Generic error object
 */
const handleError = (error: Error) => {
  console.error(`WebSocket error: ${error?.cause}, ${error.message}`);
};
