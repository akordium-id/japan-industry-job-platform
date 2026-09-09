import { useRef, useState, useMemo } from "react";

import type { DocType, DocStatus, VaultDoc } from "@/api/documents";
import {
  useMyDocuments,
  useUploadDocument,
  useDeleteDocument,
} from "@/api/hooks";
import { documentApi } from "@/api/documents";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatBytes } from "@/lib/utils";

const TYPE_LABEL: Record<DocType, string> = {
  ktp: "ID Card",
  certificate: "Certificate",
  portfolio: "Portfolio",
  transcript: "Transcript",
};

const STATUS_CONFIG: Record<
  DocStatus,
  {
    label: string;
    variant: "success" | "warning" | "danger" | "default";
    icon: string;
  }
> = {
  approved: { label: "Verified", variant: "success", icon: "✅" },
  pending: { label: "Pending verification", variant: "warning", icon: "⏳" },
  rejected: { label: "Rejected (needs fix)", variant: "danger", icon: "❌" },
};

const TYPE_PRIORITY: Record<DocType, number> = {
  ktp: 1,
  certificate: 2,
  transcript: 3,
  portfolio: 4,
};

export default function VaultPage() {
  const { data: docs = [], isLoading: loading, error } = useMyDocuments();
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const [err, setErr] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [form, setForm] = useState<{
    type: DocType;
    title: string;
    issuedBy: string;
    issuedDate: string;
  }>({
    type: "ktp",
    title: "",
    issuedBy: "",
    issuedDate: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"all" | DocType>("all");
  const [sortBy, setSortBy] = useState<"smart" | "newest" | "oldest">("smart");

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: docs.length };
    for (const d of docs) {
      counts[d.type] = (counts[d.type] ?? 0) + 1;
    }
    return counts;
  }, [docs]);

  const displayDocs = useMemo(() => {
    let filtered =
      activeTab === "all"
        ? [...docs]
        : docs.filter((d) => d.type === activeTab);

    if (sortBy === "newest") return filtered.sort((a, b) => b.id - a.id);
    if (sortBy === "oldest") return filtered.sort((a, b) => a.id - b.id);

    return filtered.sort((a, b) => {
      const isARejected = a.verification_status === "rejected";
      const isBRejected = b.verification_status === "rejected";
      if (isARejected && !isBRejected) return -1;
      if (!isARejected && isBRejected) return 1;

      const priorityA = TYPE_PRIORITY[a.type] ?? 99;
      const priorityB = TYPE_PRIORITY[b.type] ?? 99;
      if (priorityA !== priorityB) return priorityA - priorityB;

      return b.id - a.id;
    });
  }, [docs, activeTab, sortBy]);

  async function onUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setErr("Please select a file first.");
      setSuccessMsg(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErr("File too large (max 10 MB).");
      setSuccessMsg(null);
      return;
    }
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErr("Unsupported format. Please upload PDF, JPG, PNG or WEBP.");
      setSuccessMsg(null);
      return;
    }
    if (!form.title.trim()) {
      setErr("Document title is required.");
      setSuccessMsg(null);
      return;
    }
    setErr(null);
    setSuccessMsg(null);

    const fd = new FormData();
    fd.append("type", form.type);
    fd.append("title", form.title.trim());
    if (form.issuedBy) fd.append("issuedBy", form.issuedBy.trim());
    if (form.issuedDate) fd.append("issuedDate", form.issuedDate);
    fd.append("file", file);

    uploadMutation.mutate(fd, {
      onSuccess: () => {
        if (fileRef.current) fileRef.current.value = "";
        setForm((f) => ({ ...f, title: "", issuedBy: "", issuedDate: "" }));
        setSuccessMsg(
          "Document uploaded successfully and queued for verification.",
        );
      },
      onError: (e) => {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      },
    });
  }

  function onRevise(doc: VaultDoc) {
    setForm({
      type: doc.type,
      title: `${doc.title} (Revision)`,
      issuedBy: doc.issued_by ?? "",
      issuedDate: doc.issued_date ? doc.issued_date.slice(0, 10) : "",
    });
    setSuccessMsg(null);
    setErr(null);
    fileRef.current?.focus();
  }

  function onDelete(id: number) {
    if (!confirm("Delete this document?")) return;
    deleteMutation.mutate(id, {
      onError: (e) => {
        setErr(e instanceof Error ? e.message : "Failed to delete.");
      },
    });
  }

  const errorMessage = err ?? (error ? "Failed to load documents." : null);

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
        <h1>Document vault</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Manage your ID card, competency certificates, transcripts and
          portfolio.
        </p>
      </header>

      <Card title="Upload new document" padding="lg">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          <div>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Document type
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value as DocType }))
              }
              style={{
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                marginTop: 4,
              }}
            >
              <option value="ktp">ID Card (Identity)</option>
              <option value="certificate">Certificate / JLPT</option>
              <option value="portfolio">Portfolio</option>
              <option value="transcript">Academic transcript</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. JLPT N3 Certificate"
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
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Issuing authority
            </label>
            <input
              value={form.issuedBy}
              onChange={(e) =>
                setForm((f) => ({ ...f, issuedBy: e.target.value }))
              }
              placeholder="e.g. Japan Foundation"
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
            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Issue date
            </label>
            <input
              type="date"
              value={form.issuedDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, issuedDate: e.target.value }))
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
              File
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              style={{ display: "block", marginTop: 4 }}
            />
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
                marginTop: 4,
              }}
            >
              PDF, JPG, PNG, WEBP (max 10 MB)
            </p>
          </div>
        </div>
        {successMsg && (
          <p
            style={{
              color: "var(--color-success)",
              marginTop: "var(--space-3)",
              fontSize: "var(--text-sm)",
            }}
          >
            ✅ {successMsg}
          </p>
        )}
        {errorMessage && (
          <p
            style={{
              color: "var(--color-error)",
              marginTop: "var(--space-3)",
              fontSize: "var(--text-sm)",
            }}
          >
            {errorMessage}
          </p>
        )}
        <div
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="primary"
            disabled={uploadMutation.isPending}
            onClick={onUpload}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload to vault"}
          </Button>
        </div>
      </Card>

      <Card
        title="Stored documents"
        padding="lg"
        headerAction={
          docs.length > 0 ? (
            <Badge variant="info" size="sm">
              {docs.length} docs
            </Badge>
          ) : undefined
        }
      >
        {loading ? (
          <p>Loading documents...</p>
        ) : docs.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            No documents uploaded yet.
          </p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "var(--space-3)",
                marginBottom: "var(--space-4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setActiveTab("all")}
                  style={{
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-full)",
                    background:
                      activeTab === "all"
                        ? "var(--color-accent)"
                        : "var(--color-surface-2)",
                    color:
                      activeTab === "all"
                        ? "var(--color-text-inverse)"
                        : "var(--color-text-secondary)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  All ({tabCounts.all ?? 0})
                </button>
                {(
                  ["ktp", "certificate", "transcript", "portfolio"] as DocType[]
                ).map((type) => {
                  const count = tabCounts[type] ?? 0;
                  if (count === 0 && activeTab !== type) return null;
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      style={{
                        padding: "var(--space-1) var(--space-3)",
                        borderRadius: "var(--radius-full)",
                        background:
                          activeTab === type
                            ? "var(--color-accent)"
                            : "var(--color-surface-2)",
                        color:
                          activeTab === type
                            ? "var(--color-text-inverse)"
                            : "var(--color-text-secondary)",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {TYPE_LABEL[type]} ({count})
                    </button>
                  );
                })}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                style={{
                  padding: "var(--space-1) var(--space-3)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-xs)",
                }}
              >
                <option value="smart">Status & category priority</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {displayDocs.map((d) => {
                const statusCfg = STATUS_CONFIG[d.verification_status] ?? {
                  label: d.verification_status,
                  variant: "default" as const,
                  icon: "📄",
                };
                const isRejected = d.verification_status === "rejected";
                return (
                  <div
                    key={d.id}
                    style={{
                      padding: "var(--space-4)",
                      border: `1px solid ${isRejected ? "var(--color-error)" : "var(--color-border)"}`,
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
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {TYPE_LABEL[d.type] ?? d.type}
                      </span>
                      <Badge variant={statusCfg.variant} size="sm">
                        {statusCfg.icon} {statusCfg.label}
                      </Badge>
                    </div>
                    <h3
                      style={{
                        fontSize: "var(--text-base)",
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      {d.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      {formatBytes(d.file_size_bytes)} ·{" "}
                      {new Date(d.created_at).toLocaleDateString("en-GB")}
                    </p>
                    {d.issued_by && (
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        Issued by: {d.issued_by}
                      </p>
                    )}
                    {d.verification_notes && (
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-secondary)",
                          marginTop: "var(--space-2)",
                          background: "var(--color-surface-2)",
                          padding: "var(--space-2)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <strong>Admin notes:</strong> {d.verification_notes}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        marginTop: "var(--space-3)",
                      }}
                    >
                      <a
                        href={documentApi.fileUrl(d.id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="secondary" size="sm">
                          View ↗
                        </Button>
                      </a>
                      {isRejected && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onRevise(d)}
                        >
                          Re-upload ↺
                        </Button>
                      )}
                      {d.verification_status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => onDelete(d.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
