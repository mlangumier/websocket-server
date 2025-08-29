import dotenv from "dotenv";
import { httpServer } from "./http-server.js";
import "./websockets.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ debug: true });
}

// Use HOSTNAME and PORT from .env in development, fallback to 0.0.0.0 for production
const HOSTNAME: string = process.env.HOSTNAME || "0.0.0.0";
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 8080;

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});

// Close server
httpServer.on("close", () => {
  console.log(`Server shut down`);
});

// Server monitoring
httpServer.on("error", (error: Error) => {
  console.error(
    `Server error "${error.name}": ${error?.cause}, ${error.message}`
  );
});
