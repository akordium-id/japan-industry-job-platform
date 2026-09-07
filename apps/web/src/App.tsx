import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppProviders } from "@/app/providers";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { NotFoundPage } from "@/pages/NotFoundPage";
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import Landing from "@/pages/Landing";

const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const ProfilePage = lazy(() => import("@/pages/student/ProfilePage"));
const CalendarPage = lazy(() => import("@/pages/student/CalendarPage"));
const CoursesPage = lazy(() => import("@/pages/student/CoursesPage"));
const VaultPage = lazy(() => import("@/pages/student/VaultPage"));
const CVPage = lazy(() => import("@/pages/student/CVPage"));
const JobsBoardPage = lazy(() => import("@/pages/student/JobsBoardPage"));
const CorporateDashboard = lazy(
  () => import("@/pages/corporate/CorporateDashboard"),
);
const CorporateJobsPage = lazy(
  () => import("@/pages/corporate/CorporateJobsPage"),
);
const ScoutPage = lazy(() => import("@/pages/corporate/ScoutPage"));
const EducatorPortal = lazy(() => import("@/pages/educator/EducatorPortal"));
const CareerTimeline = lazy(() => import("@/pages/career/CareerTimeline"));
const AdminVerificationsPage = lazy(
  () => import("@/pages/admin/AdminVerificationsPage"),
);

function Loading() {
  return (
    <div
      style={{
        padding: "4rem",
        textAlign: "center",
        color: "var(--color-text-secondary)",
      }}
    >
      Loading...
    </div>
  );
}

export function App() {
  return (
    <AppProviders>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["student", "alumni"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/calendar"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "student",
                    "educator_bilingual",
                    "educator_silver",
                  ]}
                >
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/vault"
              element={
                <ProtectedRoute allowedRoles={["student", "alumni"]}>
                  <VaultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/jobs"
              element={
                <ProtectedRoute allowedRoles={["student", "alumni", "admin"]}>
                  <JobsBoardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/cv"
              element={
                <ProtectedRoute allowedRoles={["student", "alumni"]}>
                  <CVPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/career"
              element={
                <ProtectedRoute allowedRoles={["student", "alumni"]}>
                  <CareerTimeline />
                </ProtectedRoute>
              }
            />

            <Route
              path="/corporate"
              element={
                <ProtectedRoute allowedRoles={["corporate"]}>
                  <CorporateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/corporate/jobs"
              element={
                <ProtectedRoute allowedRoles={["corporate", "admin"]}>
                  <CorporateJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/corporate/scout"
              element={
                <ProtectedRoute allowedRoles={["corporate"]}>
                  <ScoutPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/educator"
              element={
                <ProtectedRoute
                  allowedRoles={["educator_bilingual", "educator_silver"]}
                >
                  <EducatorPortal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/verifications"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminVerificationsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </AppProviders>
  );
}
