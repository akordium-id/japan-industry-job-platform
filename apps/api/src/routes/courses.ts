import { Router, type Request, type Response } from "express";

import { requireAuth } from "../middleware/auth.js";
import {
  findActiveCourses,
  findProgress,
  enroll,
  upsertProgress,
} from "../repositories/courses.repository.js";
import { badRequest } from "../lib/errors.js";
import { ok } from "../lib/response.js";

export const coursesRouter: Router = Router();

coursesRouter.get("/", async (_req: Request, res: Response) => {
  const courses = await findActiveCourses();
  res.json(ok(courses));
});

coursesRouter.get(
  "/progress/mine",
  requireAuth,
  async (req: Request, res: Response) => {
    const rows = await findProgress(req.session.user!.id);
    res.json(ok(rows));
  },
);

coursesRouter.get(
  "/me/progress",
  requireAuth,
  async (req: Request, res: Response) => {
    const rows = await findProgress(req.session.user!.id);
    res.json(ok(rows));
  },
);

coursesRouter.post(
  "/:id/enroll",
  requireAuth,
  async (req: Request, res: Response) => {
    const courseId = Number(req.params.id);
    await enroll(req.session.user!.id, courseId);
    res.json(ok({}, "Berhasil mendaftar kursus"));
  },
);

coursesRouter.put(
  "/:id/progress",
  requireAuth,
  async (req: Request, res: Response) => {
    const courseId = Number(req.params.id);
    const { progress_pct } = req.body as { progress_pct?: number };
    const pct = Math.min(100, Math.max(0, Number(progress_pct) || 0));
    const status =
      pct === 100 ? "completed" : pct > 0 ? "in_progress" : "enrolled";
    const completedAt = pct === 100 ? new Date() : null;
    await upsertProgress({
      userId: req.session.user!.id,
      courseId,
      progressPct: pct,
      status,
      completedAt,
    });
    res.json(ok({}, "Progress kursus berhasil diperbarui"));
  },
);

void badRequest;
