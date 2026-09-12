import "dotenv/config";

import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { createServer } from "./server.js";

const app = createServer();

app.listen(env.PORT, () => {
  logger.info(
    `[api] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
});

const shutdown = (signal: string) => {
  logger.info(`[api] received ${signal}, closing`);
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
