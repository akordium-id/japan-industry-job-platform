import type { RowDataPacket } from "mysql2";

import { getPool } from "../db/pool.js";

export interface CourseRow extends RowDataPacket {
  id: number;
  title: string;
  title_jp: string | null;
  description: string | null;
  phase: number;
  educator_id: number | null;
  is_active: number;
}

export interface EnrollmentRow extends RowDataPacket {
  id: number;
  user_id: number;
  course_id: number;
  progress_pct: number;
  status: string;
  started_at: Date | null;
  completed_at: Date | null;
  title?: string;
  phase?: number;
}

export async function findActiveCourses(): Promise<CourseRow[]> {
  const [rows] = await getPool().query<CourseRow[]>(
    "SELECT * FROM courses WHERE is_active = 1 AND deleted_at IS NULL ORDER BY phase ASC, id ASC",
  );
  return rows;
}

export async function findProgress(userId: number): Promise<EnrollmentRow[]> {
  const [rows] = await getPool().query<EnrollmentRow[]>(
    `SELECT ce.id, ce.course_id, c.title, c.phase, ce.progress_pct, ce.status, ce.started_at, ce.completed_at
     FROM course_enrollments ce
     JOIN courses c ON ce.course_id = c.id
     WHERE ce.user_id = ?`,
    [userId],
  );
  return rows;
}

export async function enroll(userId: number, courseId: number): Promise<void> {
  await getPool().query(
    `INSERT INTO course_enrollments (user_id, course_id, status, started_at)
     VALUES (?, ?, 'enrolled', NOW())
     ON DUPLICATE KEY UPDATE status = status`,
    [userId, courseId],
  );
}

export async function upsertProgress(input: {
  userId: number;
  courseId: number;
  progressPct: number;
  status: string;
  completedAt: Date | null;
}): Promise<void> {
  await getPool().query(
    `INSERT INTO course_enrollments (user_id, course_id, progress_pct, status, started_at, completed_at)
     VALUES (?, ?, ?, ?, NOW(), ?)
     ON DUPLICATE KEY UPDATE
       progress_pct = VALUES(progress_pct),
       status = VALUES(status),
       completed_at = VALUES(completed_at)`,
    [
      input.userId,
      input.courseId,
      input.progressPct,
      input.status,
      input.completedAt,
    ],
  );
}
