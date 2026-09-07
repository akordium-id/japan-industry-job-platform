import type { NextFunction, Request, Response } from "express";

function sanitizeDeletedFields(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  if (data instanceof Date) return data.toISOString();
  if (Buffer.isBuffer(data)) return data;
  if (Array.isArray(data)) return data.map(sanitizeDeletedFields);
  const clean: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
  };
  delete clean.deleted_at;
  delete clean.deleted_by;
  for (const key of Object.keys(clean)) {
    if (clean[key] && typeof clean[key] === "object") {
      clean[key] = sanitizeDeletedFields(clean[key]);
    }
  }
  return clean;
}

export function jsonSanitizer(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    return originalJson(sanitizeDeletedFields(body));
  };
  next();
}
