import type { ApiResponse } from "@jijp/types";
import type { VaultDoc, DocStatus } from "./documents";

const BASE = import.meta.env.VITE_API_URL ?? "";

export interface AdminStats {
  pending: number;
  approved?: number;
  active_jobs: number;
  totalStudents?: number;
  totalApplications?: number;
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

export const adminApi = {
  pendingDocs: () =>
    fetchJson<{
      documents: (VaultDoc & { user_name: string; user_email: string })[];
    }>("/api/admin/pending-documents").then((d) => d.documents ?? []),
  decide: (
    id: number,
    action: "approved" | "rejected" | "requested_changes",
    notes?: string,
  ) =>
    fetchJson<{ id: number; status: DocStatus }>(
      `/api/admin/documents/${id}/decide`,
      { method: "POST", body: JSON.stringify({ action, notes }) },
    ),
  stats: () =>
    fetchJson<Record<string, unknown>>("/api/admin/stats").then((raw) => {
      const r =
        (raw?.["stats"] as Record<string, unknown>) ??
        (raw as Record<string, unknown>) ??
        {};
      return {
        pending: Number(r["pendingDocs"] ?? r["pending"] ?? 0),
        approved: Number(r["approvedDocs"] ?? r["approved"] ?? 0),
        active_jobs: Number(r["activeJobs"] ?? r["active_jobs"] ?? 0),
        totalStudents: Number(r["totalStudents"] ?? 0),
        totalApplications: Number(r["totalApplications"] ?? 0),
      } as AdminStats;
    }),
  batchDecide: (ids: number[], action: "approved" | "rejected") =>
    fetchJson<{ updated: number }>("/api/admin/documents/batch-decide", {
      method: "POST",
      body: JSON.stringify({ ids, action }),
    }),
};
