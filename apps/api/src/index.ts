import "dotenv/config";
import { createServer } from "./server.js";
import { env } from "./config/env.js";

const app = createServer();

app.listen(env.PORT, () => {
  console.log(
    `[api] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
});

const shutdown = (signal: string) => {
  console.log(`[api] received ${signal}, closing`);
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
