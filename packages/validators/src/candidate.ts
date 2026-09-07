import { z } from "zod";

export const jlptLevelSchema = z.enum(["N1", "N2", "N3", "N4", "N5"]);

export const educationItemSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  yearStart: z.number().int().min(1900).max(2100),
  yearEnd: z.number().int().min(1900).max(2100).optional(),
});

export const workExperienceItemSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  periodStart: z.string().min(1),
  periodEnd: z.string().optional(),
});

export const candidateProfileSchema = z.object({
  nameJapanese: z.string().optional(),
  birthDate: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  jlptLevel: jlptLevelSchema.optional(),
  specializations: z.array(z.string().min(1)).default([]),
  skills: z.array(z.string().min(1)).default([]),
  bioId: z.string().optional(),
  bioJp: z.string().optional(),
  education: z.array(educationItemSchema).default([]),
  workExperience: z.array(workExperienceItemSchema).default([]),
});

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;
export type EducationItemInput = z.infer<typeof educationItemSchema>;
export type WorkExperienceItemInput = z.infer<typeof workExperienceItemSchema>;
