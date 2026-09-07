import { z } from "zod";

export const userRoleSchema = z.enum([
  "student",
  "alumni",
  "corporate",
  "educator_bilingual",
  "educator_silver",
  "admin",
]);

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1).max(255),
  role: userRoleSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
