import type { ApiResponse, ApiError } from "@jijp/types";

const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? "";

export class ApiRequestError extends Error {
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  params?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") search.append(k, String(v));
    }
    const qs = search.toString();
    if (qs) url += (url.includes("?") ? "&" : "?") + qs;
  }
  return url;
}

async function parsePayload<T>(
  response: Response,
): Promise<ApiResponse<T> | ApiError | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as ApiResponse<T> | ApiError;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers, signal, params } = options;

  const init: RequestInit = {
    method,
    credentials: "include",
  };
  const headerObj: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers ?? {}),
  };
  init.headers = headerObj;
  if (body !== undefined) init.body = JSON.stringify(body);
  if (signal) init.signal = signal;

  const response = await fetch(buildUrl(path, params), init);

  const payload = await parsePayload<T>(response);

  if (!response.ok || !payload || payload.success === false) {
    const errorPayload = payload as ApiError | null;
    throw new ApiRequestError(
      errorPayload?.error ?? `Request failed with status ${response.status}`,
      errorPayload?.code,
      errorPayload?.details,
    );
  }

  return (payload as ApiResponse<T>).data;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  signal?: AbortSignal,
): Promise<T> {
  const init: RequestInit = {
    method: "POST",
    body: formData,
    credentials: "include",
  };
  if (signal) init.signal = signal;

  const response = await fetch(buildUrl(path), init);

  const payload = await parsePayload<T>(response);

  if (!response.ok || !payload || payload.success === false) {
    const errorPayload = payload as ApiError | null;
    throw new ApiRequestError(
      errorPayload?.error ?? `Upload failed with status ${response.status}`,
      errorPayload?.code,
      errorPayload?.details,
    );
  }

  return (payload as ApiResponse<T>).data;
}

export async function apiDownload(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<Blob> {
  const response = await fetch(buildUrl(path, params), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiRequestError(`Download failed with status ${response.status}`);
  }

  return response.blob();
}

export function fileUrl(
  path: string,
  params?: Record<string, string | number | undefined>,
): string {
  return buildUrl(path, params);
}
