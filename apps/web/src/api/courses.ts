import type { ApiResponse } from "@jijp/types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export interface CourseModule {
  id: number;
  title: string;
  title_jp?: string;
  duration_minutes: number;
}

export interface Course {
  id: number;
  title: string;
  title_jp?: string;
  description?: string;
  phase: number;
  modules: CourseModule[];
}

export interface CourseProgress {
  id: number;
  course_id?: number;
  title: string;
  phase: number;
  progress_pct: number;
  status: "enrolled" | "in_progress" | "completed" | "dropped";
  started_at: string | null;
  completed_at: string | null;
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

export const courseApi = {
  list: () =>
    fetchJson<{ courses: Course[] }>("/api/courses").then((d) => d.courses),
  detail: (id: number) =>
    fetchJson<{ course: Course }>(`/api/courses/${id}`).then((d) => d.course),
  enroll: (id: number) =>
    fetchJson<unknown>(`/api/courses/${id}/enroll`, { method: "POST" }),
  myProgress: () =>
    fetchJson<{ progress: CourseProgress[] }>("/api/courses/me/progress").then(
      (d) => d.progress,
    ),
  updateProgress: (id: number, progress_pct: number) =>
    fetchJson<unknown>(`/api/courses/${id}/progress`, {
      method: "PUT",
      body: JSON.stringify({ progress_pct }),
    }),
};
