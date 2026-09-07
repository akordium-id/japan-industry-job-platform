import type { ApiResponse } from "@jijp/types";
import type { JobApplication } from "./jobs.types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export type AppType = "apply" | "scout";
export type AppStatus =
  "submitted" | "shortlisted" | "rejected" | "accepted" | "withdrawn";

export type Application = JobApplication & Record<string, unknown>;

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

export const applicationApi = {
  apply: (jobId: number, message?: string) =>
    fetchJson<unknown>(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  mine: () =>
    fetchJson<{ applications: Application[] }>("/api/applications/mine").then(
      (d) => d.applications,
    ),
  decide: (
    appId: number,
    status: Exclude<AppStatus, "submitted" | "withdrawn">,
  ) =>
    fetchJson<unknown>(`/api/applications/${appId}/decide`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),
};
