import type { ApiResponse } from "@jijp/types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export type DocType = "ktp" | "certificate" | "portfolio" | "transcript";
export type DocStatus = "pending" | "approved" | "rejected";

export interface VaultDoc {
  id: number;
  user_id: number;
  type: DocType;
  title: string;
  file_path: string;
  file_mime: string;
  file_size_bytes: number;
  issued_by?: string;
  issued_date?: string;
  verification_status: DocStatus;
  verification_notes?: string;
  verified_by?: number;
  verified_at?: string;
  created_at: string;
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

export const documentApi = {
  mine: () =>
    fetchJson<{ documents: VaultDoc[] }>("/api/documents/mine").then(
      (d) => d.documents,
    ),
  upload: async (form: FormData) => {
    const res = await fetch(`${BASE}/api/documents/upload`, {
      method: "POST",
      body: form,
      credentials: "include",
    });
    const text = await res.text();
    const payload = text
      ? (JSON.parse(text) as
          ApiResponse<{ document: { id: number } }> | { error: string })
      : null;
    if (
      !res.ok ||
      !payload ||
      (payload as ApiResponse<{ document: { id: number } }>).success === false
    ) {
      const message =
        payload && "error" in payload
          ? (payload as { error: string }).error
          : `Upload failed with status ${res.status}`;
      throw new Error(message);
    }
    return (payload as ApiResponse<{ document: { id: number } }>).data.document;
  },
  remove: (id: number) =>
    fetchJson<unknown>(`/api/documents/${id}`, { method: "DELETE" }),
  fileUrl: (id: number) => `${BASE}/api/documents/file/${id}`,
};
