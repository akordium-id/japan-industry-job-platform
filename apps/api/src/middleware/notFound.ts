import type { RequestHandler } from "express";

import { fail } from "../lib/response.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res
    .status(404)
    .json(fail(`Route not found: ${req.method} ${req.path}`, "NOT_FOUND"));
};
