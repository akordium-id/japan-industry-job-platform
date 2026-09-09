import { useAuth } from "@/contexts/AuthContext";
import {
  usePendingDocuments,
  useDecideDocument,
  useAdminStats,
  useBatchDecide,
} from "@/api/hooks";
import { PendingDocsTable } from "@/components/admin/PendingDocsTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/sonner";

export default function AdminVerificationsPage() {
  const { user } = useAuth();
  const {
    data: docs = [],
    isLoading: loadingDocs,
    error: docsError,
  } = usePendingDocuments();
  const { data: stats } = useAdminStats();
  const decideMutation = useDecideDocument();
  const batchDecideMutation = useBatchDecide();

  if (user && user.role !== "admin") {
    return (
      <div style={{ padding: "4rem var(--container-px)", textAlign: "center" }}>
        You don't have access to this page.
      </div>
    );
  }
  if (!user) return null;

  function onDecide(id: number, action: "approved" | "rejected") {
    decideMutation.mutate(
      { id, action },
      {
        onSuccess: () => {
          toast.success(
            `Document #${id} has been ${action === "approved" ? "approved" : "rejected"}.`,
          );
        },
        onError: (e) => {
          toast.error(
            e instanceof Error ? e.message : "Failed to process document",
          );
        },
      },
    );
  }

  function batchApproveAll() {
    const pendingIds = docs.map((d) => d.id);
    if (pendingIds.length === 0) return;
    if (!confirm(`Approve all ${pendingIds.length} pending documents?`)) return;
    batchDecideMutation.mutate(
      { ids: pendingIds, action: "approved" },
      {
        onSuccess: () =>
          toast.success(`All ${pendingIds.length} pending documents approved.`),
        onError: (e) =>
          toast.error(
            e instanceof Error ? e.message : "Failed to batch approve.",
          ),
      },
    );
  }

  const err = docsError
    ? docsError instanceof Error
      ? docsError.message
      : "Failed to load documents."
    : null;

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
            <h1>Document verification & operations</h1>
            <Badge size="sm">Admin</Badge>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Review and validate candidate documents (ID, certificates,
            portfolio) for Japan placement eligibility.
          </p>
        </div>
        {docs.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={batchApproveAll}
            disabled={batchDecideMutation.isPending}
          >
            {batchDecideMutation.isPending
              ? "Processing..."
              : "Approve all pending"}
          </Button>
        )}
      </header>

      {stats && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          <StatCard
            label="Pending review"
            value={stats.pending}
            icon="⏳"
            accent="gold"
            sublabel="Documents to review"
          />
          <StatCard
            label="Documents approved"
            value={stats.approved ?? 0}
            icon="✅"
            accent="green"
            sublabel="Verified and compliant"
          />
          <StatCard
            label="Active jobs"
            value={stats.active_jobs}
            icon="💼"
            accent="blue"
            sublabel="Open to verified applicants"
          />
        </section>
      )}

      <Card padding="md">
        {loadingDocs ? (
          <p>Loading pending documents...</p>
        ) : err ? (
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-error-soft)",
              color: "var(--color-error)",
              borderRadius: "var(--radius-md)",
            }}
          >
            ⚠️ {err}
          </div>
        ) : docs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-6)" }}>
            <span style={{ fontSize: 36 }}>🎉</span>
            <h3
              style={{
                fontSize: "var(--text-lg)",
                marginTop: "var(--space-2)",
              }}
            >
              All caught up
            </h3>
            <p style={{ color: "var(--color-text-secondary)" }}>
              No documents waiting for verification right now.
            </p>
          </div>
        ) : (
          <PendingDocsTable
            data={docs}
            onDecide={onDecide}
            isDeciding={decideMutation.isPending}
          />
        )}
      </Card>
    </div>
  );
}
