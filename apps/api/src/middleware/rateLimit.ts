import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";

import { env } from "../config/env.js";

export const globalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  limit: env.RATE_LIMIT_GLOBAL_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Terlalu banyak request, silakan tunggu 1 menit." },
  },
});

export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  limit: env.RATE_LIMIT_AUTH_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Terlalu banyak percobaan autentikasi, silakan tunggu 1 menit.",
    },
  },
});

export const uploadLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.RATE_LIMIT_UPLOAD_PER_15MIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Batas unggah tercapai, silakan coba lagi setelah 15 menit.",
    },
  },
});

export const cvLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  limit: env.RATE_LIMIT_CV_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Batas pembuatan CV tercapai, silakan tunggu sebentar." },
  },
});
