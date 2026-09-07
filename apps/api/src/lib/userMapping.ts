import type { UserRow } from "../repositories/users.repository.js";

function parseJsonArray(value: string | object | null | undefined): unknown[] {
  if (!value) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(value) ? value : [];
}

export interface UserDto {
  id: number;
  name: string;
  nameJp?: string | null;
  email: string;
  role: string;
  title?: string | null;
  companyName?: string | null;
  originCity?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  jlptLevel?: string | null;
  specialization: string[];
  education: unknown[];
  experience: unknown[];
  skills: unknown[];
  bioId?: string | null;
  bioJp?: string | null;
  profileVerified: boolean;
}

export function toUserDto(u: UserRow): UserDto {
  const specialization = u.specialization
    ? u.specialization
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  return {
    id: u.id,
    name: u.name,
    nameJp: u.name_jp,
    email: u.email,
    role: u.role,
    title: u.title,
    companyName: u.company_name,
    originCity: u.origin_city,
    phone: u.phone,
    birthDate: u.birth_date,
    jlptLevel: u.jlpt_level,
    specialization,
    education: parseJsonArray(u.education_json),
    experience: parseJsonArray(u.experience_json),
    skills: parseJsonArray(u.skills_json),
    bioId: u.bio_id,
    bioJp: u.bio_jp,
    profileVerified: Boolean(u.profile_verified),
  };
}
