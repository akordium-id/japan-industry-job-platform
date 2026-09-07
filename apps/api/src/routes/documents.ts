import { Router, type Request, type Response } from "express";

import { requireAuth } from "../middleware/auth.js";
import { findByUser } from "../repositories/documents.repository.js";
import { ok } from "../lib/response.js";

export const documentsRouter: Router = Router();

documentsRouter.get(
  "/mine",
  requireAuth,
  async (req: Request, res: Response) => {
    const rows = await findByUser(req.session.user!.id);
    res.json(ok(rows));
  },
);
