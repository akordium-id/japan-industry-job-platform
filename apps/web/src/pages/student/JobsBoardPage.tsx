import { useState } from "react";
import { useJobs, useMyApplications, useApplyJob } from "@/api/hooks";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const JLPT = ["", "N5", "N4", "N3", "N2", "N1"];

export default function JobsBoardPage() {
  const [filter, setFilter] = useState({
    specialization: "",
    minJlpt: "",
    location: "",
  });

  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(filter);
  const [alertMsg, setAlertMsg] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const {
    data: jobsResponse,
    isLoading: loadingJobs,
    error: jobsError,
  } = useJobs({
    specialization: activeFilter.specialization || undefined,
    minJlpt: activeFilter.minJlpt || undefined,
    location: activeFilter.location || undefined,
    page,
    limit: 6,
  });

  const jobs = jobsResponse?.jobs ?? [];
  const pagination = jobsResponse?.pagination;

  const { data: myApps = [] } = useMyApplications();
  const applyMutation = useApplyJob();

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setPage(1);
    setActiveFilter(filter);
  }

  function handleReset() {
    const empty = { specialization: "", minJlpt: "", location: "" };
    setFilter(empty);
    setPage(1);
    setActiveFilter(empty);
  }

  function onApply(id: number, jobTitle: string) {
    if (!confirm(`Send your CV and application for "${jobTitle}"?`)) return;
    setAlertMsg(null);
    applyMutation.mutate(
      { jobId: id },
      {
        onSuccess: () => {
          setAlertMsg({
            kind: "ok",
            text: `Application for "${jobTitle}" sent to the company!`,
          });
        },
        onError: (e) => {
          setAlertMsg({
            kind: "err",
            text:
              e instanceof Error ? e.message : "Failed to send application.",
          });
        },
      },
    );
  }

  const errorMessage = jobsError
    ? jobsError instanceof Error
      ? jobsError.message
      : "Failed to load jobs."
    : null;

  const isFiltering = Boolean(
    activeFilter.specialization ||
    activeFilter.minJlpt ||
    activeFilter.location,
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
      <header>
        <h1>Job marketplace</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Career opportunities from verified partner companies.
        </p>
      </header>

      {alertMsg && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background:
              alertMsg.kind === "ok"
                ? "var(--color-success-soft)"
                : "var(--color-error-soft)",
            color:
              alertMsg.kind === "ok"
                ? "var(--color-success)"
                : "var(--color-error)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
          }}
        >
          {alertMsg.text}
        </div>
      )}

      <form
        onSubmit={handleSearch}
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
          placeholder="Position or specialisation..."
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
            background: "var(--color-surface)",
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
            background: "var(--color-surface)",
          }}
        >
          <option value="">All JLPT levels</option>
          {JLPT.filter(Boolean).map((l) => (
            <option key={l} value={l}>
              Min JLPT {l}
            </option>
          ))}
        </select>
        <input
          placeholder="Prefecture / city..."
          value={filter.location}
          onChange={(e) =>
            setFilter((f) => ({ ...f, location: e.target.value }))
          }
          style={{
            flex: 1,
            minWidth: 180,
            padding: "var(--space-2) var(--space-3)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
          }}
        />
        <Button variant="primary" type="submit">
          Search
        </Button>
        {isFiltering && (
          <Button variant="ghost" type="button" onClick={handleReset}>
            Reset
          </Button>
        )}
      </form>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-3)",
          }}
        >
          <h2 style={{ fontSize: "var(--text-xl)" }}>Available positions</h2>
          <Badge variant="info" size="sm">
            {jobs.length} jobs
          </Badge>
        </div>

        {loadingJobs ? (
          <p>Loading jobs...</p>
        ) : errorMessage ? (
          <p style={{ color: "var(--color-error)" }}>{errorMessage}</p>
        ) : jobs.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            No jobs match your filters.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {jobs.map((j) => {
              const application = (myApps ?? []).find(
                (x) => x.job_id === j.id && x.type === "apply",
              );
              const isApplied = !!application;
              return (
                <div
                  key={j.id}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-5)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "var(--text-base)" }}>
                      {j.title}
                      {j.title_jp && (
                        <span
                          style={{
                            color: "var(--color-text-tertiary)",
                            fontSize: "var(--text-sm)",
                          }}
                        >
                          {" "}
                          / {j.title_jp}
                        </span>
                      )}
                    </h3>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {j.company_name}
                      {j.company_name_jp && ` (${j.company_name_jp})`}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>📍 {j.location ?? "All Japan"}</span>
                    <span>·</span>
                    <span>💼 {j.employment_type ?? "Full-time"}</span>
                    {j.salary_range && (
                      <>
                        <span>·</span>
                        <span>💴 {j.salary_range}</span>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      flexWrap: "wrap",
                    }}
                  >
                    {j.min_jlpt && (
                      <Badge variant="accent" size="sm">
                        JLPT ≥ {j.min_jlpt}
                      </Badge>
                    )}
                    {j.specialization &&
                      j.specialization.split(",").map((s, i) => (
                        <span
                          key={i}
                          style={{
                            background: "var(--color-surface-2)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--text-xs)",
                          }}
                        >
                          {s.trim()}
                        </span>
                      ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                    }}
                  >
                    {isApplied ? (
                      <Badge
                        variant={
                          application?.status === "accepted"
                            ? "success"
                            : application?.status === "shortlisted"
                              ? "warning"
                              : application?.status === "rejected"
                                ? "danger"
                                : "default"
                        }
                        size="sm"
                      >
                        {application?.status === "accepted"
                          ? "Accepted"
                          : application?.status === "shortlisted"
                            ? "Shortlisted"
                            : application?.status === "rejected"
                              ? "Not selected"
                              : "Application sent"}
                      </Badge>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={applyMutation.isPending}
                        onClick={() => onApply(j.id, j.title)}
                      >
                        Apply now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "var(--space-5)",
              flexWrap: "wrap",
              gap: "var(--space-3)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              Showing <strong>{jobs.length}</strong> of{" "}
              <strong>{pagination.total}</strong> jobs
            </span>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1 || loadingJobs}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pagination.totalPages || loadingJobs}
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
