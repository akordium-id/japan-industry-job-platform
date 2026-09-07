import { Router } from "express";

import { getPool } from "../db/pool.js";

export const healthRouter: Router = Router();

healthRouter.get("/", async (_req, res) => {
  try {
    await getPool().query("SELECT 1");
    res.json({ success: true, data: { status: "ok", db: "up" } });
  } catch {
    res
      .status(500)
      .json({ success: false, data: { status: "down", db: "down" } });
  }
});
