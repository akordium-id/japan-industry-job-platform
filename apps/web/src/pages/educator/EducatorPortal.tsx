import { useState, useMemo } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useCalendarEvents, useCourses } from "@/api/hooks";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

type EducatorMode = "bilingual" | "silver";

export default function EducatorPortal() {
  const { user } = useAuth();
  const isSilver = user?.role === "educator_silver";
  const [mode, setMode] = useState<EducatorMode>(
    isSilver ? "silver" : "bilingual",
  );
  const [activeSession, setActiveSession] = useState<{
    id: number;
    title: string;
    title_jp?: string;
    description?: string;
    start_at?: string;
  } | null>(null);

  const { data: calendarEvents = [] } = useCalendarEvents();
  const { data: courses = [] } = useCourses();

  const scheduled = useMemo(() => {
    const now = new Date().toISOString();
    return calendarEvents.filter((e) => {
      const matchMode =
        mode === "silver" ? e.type === "partner_meeting" : e.type === "class";
      return (
        matchMode &&
        (e.start_at >= now || e.start_at.slice(0, 10) >= now.slice(0, 10))
      );
    });
  }, [calendarEvents, mode]);

  const completedSessions = useMemo(() => {
    const now = new Date().toISOString();
    return calendarEvents.filter((e) => {
      const matchMode =
        mode === "silver" ? e.type === "partner_meeting" : e.type === "class";
      return (
        matchMode &&
        e.start_at < now &&
        e.start_at.slice(0, 10) < now.slice(0, 10)
      );
    });
  }, [calendarEvents, mode]);

  return (
    <div
      style={{
        maxWidth: "var(--content-max-width)",
        margin: "0 auto",
        padding: "var(--space-6) var(--container-px)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
      data-mode={mode === "silver" ? "silver" : undefined}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
        >
          <Avatar
            name={user?.name ?? "M"}
            size="lg"
            role={isSilver ? "silver" : "educator"}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <h1>Educator & mentor portal</h1>
              <Badge variant={isSilver ? "silver" : "educator"} size="sm">
                {isSilver ? "Senior Mentor" : "Educator"}
              </Badge>
            </div>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              {user?.name ?? "Instructor"}
              {user?.nameJp ? ` (${user.nameJp})` : ""} ·{" "}
              {user?.title ??
                (isSilver
                  ? "Senior industry mentor"
                  : "Japanese language instructor")}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-tertiary)",
            }}
          >
            Interface mode:
          </span>
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "var(--color-surface-2)",
              padding: 4,
              borderRadius: "var(--radius-md)",
            }}
          >
            <button
              onClick={() => setMode("bilingual")}
              style={{
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius)",
                background:
                  mode === "bilingual" ? "var(--color-surface)" : "transparent",
                fontSize: "var(--text-sm)",
              }}
            >
              📚 Bilingual
            </button>
            <button
              onClick={() => setMode("silver")}
              style={{
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius)",
                background:
                  mode === "silver" ? "var(--color-surface)" : "transparent",
                fontSize: "var(--text-sm)",
              }}
            >
              👴 Senior
            </button>
          </div>
        </div>
      </header>

      <div
        style={{
          padding: "var(--space-4)",
          background:
            mode === "silver"
              ? "var(--color-role-silver)"
              : "var(--color-role-educator)",
          color: "var(--color-text-inverse)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <span style={{ fontSize: 28 }}>{mode === "silver" ? "🗾" : "📚"}</span>
        <div style={{ flex: 1 }}>
          <strong>
            {mode === "silver"
              ? "Senior mentor mode"
              : "Bilingual educator mode"}
          </strong>
          <p style={{ fontSize: "var(--text-sm)", opacity: 0.9 }}>
            {mode === "silver"
              ? "Larger fonts and high contrast for senior mentors."
              : "Manage modules and assessment with bilingual guidance."}
          </p>
        </div>
      </div>

      {activeSession && (
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-error-soft)",
            border: "1px solid var(--color-error)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-3)",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "var(--color-error)",
                  letterSpacing: "0.05em",
                }}
              >
                ● LIVE
              </span>
              <h3 style={{ fontSize: "var(--text-lg)", marginTop: 4 }}>
                {activeSession.title}
              </h3>
              {activeSession.title_jp && (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {activeSession.title_jp}
                </p>
              )}
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setActiveSession(null)}
            >
              End session
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            <span>📅 {activeSession.start_at?.slice(0, 10)}</span>
            <span>⏰ {activeSession.start_at?.slice(11, 16)}</span>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: "var(--space-5)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <Card
            title={
              mode === "silver" ? "Scheduled sessions" : "Upcoming sessions"
            }
            subtitle={`${scheduled.length} sessions queued`}
          >
            {scheduled.length === 0 ? (
              <p style={{ color: "var(--color-text-secondary)" }}>
                No upcoming sessions in the calendar.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {scheduled.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-surface)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      <Badge
                        variant={mode === "silver" ? "silver" : "educator"}
                        size="sm"
                      >
                        {mode === "silver" ? "Senior mentor" : "Bilingual"}
                      </Badge>
                      <Badge variant="warning" size="sm">
                        Scheduled
                      </Badge>
                    </div>
                    <h4 style={{ fontSize: "var(--text-base)" }}>
                      {session.title}
                    </h4>
                    {session.title_jp && (
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {session.title_jp}
                      </p>
                    )}
                    {session.description && (
                      <p
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--color-text-secondary)",
                          marginTop: 6,
                        }}
                      >
                        {session.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                        marginTop: "var(--space-2)",
                      }}
                    >
                      <span>📅 {session.start_at.slice(0, 10)}</span>
                      <span>⏰ {session.start_at.slice(11, 16)}</span>
                    </div>
                    <div style={{ marginTop: "var(--space-3)" }}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActiveSession(session)}
                      >
                        Start session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title={mode === "silver" ? "Past sessions" : "Session history"}
            subtitle={`${completedSessions.length} sessions completed`}
          >
            {completedSessions.length === 0 ? (
              <p style={{ color: "var(--color-text-secondary)" }}>
                No past sessions yet.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {completedSessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-surface)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Badge variant="success" size="sm">
                        Completed
                      </Badge>
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {session.start_at.slice(0, 10)}
                      </span>
                    </div>
                    <h4 style={{ fontSize: "var(--text-base)", marginTop: 6 }}>
                      {session.title}
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {mode === "silver" && (
            <Card
              title="Simulation room"
              subtitle="Role-play & negotiation"
              accent
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {[
                  {
                    icon: "🤝",
                    title: "Contract negotiation",
                    level: "Advanced",
                  },
                  {
                    icon: "📋",
                    title: "Executive project pitch",
                    level: "Intermediate",
                  },
                  { icon: "🍺", title: "Nomikai etiquette", level: "Beginner" },
                  {
                    icon: "📞",
                    title: "Business phone keigo",
                    level: "Intermediate",
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    style={{
                      padding: "var(--space-3)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "var(--font-semibold)" }}>
                        {s.title}
                      </p>
                    </div>
                    <Badge variant="silver" size="sm">
                      {s.level}
                    </Badge>
                    <Button variant="secondary" size="sm">
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          {mode !== "silver" && (
            <Card title="Curriculum" subtitle="Active modules">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                {courses.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: "var(--space-2) 0",
                      borderBottom: "1px solid var(--color-border-soft)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: "var(--font-medium)" }}>
                        {c.title}
                      </span>
                      <Badge variant="accent" size="sm">
                        Phase {c.phase}
                      </Badge>
                    </div>
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      {c.title_jp ?? "Course"}
                    </p>
                    <div style={{ marginTop: "var(--space-2)" }}>
                      <ProgressBar
                        value={100}
                        variant="accent"
                        size="sm"
                        showValue={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {mode === "silver" && (
            <Card title="Session notes" subtitle="Tacit knowledge log">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                <div
                  style={{
                    padding: "var(--space-3)",
                    background: "var(--color-surface-2)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    <span>2026-07-10</span>
                    <span>Sample candidate</span>
                  </div>
                  <p style={{ marginTop: "var(--space-2)" }}>
                    Strong on nomikai etiquette. Needs more practice with formal
                    aisatsu when meeting new clients.
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                style={{ marginTop: "var(--space-3)" }}
              >
                Add new note
              </Button>
            </Card>
          )}

          <Card title="Quick stats">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "var(--space-3)",
              }}
            >
              {[
                { label: "Total sessions", value: calendarEvents.length },
                { label: "Upcoming", value: scheduled.length },
                { label: "Completed", value: completedSessions.length },
                { label: "Courses available", value: courses.length },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "var(--space-3)",
                    background: "var(--color-surface-2)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "var(--text-2xl)",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
