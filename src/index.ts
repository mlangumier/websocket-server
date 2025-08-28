import { createServer } from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ debug: true });
}

const HOSTNAME = process.env.HOSTNAME ?? "127.0.0.1";
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// Init server for hosting platform
const server = createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`WebSocket server is running\n`);
});

// Attach WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket events
wss.on("connection", ws => {
  console.log(`Client connected`);

  ws.on("message", message => {
    const text = (message as Buffer).toString();
    console.log(`Received message: ${text}`);
    ws.send(`Echo: ${text}`);
  });

  ws.on("close", () => {
    console.log(`Client disconnected`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on https://${HOSTNAME}:${PORT}`);
});

// Server monitoring
server.on("error", error => {
  console.error(`Server error: ${error.cause}, ${error.message}`);
});
server.on("close", () => {
  console.log(`Server shut down`);
});
