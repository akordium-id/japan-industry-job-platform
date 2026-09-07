import { Router, type Request, type Response } from "express";
import { idParamSchema } from "@jijp/validators";

import { requireAuth } from "../middleware/auth.js";
import { getMe } from "../services/auth.service.js";
import { toUserDto } from "../lib/userMapping.js";
import { notFound } from "../lib/errors.js";
import { ok } from "../lib/response.js";
import { findById } from "../repositories/users.repository.js";

export const candidatesRouter: Router = Router();

candidatesRouter.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const result = idParamSchema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ success: false, error: "Invalid id" });
      return;
    }
    void getMe;
    const user = await findById(result.data.id);
    if (!user) throw notFound("Kandidat tidak ditemukan");
    res.json(ok(toUserDto(user)));
  },
);
