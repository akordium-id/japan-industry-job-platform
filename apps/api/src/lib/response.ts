import type { ApiError, ApiResponse, PaginatedResponse } from "@jijp/types";

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function created<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function fail(
  error: string,
  code?: string,
  details?: unknown,
): ApiError {
  return {
    success: false,
    error,
    ...(code ? { code } : {}),
    ...(details !== undefined ? { details } : {}),
  };
}

export function paginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}
