import { Router, type Request, type Response } from "express";

import { requireAuth } from "../middleware/auth.js";
import { listMine, markAsRead } from "../services/notifications.service.js";
import { ok } from "../lib/response.js";

export const notificationsRouter: Router = Router();

notificationsRouter.get(
  "/mine",
  requireAuth,
  async (req: Request, res: Response) => {
    const { rows, unread } = await listMine(req.session.user!.id);
    res.json(ok({ notifications: rows, unread }));
  },
);

notificationsRouter.post(
  "/:id/read",
  requireAuth,
  async (req: Request, res: Response) => {
    await markAsRead(Number(req.params.id), req.session.user!.id);
    res.json(ok({}, "Ditandai sudah dibaca"));
  },
);
