import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
  type LoginResponse,
} from "./auth";
import { courseApi, type Course, type CourseProgress } from "./courses";
import { calendarApi, type CalendarEvent } from "./calendar";
import { documentApi, type VaultDoc } from "./documents";
import { adminApi, type AdminStats } from "./admin";
import {
  jobApi,
  type Job,
  type Company,
  type ScoutCandidate,
  type JobsResponse,
} from "./jobs";
import { applicationApi, type Application } from "./applications";
import { notificationApi, type NotificationItem } from "./notifications";
import { userApi, type ProfilePayload, type AppUser } from "./user";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
export const registerSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  iceUuid: z.string().optional(),
});
export type LoginFormData = LoginPayload;
export type RegisterFormData = RegisterPayload;

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, RegisterPayload>({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export const courseKeys = {
  all: ["courses"] as const,
  list: () => [...courseKeys.all, "list"] as const,
  detail: (id: number) => [...courseKeys.all, "detail", id] as const,
  myProgress: () => [...courseKeys.all, "my-progress"] as const,
};

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: courseKeys.list(),
    queryFn: () => courseApi.list(),
  });
}

export function useCourseDetail(id: number) {
  return useQuery<Course>({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseApi.detail(id),
    enabled: !!id,
  });
}

export function useMyCourseProgress() {
  return useQuery<CourseProgress[]>({
    queryKey: courseKeys.myProgress(),
    queryFn: () => courseApi.myProgress(),
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (courseId) => courseApi.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.myProgress() });
      queryClient.invalidateQueries({ queryKey: courseKeys.list() });
    },
  });
}

export function useUpdateCourseProgress() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { courseId: number; progressPct: number }>(
    {
      mutationFn: ({ courseId, progressPct }) =>
        courseApi.updateProgress(courseId, progressPct),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: courseKeys.myProgress() });
      },
    },
  );
}

export const calendarKeys = {
  all: ["calendar"] as const,
  events: (params?: { from?: string; to?: string; type?: string }) =>
    [...calendarKeys.all, "events", params] as const,
};

export function useCalendarEvents(params?: {
  from?: string;
  to?: string;
  type?: string;
}) {
  return useQuery<CalendarEvent[]>({
    queryKey: calendarKeys.events(params),
    queryFn: () => calendarApi.list(params),
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation<CalendarEvent, Error, Omit<CalendarEvent, "id">>({
    mutationFn: (event) => calendarApi.create(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => calendarApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export const docKeys = {
  all: ["documents"] as const,
  mine: () => [...docKeys.all, "mine"] as const,
  pending: () => [...docKeys.all, "pending"] as const,
};

export function useMyDocuments() {
  return useQuery<VaultDoc[]>({
    queryKey: docKeys.mine(),
    queryFn: () => documentApi.mine(),
  });
}

export function usePendingDocuments() {
  return useQuery<(VaultDoc & { user_name: string; user_email: string })[]>({
    queryKey: docKeys.pending(),
    queryFn: () => adminApi.pendingDocs(),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation<{ id: number }, Error, FormData>({
    mutationFn: (formData) => documentApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docKeys.mine() });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => documentApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docKeys.mine() });
    },
  });
}

export function useDecideDocument() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    {
      id: number;
      action: "approved" | "rejected" | "requested_changes";
      notes?: string;
    }
  >({
    mutationFn: ({ id, action, notes }) => adminApi.decide(id, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docKeys.pending() });
    },
  });
}

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
};

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: adminKeys.stats(),
    queryFn: () => adminApi.stats(),
  });
}

export function useBatchDecide() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { ids: number[]; action: "approved" | "rejected" }
  >({
    mutationFn: ({ ids, action }) => adminApi.batchDecide(ids, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: docKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: number) => [...jobKeys.details(), id] as const,
  companies: () => ["companies"] as const,
  myApplications: () => ["my-applications"] as const,
  scoutCandidates: (filters?: Record<string, unknown>) =>
    ["scout-candidates", filters] as const,
};

export function useJobs(filters: Record<string, unknown> = {}) {
  return useQuery<JobsResponse>({
    queryKey: jobKeys.list(filters),
    queryFn: () =>
      jobApi.listJobs(filters as Parameters<typeof jobApi.listJobs>[0]),
  });
}

export function useJob(id: number) {
  return useQuery<Job>({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobApi.getJob(id),
    enabled: !!id,
  });
}

export function useCompanies() {
  return useQuery<Company[]>({
    queryKey: jobKeys.companies(),
    queryFn: () => jobApi.listCompanies(),
  });
}

export function useMyApplications() {
  return useQuery<Application[]>({
    queryKey: jobKeys.myApplications(),
    queryFn: () => applicationApi.mine(),
  });
}

export function useScoutCandidates(filters: Record<string, unknown> = {}) {
  return useQuery<ScoutCandidate[]>({
    queryKey: jobKeys.scoutCandidates(filters),
    queryFn: () =>
      jobApi.scoutCandidates(
        filters as Parameters<typeof jobApi.scoutCandidates>[0],
      ),
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { jobId: number; message?: string }>({
    mutationFn: ({ jobId, message }) => applicationApi.apply(jobId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.myApplications() });
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof jobApi.createJob>[0]) =>
      jobApi.createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

export function useCloseJob() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => jobApi.closeJob(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

export const profileKeys = {
  me: ["user", "me"] as const,
};

export function useProfile() {
  return useQuery<AppUser | null>({
    queryKey: profileKeys.me,
    queryFn: () => userApi.me().catch(() => null),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<AppUser, Error, ProfilePayload>({
    mutationFn: (payload) => userApi.update(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(profileKeys.me, updated);
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}

export const notificationKeys = {
  all: ["notifications"] as const,
  mine: () => [...notificationKeys.all, "mine"] as const,
};

export function useMyNotifications() {
  return useQuery<{ notifications: NotificationItem[]; unread: number }>({
    queryKey: notificationKeys.mine(),
    queryFn: () => notificationApi.mine(),
    staleTime: 1000 * 60,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, number>({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.mine() });
    },
  });
}
