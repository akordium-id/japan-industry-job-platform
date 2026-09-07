import fs from "node:fs";

import { Router, type Request, type Response } from "express";

import { requireAuth } from "../middleware/auth.js";
import { badRequest, notFound, forbidden } from "../lib/errors.js";
import { ok } from "../lib/response.js";
import { findById, softDelete } from "../repositories/documents.repository.js";
import {
  UPLOAD_ROOT,
  uploadMiddleware,
  safeResolveDocPath,
} from "../middleware/upload.js";
import { uploadLimiter } from "../middleware/rateLimit.js";
import { insert } from "../repositories/documents.repository.js";
import path from "node:path";
import { notifyAdminsDocumentSubmitted } from "../services/notifications.service.js";

export const documentsUploadRouter: Router = Router();

documentsUploadRouter.post(
  "/upload",
  requireAuth,
  uploadLimiter,
  uploadMiddleware.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) throw badRequest("File tidak ditemukan");
    const { type, title, issuedBy, issuedDate } = req.body as Record<
      string,
      string | undefined
    >;
    const userId = req.session.user!.id;
    const relPath = path.relative(UPLOAD_ROOT, req.file.path);
    const docTitle = title || req.file.originalname;
    const docId = await insert({
      userId,
      type: type ?? "certificate",
      title: docTitle,
      filePath: relPath,
      fileMime: req.file.mimetype,
      fileSize: req.file.size,
      issuedBy: issuedBy ?? null,
      issuedDate: issuedDate ?? null,
    });
    await notifyAdminsDocumentSubmitted({
      userName: req.session.user!.name,
      title: docTitle,
      type: type ?? "document",
    });
    res.status(201).json(ok({ id: docId }));
  },
);

export const documentsActionsRouter: Router = Router();

documentsActionsRouter.delete(
  "/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const doc = await findById(id);
    if (!doc) throw notFound("Dokumen tidak ditemukan");
    if (
      doc.user_id !== req.session.user!.id &&
      req.session.user!.role !== "admin"
    ) {
      throw forbidden("Akses ditolak");
    }
    await softDelete(id, req.session.user!.id);
    res.json(ok({}, "Dokumen dihapus"));
  },
);

const serveFileHandler = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    throw badRequest("ID dokumen tidak valid");
  const doc = await findById(id);
  if (!doc) throw notFound("Dokumen tidak ditemukan");
  if (
    doc.user_id !== req.session.user!.id &&
    req.session.user!.role !== "admin"
  ) {
    throw forbidden("Akses ditolak ke file ini");
  }
  const safePath = safeResolveDocPath(doc.file_path);
  if (!safePath || !fs.existsSync(safePath)) {
    throw notFound("File fisik tidak ditemukan pada server");
  }
  res.sendFile(safePath);
};

documentsActionsRouter.get("/file/:id", requireAuth, serveFileHandler);
documentsActionsRouter.get("/:id/file", requireAuth, serveFileHandler);
