import { z } from "zod";

export const documentTypeSchema = z.enum([
  "ktp",
  "certificate",
  "portfolio",
  "transcript",
]);

export const documentStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const documentUploadSchema = z.object({
  type: documentTypeSchema,
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(127),
  sizeBytes: z.number().int().positive(),
});

export const documentReviewSchema = z.object({
  status: documentStatusSchema,
  rejectionReason: z.string().optional(),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type DocumentReviewInput = z.infer<typeof documentReviewSchema>;
