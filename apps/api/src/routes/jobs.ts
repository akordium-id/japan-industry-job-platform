import { Router, type Request, type Response } from "express";

import { jobPostingSchema } from "@jijp/validators";

import { requireAuth } from "../middleware/auth.js";
import {
  findJobs,
  findJobById,
  insertJob,
  softDeleteJob,
} from "../repositories/jobs.repository.js";
import {
  findExisting,
  insert as insertApplication,
} from "../repositories/applications.repository.js";
import { notFound, badRequest, conflict, forbidden } from "../lib/errors.js";
import { ok, paginated } from "../lib/response.js";
import { notifyUser } from "../services/notifications.service.js";
import { findScoutCandidates } from "../repositories/users.repository.js";
import { toUserDto } from "../lib/userMapping.js";

export const jobsRouter: Router = Router();

jobsRouter.get("/", async (req: Request, res: Response) => {
  const specialization =
    typeof req.query.specialization === "string"
      ? req.query.specialization
      : undefined;
  const minJlpt =
    typeof req.query.minJlpt === "string" ? req.query.minJlpt : undefined;
  const location =
    typeof req.query.location === "string" ? req.query.location : undefined;
  const page = req.query.page ? Math.max(1, Number(req.query.page)) : undefined;
  const limit = req.query.limit
    ? Math.min(100, Math.max(1, Number(req.query.limit)))
    : undefined;

  const { rows, total } = await findJobs({ specialization, minJlpt, location });

  if (page && limit) {
    const offset = (page - 1) * limit;
    res.json(paginated(rows.slice(offset, offset + limit), page, limit, total));
    return;
  }

  res.json(paginated(rows, 1, rows.length || 1, total));
});

jobsRouter.post("/", requireAuth, async (req: Request, res: Response) => {
  const parsed = jobPostingSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validasi gagal", "VALIDATION_ERROR");

  const id = await insertJob({
    companyId: Number((req.body as { companyId?: number }).companyId),
    title: parsed.data.title,
    titleJp: null,
    description: parsed.data.description,
    requirements:
      (req.body as { requirements?: string }).requirements ??
      parsed.data.description,
    specialization: Array.isArray(parsed.data.requiredSpecializations)
      ? parsed.data.requiredSpecializations.join(",")
      : null,
    minJlpt: parsed.data.requiredJlptLevel ?? null,
    location: parsed.data.location,
    employmentType: (req.body as { employmentType?: string }).employmentType,
    salaryRange:
      parsed.data.salaryMin && parsed.data.salaryMax
        ? `${parsed.data.salaryMin}-${parsed.data.salaryMax}`
        : null,
    postedBy: req.session.user!.id,
  });
  res.status(201).json(ok({ id, ...parsed.data }));
});

jobsRouter.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const job = await findJobById(id);
  if (!job) throw notFound("Lowongan tidak ditemukan");
  if (
    job.posted_by !== req.session.user!.id &&
    req.session.user!.role !== "admin"
  ) {
    throw forbidden("Akses ditolak");
  }
  await softDeleteJob(id, req.session.user!.id);
  res.json(ok({}, "Lowongan berhasil dihapus (soft delete)"));
});

jobsRouter.post(
  "/:id/apply",
  requireAuth,
  async (req: Request, res: Response) => {
    const jobId = Number(req.params.id);
    const job = await findJobById(jobId);
    if (!job) throw notFound("Lowongan tidak ditemukan");
    if (!job.is_active)
      throw badRequest("Lowongan ini sudah ditutup atau tidak aktif");

    const existing = await findExisting(jobId, req.session.user!.id, "apply");
    if (existing) throw conflict("Anda sudah melamar posisi ini");

    const id = await insertApplication({
      jobId,
      userId: req.session.user!.id,
      type: "apply",
      status: "submitted",
      message: (req.body as { message?: string }).message ?? null,
    });

    if (job.posted_by) {
      await notifyUser({
        userId: job.posted_by,
        templateKey: "application_submitted",
        vars: {
          name: req.session.user!.name,
          jobTitle: job.title,
          message: (req.body as { message?: string }).message ?? "-",
        },
      });
    }
    res.status(201).json(ok({ id }, "Lamaran berhasil dikirim"));
  },
);

export const scoutRouter: Router = Router();

scoutRouter.post(
  "/jobs/:id/scout",
  requireAuth,
  async (req: Request, res: Response) => {
    await handleScout(req, res, Number(req.params.id));
  },
);

scoutRouter.post("/", requireAuth, async (req: Request, res: Response) => {
  const jobId = Number((req.body as { jobId?: number }).jobId);
  await handleScout(req, res, jobId);
});

async function handleScout(
  req: Request,
  res: Response,
  jobId: number,
): Promise<void> {
  const { candidateId, message } = req.body as {
    candidateId?: number;
    message?: string;
  };
  if (!candidateId) throw badRequest("candidateId wajib diisi");
  const job = await findJobById(jobId);
  if (!job) throw notFound("Lowongan tidak ditemukan");
  if (!job.is_active) throw badRequest("Lowongan ini sudah ditutup");
  if (!job.is_active) return;

  const { findById: findUserById } =
    await import("../repositories/users.repository.js");
  const candidate = await findUserById(candidateId);
  if (!candidate) throw notFound("Kandidat tidak ditemukan");
  if (!candidate.profile_verified) {
    throw badRequest("Hanya kandidat terverifikasi yang dapat di-scout");
  }

  const existing = await findExisting(jobId, candidateId, "scout");
  if (existing)
    throw conflict("Kandidat sudah pernah di-scout untuk posisi ini");

  const id = await insertApplication({
    jobId,
    userId: candidateId,
    type: "scout",
    status: "shortlisted",
    message: message ?? null,
  });

  await notifyUser({
    userId: candidateId,
    templateKey: "scout_received",
    vars: {
      jobTitle: job.title,
      company: req.session.user!.name,
      message: message ?? "-",
    },
    channel: "email",
  });

  res.status(201).json(ok({ id }, "Scout berhasil dikirim ke kandidat"));
}

scoutRouter.get(
  "/candidates",
  requireAuth,
  async (req: Request, res: Response) => {
    const specialization =
      typeof req.query.specialization === "string"
        ? req.query.specialization
        : undefined;
    const minJlpt =
      typeof req.query.minJlpt === "string" ? req.query.minJlpt : undefined;
    const rows = await findScoutCandidates({ specialization, minJlpt });
    res.json(ok(rows.map(toUserDto)));
  },
);

export const applicationsRouter: Router = Router();

applicationsRouter.get(
  "/mine",
  requireAuth,
  async (req: Request, res: Response) => {
    const { findByUser } =
      await import("../repositories/applications.repository.js");
    const rows = await findByUser(req.session.user!.id);
    res.json(ok(rows));
  },
);

applicationsRouter.get(
  "/jobs/:id/applications",
  requireAuth,
  async (req: Request, res: Response) => {
    const jobId = Number(req.params.id);
    const job = await findJobById(jobId);
    if (!job) throw notFound("Lowongan tidak ditemukan");
    if (
      job.posted_by !== req.session.user!.id &&
      req.session.user!.role !== "admin"
    ) {
      throw forbidden("Akses ditolak");
    }
    const { findByJob } =
      await import("../repositories/applications.repository.js");
    const rows = await findByJob(jobId);
    res.json(ok(rows));
  },
);

const VALID_DECISION_STATUSES = [
  "shortlisted",
  "accepted",
  "rejected",
  "withdrawn",
] as const;

applicationsRouter.post(
  "/:id/decide",
  requireAuth,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status, message } = req.body as {
      status?: string;
      message?: string;
    };
    if (!status || !VALID_DECISION_STATUSES.includes(status as never)) {
      throw badRequest("Status tidak valid");
    }
    const { findByIdWithDetails, updateStatus } =
      await import("../repositories/applications.repository.js");
    const app = await findByIdWithDetails(id);
    if (!app) throw notFound("Lamaran tidak ditemukan");
    if (
      app.posted_by !== req.session.user!.id &&
      req.session.user!.role !== "admin"
    ) {
      throw forbidden("Akses ditolak");
    }
    await updateStatus({
      id,
      status: status as "shortlisted",
      updatedBy: req.session.user!.id,
    });
    const statusLabels: Record<string, string> = {
      shortlisted: "Lolos Tahap Awal (Shortlisted)",
      accepted: "Diterima (Accepted)",
      rejected: "Tidak Lolos (Rejected)",
      withdrawn: "Dibatalkan",
    };
    await notifyUser({
      userId: app.user_id,
      templateKey: "application_decided",
      vars: {
        name: app.candidate_name,
        jobTitle: app.job_title,
        company: app.company_name ?? "Perusahaan",
        status: statusLabels[status] ?? status,
        message: message ?? "-",
      },
      channel: "email",
    });
    res.json(ok({}, `Status lamaran berhasil diperbarui menjadi ${status}`));
  },
);
