import type { RowDataPacket } from "mysql2";

import { getPool } from "../db/pool.js";

export interface CalendarEventRow extends RowDataPacket {
  id: number;
  title: string;
  title_jp: string | null;
  description: string | null;
  start_at: Date;
  end_at: Date;
  type: string;
  visibility: string;
  created_by: number | null;
}

export async function findEvents(filters: {
  from?: string | undefined;
  to?: string | undefined;
  type?: string | undefined;
}): Promise<CalendarEventRow[]> {
  let query = "SELECT * FROM calendar_events WHERE deleted_at IS NULL";
  const params: string[] = [];
  if (filters.from) {
    query += " AND start_at >= ?";
    params.push(filters.from);
  }
  if (filters.to) {
    query += " AND end_at <= ?";
    params.push(filters.to);
  }
  if (filters.type) {
    query += " AND type = ?";
    params.push(filters.type);
  }
  query += " ORDER BY start_at ASC";
  const [rows] = await getPool().query<CalendarEventRow[]>(query, params);
  return rows;
}

export async function insertEvent(input: {
  title: string;
  titleJp?: string | null | undefined;
  description?: string | null | undefined;
  startAt: string;
  endAt: string;
  type?: string | undefined;
  visibility?: string | undefined;
  createdBy: number;
}): Promise<CalendarEventRow | null> {
  const [result] = await getPool().query(
    `INSERT INTO calendar_events (title, title_jp, description, start_at, end_at, type, visibility, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.titleJp ?? null,
      input.description ?? null,
      input.startAt,
      input.endAt,
      input.type ?? "class",
      input.visibility ?? "student",
      input.createdBy,
    ],
  );
  const insertId = (result as { insertId: number }).insertId;
  const [rows] = await getPool().query<CalendarEventRow[]>(
    "SELECT * FROM calendar_events WHERE id = ?",
    [insertId],
  );
  return rows[0] ?? null;
}

export async function softDeleteEvent(
  id: number,
  byUserId: number,
): Promise<void> {
  await getPool().query(
    "UPDATE calendar_events SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id = ?",
    [byUserId, id],
  );
}
