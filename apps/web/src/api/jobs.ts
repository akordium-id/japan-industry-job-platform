import type { ApiResponse } from "@jijp/types";
import type {
  JobApplication,
  Company,
  Job,
  ScoutCandidate,
} from "./jobs.types";

export type {
  Company,
  Job,
  JobApplication,
  ScoutCandidate,
} from "./jobs.types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobsResponse {
  jobs: Job[];
  pagination?: PaginationMeta;
}

export interface CreateJobPayload {
  companyId?: number;
  company_id?: number;
  title: string;
  titleJp?: string;
  title_jp?: string;
  description: string;
  requirements: string;
  specialization?: string;
  minJlpt?: string;
  min_jlpt?: string;
  location?: string;
  employmentType?: string;
  employment_type?: string;
  salaryRange?: string;
  salary_range?: string;
}

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${input}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const payload = text
    ? (JSON.parse(text) as ApiResponse<T> | { error: string })
    : null;
  if (!res.ok || !payload || (payload as ApiResponse<T>).success === false) {
    const message =
      payload && "error" in payload
        ? (payload as { error: string }).error
        : `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return (payload as ApiResponse<T>).data;
}

export const jobApi = {
  listCompanies: () =>
    fetchJson<{ companies: Company[] }>("/api/jobs/companies").then(
      (d) => d.companies,
    ),

  createCompany: (c: Partial<Company>) =>
    fetchJson<{ company?: Company; id?: number; name?: string }>(
      "/api/jobs/companies",
      { method: "POST", body: JSON.stringify(c) },
    ).then((d) => d.company ?? (d as unknown as Company)),

  listJobs: (
    p: {
      specialization?: string;
      minJlpt?: string;
      location?: string;
      page?: number;
      limit?: number;
    } = {},
  ) => {
    const params = new URLSearchParams();
    if (p.specialization) params.set("specialization", p.specialization);
    if (p.minJlpt) params.set("minJlpt", p.minJlpt);
    if (p.location) params.set("location", p.location);
    if (p.page) params.set("page", String(p.page));
    if (p.limit) params.set("limit", String(p.limit));
    const qs = params.toString();
    return fetchJson<JobsResponse>(`/api/jobs${qs ? `?${qs}` : ""}`);
  },

  getJob: (id: number) =>
    fetchJson<{ job: Job }>(`/api/jobs/${id}`).then((d) => d.job),

  createJob: (j: CreateJobPayload) =>
    fetchJson<{ job: Job }>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(j),
    }).then((d) => d.job),

  updateJob: (id: number, j: Partial<Job>) =>
    fetchJson<{ job: Job }>(`/api/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(j),
    }).then((d) => d.job),

  closeJob: (id: number) =>
    fetchJson<unknown>(`/api/jobs/${id}/close`, { method: "POST" }),

  applicationsForJob: (id: number) =>
    fetchJson<{
      applications: Array<JobApplication & Record<string, unknown>>;
    }>(`/api/jobs/${id}/applications`),

  decideApplication: (id: number, status: string, message?: string) =>
    fetchJson<unknown>(`/api/applications/${id}/decide`, {
      method: "POST",
      body: JSON.stringify({ status, message }),
    }),

  scoutCandidates: (p: { specialization?: string; minJlpt?: string } = {}) => {
    const params = new URLSearchParams();
    if (p.specialization) params.set("specialization", p.specialization);
    if (p.minJlpt) params.set("minJlpt", p.minJlpt);
    const qs = params.toString();
    return fetchJson<{ candidates: ScoutCandidate[] }>(
      `/api/jobs/scout-candidates${qs ? `?${qs}` : ""}`,
    ).then((d) => d.candidates);
  },

  scout: (jobId: number, userId: number, message?: string) =>
    fetchJson<unknown>(`/api/jobs/${jobId}/scout`, {
      method: "POST",
      body: JSON.stringify({ candidateId: userId, message }),
    }),
};
