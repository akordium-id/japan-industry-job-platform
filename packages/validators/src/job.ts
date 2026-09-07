import { z } from "zod";
import { jlptLevelSchema } from "./candidate.js";

export const applicationStatusSchema = z.enum([
  "submitted",
  "shortlisted",
  "accepted",
  "rejected",
]);

export const scoutStatusSchema = z.enum(["pending", "accepted", "declined"]);

export const jobPostingSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  location: z.string().min(1),
  requiredJlptLevel: jlptLevelSchema.optional(),
  requiredSpecializations: z.array(z.string().min(1)).default([]),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
});

export const jobApplicationSchema = z.object({
  jobId: z.number().int().positive(),
  message: z.string().optional(),
});

export const jobApplicationStatusUpdateSchema = z.object({
  status: applicationStatusSchema,
});

export const scoutInvitationSchema = z.object({
  candidateId: z.number().int().positive(),
  jobId: z.number().int().positive().optional(),
  message: z.string().min(1),
});

export const scoutInvitationResponseSchema = z.object({
  status: scoutStatusSchema,
});

export type JobPostingInput = z.infer<typeof jobPostingSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type JobApplicationStatusUpdateInput = z.infer<
  typeof jobApplicationStatusUpdateSchema
>;
export type ScoutInvitationInput = z.infer<typeof scoutInvitationSchema>;
export type ScoutInvitationResponseInput = z.infer<
  typeof scoutInvitationResponseSchema
>;
