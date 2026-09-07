import type { RowDataPacket, ResultSetHeader } from "mysql2";

import { getPool } from "../db/pool.js";

export interface DocumentRow extends RowDataPacket {
  id: number;
  user_id: number;
  type: string;
  title: string;
  file_path: string;
  file_mime: string;
  file_size_bytes: number;
  issued_by: string | null;
  issued_date: string | null;
  verification_status: "pending" | "approved" | "rejected";
  verification_notes: string | null;
  verified_by: number | null;
  verified_at: Date | null;
  created_at: Date;
  user_name?: string;
  user_email?: string;
}

export async function findByUser(userId: number): Promise<DocumentRow[]> {
  const [rows] = await getPool().query<DocumentRow[]>(
    "SELECT * FROM documents WHERE user_id = ? AND deleted_at IS NULL ORDER BY id DESC",
    [userId],
  );
  return rows;
}

export async function findById(id: number): Promise<DocumentRow | null> {
  const [rows] = await getPool().query<DocumentRow[]>(
    "SELECT * FROM documents WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  return rows[0] ?? null;
}

export async function findPendingWithOwner(): Promise<DocumentRow[]> {
  const [rows] = await getPool().query<DocumentRow[]>(
    `SELECT d.*, u.name as user_name, u.email as user_email
     FROM documents d
     JOIN users u ON u.id = d.user_id
     WHERE d.verification_status = 'pending' AND d.deleted_at IS NULL
     ORDER BY d.created_at ASC`,
  );
  return rows;
}

export async function insert(input: {
  userId: number;
  type: string;
  title: string;
  filePath: string;
  fileMime: string;
  fileSize: number;
  issuedBy?: string | null;
  issuedDate?: string | null;
}): Promise<number> {
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO documents (user_id, type, title, file_path, file_mime, file_size_bytes, issued_by, issued_date, verification_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      input.userId,
      input.type,
      input.title,
      input.filePath,
      input.fileMime,
      input.fileSize,
      input.issuedBy ?? null,
      input.issuedDate ?? null,
    ],
  );
  return result.insertId;
}

export async function softDelete(id: number, byUserId: number): Promise<void> {
  await getPool().query(
    "UPDATE documents SET deleted_at = NOW(), deleted_by = ? WHERE id = ?",
    [byUserId, id],
  );
}

export async function updateVerification(input: {
  id: number;
  status: string;
  notes: string | null;
  verifiedBy: number;
}): Promise<void> {
  await getPool().query(
    `UPDATE documents
     SET verification_status = ?, verification_notes = ?, verified_by = ?, verified_at = NOW()
     WHERE id = ?`,
    [input.status, input.notes, input.verifiedBy, input.id],
  );
}

export async function batchUpdateVerification(input: {
  ids: number[];
  status: string;
  verifiedBy: number;
}): Promise<void> {
  for (const id of input.ids) {
    await getPool().query(
      `UPDATE documents
       SET verification_status = ?, verified_by = ?, verified_at = NOW()
       WHERE id = ?`,
      [input.status, input.verifiedBy, id],
    );
  }
}

export async function countByStatus(
  status: "pending" | "approved" | "rejected",
): Promise<number> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM documents WHERE verification_status = ? AND deleted_at IS NULL`,
    [status],
  );
  const first = rows[0];
  return first ? Number(first.total) : 0;
}
