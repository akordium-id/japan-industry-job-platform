import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Download, Edit3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cvApi } from "@/api/cv";
import { useMyDocuments } from "@/api/hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function CVPage() {
  const { user, refreshUser } = useAuth();
  const { data: docs = [] } = useMyDocuments();
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const approvedDocs = docs.filter((d) => d.verification_status === "approved");
  const pendingDocs = docs.filter((d) => d.verification_status === "pending");

  if (!user) return null;
  const incomplete =
    !user.nameJp &&
    !user.birthDate &&
    (!user.education || user.education.length === 0);

  async function onDownload() {
    setErrorMsg(null);
    setDownloading(true);
    try {
      await refreshUser();
      await cvApi.triggerDownload();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to download CV");
    } finally {
      setDownloading(false);
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
      <header>
        <h1>CV generator (Rirekisho)</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Generate a JIS-standard Rirekisho PDF, ready for partner-company
          applications.
        </p>
      </header>

      {incomplete && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-warning-soft)",
            color: "var(--color-warning)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <span>
            <strong>Your profile is incomplete.</strong> Fill in Japanese name,
            education history and date of birth for a richer CV.
          </span>
          <Link to="/student/profile">
            <Button variant="secondary" size="sm">
              Complete profile
            </Button>
          </Link>
        </div>
      )}

      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4) var(--space-5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-full)",
              background:
                approvedDocs.length > 0
                  ? "rgba(39, 174, 96, 0.12)"
                  : "rgba(230, 126, 34, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                approvedDocs.length > 0
                  ? "var(--color-success)"
                  : "var(--color-warning)",
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <strong style={{ fontSize: "var(--text-sm)" }}>
                Credential & supporting document status
              </strong>
              <Badge
                variant={approvedDocs.length > 0 ? "success" : "warning"}
                size="sm"
              >
                {approvedDocs.length > 0 ? "Verified" : "No valid documents"}
              </Badge>
            </div>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-secondary)",
                margin: "2px 0 0",
              }}
            >
              {approvedDocs.length} verified
              {approvedDocs.length > 0 &&
                ` (${approvedDocs
                  .map((d) => d.title)
                  .slice(0, 2)
                  .join(
                    ", ",
                  )}${approvedDocs.length > 2 ? ` +${approvedDocs.length - 2}` : ""})`}
              {pendingDocs.length > 0 &&
                ` · ${pendingDocs.length} pending review`}
            </p>
          </div>
        </div>
        <Link to="/student/vault">
          <Button variant="secondary" size="sm">
            Manage vault →
          </Button>
        </Link>
      </div>

      <Card
        title="Rirekisho preview"
        subtitle="Standard Japanese recruitment format"
        padding="lg"
        headerAction={
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Link to="/student/profile">
              <Button variant="ghost" size="sm">
                <Edit3 size={15} style={{ marginRight: 4 }} />
                Edit profile
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              disabled={downloading}
              onClick={onDownload}
            >
              <Download size={15} style={{ marginRight: 4 }} />
              {downloading ? "Generating PDF..." : "Download PDF"}
            </Button>
          </div>
        }
      >
        {errorMsg && (
          <div
            style={{
              padding: "var(--space-3)",
              background: "var(--color-error-soft)",
              color: "var(--color-error)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-3)",
            }}
          >
            {errorMsg}
          </div>
        )}

        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "var(--space-3)",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  background: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "var(--text-xs)",
                  marginBottom: "var(--space-2)",
                }}
              >
                JIS STANDARD FORMAT
              </span>
              <h2 style={{ fontSize: "var(--text-xl)" }}>
                {user.nameJp || user.name}
              </h2>
              {user.nameJp && (
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {user.name}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {user.jlptLevel && (
                <Badge variant="accent" size="md">
                  JLPT {user.jlptLevel}
                </Badge>
              )}
              {user.originCity && <Badge size="md">📍 {user.originCity}</Badge>}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-4)",
              padding: "var(--space-3) 0",
              borderTop: "1px solid var(--color-border-soft)",
              borderBottom: "1px solid var(--color-border-soft)",
              marginBottom: "var(--space-4)",
              fontSize: "var(--text-sm)",
            }}
          >
            <div>
              <strong style={{ color: "var(--color-text-tertiary)" }}>
                Email:{" "}
              </strong>
              {user.email}
            </div>
            {user.phone && (
              <div>
                <strong style={{ color: "var(--color-text-tertiary)" }}>
                  Phone:{" "}
                </strong>
                {user.phone}
              </div>
            )}
            {user.birthDate && (
              <div>
                <strong style={{ color: "var(--color-text-tertiary)" }}>
                  DOB:{" "}
                </strong>
                {user.birthDate}
              </div>
            )}
          </div>

          {user.specialization && user.specialization.length > 0 && (
            <div style={{ marginBottom: "var(--space-4)" }}>
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Vocational specialisation
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                }}
              >
                {user.specialization.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--color-accent-soft)",
                      color: "var(--color-accent)",
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-full)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "var(--space-4)" }}>
            <h3
              style={{
                fontSize: "var(--text-base)",
                marginBottom: "var(--space-2)",
              }}
            >
              Education (学歴)
            </h3>
            {user.education && user.education.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {user.education.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--text-sm)",
                      padding: "var(--space-2) 0",
                      borderBottom: "1px solid var(--color-border-soft)",
                    }}
                  >
                    <span>
                      {e.degree} — {e.institution}
                    </span>
                    <span style={{ color: "var(--color-text-tertiary)" }}>
                      {e.year}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-tertiary)",
                }}
              >
                No education history added.
              </p>
            )}
          </div>

          <div style={{ marginBottom: "var(--space-4)" }}>
            <h3
              style={{
                fontSize: "var(--text-base)",
                marginBottom: "var(--space-2)",
              }}
            >
              Work experience (職歴)
            </h3>
            {user.experience && user.experience.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {user.experience.map((x, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--text-sm)",
                      padding: "var(--space-2) 0",
                      borderBottom: "1px solid var(--color-border-soft)",
                    }}
                  >
                    <span>
                      {x.title} @ {x.company}
                    </span>
                    <span style={{ color: "var(--color-text-tertiary)" }}>
                      {x.start} – {x.end || "Present"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-tertiary)",
                }}
              >
                No work experience added.
              </p>
            )}
          </div>

          {user.skills && user.skills.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Additional competencies
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                }}
              >
                {user.skills.map((sk, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--color-surface-2)",
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            gap: "var(--space-3)",
          }}
        >
          <Button variant="primary" disabled={downloading} onClick={onDownload}>
            {downloading ? "Generating PDF..." : "⬇ Download PDF (Rirekisho)"}
          </Button>
          <Link to="/student/profile">
            <Button variant="ghost">Edit full profile</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
