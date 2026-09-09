import { useState, useMemo, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FileText, UserCheck } from "lucide-react";

import { useJobs, useScoutCandidates } from "@/api/hooks";
import { jobApi, type ScoutCandidate } from "@/api/jobs";
import { cvApi } from "@/api/cv";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";

const JLPT = ["", "N5", "N4", "N3", "N2", "N1"];

function jlptVariant(level?: string): "accent" | "info" | "default" {
  if (level === "N3" || level === "N2" || level === "N1") return "accent";
  if (level === "N4") return "info";
  return "default";
}

interface ScoutModalProps {
  candidate: ScoutCandidate | null;
  jobs: Array<{ id: number; title: string; company_name?: string }>;
  onClose: () => void;
  onSuccess: (candidateName: string) => void;
}

function ScoutModal({ candidate, jobs, onClose, onSuccess }: ScoutModalProps) {
  const [jobId, setJobId] = useState<number>(jobs[0]?.id ?? 0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!candidate) return;
    if (!jobId) {
      setModalError("Choose an active job first.");
      return;
    }
    setLoading(true);
    setModalError(null);
    try {
      await jobApi.scout(jobId, candidate.id, message || undefined);
      onSuccess(candidate.name);
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
                Choose a position
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
                  value={jobId}
                  onChange={(e) => setJobId(Number(e.target.value))}
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
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Why this candidate, what role and location..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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

export default function ScoutPage() {
  const [filter, setFilter] = useState({ specialization: "", minJlpt: "" });
  const [appliedFilter, setAppliedFilter] = useState({
    specialization: "",
    minJlpt: "",
  });
  const [selectedCandidate, setSelectedCandidate] =
    useState<ScoutCandidate | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    data: candidates = [],
    isLoading: loadingCandidates,
    error: candidatesError,
  } = useScoutCandidates({
    specialization: appliedFilter.specialization || undefined,
    minJlpt: appliedFilter.minJlpt || undefined,
  });

  const { data: jobsResponse, isLoading: loadingJobs } = useJobs();
  const rawJobs = jobsResponse?.jobs ?? [];
  const activeJobs = useMemo(
    () => rawJobs.filter((j) => j.is_active === 1),
    [rawJobs],
  );

  function handleFilterSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setAppliedFilter(filter);
  }

  function handleFilterReset() {
    const empty = { specialization: "", minJlpt: "" };
    setFilter(empty);
    setAppliedFilter(empty);
  }

  function handleOpenScout(cand: ScoutCandidate) {
    if (activeJobs.length === 0) {
      alert(
        "Your company has no active jobs. Create one first in 'Manage jobs'.",
      );
      return;
    }
    setSelectedCandidate(cand);
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <h1>Scout candidates</h1>
            <Badge variant="corporate" size="sm">
              Corporate
            </Badge>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Filter and directly invite verified talent (ID verified and
            admin-certified).
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link to="/corporate" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
              ← Dashboard
            </Button>
          </Link>
          <Link to="/corporate/jobs" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">
              Manage jobs
            </Button>
          </Link>
        </div>
      </header>

      {success && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-success-soft)",
            color: "var(--color-success)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)}>✕</button>
        </div>
      )}
      {candidatesError && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-error-soft)",
            color: "var(--color-error)",
            borderRadius: "var(--radius-md)",
          }}
        >
          ⚠️{" "}
          {candidatesError instanceof Error
            ? candidatesError.message
            : "Failed to load scout candidates."}
        </div>
      )}

      <form
        onSubmit={handleFilterSubmit}
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
          placeholder="Specialisation (e.g. Manufacturing, QC, IT)..."
          value={filter.specialization}
          onChange={(e) =>
            setFilter((f) => ({ ...f, specialization: e.target.value }))
          }
          style={{
            flex: 1,
            minWidth: 200,
            padding: "var(--space-2) var(--space-3)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        />
        <select
          value={filter.minJlpt}
          onChange={(e) =>
            setFilter((f) => ({ ...f, minJlpt: e.target.value }))
          }
          style={{
            padding: "var(--space-2) var(--space-3)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {JLPT.map((l) => (
            <option key={l} value={l}>
              {l ? `JLPT ${l}` : "All JLPT levels"}
            </option>
          ))}
        </select>
        <Button type="submit" variant="primary">
          Apply filter
        </Button>
        {(filter.specialization || filter.minJlpt) && (
          <Button type="button" variant="ghost" onClick={handleFilterReset}>
            Reset
          </Button>
        )}
      </form>

      {loadingCandidates ? (
        <p>Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <Card padding="lg">
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            No candidates match your filters.
          </p>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {candidates.map((c) => (
            <Card key={c.id} padding="md">
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Avatar name={c.name} size="md" role="student" />
                <div>
                  <p style={{ fontWeight: "var(--font-semibold)" }}>{c.name}</p>
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
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => cvApi.triggerDownload(c.id)}
                >
                  <FileText size={14} style={{ marginRight: 4 }} />
                  Download CV
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleOpenScout(c)}
                >
                  <UserCheck size={14} style={{ marginRight: 4 }} />
                  Request scout
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loadingJobs && activeJobs.length === 0 && (
        <Card padding="md">
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            💡 <strong>Tip:</strong> Your company has no active jobs.{" "}
            <Link
              to="/corporate/jobs"
              style={{ color: "var(--color-role-corporate)", fontWeight: 600 }}
            >
              Post a job here
            </Link>{" "}
            before sending scout invitations.
          </p>
        </Card>
      )}

      <ScoutModal
        candidate={selectedCandidate}
        jobs={
          activeJobs as Array<{
            id: number;
            title: string;
            company_name?: string;
          }>
        }
        onClose={() => setSelectedCandidate(null)}
        onSuccess={(name) => setSuccess(`Scout invitation sent to ${name}!`)}
      />
    </div>
  );
}
