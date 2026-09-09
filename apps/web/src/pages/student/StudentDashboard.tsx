import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Briefcase,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import {
  useCourses,
  useMyCourseProgress,
  useMyDocuments,
  useCalendarEvents,
  useMyApplications,
} from "@/api/hooks";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { ReadinessGauge } from "@/components/ui/ReadinessGauge";
import { ActionHero } from "@/components/student/ActionHero";
import { PathwayMilestoneRoadmap } from "@/components/student/PathwayMilestoneRoadmap";
import { formatDate, daysUntil } from "@/lib/utils";

function credentialIcon(type: string): string {
  switch (type) {
    case "certificate":
      return "📜";
    case "badge":
      return "🏅";
    case "transcript":
      return "📋";
    case "ktp":
      return "🪪";
    default:
      return "📄";
  }
}

function credentialStatusVariant(
  status: string,
): "success" | "warning" | "danger" {
  switch (status) {
    case "approved":
    case "valid":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "expired":
      return "danger";
    default:
      return "warning";
  }
}

function credentialStatusLabel(status: string): string {
  switch (status) {
    case "approved":
    case "valid":
      return "Valid";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    case "expired":
      return "Expired";
    default:
      return status;
  }
}

function moduleStatusVariant(status: string): "success" | "accent" | "default" {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "accent";
    default:
      return "default";
  }
}

function moduleStatusLabel(status: string): string {
  switch (status) {
    case "completed":
      return "Done";
    case "in_progress":
      return "Ongoing";
    default:
      return "Available";
  }
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: documents = [] } = useMyDocuments();
  const { data: courses = [] } = useCourses();
  const { data: courseProgress = [] } = useMyCourseProgress();
  const { data: calendarEvents = [] } = useCalendarEvents();
  const { data: myApps = [] } = useMyApplications();

  // Document counts
  const validDocs = useMemo(
    () => documents.filter((c) => c.verification_status === "approved").length,
    [documents],
  );
  const pendingDocs = useMemo(
    () => documents.filter((c) => c.verification_status === "pending").length,
    [documents],
  );
  const rejectedDocs = useMemo(
    () => documents.filter((c) => c.verification_status === "rejected").length,
    [documents],
  );

  // Curriculum computations
  const overallProgress = useMemo(() => {
    if (courses.length === 0) return 0;
    const sum = courses.reduce((acc, c) => {
      const p = courseProgress.find((cp) => (cp.course_id ?? cp.id) === c.id);
      return acc + (p?.progress_pct ?? 0);
    }, 0);
    return Math.round(sum / courses.length);
  }, [courses, courseProgress]);

  const completedCount = useMemo(
    () => courseProgress.filter((cp) => cp.status === "completed").length,
    [courseProgress],
  );

  // Upcoming sessions
  const upcomingSessions = useMemo(() => {
    const now = new Date().toISOString();
    return calendarEvents
      .filter(
        (e) => e.start_at >= now || e.start_at.slice(0, 10) >= now.slice(0, 10),
      )
      .slice(0, 2);
  }, [calendarEvents]);

  const nextSession = upcomingSessions[0];
  const daysToNext = nextSession ? daysUntil(nextSession.start_at) : null;

  // Check CV readiness
  const hasCv = Boolean(user?.profileVerified || validDocs > 0);

  // Compute readiness score & breakdown
  const { readinessScore, readinessBreakdown } = useMemo(() => {
    const hasIdentity = Boolean(user?.profileVerified || validDocs > 0);
    const hasLanguage = Boolean(user?.title || validDocs >= 2);
    const hasRirekisho = hasCv;
    const hasCurriculum = overallProgress >= 50;

    let score = 0;
    if (hasIdentity) score += 25;
    if (hasLanguage) score += 25;
    if (hasRirekisho) score += 25;
    if (hasCurriculum) score += 25;

    return {
      readinessScore: score,
      readinessBreakdown: [
        { label: "Verifikasi KTP / Identitas", passed: hasIdentity },
        { label: "Level JLPT / Bahasa Jepang", passed: hasLanguage },
        { label: "Rirekisho (CV Standar Jepang)", passed: hasRirekisho },
        { label: "Kemajuan Kurikulum (≥50%)", passed: hasCurriculum },
      ],
    };
  }, [user, validDocs, hasCv, overallProgress]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Action-Oriented Hero Banner */}
      <ActionHero
        user={user}
        pendingDocsCount={pendingDocs}
        rejectedDocsCount={rejectedDocs}
        approvedDocsCount={validDocs}
        hasCv={hasCv}
        activeJobsCount={myApps.length}
      />

      {/* 2. Readiness Gauge & Core Metrics Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2">
          <ReadinessGauge
            score={readinessScore}
            title="Skor Kesiapan Karier Jepang"
            subtitle="Japan Job Readiness Assessment (日本就職準備度)"
            breakdown={readinessBreakdown}
            className="h-full"
          />
        </div>

        {/* Quick Shortcut Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <Link
            to="/student/cv"
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all group text-decoration-none"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Japanese CV Builder
                </h3>
                <p className="text-xs text-slate-500">履歴書 (JIS Standard PDF)</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/student/jobs"
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all group text-decoration-none"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Job Matching & Scout
                </h3>
                <p className="text-xs text-slate-500">Lowongan Aktif & Lamaran</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 3. The Pathway to Japan: 4-Stage Milestone Roadmap */}
      <PathwayMilestoneRoadmap
        status={{
          hasUploadedDocs: documents.length > 0,
          isVerified: Boolean(user?.profileVerified),
          hasCv,
          appliedJobsCount: myApps.length,
          completedCoursesCount: completedCount,
        }}
      />

      {/* 4. Stat Cards Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Progress Kurikulum"
          value={overallProgress}
          unit="%"
          icon="📊"
          sublabel={`${completedCount} dari ${courses.length || 4} modul selesai`}
          accent="red"
          trend={{
            value: `${overallProgress}% tercapai`,
            positive: overallProgress > 0,
          }}
        />
        <StatCard
          label="Dokumen Terverifikasi"
          value={validDocs}
          unit="berkas"
          icon="🔐"
          sublabel={`${documents.length} dokumen di vault`}
          accent="green"
        />
        <StatCard
          label="Lamaran Terkirim"
          value={myApps.length}
          unit="posisi"
          icon="💼"
          sublabel="Status dalam evaluasi"
          accent="blue"
        />
        <StatCard
          label="Sesi Mentoring Berikutnya"
          value={daysToNext !== null ? daysToNext : "—"}
          unit={daysToNext !== null ? "hari lagi" : ""}
          icon="📅"
          sublabel={nextSession ? nextSession.title : "Belum ada jadwal"}
          accent="gold"
        />
      </section>

      {/* 5. Two-Column Dashboard Details: Curriculum & Vault / Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Curriculum Progress */}
        <div className="lg:col-span-2">
          <Card
            title="Curriculum Learning Track"
            subtitle="カリキュラムトラック — Persiapan Bahasa & Budaya Kerja Jepang"
            padding="lg"
            headerAction={
              <Link to="/student/courses" className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
                Lihat Semua Modul <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {courses.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Belum ada modul kursus yang terdaftar.
              </p>
            ) : (
              <ol className="space-y-4">
                {courses.map((mod, idx) => {
                  const cp = courseProgress.find(
                    (p) => (p.course_id ?? p.id) === mod.id,
                  );
                  const isCompleted = cp?.status === "completed";
                  const isInProgress = cp?.status === "in_progress";
                  const progress = cp?.progress_pct ?? 0;

                  return (
                    <li
                      key={mod.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400">
                              Phase {mod.phase || idx + 1}
                            </span>
                            <Badge
                              variant={moduleStatusVariant(
                                isCompleted
                                  ? "completed"
                                  : isInProgress
                                    ? "in_progress"
                                    : "default",
                              )}
                              size="sm"
                            >
                              {moduleStatusLabel(
                                isCompleted
                                  ? "completed"
                                  : isInProgress
                                    ? "in_progress"
                                    : "default",
                              )}
                            </Badge>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {mod.title}
                          </h4>
                          {mod.title_jp && (
                            <p className="text-xs text-slate-400 font-medium">
                              {mod.title_jp}
                            </p>
                          )}
                        </div>
                      </div>
                      <ProgressBar
                        value={progress}
                        variant={isCompleted ? "success" : "accent"}
                        size="sm"
                        showValue
                      />
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </div>

        {/* Right: Document Vault & Upcoming Sessions */}
        <div className="space-y-6">
          {/* Document Vault Mini List */}
          <Card
            title="Document Vault"
            subtitle="Dokumen Verifikasi"
            padding="lg"
            headerAction={
              <Link to="/student/vault" className="text-xs font-semibold text-red-600 hover:text-red-700">
                Kelola ({documents.length})
              </Link>
            }
          >
            {documents.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-slate-500">
                  Belum ada dokumen yang diunggah.
                </p>
                <Link to="/student/vault">
                  <Button size="sm" variant="secondary">
                    Unggah Dokumen
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {documents.slice(0, 4).map((cred) => (
                  <li
                    key={cred.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-100 bg-white"
                  >
                    <span className="text-xl shrink-0">{credentialIcon(cred.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {cred.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatDate(cred.issued_date || cred.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={credentialStatusVariant(cred.verification_status)}
                      size="sm"
                      dot
                    >
                      {credentialStatusLabel(cred.verification_status)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Upcoming Sessions */}
          <Card
            title="Agenda & Kelas"
            subtitle="Sesi Mendatang"
            padding="lg"
            headerAction={
              <Link to="/student/calendar" className="text-xs font-semibold text-slate-500 hover:text-slate-700">
                Kalender
              </Link>
            }
          >
            {upcomingSessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-5">
                Tidak ada agenda kelas dalam waktu dekat.
              </p>
            ) : (
              <ul className="space-y-3">
                {upcomingSessions.map((sess) => (
                  <li
                    key={sess.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/60"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {sess.type === "partner_meeting" ? "Mitra / Mentor" : "Pelatihan"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(sess.start_at)}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{sess.title}</h5>
                    {sess.title_jp && (
                      <p className="text-[11px] text-slate-400">{sess.title_jp}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
