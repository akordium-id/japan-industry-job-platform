import type { RowDataPacket, ResultSetHeader } from "mysql2";

import { getPool } from "../db/pool.js";

export interface CompanyRow extends RowDataPacket {
  id: number;
  name: string;
  name_jp: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
  contact_email: string | null;
}

export interface JobPostingRow extends RowDataPacket {
  id: number;
  company_id: number;
  title: string;
  title_jp: string | null;
  description: string | null;
  requirements: string | null;
  specialization: string | null;
  min_jlpt: string | null;
  location: string | null;
  employment_type: string | null;
  salary_range: string | null;
  is_active: number;
  posted_by: number | null;
  created_at: Date;
  company_name?: string;
  company_name_jp?: string;
}

export async function findAllCompanies(): Promise<CompanyRow[]> {
  const [rows] = await getPool().query<CompanyRow[]>(
    "SELECT * FROM companies ORDER BY name ASC",
  );
  return rows;
}

export async function insertCompany(input: {
  name: string;
  nameJp?: string | null | undefined;
  industry?: string | null | undefined;
  website?: string | null | undefined;
  description?: string | null | undefined;
  contactEmail?: string | null | undefined;
  createdBy: number;
}): Promise<number> {
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO companies (name, name_jp, industry, website, description, contact_email, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.nameJp ?? null,
      input.industry ?? null,
      input.website ?? null,
      input.description ?? null,
      input.contactEmail ?? null,
      input.createdBy,
    ],
  );
  return result.insertId;
}

export async function findJobs(filters: {
  specialization?: string | undefined;
  minJlpt?: string | undefined;
  location?: string | undefined;
}): Promise<{ rows: JobPostingRow[]; total: number }> {
  let where = " WHERE jp.is_active = 1 AND jp.deleted_at IS NULL";
  const params: (string | number)[] = [];
  if (filters.specialization) {
    where += " AND (jp.title LIKE ? OR jp.specialization LIKE ?)";
    params.push(`%${filters.specialization}%`, `%${filters.specialization}%`);
  }
  if (filters.minJlpt) {
    where += ` AND (jp.min_jlpt IS NULL OR jp.min_jlpt = '' OR FIELD(jp.min_jlpt, 'N5', 'N4', 'N3', 'N2', 'N1') <= FIELD(?, 'N5', 'N4', 'N3', 'N2', 'N1'))`;
    params.push(filters.minJlpt);
  }
  if (filters.location) {
    where += " AND jp.location LIKE ?";
    params.push(`%${filters.location}%`);
  }

  const [countRows] = await getPool().query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM job_postings jp ${where}`,
    params,
  );
  const total = countRows[0] ? Number(countRows[0].total) : 0;

  const [rows] = await getPool().query<JobPostingRow[]>(
    `SELECT jp.*, c.name as company_name, c.name_jp as company_name_jp
     FROM job_postings jp
     LEFT JOIN companies c ON c.id = jp.company_id
     ${where}
     ORDER BY jp.created_at DESC`,
    params,
  );

  return { rows, total };
}

export async function findJobById(id: number): Promise<JobPostingRow | null> {
  const [rows] = await getPool().query<JobPostingRow[]>(
    "SELECT * FROM job_postings WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  return rows[0] ?? null;
}

export async function insertJob(input: {
  companyId: number;
  title: string;
  titleJp?: string | null | undefined;
  description: string;
  requirements: string;
  specialization?: string | null | undefined;
  minJlpt?: string | null | undefined;
  location?: string | null | undefined;
  employmentType?: string | undefined;
  salaryRange?: string | null | undefined;
  postedBy: number;
}): Promise<number> {
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO job_postings
       (company_id, title, title_jp, description, requirements, specialization, min_jlpt, location, employment_type, salary_range, is_active, posted_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [
      input.companyId,
      input.title,
      input.titleJp ?? null,
      input.description,
      input.requirements,
      input.specialization ?? null,
      input.minJlpt ?? null,
      input.location ?? null,
      input.employmentType ?? "fulltime",
      input.salaryRange ?? null,
      input.postedBy,
    ],
  );
  return result.insertId;
}

export async function softDeleteJob(
  id: number,
  byUserId: number,
): Promise<void> {
  await getPool().query(
    "UPDATE job_postings SET deleted_at = NOW(), deleted_by = ?, is_active = 0 WHERE id = ?",
    [byUserId, id],
  );
}

export async function countActiveJobs(): Promise<number> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM job_postings WHERE is_active = 1",
  );
  return rows[0] ? Number(rows[0].total) : 0;
}
