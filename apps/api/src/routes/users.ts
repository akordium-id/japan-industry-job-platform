import { Router, type Request, type Response } from "express";

import { requireAuth } from "../middleware/auth.js";
import { getMe } from "../services/auth.service.js";
import { toUserDto } from "../lib/userMapping.js";
import { notFound } from "../lib/errors.js";
import { ok } from "../lib/response.js";

export const usersRouter: Router = Router();

usersRouter.get("/me", requireAuth, async (req: Request, res: Response) => {
  const user = await getMe(req.session.user!.id);
  if (!user) throw notFound("User tidak ditemukan");
  res.json(ok(toUserDto(user)));
});

usersRouter.put("/me", requireAuth, async (req: Request, res: Response) => {
  const { updateProfile } = await import("../repositories/users.repository.js");
  await updateProfile(req.session.user!.id, req.body);
  const user = await getMe(req.session.user!.id);
  res.json(ok(toUserDto(user!)));
});
