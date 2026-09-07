import { z } from "zod";

export const notificationTypeSchema = z.enum([
  "document_submitted",
  "document_approved",
  "document_rejected",
  "application_submitted",
  "application_decided",
  "scout_received",
]);

export const notificationCreateSchema = z.object({
  type: notificationTypeSchema,
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const notificationSchema = notificationCreateSchema.extend({
  userId: z.number().int().positive(),
});

export type NotificationInput = z.infer<typeof notificationSchema>;
export type NotificationCreateInput = z.infer<typeof notificationCreateSchema>;
