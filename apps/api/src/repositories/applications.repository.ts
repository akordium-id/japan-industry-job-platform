import type { RowDataPacket, ResultSetHeader } from "mysql2";

import { getPool } from "../db/pool.js";

export interface JobApplicationRow extends RowDataPacket {
  id: number;
  job_id: number;
  user_id: number;
  type: "apply" | "scout";
  status: "submitted" | "shortlisted" | "rejected" | "accepted" | "withdrawn";
  message: string | null;
  created_at: Date;
  decided_at: Date | null;
  job_title?: string;
  company_name?: string;
  candidate_name?: string;
  candidate_email?: string;
  jlpt_level?: string | null;
  specialization?: string | null;
  origin_city?: string | null;
  posted_by?: number;
}

export async function findExisting(
  jobId: number,
  userId: number,
  type: "apply" | "scout",
): Promise<JobApplicationRow | null> {
  const [rows] = await getPool().query<JobApplicationRow[]>(
    "SELECT * FROM job_applications WHERE job_id = ? AND user_id = ? AND type = ?",
    [jobId, userId, type],
  );
  return rows[0] ?? null;
}

export async function insert(input: {
  jobId: number;
  userId: number;
  type: "apply" | "scout";
  status: "submitted" | "shortlisted";
  message?: string | null;
}): Promise<number> {
  const [result] = await getPool().query<ResultSetHeader>(
    "INSERT INTO job_applications (job_id, user_id, type, status, message) VALUES (?, ?, ?, ?, ?)",
    [
      input.jobId,
      input.userId,
      input.type,
      input.status,
      input.message ?? null,
    ],
  );
  return result.insertId;
}

export async function findByUser(userId: number): Promise<JobApplicationRow[]> {
  const [rows] = await getPool().query<JobApplicationRow[]>(
    `SELECT ja.*, jp.title as job_title, c.name as company_name
     FROM job_applications ja
     JOIN job_postings jp ON jp.id = ja.job_id
     LEFT JOIN companies c ON c.id = jp.company_id
     WHERE ja.user_id = ? ORDER BY ja.created_at DESC`,
    [userId],
  );
  return rows;
}

export async function findByJob(jobId: number): Promise<JobApplicationRow[]> {
  const [rows] = await getPool().query<JobApplicationRow[]>(
    `SELECT ja.*, u.name as candidate_name, u.email as candidate_email,
            u.jlpt_level, u.specialization, u.origin_city
     FROM job_applications ja
     JOIN users u ON u.id = ja.user_id
     WHERE ja.job_id = ? AND ja.deleted_at IS NULL
     ORDER BY ja.created_at DESC`,
    [jobId],
  );
  return rows;
}

export async function findByIdWithDetails(
  id: number,
): Promise<JobApplicationRow | null> {
  const [rows] = await getPool().query<JobApplicationRow[]>(
    `SELECT ja.*, jp.title as job_title, jp.posted_by, c.name as company_name, u.name as candidate_name
     FROM job_applications ja
     JOIN job_postings jp ON jp.id = ja.job_id
     LEFT JOIN companies c ON c.id = jp.company_id
     JOIN users u ON u.id = ja.user_id
     WHERE ja.id = ? AND ja.deleted_at IS NULL`,
    [id],
  );
  return rows[0] ?? null;
}

export async function updateStatus(input: {
  id: number;
  status: "submitted" | "shortlisted" | "rejected" | "accepted" | "withdrawn";
  updatedBy: number;
}): Promise<void> {
  await getPool().query(
    "UPDATE job_applications SET status = ?, decided_at = NOW(), updated_by = ? WHERE id = ?",
    [input.status, input.updatedBy, input.id],
  );
}

export async function countAll(): Promise<number> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM job_applications",
  );
  return rows[0] ? Number(rows[0].total) : 0;
}
