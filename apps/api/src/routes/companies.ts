import { Router, type Request, type Response } from "express";

import { ok } from "../lib/response.js";
import {
  findAllCompanies,
  insertCompany,
} from "../repositories/jobs.repository.js";
import { requireAuth } from "../middleware/auth.js";
import { badRequest } from "../lib/errors.js";

export const companiesRouter: Router = Router();

companiesRouter.get("/", async (_req: Request, res: Response) => {
  const companies = await findAllCompanies();
  res.json(ok(companies));
});

companiesRouter.post("/", requireAuth, async (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name) throw badRequest("Nama perusahaan wajib diisi");
  const id = await insertCompany({
    name,
    nameJp: (req.body as { nameJp?: string }).nameJp,
    industry: (req.body as { industry?: string }).industry,
    website: (req.body as { website?: string }).website,
    description: (req.body as { description?: string }).description,
    contactEmail: (req.body as { contactEmail?: string }).contactEmail,
    createdBy: req.session.user!.id,
  });
  res.status(201).json(ok({ id, name }));
});
