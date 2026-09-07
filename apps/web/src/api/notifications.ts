import type { ApiResponse } from "@jijp/types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export type NotifStatus = "queued" | "sent" | "failed" | "skipped";

export interface NotificationItem {
  id: number;
  channel: "email" | "webhook" | "in_app";
  template_key: string;
  subject: string;
  payload_json?: unknown;
  status: NotifStatus;
  read_at: string | null;
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

export const notificationApi = {
  mine: () =>
    fetchJson<{ notifications: NotificationItem[]; unread: number }>(
      "/api/notifications/mine",
    ),
  markRead: (id: number) =>
    fetchJson<unknown>(`/api/notifications/${id}/read`, { method: "POST" }),
};
