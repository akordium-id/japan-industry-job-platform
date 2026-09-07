import { Router, type Request, type Response } from "express";

import { requireAuth } from "../middleware/auth.js";
import { cvLimiter } from "../middleware/rateLimit.js";
import { streamCvPdf } from "../services/cv.service.js";
import { getMe } from "../services/auth.service.js";
import { notFound, forbidden } from "../lib/errors.js";

export const cvRouter: Router = Router();

cvRouter.get(
  "/export",
  requireAuth,
  cvLimiter,
  async (req: Request, res: Response) => {
    const u = await getMe(req.session.user!.id);
    if (!u) throw notFound("User tidak ditemukan");
    streamCvPdf(
      {
        name: u.name,
        nameJp: u.name_jp,
        email: u.email,
        phone: u.phone,
        originCity: u.origin_city,
        jlptLevel: u.jlpt_level,
        specialization: u.specialization,
        education: u.education_json as never,
        experience: u.experience_json as never,
        bioId: u.bio_id,
        bioJp: u.bio_jp,
      },
      res,
    );
  },
);

cvRouter.get(
  "/export/:candidateId",
  requireAuth,
  cvLimiter,
  async (req: Request, res: Response) => {
    const { findById } = await import("../repositories/users.repository.js");
    const cid = Number(req.params.candidateId);
    const u = await findById(cid);
    if (!u) throw notFound("Kandidat tidak ditemukan");
    if (req.session.user!.role === "corporate" && !u.profile_verified) {
      throw forbidden("Akses ditolak: profil kandidat belum diverifikasi");
    }
    streamCvPdf(
      {
        name: u.name,
        nameJp: u.name_jp,
        email: u.email,
        phone: u.phone,
        originCity: u.origin_city,
        jlptLevel: u.jlpt_level,
        specialization: u.specialization,
        education: u.education_json as never,
        experience: u.experience_json as never,
        bioId: u.bio_id,
        bioJp: u.bio_jp,
      },
      res,
    );
  },
);
