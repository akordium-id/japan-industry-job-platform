import pino from "pino";
import { pinoHttp } from "pino-http";
import { req, res } from "pino-std-serializers";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req,
    res,
  },
});
