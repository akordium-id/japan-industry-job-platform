import type { ApiResponse } from "@jijp/types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export interface ProfileEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface ProfileExperience {
  title: string;
  company: string;
  start: string;
  end?: string;
  description?: string;
}

export interface ProfilePayload {
  nameJp?: string;
  birthDate?: string;
  originCity?: string;
  phone?: string;
  jlptLevel?: "N1" | "N2" | "N3" | "N4" | "N5";
  specialization?: string[];
  bioId?: string;
  bioJp?: string;
  education?: ProfileEducation[];
  experience?: ProfileExperience[];
  skills?: string[];
}

export interface AppUser {
  id: number | string;
  name: string;
  nameJp?: string;
  email: string;
  role: string;
  avatar?: string;
  iceUuid?: string;
  company?: string;
  title?: string;
  birthDate?: string;
  originCity?: string;
  phone?: string;
  jlptLevel?: ProfilePayload["jlptLevel"];
  specialization?: string[];
  education?: ProfileEducation[];
  experience?: ProfileExperience[];
  skills?: string[];
  bioId?: string;
  bioJp?: string;
  profileVerified?: boolean;
  updatedAt?: string;
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

export const userApi = {
  me: async (): Promise<AppUser> => {
    const d = await fetchJson<{ user?: AppUser } | AppUser>("/api/users/me");
    if (d && typeof d === "object" && "user" in d)
      return (d as { user: AppUser }).user;
    return d as AppUser;
  },
  update: async (payload: ProfilePayload): Promise<AppUser> => {
    const d = await fetchJson<{ user?: AppUser } | AppUser>("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (d && typeof d === "object" && "user" in d)
      return (d as { user: AppUser }).user;
    return d as AppUser;
  },
  listCandidates: () =>
    fetchJson<{
      candidates: Array<{
        id: number;
        name: string;
        nameJp?: string;
        originCity?: string;
        jlptLevel?: string;
        specialization: string[];
        profileVerified: boolean;
      }>;
    }>("/api/users/candidates").then((d) => d.candidates),
};
