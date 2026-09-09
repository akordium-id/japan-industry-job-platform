import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Users, Check, X, Clock, MailOpen } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { jobApi } from "@/api/jobs";
import { cvApi } from "@/api/cv";
import { useJobs, useCompanies, jobKeys } from "@/api/hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

const EMPTY_FORM = {
  companyId: 0,
  title: "",
  titleJp: "",
  description: "",
  requirements: "",
  specialization: "",
  minJlpt: "",
  location: "",
  employmentType: "fulltime",
  salaryRange: "",
};

export default function CorporateJobsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: companies = [], error: companiesError } = useCompanies();
  const {
    data: jobsResponse,
    isLoading: loadingJobs,
    error: jobsError,
  } = useJobs();
  const jobs = jobsResponse?.jobs ?? [];

  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    nameJp: "",
    industry: "",
  });
  const [showNewCo, setShowNewCo] = useState(false);
  const [posting, setPosting] = useState(false);

  const [selectedJob, setSelectedJob] = useState<{
    id: number;
    title: string;
    title_jp?: string;
  } | null>(null);
  const [jobApplicants, setJobApplicants] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null);

  const activeCompanyId = form.companyId || companies[0]?.id || 0;

  async function openApplicantsModal(job: {
    id: number;
    title: string;
    title_jp?: string;
  }) {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const data = await jobApi.applicationsForJob(job.id);
      setJobApplicants(data.applications ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load applicants.");
    } finally {
      setLoadingApplicants(false);
    }
  }

  async function handleDecideApplication(appId: number, status: string) {
    setUpdatingAppId(appId);
    try {
      await jobApi.decideApplication(appId, status);
      setSuccess(
        `Application status changed to "${status}". Notification sent to candidate.`,
      );
      setJobApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a)),
      );
    } catch (e) {
      setErr(
        e instanceof Error ? e.message : "Failed to update application status.",
      );
    } finally {
      setUpdatingAppId(null);
    }
  }

  async function onCreateCompany() {
    if (!newCompany.name) {
      setErr("Company name is required.");
      return;
    }
    setErr(null);
    try {
      const c = await jobApi.createCompany(newCompany);
      setNewCompany({ name: "", nameJp: "", industry: "" });
      setShowNewCo(false);
      setSuccess(`Company "${c.name}" registered.`);
      await queryClient.invalidateQueries({ queryKey: jobKeys.companies() });
      setForm((f) => ({ ...f, companyId: c.id }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to register company.");
    }
  }

  async function onPost() {
    const targetCompanyId = form.companyId || activeCompanyId;
    if (!targetCompanyId || !form.title) {
      setErr("Choose a company and provide a job title.");
      return;
    }
    setPosting(true);
    setErr(null);
    try {
      await jobApi.createJob({
        ...form,
        companyId: targetCompanyId,
        specialization: form.specialization || undefined,
      });
      setSuccess(`Job "${form.title}" published.`);
      setForm(EMPTY_FORM);
      await queryClient.invalidateQueries({ queryKey: jobKeys.all });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to publish job.");
    } finally {
      setPosting(false);
    }
  }

  async function onClose(id: number, title: string) {
    if (!confirm(`Close "${title}"? Applicants can no longer apply.`)) return;
    setErr(null);
    try {
      await jobApi.closeJob(id);
      setSuccess(`"${title}" closed.`);
      await queryClient.invalidateQueries({ queryKey: jobKeys.all });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to close job.");
    }
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
            <h1>Manage jobs</h1>
            <Badge variant="corporate" size="sm">
              Corporate
            </Badge>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Publish positions for verified candidates and alumni.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {user?.role === "admin" ? (
            <Link to="/admin/verifications" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm">
                ← Verifications
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/corporate" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm">
                  ← Dashboard
                </Button>
              </Link>
              <Link to="/corporate/scout" style={{ textDecoration: "none" }}>
                <Button variant="primary" size="sm">
                  Scout talent
                </Button>
              </Link>
            </>
          )}
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
      {(err ?? companiesError ?? jobsError) && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-error-soft)",
            color: "var(--color-error)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>⚠️ {err ?? "Failed to load data."}</span>
          <button onClick={() => setErr(null)}>✕</button>
        </div>
      )}

      <Card title="Post a new job" padding="lg">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Hiring company
            </label>
            <div
              style={{ display: "flex", gap: "var(--space-2)", marginTop: 4 }}
            >
              <select
                value={activeCompanyId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, companyId: Number(e.target.value) }))
                }
                style={{
                  flex: 1,
                  padding: "var(--space-2) var(--space-3)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <option value={0}>— Select company —</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.name_jp ? ` (${c.name_jp})` : ""}
                  </option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewCo((s) => !s)}
              >
                {showNewCo ? "Close" : "+ Add company"}
              </Button>
            </div>

            {showNewCo && (
              <div
                style={{
                  marginTop: "var(--space-3)",
                  padding: "var(--space-3)",
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-md)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "var(--space-2)",
                  alignItems: "flex-end",
                }}
              >
                <input
                  placeholder="Company name (EN)"
                  value={newCompany.name}
                  onChange={(e) =>
                    setNewCompany((c) => ({ ...c, name: e.target.value }))
                  }
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <input
                  placeholder="Company name (JP)"
                  value={newCompany.nameJp}
                  onChange={(e) =>
                    setNewCompany((c) => ({ ...c, nameJp: e.target.value }))
                  }
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <input
                  placeholder="Industry"
                  value={newCompany.industry}
                  onChange={(e) =>
                    setNewCompany((c) => ({ ...c, industry: e.target.value }))
                  }
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <Button size="sm" variant="primary" onClick={onCreateCompany}>
                  Save
                </Button>
              </div>
            )}
          </div>

          {(
            [
              {
                k: "title",
                label: "Job title (EN)",
                placeholder: "e.g. CNC Machine Operator",
              },
              {
                k: "titleJp",
                label: "Job title (JP)",
                placeholder: "e.g. マシニングセンタオペレーター",
              },
              {
                k: "location",
                label: "Location (prefecture / city)",
                placeholder: "e.g. Aichi / Nagoya",
              },
              {
                k: "salaryRange",
                label: "Monthly salary range",
                placeholder: "e.g. ¥220,000–300,000 / month",
              },
            ] as const
          ).map((f) => (
            <div key={f.k}>
              <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
                {f.label}
              </label>
              <input
                value={form[f.k]}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setForm((s) => ({ ...s, [f.k]: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "var(--space-2) var(--space-3)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  marginTop: 4,
                }}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Minimum JLPT
            </label>
            <select
              value={form.minJlpt}
              onChange={(e) =>
                setForm((f) => ({ ...f, minJlpt: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                marginTop: 4,
              }}
            >
              <option value="">Not required</option>
              {["N5", "N4", "N3", "N2", "N1"].map((l) => (
                <option key={l} value={l}>
                  JLPT {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Employment type
            </label>
            <select
              value={form.employmentType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  employmentType: e.target.value as
                    "fulltime" | "contract" | "internship",
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
              <option value="fulltime">Fulltime (正社員)</option>
              <option value="contract">Contract (契約社員 / 技能実習)</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Specialisations (comma-separated)
            </label>
            <input
              value={form.specialization}
              placeholder="Manufacturing, Machinery, Automotive"
              onChange={(e) =>
                setForm((f) => ({ ...f, specialization: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                marginTop: 4,
              }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Job description
            </label>
            <textarea
              rows={3}
              placeholder="Outline the role, responsibilities, hours..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
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

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Qualifications
            </label>
            <textarea
              rows={3}
              placeholder="Required experience, certifications, physical criteria..."
              value={form.requirements}
              onChange={(e) =>
                setForm((f) => ({ ...f, requirements: e.target.value }))
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
        </div>

        <div
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="primary" onClick={onPost} disabled={posting}>
            {posting ? "Publishing..." : "Publish job"}
          </Button>
        </div>
      </Card>

      <Card
        title="Published jobs"
        subtitle={`${jobs.length} jobs in total`}
        padding="md"
      >
        {loadingJobs ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            No jobs published yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "var(--text-sm)",
              }}
            >
              <thead>
                <tr style={{ background: "var(--color-surface-2)" }}>
                  <th style={{ padding: "var(--space-3)", textAlign: "left" }}>
                    Position
                  </th>
                  <th style={{ padding: "var(--space-3)", textAlign: "left" }}>
                    Company
                  </th>
                  <th style={{ padding: "var(--space-3)", textAlign: "left" }}>
                    JLPT
                  </th>
                  <th style={{ padding: "var(--space-3)", textAlign: "left" }}>
                    Location
                  </th>
                  <th style={{ padding: "var(--space-3)", textAlign: "left" }}>
                    Status
                  </th>
                  <th style={{ padding: "var(--space-3)", textAlign: "left" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr
                    key={j.id}
                    style={{ borderTop: "1px solid var(--color-border-soft)" }}
                  >
                    <td style={{ padding: "var(--space-3)" }}>
                      <strong>{j.title}</strong>
                      {j.title_jp && (
                        <div
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          {j.title_jp}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "var(--space-3)" }}>
                      {j.company_name}
                    </td>
                    <td style={{ padding: "var(--space-3)" }}>
                      {j.min_jlpt ? (
                        <Badge variant="accent" size="sm">
                          {j.min_jlpt}
                        </Badge>
                      ) : (
                        <span style={{ color: "var(--color-text-tertiary)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "var(--space-3)" }}>
                      {j.location ?? "—"}
                    </td>
                    <td style={{ padding: "var(--space-3)" }}>
                      <Badge
                        variant={j.is_active ? "success" : "default"}
                        size="sm"
                      >
                        {j.is_active ? "Active" : "Closed"}
                      </Badge>
                    </td>
                    <td style={{ padding: "var(--space-3)" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-2)",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openApplicantsModal(j)}
                        >
                          <Users size={14} style={{ marginRight: 4 }} />
                          Applicants
                        </Button>
                        {j.is_active ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onClose(j.id, j.title)}
                          >
                            Close
                          </Button>
                        ) : (
                          <span
                            style={{
                              color: "var(--color-text-tertiary)",
                              fontSize: "var(--text-xs)",
                            }}
                          >
                            Closed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={`Applicants: ${selectedJob?.title ?? ""}`}
        titleJp={selectedJob?.title_jp}
        size="lg"
      >
        {loadingApplicants ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            Loading applicants...
          </p>
        ) : jobApplicants.length === 0 ? (
          <div
            style={{
              padding: "var(--space-6)",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            <MailOpen size={36} style={{ opacity: 0.4, marginBottom: 8 }} />
            <p>No applicants for this position yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              maxHeight: 500,
              overflowY: "auto",
            }}
          >
            {jobApplicants.map((app) => {
              const status = app["status"] as string | undefined;
              return (
                <div
                  key={app["id"] as number}
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                    padding: "var(--space-4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "var(--text-base)" }}>
                        {(app["candidate_name"] as string) ?? "Candidate"}
                      </strong>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-secondary)",
                          marginTop: 2,
                        }}
                      >
                        {(app["candidate_email"] as string) ?? ""} ·{" "}
                        {(app["origin_city"] as string) ?? "Indonesia"}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      {(app["jlpt_level"] as string) && (
                        <Badge variant="accent" size="sm">
                          {app["jlpt_level"] as string}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          status === "accepted"
                            ? "success"
                            : status === "shortlisted"
                              ? "warning"
                              : status === "rejected"
                                ? "danger"
                                : "default"
                        }
                        size="sm"
                      >
                        {status === "submitted"
                          ? "Pending review"
                          : status === "shortlisted"
                            ? "Shortlisted"
                            : status === "accepted"
                              ? "Accepted"
                              : status === "rejected"
                                ? "Rejected"
                                : (status ?? "")}
                      </Badge>
                    </div>
                  </div>

                  {(app["message"] as string) && (
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                        background: "var(--color-surface)",
                        padding: "var(--space-2) var(--space-3)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: "3px solid var(--color-role-corporate)",
                      }}
                    >
                      &ldquo;{app["message"] as string}&rdquo;
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      Applied:{" "}
                      {new Date(app["created_at"] as string).toLocaleDateString(
                        "en-GB",
                      )}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          cvApi.triggerDownload(app["user_id"] as number)
                        }
                      >
                        <FileText size={14} style={{ marginRight: 4 }} />
                        Download CV
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={
                          updatingAppId === (app["id"] as number) ||
                          status === "shortlisted"
                        }
                        onClick={() =>
                          handleDecideApplication(
                            app["id"] as number,
                            "shortlisted",
                          )
                        }
                      >
                        <Clock size={14} style={{ marginRight: 4 }} />
                        Shortlist
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={
                          updatingAppId === (app["id"] as number) ||
                          status === "accepted"
                        }
                        onClick={() =>
                          handleDecideApplication(
                            app["id"] as number,
                            "accepted",
                          )
                        }
                      >
                        <Check size={14} style={{ marginRight: 4 }} />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={
                          updatingAppId === (app["id"] as number) ||
                          status === "rejected"
                        }
                        onClick={() =>
                          handleDecideApplication(
                            app["id"] as number,
                            "rejected",
                          )
                        }
                      >
                        <X size={14} style={{ marginRight: 4 }} />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
