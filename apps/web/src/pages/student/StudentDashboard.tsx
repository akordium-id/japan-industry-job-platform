import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import {
  useCourses,
  useMyCourseProgress,
  useMyDocuments,
  useCalendarEvents,
} from "@/api/hooks";
import { documentApi } from "@/api/documents";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn, formatDate, daysUntil } from "@/lib/utils";

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

function sessionTypeBadge(type: string): "info" | "silver" {
  return type === "partner_meeting" ? "silver" : "info";
}

function sessionTypeLabel(type: string): string {
  switch (type) {
    case "partner_meeting":
      return "Partner / Mentor";
    case "class":
      return "Training";
    case "event":
      return "Workshop";
    case "deadline":
      return "Deadline";
    default:
      return "Session";
  }
}

const containerStyle: React.CSSProperties = {
  maxWidth: "var(--content-max-width)",
  margin: "0 auto",
  padding: "var(--space-6) var(--container-px)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-6)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "var(--space-4)",
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "var(--space-4)",
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
  gap: "var(--space-5)",
};

const stepList: React.CSSProperties = {
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-4)",
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: documents = [] } = useMyDocuments();
  const { data: courses = [] } = useCourses();
  const { data: courseProgress = [] } = useMyCourseProgress();
  const { data: calendarEvents = [] } = useCalendarEvents();

  const validDocs = useMemo(
    () => documents.filter((c) => c.verification_status === "approved").length,
    [documents],
  );

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

  const displayName = user?.name ?? "Student";
  const userId = user?.id?.toString().padStart(4, "0").toUpperCase() ?? "0001";

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <Avatar name={displayName} size="lg" role="student" />
          <div>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-tertiary)",
              }}
            >
              Welcome back,
            </p>
            <h1 style={{ fontSize: "var(--text-2xl)" }}>{displayName}</h1>
            {user?.title && (
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {user.title}
              </p>
            )}
            <div
              style={{ display: "flex", gap: "var(--space-2)", marginTop: 8 }}
            >
              <Badge variant="student" size="sm">
                ID: {userId}
              </Badge>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link to="/student/profile" style={{ textDecoration: "none" }}>
            <Button variant="secondary" size="sm">
              Edit profile
            </Button>
          </Link>
          <Link to="/student/calendar" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
              Calendar
            </Button>
          </Link>
          <Link to="/student/courses" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
              Courses
            </Button>
          </Link>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <Link
          to="/student/cv"
          style={{
            textDecoration: "none",
            background: "var(--color-surface)",
            padding: "var(--space-5)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <span style={{ fontSize: 28 }}>📄</span>
            <div>
              <h3 style={{ fontSize: "var(--text-base)" }}>
                CV Builder (履歴書)
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Generate and download JIS-standard Rirekisho as PDF.
              </p>
            </div>
          </div>
          <span style={{ color: "var(--color-accent)" }}>→</span>
        </Link>
        <Link
          to="/student/jobs"
          style={{
            textDecoration: "none",
            background: "var(--color-surface)",
            padding: "var(--space-5)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <span style={{ fontSize: 28 }}>💼</span>
            <div>
              <h3 style={{ fontSize: "var(--text-base)" }}>Job Marketplace</h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Explore positions from partner companies and track applications.
              </p>
            </div>
          </div>
          <span style={{ color: "var(--color-accent)" }}>→</span>
        </Link>
      </section>

      <section style={statsGrid}>
        <StatCard
          label="Overall progress"
          value={overallProgress}
          unit="%"
          icon="📊"
          sublabel={`${completedCount} of ${courses.length || 4} modules`}
          accent="red"
          trend={{
            value: `${overallProgress}% complete`,
            positive: overallProgress > 0,
          }}
        />
        <StatCard
          label="Modules done"
          value={completedCount}
          unit={`/ ${courses.length || 4}`}
          icon="✅"
          sublabel={`${courseProgress.filter((p) => p.status === "in_progress").length} ongoing`}
          accent="green"
        />
        <StatCard
          label="Documents in vault"
          value={validDocs}
          unit="docs"
          icon="🔐"
          sublabel={`${documents.length} total`}
          accent="blue"
        />
        <StatCard
          label="Days to next session"
          value={daysToNext !== null ? daysToNext : "—"}
          unit={daysToNext !== null ? "days" : ""}
          icon="📅"
          sublabel={nextSession ? nextSession.title : "No upcoming session"}
          accent="gold"
        />
      </section>

      <div className="dashboard-grid" style={twoColGrid}>
        <Card
          title="Curriculum Track"
          subtitle="カリキュラムトラック"
          padding="lg"
        >
          {courses.length === 0 ? (
            <p style={{ color: "var(--color-text-secondary)" }}>
              No active courses.
            </p>
          ) : (
            <ol style={stepList}>
              {courses.map((mod, idx) => {
                const isLast = idx === courses.length - 1;
                const cp = courseProgress.find(
                  (p) => (p.course_id ?? p.id) === mod.id,
                );
                const isCompleted = cp?.status === "completed";
                const isInProgress = cp?.status === "in_progress";
                const progress = cp?.progress_pct ?? 0;
                return (
                  <li
                    key={mod.id}
                    style={{
                      paddingLeft: "var(--space-6)",
                      borderLeft: isLast
                        ? "none"
                        : "2px solid var(--color-border)",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: -8,
                        top: 0,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: isCompleted
                          ? "var(--color-success)"
                          : isInProgress
                            ? "var(--color-accent)"
                            : "var(--color-border)",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          Phase {mod.phase || idx + 1}
                        </span>
                        <h3 style={{ fontSize: "var(--text-base)" }}>
                          {mod.title}
                        </h3>
                        {mod.title_jp && (
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--color-text-tertiary)",
                            }}
                          >
                            {mod.title_jp}
                          </p>
                        )}
                      </div>
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <Card
            title="Document Vault"
            subtitle="Credentials"
            padding="lg"
            headerAction={
              <Badge variant="info" size="sm">
                {documents.length} docs
              </Badge>
            }
          >
            {documents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  No documents uploaded yet.
                </p>
                <Link to="/student/vault">
                  <Button size="sm" variant="secondary">
                    Upload documents
                  </Button>
                </Link>
              </div>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {documents.slice(0, 4).map((cred) => (
                  <li
                    key={cred.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--space-3)",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>
                      {credentialIcon(cred.type)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: "var(--font-medium)" }}>
                        {cred.title}
                      </p>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {formatDate(cred.issued_date || cred.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={credentialStatusVariant(
                        cred.verification_status,
                      )}
                      size="sm"
                      dot
                    >
                      {credentialStatusLabel(cred.verification_status)}
                    </Badge>
                    <a
                      href={documentApi.fileUrl(cred.id)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card
            title="Upcoming sessions"
            subtitle="セッション予定"
            padding="lg"
            headerAction={
              <Badge variant="accent" size="sm" dot>
                {upcomingSessions.length} scheduled
              </Badge>
            }
          >
            {upcomingSessions.length === 0 ? (
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  textAlign: "center",
                }}
              >
                No sessions scheduled.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {upcomingSessions.map((sess) => (
                  <li key={sess.id}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <Badge variant={sessionTypeBadge(sess.type)} size="sm">
                        {sessionTypeLabel(sess.type)}
                      </Badge>
                    </div>
                    <h4 style={{ fontSize: "var(--text-base)" }}>
                      {sess.title}
                    </h4>
                    {sess.title_jp && (
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {sess.title_jp}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                        marginTop: "var(--space-1)",
                      }}
                    >
                      {formatDate(sess.start_at)} ·{" "}
                      {typeof sess.start_at === "string" &&
                      sess.start_at.length >= 16
                        ? sess.start_at.slice(11, 16)
                        : "09:00"}
                    </p>
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

void cn;
