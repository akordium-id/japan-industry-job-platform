import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { CAREER_MILESTONES, type CareerMilestone } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

const TYPE_CONFIG: Record<
  CareerMilestone["type"],
  { icon: string; label: string; color: string }
> = {
  placement: { icon: "🛫", label: "Placement", color: "info" },
  promotion: { icon: "⬆️", label: "Promotion", color: "success" },
  contract_renewal: { icon: "📝", label: "Contract renewal", color: "warning" },
  transfer: { icon: "🔄", label: "Transfer", color: "default" },
  certification: { icon: "🏅", label: "Certification", color: "accent" },
  notification: { icon: "⚡", label: "Recommendation", color: "danger" },
};

function monthsDiff(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return (
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  );
}

export default function CareerTimeline() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const startDate = CAREER_MILESTONES[0]?.date ?? "";
  const totalMonths = monthsDiff(
    startDate,
    new Date().toISOString().slice(0, 10),
  );

  const proactive = CAREER_MILESTONES.filter((m) => m.isProactive);
  const timeline = CAREER_MILESTONES.filter((m) => !m.isProactive);

  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("app_dismissed_recommendations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [consultForm, setConsultForm] = useState({
    topic: "Contract negotiation & salary review",
    preferredDate: new Date(Date.now() + 86400000 * 3)
      .toISOString()
      .slice(0, 10),
    preferredTime: "14:00",
    notes: "",
  });

  function handleOpenConsultModal(m: CareerMilestone) {
    setConsultForm((prev) => ({
      ...prev,
      topic: m.title.replace("⚡ ", "").trim(),
    }));
    setBookingSuccess(false);
    setIsConsultModalOpen(true);
  }

  function handleDismissReminder(id: string) {
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    try {
      localStorage.setItem(
        "app_dismissed_recommendations",
        JSON.stringify(next),
      );
    } catch {
      // ignore
    }
  }

  function handleRestoreReminder(id: string) {
    const next = dismissedIds.filter((item) => item !== id);
    setDismissedIds(next);
    try {
      localStorage.setItem(
        "app_dismissed_recommendations",
        JSON.stringify(next),
      );
    } catch {
      // ignore
    }
  }

  function handleSubmitConsultation(e: React.FormEvent) {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setIsConsultModalOpen(false);
      setBookingSuccess(false);
    }, 2500);
  }

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
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <h1>Career timeline</h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Long-term career history and guidance for alumni.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: 700,
                color: "var(--color-accent)",
              }}
            >
              {totalMonths}
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
              }}
            >
              Months in Japan
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: 700,
                color: "var(--color-accent)",
              }}
            >
              {user?.company?.split(" ")[0] ?? "—"}
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
              }}
            >
              Company
            </div>
          </div>
        </div>
      </header>

      {proactive.map((m) => {
        const isDismissed = dismissedIds.includes(m.id);
        if (isDismissed) {
          return (
            <div
              key={m.id}
              style={{
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface-2)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "var(--text-sm)",
              }}
            >
              <span>
                🔔 Reminder for <strong>{m.title}</strong> snoozed for 7 days.
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRestoreReminder(m.id)}
              >
                Show again
              </Button>
            </div>
          );
        }

        return (
          <div
            key={m.id}
            style={{
              padding: "var(--space-4)",
              background: "var(--color-warning-soft)",
              border: "1px solid var(--color-warning)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-3)",
              }}
            >
              <span style={{ fontSize: 28 }}>⚡</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-2)",
                    alignItems: "center",
                  }}
                >
                  <strong>{m.title}</strong>
                  <Badge variant="warning" size="sm">
                    Career tip
                  </Badge>
                </div>
                <p
                  style={{ color: "var(--color-text-secondary)", marginTop: 6 }}
                >
                  {m.description}
                </p>
              </div>
            </div>
            {m.proactiveMessage && (
              <div
                style={{
                  padding: "var(--space-3)",
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                  display: "flex",
                  gap: "var(--space-2)",
                }}
              >
                <span>📊</span>
                <p>{m.proactiveMessage}</p>
              </div>
            )}
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenConsultModal(m)}
              >
                Schedule consultation
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDismissReminder(m.id)}
              >
                Snooze
              </Button>
            </div>
          </div>
        );
      })}

      {isConsultModalOpen && (
        <div
          onClick={() => setIsConsultModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "var(--space-4)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              maxWidth: 520,
              width: "100%",
              padding: "var(--space-6)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-4)",
              }}
            >
              <h2 style={{ fontSize: "var(--text-xl)" }}>
                Schedule career consultation
              </h2>
              <button
                onClick={() => setIsConsultModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "var(--space-6)" }}>
                <span style={{ fontSize: 36 }}>🎉</span>
                <h3 style={{ marginTop: "var(--space-2)" }}>
                  Request submitted
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Consultation request for <strong>{consultForm.topic}</strong>{" "}
                  on{" "}
                  <strong>
                    {formatDate(consultForm.preferredDate)} at{" "}
                    {consultForm.preferredTime} JST
                  </strong>{" "}
                  has been forwarded to a career consultant. You will receive a
                  meeting link shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitConsultation}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
                  >
                    Topic
                  </label>
                  <input
                    value={consultForm.topic}
                    onChange={(e) =>
                      setConsultForm((f) => ({ ...f, topic: e.target.value }))
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "var(--space-2) var(--space-3)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      marginTop: 4,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--space-3)",
                  }}
                >
                  <div>
                    <label
                      style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
                    >
                      Preferred date
                    </label>
                    <input
                      type="date"
                      value={consultForm.preferredDate}
                      onChange={(e) =>
                        setConsultForm((f) => ({
                          ...f,
                          preferredDate: e.target.value,
                        }))
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "var(--space-2) var(--space-3)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        marginTop: 4,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
                    >
                      Time (JST)
                    </label>
                    <select
                      value={consultForm.preferredTime}
                      onChange={(e) =>
                        setConsultForm((f) => ({
                          ...f,
                          preferredTime: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "var(--space-2) var(--space-3)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        marginTop: 4,
                      }}
                    >
                      <option value="10:00">10:00 - 11:00 JST</option>
                      <option value="14:00">14:00 - 15:00 JST</option>
                      <option value="16:00">16:00 - 17:00 JST</option>
                      <option value="19:00">19:00 - 20:00 JST (evening)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
                  >
                    Notes
                  </label>
                  <textarea
                    placeholder="Specific questions, benchmarks you want to compare..."
                    value={consultForm.notes}
                    onChange={(e) =>
                      setConsultForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "var(--space-2) var(--space-3)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      marginTop: 4,
                      resize: "vertical",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "var(--space-2)",
                  }}
                >
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsConsultModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Submit
                  </Button>
                </div>
              </form>
            )}
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
        <div>
          <h2 style={{ marginBottom: "var(--space-3)" }}>Career timeline</h2>
          <ol
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {timeline.map((milestone, idx) => {
              const cfg = TYPE_CONFIG[milestone.type];
              const isExpanded = expandedId === milestone.id;
              const isLast = idx === timeline.length - 1;
              return (
                <li
                  key={milestone.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "32px 1fr",
                    gap: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background:
                          milestone.type === "notification"
                            ? "var(--color-error)"
                            : "var(--color-primary)",
                        color: "var(--color-text-inverse)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                      }}
                    >
                      {cfg.icon}
                    </div>
                    {!isLast && (
                      <div
                        style={{
                          flex: 1,
                          width: 2,
                          background: "var(--color-border)",
                          marginTop: "var(--space-2)",
                        }}
                      />
                    )}
                  </div>
                  <div
                    onClick={() =>
                      setExpandedId(isExpanded ? null : milestone.id)
                    }
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-2)",
                          alignItems: "center",
                        }}
                      >
                        <Badge
                          variant={
                            cfg.color as
                              | "info"
                              | "success"
                              | "warning"
                              | "default"
                              | "accent"
                              | "danger"
                          }
                          size="sm"
                        >
                          {cfg.label}
                        </Badge>
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          {formatDate(milestone.date)}
                        </span>
                      </div>
                      {milestone.salaryChange && (
                        <span
                          style={{
                            background: "var(--color-success-soft)",
                            color: "var(--color-success)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                          }}
                        >
                          {milestone.salaryChange}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "var(--text-base)", marginTop: 6 }}>
                      {milestone.title}
                    </h3>
                    {milestone.titleJp && (
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {milestone.titleJp}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                        marginTop: 6,
                      }}
                    >
                      <span>🏢 {milestone.company}</span>
                      <span>📍 {milestone.location}</span>
                    </div>
                    {isExpanded && (
                      <p
                        style={{
                          marginTop: "var(--space-2)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {milestone.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
            <li
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--color-surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: "var(--color-text-tertiary)",
                }}
              >
                ?
              </div>
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Your next milestone will appear here.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <Card title="Career statistics" padding="md">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "var(--space-3)",
              }}
            >
              {[
                {
                  label: "Months worked",
                  value: `${totalMonths}`,
                  unit: "months",
                },
                { label: "Promotions", value: "1", unit: "times" },
                { label: "Certifications", value: "2", unit: "total" },
                { label: "Companies", value: "1", unit: "" },
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
                    {s.value}{" "}
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      {s.unit}
                    </span>
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

          <Card
            title="Strategic next steps"
            subtitle="Recommendations"
            padding="md"
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
                  icon: "📋",
                  title: "Contract negotiation",
                  desc: "Months 15-18 are optimal. You're currently at month 15.",
                  urgency: "danger" as const,
                },
                {
                  icon: "📜",
                  title: "Quality engineer certification",
                  desc: "Boost your market value with QE certification.",
                  urgency: "warning" as const,
                },
                {
                  icon: "🌐",
                  title: "Reach JLPT N2",
                  desc: "N2 opens pathways to managerial-level positions.",
                  urgency: "info" as const,
                },
              ].map((s) => (
                <div
                  key={s.title}
                  style={{
                    padding: "var(--space-3)",
                    background: "var(--color-surface-2)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-3)",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "var(--font-semibold)" }}>
                      {s.title}
                    </p>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                  <Badge
                    variant={
                      s.urgency === "danger"
                        ? "danger"
                        : s.urgency === "warning"
                          ? "warning"
                          : "info"
                    }
                    size="sm"
                  >
                    {s.urgency === "danger"
                      ? "Now"
                      : s.urgency === "warning"
                        ? "Important"
                        : "Suggested"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
