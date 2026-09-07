import { Router, type Request, type Response } from "express";

import { requireAuth } from "../middleware/auth.js";
import {
  findEvents,
  insertEvent,
  softDeleteEvent,
} from "../repositories/calendar.repository.js";
import { badRequest } from "../lib/errors.js";
import { ok } from "../lib/response.js";

export const calendarRouter: Router = Router();

calendarRouter.get("/", async (req: Request, res: Response) => {
  const from = typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;
  const type = typeof req.query.type === "string" ? req.query.type : undefined;
  const events = await findEvents({ from, to, type });
  res.json(ok(events));
});

calendarRouter.get("/events", async (req: Request, res: Response) => {
  const from = typeof req.query.from === "string" ? req.query.from : undefined;
  const to = typeof req.query.to === "string" ? req.query.to : undefined;
  const type = typeof req.query.type === "string" ? req.query.type : undefined;
  const events = await findEvents({ from, to, type });
  res.json(ok(events));
});

calendarRouter.post(
  "/events",
  requireAuth,
  async (req: Request, res: Response) => {
    const { title, title_jp, description, start_at, end_at, type, visibility } =
      req.body as Record<string, string | undefined>;
    if (!title || !start_at || !end_at) {
      throw badRequest("Title, start_at, and end_at are required");
    }
    const created = await insertEvent({
      title,
      titleJp: title_jp,
      description,
      startAt: start_at,
      endAt: end_at,
      type: type ?? "class",
      visibility: visibility ?? "student",
      createdBy: req.session.user!.id,
    });
    res.status(201).json(ok(created));
  },
);

calendarRouter.delete(
  "/events/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await softDeleteEvent(id, req.session.user!.id);
    res.json(ok({}, "Event berhasil dihapus"));
  },
);
