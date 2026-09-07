import { useState, type FormEvent, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useScoutCandidates, useJobs } from "@/api/hooks";
import { jobApi, type ScoutCandidate } from "@/api/jobs";
import { cvApi } from "@/api/cv";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

function jlptVariant(level?: string): "accent" | "info" | "default" {
  if (level === "N3" || level === "N2" || level === "N1") return "accent";
  if (level === "N4") return "info";
  return "default";
}

interface InterviewModalProps {
  candidate: ScoutCandidate | null;
  jobs: Array<{ id: number; title: string; company_name?: string }>;
  onClose: () => void;
}

function InterviewModal({ candidate, jobs, onClose }: InterviewModalProps) {
  const [form, setForm] = useState({ jobId: jobs[0]?.id ?? 0, message: "" });
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!candidate) return;
    if (!form.jobId) {
      setModalError("Please choose a job.");
      return;
    }
    setLoading(true);
    setModalError(null);
    try {
      await jobApi.scout(form.jobId, candidate.id, form.message || undefined);
      onClose();
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to send scout.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={!!candidate}
      onClose={onClose}
      title="Request interview / scout"
      titleJp="面接リクエスト"
      size="md"
      footer={
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send invitation"}
          </Button>
        </div>
      }
    >
      {candidate && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {modalError && (
            <div
              style={{
                padding: "var(--space-3)",
                background: "var(--color-error-soft)",
                color: "var(--color-error)",
                borderRadius: "var(--radius-md)",
              }}
            >
              ⚠️ {modalError}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <Avatar name={candidate.name} size="md" role="student" />
            <div>
              <p style={{ fontWeight: "var(--font-semibold)" }}>
                {candidate.name}
              </p>
              {candidate.nameJp && (
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {candidate.nameJp}
                </p>
              )}
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-tertiary)",
                }}
              >
                {candidate.originCity ?? "Indonesia"} · JLPT{" "}
                {candidate.jlptLevel ?? "N4"}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            <div>
              <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
                Choose a job
              </label>
              {jobs.length === 0 ? (
                <p
                  style={{
                    color: "var(--color-error)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  No active jobs. Create one in "Manage jobs" first.
                </p>
              ) : (
                <select
                  value={form.jobId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, jobId: Number(e.target.value) }))
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "var(--space-2) var(--space-3)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    marginTop: 4,
                  }}
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} {j.company_name ? `(${j.company_name})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
                Message / offer
              </label>
              <textarea
                rows={4}
                placeholder="Why this candidate caught your attention..."
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
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
          </form>
        </div>
      )}
    </Modal>
  );
}

export default function CorporateDashboard() {
  const { user } = useAuth();
  const { data: rawCandidates = [], isLoading: loadingCandidates } =
    useScoutCandidates();
  const { data: jobsResponse } = useJobs();
  const jobs = jobsResponse?.jobs ?? [];

  const [search, setSearch] = useState("");
  const [jlptFilter, setJlptFilter] = useState<"All" | "N3" | "N4" | "N5">(
    "All",
  );
  const [specFilter, setSpecFilter] = useState("");
  const [interviewTarget, setInterviewTarget] = useState<ScoutCandidate | null>(
    null,
  );
  const [rirekishoCandidateId, setRirekishoCandidateId] = useState<number | "">(
    "",
  );
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rawCandidates.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (jlptFilter !== "All" && c.jlptLevel !== jlptFilter) return false;
      if (
        specFilter &&
        !c.specialization?.some((s) =>
          s.toLowerCase().includes(specFilter.toLowerCase()),
        )
      )
        return false;
      return true;
    });
  }, [rawCandidates, search, jlptFilter, specFilter]);

  async function handleGenerateRirekisho() {
    if (!rirekishoCandidateId) {
      setErrorBanner("Please select a candidate first.");
      return;
    }
    const cand = rawCandidates.find((c) => c.id === rirekishoCandidateId);
    if (!cand) return;
    setErrorBanner(null);
    try {
      await cvApi.triggerDownload(cand.id);
      setSuccessBanner(`Rirekisho for ${cand.name} downloaded.`);
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : "Failed to download Rirekisho",
      );
    }
  }

  const activeJobs = useMemo(
    () => jobs.filter((j) => j.is_active === 1),
    [jobs],
  );

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
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              alignItems: "center",
            }}
          >
            <h1>Recruitment portal</h1>
            <Badge variant="corporate" size="sm">
              Corporate
            </Badge>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {user?.company ?? "Sample Company"} · {user?.name ?? "Recruiter"} (
            {user?.title ?? "HR"})
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link to="/corporate/jobs" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
              Manage jobs
            </Button>
          </Link>
          <Link to="/corporate/scout" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="sm">
              Scout talent
            </Button>
          </Link>
        </div>
      </header>

      {successBanner && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-success-soft)",
            color: "var(--color-success)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--text-sm)",
          }}
        >
          <span>✅ {successBanner}</span>
          <button onClick={() => setSuccessBanner(null)}>✕</button>
        </div>
      )}
      {errorBanner && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-error-soft)",
            color: "var(--color-error)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--text-sm)",
          }}
        >
          <span>⚠️ {errorBanner}</span>
          <button onClick={() => setErrorBanner(null)}>✕</button>
        </div>
      )}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <StatCard
          label="Verified candidates"
          value={rawCandidates.length}
          icon="👥"
          accent="purple"
          sublabel="Ready for hiring"
        />
        <StatCard
          label="Active jobs"
          value={activeJobs.length}
          icon="💼"
          accent="green"
          sublabel="Published on the platform"
        />
        <StatCard
          label="Your company"
          value={user?.company ? "Active" : "Active"}
          icon="🏢"
          accent="blue"
          sublabel={user?.company ?? "Corporate HR"}
        />
        <StatCard
          label="CV standard"
          value="JIS S 5502"
          icon="📄"
          accent="gold"
          sublabel="Standard Japanese format"
        />
      </section>

      <Card accent padding="md">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 32 }}>🤖</span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "var(--text-lg)" }}>
                Smart talent matching
              </h3>
              <Badge variant="accent" size="sm">
                Active
              </Badge>
            </div>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Candidates are filtered from validated profiles, identity-checked
              and certified by admins.
            </p>
          </div>
          <Link to="/corporate/scout" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="sm">
              Open scout page
            </Button>
          </Link>
        </div>
      </Card>

      <section
        style={{
          display: "flex",
          gap: "var(--space-3)",
          flexWrap: "wrap",
          background: "var(--color-surface)",
          padding: "var(--space-4)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        <input
          placeholder="Search by candidate name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "var(--space-2) var(--space-3)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        />
        <select
          value={jlptFilter}
          onChange={(e) => setJlptFilter(e.target.value as typeof jlptFilter)}
          style={{
            padding: "var(--space-2) var(--space-3)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <option value="All">All levels</option>
          <option value="N3">N3</option>
          <option value="N4">N4</option>
          <option value="N5">N5</option>
        </select>
        <input
          placeholder="Specialisation..."
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
          style={{
            flex: 1,
            minWidth: 180,
            padding: "var(--space-2) var(--space-3)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        />
      </section>

      <section>
        <h2 style={{ marginBottom: "var(--space-3)" }}>
          Candidates{" "}
          <span
            style={{
              color: "var(--color-text-tertiary)",
              fontSize: "var(--text-base)",
            }}
          >
            ({filtered.length})
          </span>
        </h2>
        {loadingCandidates ? (
          <p>Loading candidates...</p>
        ) : filtered.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            No candidates match your filters.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filtered.map((c) => (
              <Card key={c.id} padding="md">
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                  <Avatar name={c.name} size="md" role="student" />
                  <div>
                    <p style={{ fontWeight: "var(--font-semibold)" }}>
                      {c.name}
                    </p>
                    {c.nameJp && (
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        {c.nameJp}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      📍 {c.originCity ?? "Indonesia"}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "var(--space-3)",
                    display: "flex",
                    gap: "var(--space-2)",
                    flexWrap: "wrap",
                  }}
                >
                  <Badge variant={jlptVariant(c.jlptLevel)} size="sm">
                    JLPT {c.jlptLevel ?? "N4"}
                  </Badge>
                  {c.specialization.slice(0, 3).map((s, i) => (
                    <span
                      key={i}
                      style={{
                        background: "var(--color-surface-2)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                  {c.specialization.length > 3 && (
                    <span
                      style={{
                        background: "var(--color-surface-2)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      +{c.specialization.length - 3}
                    </span>
                  )}
                </div>
                {c.bioId && (
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      marginTop: "var(--space-3)",
                    }}
                  >
                    {c.bioId.slice(0, 110)}
                    {c.bioId.length > 110 ? "…" : ""}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "var(--space-3)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-success)",
                      fontWeight: 600,
                    }}
                  >
                    🎖 Verified
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setInterviewTarget(c)}
                  >
                    Request scout
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card accent padding="lg">
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ fontSize: "var(--text-lg)" }}>
              Automated Rirekisho generator
            </h3>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
              }}
            >
              Generate JIS-standard Rirekisho (履歴書) PDF from a candidate's
              profile.
            </p>
          </div>
          <select
            value={rirekishoCandidateId}
            onChange={(e) =>
              setRirekishoCandidateId(
                e.target.value ? Number(e.target.value) : "",
              )
            }
            style={{
              flex: 1,
              minWidth: 220,
              padding: "var(--space-2) var(--space-3)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <option value="">— Select candidate —</option>
            {rawCandidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · JLPT {c.jlptLevel ?? "N4"}
              </option>
            ))}
          </select>
          <Button variant="primary" onClick={handleGenerateRirekisho}>
            Generate & download
          </Button>
        </div>
      </Card>

      <InterviewModal
        candidate={interviewTarget}
        jobs={
          activeJobs as Array<{
            id: number;
            title: string;
            company_name?: string;
          }>
        }
        onClose={() => setInterviewTarget(null)}
      />
    </div>
  );
}
