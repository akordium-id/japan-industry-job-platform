import { z } from "zod";

import { logger } from "../lib/logger.js";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  SESSION_SECRET: z.string().min(8),
  CORS_ORIGINS: z.string().default(""),

  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(10),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),

  WEBHOOK_URL: z.string().optional(),
  WEBHOOK_SECRET: z.string().optional(),

  SSO_PROVIDER_URL: z.string().optional(),
  SSO_JWT_PUBLIC_KEY: z.string().optional(),

  RATE_LIMIT_GLOBAL_PER_MIN: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_AUTH_PER_MIN: z.coerce.number().int().positive().default(15),
  RATE_LIMIT_UPLOAD_PER_15MIN: z.coerce.number().int().positive().default(20),
  RATE_LIMIT_CV_PER_MIN: z.coerce.number().int().positive().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error(
    parsed.error.flatten().fieldErrors,
    "[api] invalid environment variables",
  );
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
