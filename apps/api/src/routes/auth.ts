import { Router, type Request, type Response } from "express";
import { loginSchema, registerSchema } from "@jijp/validators";

import { authLimiter } from "../middleware/rateLimit.js";
import {
  loginLocal,
  registerLocal,
  validateSsoToken,
} from "../services/auth.service.js";
import { badRequest, unauthorized } from "../lib/errors.js";
import { ok, fail } from "../lib/response.js";

export const authRouter: Router = Router();

authRouter.post("/login", authLimiter, async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(fail("Validasi gagal", "VALIDATION_ERROR"));
    return;
  }
  const { email, password } = parsed.data;
  const user = await loginLocal(email, password);
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  res.json(ok({ user: req.session.user }, "Login berhasil"));
});

authRouter.post(
  "/register",
  authLimiter,
  async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(fail("Validasi gagal", "VALIDATION_ERROR"));
      return;
    }
    const created = await registerLocal({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role,
    });
    req.session.user = created;
    res.status(201).json(ok({ user: created }, "Registrasi berhasil"));
  },
);

authRouter.post("/sso/callback", async (req: Request, res: Response) => {
  const token =
    typeof req.query.token === "string" ? req.query.token : req.body?.token;
  if (!token) throw badRequest("Token missing");
  const result = await validateSsoToken(token);
  req.session.user = result;
  res.json(ok({ user: result }, "SSO login berhasil"));
});

authRouter.get("/me", (req: Request, res: Response) => {
  if (!req.session.user) throw unauthorized("Tidak ada sesi aktif.");
  res.json(ok({ user: req.session.user }));
});

authRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) throw badRequest("Gagal logout");
    res.clearCookie("connect.sid");
    res.json(ok({}, "Logout berhasil"));
  });
});
