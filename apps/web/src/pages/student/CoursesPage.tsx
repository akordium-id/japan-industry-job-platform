import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  useCourses,
  useMyCourseProgress,
  useEnrollCourse,
  useUpdateCourseProgress,
} from "@/api/hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const PHASE_ICONS: Record<number, string> = {
  1: "🎌",
  2: "🏢",
  3: "🤝",
  4: "🎓",
};

interface SubTopic {
  id: number;
  title: string;
  title_jp: string;
  duration_minutes: number;
}

const DEFAULT_SYLLABUS: Record<number, SubTopic[]> = {
  1: [
    {
      id: 101,
      title: "Hiragana & Katakana Vowels and Consonants",
      title_jp: "五十音・平仮名・片仮名",
      duration_minutes: 45,
    },
    {
      id: 102,
      title: "Basic Conversation & Formal Greetings (Aisatsu)",
      title_jp: "日常挨拶と自己紹介",
      duration_minutes: 60,
    },
    {
      id: 103,
      title: "Basic Sentence Patterns & Particles",
      title_jp: "基本文型と助詞",
      duration_minutes: 90,
    },
    {
      id: 104,
      title: "Factory Vocabulary & Workplace Safety",
      title_jp: "工場語彙と労働安全",
      duration_minutes: 75,
    },
  ],
  2: [
    {
      id: 201,
      title: "5S Principles",
      title_jp: "5Sの徹底理解",
      duration_minutes: 60,
    },
    {
      id: 202,
      title: "Horenso Communication",
      title_jp: "報連相の実践",
      duration_minutes: 60,
    },
    {
      id: 203,
      title: "Hierarchy & Honne/Tatemae",
      title_jp: "企業階層と本音・建前",
      duration_minutes: 75,
    },
    {
      id: 204,
      title: "Business Card Etiquette",
      title_jp: "名刺交換・上座下座マナー",
      duration_minutes: 45,
    },
  ],
  3: [
    {
      id: 301,
      title: "Sonkeigo (Respect Language)",
      title_jp: "尊敬語の習得",
      duration_minutes: 60,
    },
    {
      id: 302,
      title: "Kenjougo (Humble Language)",
      title_jp: "謙譲語の運用",
      duration_minutes: 60,
    },
    {
      id: 303,
      title: "Phone & Formal Email Simulation",
      title_jp: "電話・ビジネスメール対応",
      duration_minutes: 90,
    },
    {
      id: 304,
      title: "Meeting & Negotiation Simulation",
      title_jp: "シルバー人材合同ロールプレイング",
      duration_minutes: 120,
    },
  ],
  4: [
    {
      id: 401,
      title: "JIS-Standard Rirekisho",
      title_jp: "JIS規格履歴書の作成",
      duration_minutes: 90,
    },
    {
      id: 402,
      title: "Interview Simulation (Mensetsu)",
      title_jp: "採用面接シミュレーション",
      duration_minutes: 90,
    },
    {
      id: 403,
      title: "Final Competency Assessment",
      title_jp: "修了総合検定",
      duration_minutes: 120,
    },
  ],
};

function statusLabel(status?: string, isLocked?: boolean): string {
  if (isLocked) return "Locked — complete previous phase first";
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "Ongoing";
    case "enrolled":
      return "Enrolled";
    default:
      return "Available";
  }
}

function statusVariant(
  status?: string,
  isLocked?: boolean,
): "success" | "accent" | "info" | "default" {
  if (isLocked) return "default";
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "accent";
    case "enrolled":
      return "info";
    default:
      return "default";
  }
}

export default function CoursesPage() {
  const {
    data: courses = [],
    isLoading: loadingCourses,
    error: courseError,
  } = useCourses();
  const { data: progress = [], isLoading: loadingProgress } =
    useMyCourseProgress();
  const enrollMutation = useEnrollCourse();
  const updateProgressMutation = useUpdateCourseProgress();

  const [checkedSubtopics, setCheckedSubtopics] = useState<
    Record<number, number[]>
  >(() => {
    try {
      const saved = localStorage.getItem("app_course_subtopics");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const loading = loadingCourses || loadingProgress;

  const completedCount = useMemo(
    () => progress.filter((p) => p.status === "completed").length,
    [progress],
  );

  const inProgressCount = useMemo(
    () =>
      progress.filter(
        (p) => p.status === "in_progress" || p.status === "enrolled",
      ).length,
    [progress],
  );

  const avgProgress = useMemo(() => {
    if (courses.length === 0) return 0;
    const total = courses.reduce((acc, c) => {
      const p = progress.find((cp) => (cp.course_id ?? cp.id) === c.id);
      return acc + (p?.progress_pct ?? 0);
    }, 0);
    return Math.round(total / courses.length);
  }, [courses, progress]);

  const sortedCourses = useMemo(
    () => [...courses].sort((a, b) => a.phase - b.phase),
    [courses],
  );

  function getCoursePct(courseId: number) {
    return (
      progress.find((p) => (p.course_id ?? p.id) === courseId)?.progress_pct ??
      0
    );
  }

  function getCourseStatus(courseId: number) {
    return progress.find((p) => (p.course_id ?? p.id) === courseId)?.status;
  }

  function isCourseLocked(phase: number): boolean {
    if (phase <= 1) return false;
    const prevCourse = sortedCourses.find((c) => c.phase === phase - 1);
    if (!prevCourse) return false;
    const prevProgress = progress.find(
      (p) => (p.course_id ?? p.id) === prevCourse.id,
    );
    return prevProgress?.status !== "completed";
  }

  function handleEnroll(courseId: number) {
    enrollMutation.mutate(courseId);
  }

  function handleToggleSubtopic(
    courseId: number,
    topicId: number,
    totalTopics: number,
  ) {
    const currentList = checkedSubtopics[courseId] ?? [];
    const isChecked = currentList.includes(topicId);
    const updatedList = isChecked
      ? currentList.filter((id) => id !== topicId)
      : [...currentList, topicId];

    const nextState = { ...checkedSubtopics, [courseId]: updatedList };
    setCheckedSubtopics(nextState);
    try {
      localStorage.setItem("app_course_subtopics", JSON.stringify(nextState));
    } catch {
      // ignore
    }

    const pct = Math.round((updatedList.length / totalTopics) * 100);
    updateProgressMutation.mutate({ courseId, progressPct: pct });
  }

  if (loading) {
    return (
      <div style={{ padding: "4rem var(--container-px)", textAlign: "center" }}>
        Loading curriculum...
      </div>
    );
  }

  if (courseError) {
    return (
      <div
        style={{
          padding: "4rem var(--container-px)",
          textAlign: "center",
          color: "var(--color-error)",
        }}
      >
        Failed to load curriculum.
      </div>
    );
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
      <header>
        <h1>Curriculum & courses</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          A staged vocational training program aligned with Japanese industry
          standards. Complete each phase in order to unlock the next and claim
          your certificate.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <StatCard
          label="Average progress"
          value={avgProgress}
          unit="%"
          icon="📊"
          sublabel={`${completedCount} of ${courses.length} modules done`}
          accent="red"
          trend={{
            value: `${avgProgress}% complete`,
            positive: avgProgress > 0,
          }}
        />
        <StatCard
          label="Modules done"
          value={completedCount}
          unit={`/ ${courses.length}`}
          icon="✅"
          sublabel="Validated completions"
          accent="green"
        />
        <StatCard
          label="Currently learning"
          value={inProgressCount}
          unit="courses"
          icon="📖"
          sublabel="Actively enrolled"
          accent="blue"
        />
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {sortedCourses.map((c) => {
          const pct = getCoursePct(c.id);
          const status = getCourseStatus(c.id);
          const isCompleted = status === "completed";
          const isLocked = isCourseLocked(c.phase);
          const icon = PHASE_ICONS[c.phase] ?? "📚";
          const subtopics = DEFAULT_SYLLABUS[c.phase] ?? [];
          const completedTopics = checkedSubtopics[c.id] ?? [];

          return (
            <Card
              key={c.id}
              title={`${icon} Phase ${c.phase} — ${c.title}`}
              subtitle={c.title_jp}
              padding="lg"
              headerAction={
                <Badge variant={statusVariant(status, isLocked)} size="sm">
                  {isLocked ? "🔒 Locked" : statusLabel(status)}
                </Badge>
              }
            >
              {c.description && (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {c.description}
                </p>
              )}

              {isLocked && (
                <div
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    background: "var(--color-warning-soft)",
                    color: "var(--color-warning)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-sm)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  🔒 Complete 100% of Phase {c.phase - 1} to unlock.
                </div>
              )}

              <div style={{ marginBottom: "var(--space-3)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--text-sm)",
                    marginBottom: 6,
                  }}
                >
                  <span>Progress</span>
                  <strong>{isLocked ? "0%" : `${pct}%`}</strong>
                </div>
                <ProgressBar
                  value={isLocked ? 0 : pct}
                  variant={isCompleted ? "success" : "accent"}
                  size="sm"
                />
              </div>

              {subtopics.length > 0 && (
                <div style={{ marginBottom: "var(--space-3)" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    <span>Syllabus ({subtopics.length} sessions)</span>
                    <span>
                      {completedTopics.length}/{subtopics.length} done
                    </span>
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {subtopics.map((m) => {
                      const isTopicDone =
                        isCompleted || completedTopics.includes(m.id);
                      return (
                        <li
                          key={m.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "var(--space-2)",
                            fontSize: "var(--text-sm)",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`topic-${c.id}-${m.id}`}
                            checked={isTopicDone}
                            disabled={isLocked || !status || isCompleted}
                            onChange={() =>
                              handleToggleSubtopic(c.id, m.id, subtopics.length)
                            }
                          />
                          <label
                            htmlFor={`topic-${c.id}-${m.id}`}
                            style={{ flex: 1 }}
                          >
                            <div>{m.title}</div>
                            <div
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-text-tertiary)",
                              }}
                            >
                              {m.title_jp} · {m.duration_minutes} min
                            </div>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "var(--space-3)",
                }}
              >
                {isLocked ? (
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    Previous phase incomplete
                  </span>
                ) : !status ? (
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={enrollMutation.isPending}
                    onClick={() => handleEnroll(c.id)}
                  >
                    {enrollMutation.isPending
                      ? "Enrolling..."
                      : "Start this phase"}
                  </Button>
                ) : isCompleted ? (
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-success)",
                      fontWeight: 600,
                    }}
                  >
                    ✓ Phase complete
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Check items above to add progress
                  </span>
                )}

                {status && !isCompleted && !isLocked && (
                  <Link
                    to="/student/calendar"
                    style={{ textDecoration: "none" }}
                  >
                    <Button size="sm" variant="ghost">
                      Schedule
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
