import type { ApiResponse } from "@jijp/types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export type AppRole =
  | "student"
  | "corporate"
  | "educator_bilingual"
  | "educator_silver"
  | "alumni"
  | "admin";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  iceUuid?: string;
  role?: AppRole;
}

export interface LoginResponse {
  user?: {
    id: number | string;
    name: string;
    email: string;
    role: AppRole;
  };
  token?: string;
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

export const authApi = {
  login: (payload: LoginPayload) =>
    fetchJson<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload: RegisterPayload) =>
    fetchJson<LoginResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () => fetchJson<unknown>("/api/auth/logout", { method: "POST" }),
};
