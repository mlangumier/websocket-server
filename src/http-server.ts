import { createServer } from "http";

/**
 * Creates & configures the HttpServer that is running our app
 */
export const httpServer = createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Server is running\n`);
});
