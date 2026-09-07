import type { RowDataPacket } from "mysql2";

import { getPool } from "../db/pool.js";

export interface NotificationRow extends RowDataPacket {
  id: number;
  user_id: number;
  channel: string;
  template_key: string;
  payload_json: string | null;
  subject: string | null;
  status: string;
  read_at: Date | null;
  created_at: Date;
}

export interface NotificationTemplateRow extends RowDataPacket {
  template_key: string;
  subject_id: string;
  subject_jp: string | null;
  body_id: string;
  body_jp: string | null;
}

export async function findTemplate(
  templateKey: string,
): Promise<NotificationTemplateRow | null> {
  const [rows] = await getPool().query<NotificationTemplateRow[]>(
    "SELECT * FROM notification_templates WHERE template_key = ?",
    [templateKey],
  );
  return rows[0] ?? null;
}

export async function insertInApp(input: {
  userId: number;
  templateKey: string;
  payloadJson: string;
  subject: string;
}): Promise<void> {
  await getPool().query(
    `INSERT INTO notifications (user_id, channel, template_key, payload_json, subject, status)
     VALUES (?, ?, ?, ?, ?, 'sent')`,
    [
      input.userId,
      "in_app",
      input.templateKey,
      input.payloadJson,
      input.subject,
    ],
  );
}

export async function findByUser(userId: number): Promise<NotificationRow[]> {
  const [rows] = await getPool().query<NotificationRow[]>(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30",
    [userId],
  );
  return rows;
}

export async function markRead(id: number, userId: number): Promise<void> {
  await getPool().query(
    "UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?",
    [id, userId],
  );
}

export async function countUnread(rows: NotificationRow[]): Promise<number> {
  return rows.filter((r) => !r.read_at).length;
}
