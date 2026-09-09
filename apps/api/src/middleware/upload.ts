import fs from "node:fs";
import path from "node:path";

import multer, { type FileFilterCallback } from "multer";
import type { Express, Request } from "express";

import { env } from "../config/env.js";

export const UPLOAD_ROOT = path.resolve(process.cwd(), env.UPLOAD_DIR);
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const ALLOWED_MIME: Record<string, readonly string[]> = {
  ktp: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  certificate: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  portfolio: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  transcript: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  badge: ["image/jpeg", "image/png", "image/webp"],
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const type =
      typeof req.body?.type === "string" ? req.body.type : "certificate";
    const dir = path.join(UPLOAD_ROOT, type);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80);
    const userId = req.session?.user?.id ?? "anon";
    cb(null, `${Date.now()}-${userId}-${safe}`);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  const type = typeof req.body?.type === "string" ? req.body.type : undefined;
  if (!type || !(type in ALLOWED_MIME)) {
    cb(new Error("Tipe dokumen tidak dikenal"));
    return;
  }
  const allowed = ALLOWED_MIME[type] ?? [];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Format file tidak diizinkan"));
    return;
  }
  cb(null, true);
}

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
  fileFilter,
});

export function safeResolveDocPath(relPath: string): string | null {
  const resolved = path.resolve(UPLOAD_ROOT, relPath);
  if (!resolved.startsWith(path.resolve(UPLOAD_ROOT) + path.sep)) {
    return null;
  }
  return resolved;
}
