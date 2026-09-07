import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { fail } from "../lib/response.js";
import { HttpError } from "../lib/errors.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res
      .status(400)
      .json(fail("Validation failed", "VALIDATION_ERROR", err.flatten()));
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json(fail(err.message, err.code, err.details));
    return;
  }

  if (err && typeof err === "object" && "type" in err) {
    const e = err as { type?: string; status?: number; message?: string };
    if (e.type === "entity.too.large") {
      res.status(413).json(fail("Payload terlalu besar", "PAYLOAD_TOO_LARGE"));
      return;
    }
    if (e.type === "entity.parse.failed") {
      res.status(400).json(fail("Invalid JSON body", "BAD_REQUEST"));
      return;
    }
  }

  console.error("[api] unhandled error:", err);

  res.status(500).json(fail("Internal Server Error", "INTERNAL_ERROR"));
};
