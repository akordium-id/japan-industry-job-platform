import type { ApiResponse } from "@jijp/types";

const BASE = import.meta.env.VITE_API_URL ?? "";

export interface CalendarEvent {
  id: number;
  title: string;
  title_jp?: string;
  description?: string;
  start_at: string;
  end_at: string;
  type: "class" | "partner_meeting" | "event" | "deadline";
  visibility: "student" | "alumni" | "corporate" | "all";
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

export const calendarApi = {
  list: (params: { from?: string; to?: string; type?: string } = {}) => {
    const search = new URLSearchParams();
    if (params.from) search.set("from", params.from);
    if (params.to) search.set("to", params.to);
    if (params.type) search.set("type", params.type);
    const qs = search.toString();
    return fetchJson<{ events: CalendarEvent[] }>(
      `/api/calendar${qs ? `?${qs}` : ""}`,
    ).then((d) => d.events);
  },
  create: (e: Omit<CalendarEvent, "id">) =>
    fetchJson<{ event: CalendarEvent }>("/api/calendar/events", {
      method: "POST",
      body: JSON.stringify(e),
    }).then((d) => d.event),
  remove: (id: number) =>
    fetchJson<unknown>(`/api/calendar/events/${id}`, { method: "DELETE" }),
};
