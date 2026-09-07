import { getPool } from "../db/pool.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { UserRole } from "@jijp/types";

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  ice_uuid: string | null;
  name_jp: string | null;
  birth_date: string | null;
  origin_city: string | null;
  phone: string | null;
  jlpt_level: string | null;
  specialization: string | null;
  education_json: string | object | null;
  experience_json: string | object | null;
  skills_json: string | object | null;
  bio_id: string | null;
  bio_jp: string | null;
  profile_verified: number;
  avatar: string | null;
  company_name: string | null;
  title: string | null;
  program_name: string | null;
  candidate_status: string | null;
  language_score: number | null;
  cultural_score: number | null;
  technical_score: number | null;
  overall_score: number | null;
}

export interface ProfileUpdateInput {
  nameJp?: string;
  birthDate?: string;
  originCity?: string;
  phone?: string;
  jlptLevel?: string;
  specialization?: string | string[];
  education?: unknown;
  experience?: unknown;
  skills?: unknown;
  bioId?: string;
  bioJp?: string;
}

export async function findById(id: number): Promise<UserRow | null> {
  const [rows] = await getPool().query<UserRow[]>(
    "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  return rows[0] ?? null;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await getPool().query<UserRow[]>(
    "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
    [email],
  );
  return rows[0] ?? null;
}

export async function findByIceUuidOrEmail(
  iceUuid: string,
  email: string,
): Promise<UserRow | null> {
  const [rows] = await getPool().query<UserRow[]>(
    "SELECT * FROM users WHERE ice_uuid = ? OR email = ?",
    [iceUuid, email],
  );
  return rows[0] ?? null;
}

export async function emailExists(email: string): Promise<boolean> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ?",
    [email],
  );
  return rows.length > 0;
}

export async function insertUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  iceUuid?: string | null;
}): Promise<number> {
  const [result] = await getPool().query<ResultSetHeader>(
    "INSERT INTO users (name, email, password_hash, role, ice_uuid) VALUES (?, ?, ?, ?, ?)",
    [
      input.name,
      input.email,
      input.passwordHash,
      input.role,
      input.iceUuid ?? null,
    ],
  );
  return result.insertId;
}

export async function updateIceUuid(
  id: number,
  iceUuid: string,
): Promise<void> {
  await getPool().query("UPDATE users SET ice_uuid = ? WHERE id = ?", [
    iceUuid,
    id,
  ]);
}

export async function updateProfile(
  id: number,
  p: ProfileUpdateInput,
): Promise<void> {
  const specialization = Array.isArray(p.specialization)
    ? p.specialization.join(", ")
    : p.specialization;
  await getPool().query(
    `UPDATE users SET
      name_jp = COALESCE(?, name_jp),
      birth_date = COALESCE(?, birth_date),
      origin_city = COALESCE(?, origin_city),
      phone = COALESCE(?, phone),
      jlpt_level = COALESCE(?, jlpt_level),
      specialization = COALESCE(?, specialization),
      education_json = COALESCE(?, education_json),
      experience_json = COALESCE(?, experience_json),
      skills_json = COALESCE(?, skills_json),
      bio_id = COALESCE(?, bio_id),
      bio_jp = COALESCE(?, bio_jp),
      updated_at = NOW()
     WHERE id = ?`,
    [
      p.nameJp ?? null,
      p.birthDate ?? null,
      p.originCity ?? null,
      p.phone ?? null,
      p.jlptLevel ?? null,
      specialization ?? null,
      p.education ? JSON.stringify(p.education) : null,
      p.experience ? JSON.stringify(p.experience) : null,
      p.skills ? JSON.stringify(p.skills) : null,
      p.bioId ?? null,
      p.bioJp ?? null,
      id,
    ],
  );
}

export async function findScoutCandidates(filters: {
  specialization?: string | undefined;
  minJlpt?: string | undefined;
}): Promise<UserRow[]> {
  let query =
    'SELECT * FROM users WHERE role = "student" AND profile_verified = 1 AND deleted_at IS NULL';
  const params: (string | number)[] = [];
  if (filters.specialization) {
    query += " AND specialization LIKE ?";
    params.push(`%${filters.specialization}%`);
  }
  if (filters.minJlpt) {
    query += " AND jlpt_level = ?";
    params.push(filters.minJlpt);
  }
  const [rows] = await getPool().query<UserRow[]>(query, params);
  return rows;
}

export async function findAdmins(): Promise<{ id: number }[]> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    'SELECT id FROM users WHERE role = "admin" AND deleted_at IS NULL',
  );
  return rows as { id: number }[];
}
