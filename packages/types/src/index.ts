// =============================================================
// @jijp/types — Shared TypeScript types for JIJP Platform
// Used by both apps/api (Express) and apps/web (React)
// =============================================================

// ─── User & Auth ─────────────────────────────────────────────

export type UserRole =
  | "student"
  | "alumni"
  | "corporate"
  | "educator_bilingual"
  | "educator_silver"
  | "admin";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: number;
  role: UserRole;
  email: string;
}

// ─── Document Vault ──────────────────────────────────────────

export type DocumentType = "ktp" | "certificate" | "portfolio" | "transcript";

export type DocumentStatus = "pending" | "approved" | "rejected";

export interface Document {
  id: number;
  userId: number;
  type: DocumentType;
  status: DocumentStatus;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
}

// ─── Candidate Profile ───────────────────────────────────────

export type JLPTLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export interface Education {
  degree: string;
  institution: string;
  yearStart: number;
  yearEnd?: number;
}

export interface WorkExperience {
  title: string;
  company: string;
  periodStart: string;
  periodEnd?: string;
}

export interface CandidateProfile {
  userId: number;
  nameJapanese?: string;
  birthDate?: string;
  city?: string;
  phone?: string;
  jlptLevel?: JLPTLevel;
  specializations: string[];
  skills: string[];
  bioId?: string;
  bioJp?: string;
  education: Education[];
  workExperience: WorkExperience[];
}

// ─── Job Board ───────────────────────────────────────────────

export type ApplicationStatus =
  | "submitted"
  | "shortlisted"
  | "accepted"
  | "rejected";

export interface JobPosting {
  id: number;
  corporateId: number;
  title: string;
  description: string;
  location: string;
  requiredJlptLevel?: JLPTLevel;
  requiredSpecializations: string[];
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  candidateId: number;
  status: ApplicationStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoutInvitation {
  id: number;
  corporateId: number;
  candidateId: number;
  jobId?: number;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

// ─── Notifications ───────────────────────────────────────────

export type NotificationType =
  | "document_submitted"
  | "document_approved"
  | "document_rejected"
  | "application_submitted"
  | "application_decided"
  | "scout_received";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Learning & Calendar ─────────────────────────────────────

export type CourseStatus = "enrolled" | "in_progress" | "completed";

export interface CalendarEvent {
  id: number;
  title: string;
  titleJp?: string;
  startAt: string;
  endAt: string;
  type: "class" | "exam" | "ceremony" | "other";
  visibleTo: UserRole[];
}

// ─── Career Timeline (Alumni) ─────────────────────────────────

export type MilestoneType =
  | "placement"
  | "promotion"
  | "contract"
  | "certification";

export interface CareerMilestone {
  id: number;
  userId: number;
  type: MilestoneType;
  title: string;
  description?: string;
  occurredAt: string;
}

// ─── API Response Wrappers ───────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
