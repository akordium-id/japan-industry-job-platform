export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    message: string,
    code: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

export const badRequest = (msg: string, code = "BAD_REQUEST"): HttpError =>
  new HttpError(400, msg, code);

export const unauthorized = (msg = "Unauthorized"): HttpError =>
  new HttpError(401, msg, "UNAUTHORIZED");

export const forbidden = (msg = "Akses ditolak."): HttpError =>
  new HttpError(403, msg, "FORBIDDEN");

export const notFound = (msg = "Resource tidak ditemukan"): HttpError =>
  new HttpError(404, msg, "NOT_FOUND");

export const conflict = (msg: string): HttpError =>
  new HttpError(409, msg, "CONFLICT");

export const internal = (msg = "Internal Server Error"): HttpError =>
  new HttpError(500, msg, "INTERNAL_ERROR");
