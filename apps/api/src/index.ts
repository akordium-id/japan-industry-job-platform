import "dotenv/config";

import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { createServer } from "./server.js";
import {
  startDemoScheduler,
  stopDemoScheduler,
} from "./services/scheduler.service.js";

const app = createServer();

app.listen(env.PORT, () => {
  logger.info(
    `[api] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
  startDemoScheduler();
});

const shutdown = (signal: string) => {
  logger.info(`[api] received ${signal}, closing`);
  stopDemoScheduler();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
