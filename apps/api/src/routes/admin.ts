import { Router, type Request, type Response } from "express";

import { requireRole } from "../middleware/auth.js";
import {
  countByStatus,
  findPendingWithOwner,
  batchUpdateVerification,
  updateVerification,
} from "../repositories/documents.repository.js";
import { countActiveJobs } from "../repositories/jobs.repository.js";
import { countAll } from "../repositories/applications.repository.js";
import { ok } from "../lib/response.js";
import { badRequest, notFound } from "../lib/errors.js";
import { findById } from "../repositories/documents.repository.js";
import { notifyUser } from "../services/notifications.service.js";
import { findByEmail } from "../repositories/users.repository.js";

export const adminRouter: Router = Router();

const getStudentCount = async (): Promise<number> => {
  const { getPool } = await import("../db/pool.js");
  const [rows] = await getPool().query<
    { total: number }[] & import("mysql2").RowDataPacket[]
  >('SELECT COUNT(*) as total FROM users WHERE role = "student"');
  return rows[0] ? Number(rows[0].total) : 0;
};

adminRouter.get(
  "/pending-documents",
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    const docs = await findPendingWithOwner();
    res.json(ok(docs));
  },
);

adminRouter.get(
  "/documents/pending",
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    const docs = await findPendingWithOwner();
    res.json(ok(docs));
  },
);

adminRouter.post(
  "/documents/:id/decide",
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { action, notes } = req.body as { action?: string; notes?: string };
    if (action !== "approved" && action !== "rejected") {
      throw badRequest("action harus 'approved' atau 'rejected'");
    }
    await updateVerification({
      id,
      status: action,
      notes: notes ?? null,
      verifiedBy: req.session.user!.id,
    });
    const doc = await findById(id);
    if (doc) {
      const user = await findByEmail(doc.user_id.toString()).catch(() => null);
      void user;
      await notifyUser({
        userId: doc.user_id,
        templateKey:
          action === "approved" ? "document_approved" : "document_rejected",
        vars: { title: doc.title, type: doc.type, notes: notes ?? "-" },
        channel: "email",
      });
    }
    res.json(ok({}, `Dokumen ${action}`));
  },
);

adminRouter.post(
  "/documents/batch-decide",
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const { ids, action } = req.body as { ids?: number[]; action?: string };
    if (!Array.isArray(ids) || ids.length === 0) {
      throw badRequest("IDs wajib berupa array non-kosong");
    }
    await batchUpdateVerification({
      ids,
      status: action ?? "approved",
      verifiedBy: req.session.user!.id,
    });
    res.json(ok({}, `Batch ${ids.length} dokumen ${action}`));
  },
);

adminRouter.get(
  "/stats",
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    const [
      totalStudents,
      pendingDocs,
      approvedDocs,
      activeJobs,
      totalApplications,
    ] = await Promise.all([
      getStudentCount(),
      countByStatus("pending"),
      countByStatus("approved"),
      countActiveJobs(),
      countAll(),
    ]);
    res.json(
      ok({
        totalStudents,
        pendingDocs,
        approvedDocs,
        activeJobs,
        totalApplications,
      }),
    );
  },
);

void notFound;
