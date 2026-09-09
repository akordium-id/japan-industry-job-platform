import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { ProfilePayload } from "@/api/user";

const JLPT = ["N5", "N4", "N3", "N2", "N1"] as const;

const containerStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "var(--space-6) var(--container-px)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-5)",
};

const fieldRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "var(--space-4)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "var(--space-2) var(--space-3)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--text-sm)",
  background: "var(--color-surface)",
  marginTop: 4,
};

const labelStyle: React.CSSProperties = {
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-medium)",
  display: "block",
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState<ProfilePayload>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  const [newSpec, setNewSpec] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduInst, setEduInst] = useState("");
  const [eduYear, setEduYear] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        nameJp: user.nameJp,
        birthDate: user.birthDate,
        originCity: user.originCity,
        phone: user.phone,
        jlptLevel: user.jlptLevel,
        specialization: user.specialization ?? [],
        bioId: user.bioId,
        bioJp: user.bioJp,
        education: user.education ?? [],
        experience: user.experience ?? [],
        skills: user.skills ?? [],
      });
    }
  }, [user]);

  function setField<K extends keyof ProfilePayload>(
    key: K,
    val: ProfilePayload[K],
  ) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function addToList(key: "specialization" | "skills", value: string) {
    const v = value.trim();
    if (!v) return;
    setForm((f) => ({ ...f, [key]: [...((f[key] as string[]) ?? []), v] }));
  }

  function removeFromList(key: "specialization" | "skills", idx: number) {
    setForm((f) => ({
      ...f,
      [key]: (f[key] as string[]).filter((_, i) => i !== idx),
    }));
  }

  function addEducation() {
    if (!eduDegree.trim() || !eduInst.trim()) return;
    setForm((f) => ({
      ...f,
      education: [
        ...(f.education ?? []),
        {
          degree: eduDegree.trim(),
          institution: eduInst.trim(),
          year: eduYear.trim() || String(new Date().getFullYear()),
        },
      ],
    }));
    setEduDegree("");
    setEduInst("");
    setEduYear("");
  }

  function removeEducation(idx: number) {
    setForm((f) => ({
      ...f,
      education: (f.education ?? []).filter((_, i) => i !== idx),
    }));
  }

  function addExperience() {
    if (!expTitle.trim() || !expCompany.trim()) return;
    setForm((f) => ({
      ...f,
      experience: [
        ...(f.experience ?? []),
        {
          title: expTitle.trim(),
          company: expCompany.trim(),
          start: expStart.trim() || String(new Date().getFullYear()),
          end: expEnd.trim() || "Present",
        },
      ],
    }));
    setExpTitle("");
    setExpCompany("");
    setExpStart("");
    setExpEnd("");
  }

  function removeExperience(idx: number) {
    setForm((f) => ({
      ...f,
      experience: (f.experience ?? []).filter((_, i) => i !== idx),
    }));
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    try {
      await updateProfile(form);
      setMsg({ kind: "ok", text: "Profile saved successfully." });
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Failed to save profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div style={containerStyle}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            alignItems: "center",
          }}
        >
          <Avatar name={user.name} size="lg" role="student" />
          <div>
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                alignItems: "center",
              }}
            >
              <h1>{user.name}</h1>
              {user.nameJp && <Badge size="sm">{user.nameJp}</Badge>}
              <Badge
                variant={user.profileVerified ? "success" : "warning"}
                size="sm"
              >
                {user.profileVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              {user.email} · Role: {user.role.toUpperCase()}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link to="/student/cv">
            <Button variant="secondary" size="sm">
              View CV
            </Button>
          </Link>
          <Link to="/student/vault">
            <Button variant="ghost" size="sm">
              Document Vault
            </Button>
          </Link>
        </div>
      </header>

      {msg && (
        <div
          style={{
            background:
              msg.kind === "ok"
                ? "var(--color-success-soft)"
                : "var(--color-error-soft)",
            color:
              msg.kind === "ok" ? "var(--color-success)" : "var(--color-error)",
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
          }}
        >
          {msg.text}
        </div>
      )}

      <Card title="Personal data" subtitle="Identity & contact" padding="lg">
        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>Full name (as on ID)</label>
            <input value={user.name} disabled style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Japanese name</label>
            <input
              value={form.nameJp ?? ""}
              placeholder="e.g. 田中 健一"
              onChange={(e) => setField("nameJp", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Date of birth</label>
            <input
              type="date"
              value={form.birthDate ? form.birthDate.substring(0, 10) : ""}
              onChange={(e) => setField("birthDate", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>City of origin</label>
            <input
              value={form.originCity ?? ""}
              placeholder="e.g. Yogyakarta"
              onChange={(e) => setField("originCity", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Phone / WhatsApp</label>
            <input
              value={form.phone ?? ""}
              placeholder="+62 812-3456-7890"
              onChange={(e) => setField("phone", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>JLPT level</label>
            <select
              value={form.jlptLevel ?? ""}
              onChange={(e) =>
                setField(
                  "jlptLevel",
                  e.target.value as ProfilePayload["jlptLevel"],
                )
              }
              style={inputStyle}
            >
              <option value="">— Not tested —</option>
              {JLPT.map((l) => (
                <option key={l} value={l}>
                  JLPT {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card title="Education & experience" padding="lg">
        <h3
          style={{
            fontSize: "var(--text-base)",
            marginBottom: "var(--space-3)",
          }}
        >
          Education (学歴)
        </h3>
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginBottom: "var(--space-3)",
            flexWrap: "wrap",
          }}
        >
          <input
            value={eduDegree}
            placeholder="Degree (e.g. BSc Computer Science)"
            onChange={(e) => setEduDegree(e.target.value)}
            style={{ ...inputStyle, flex: 2, marginTop: 0 }}
          />
          <input
            value={eduInst}
            placeholder="Institution"
            onChange={(e) => setEduInst(e.target.value)}
            style={{ ...inputStyle, flex: 2, marginTop: 0 }}
          />
          <input
            value={eduYear}
            placeholder="Year"
            onChange={(e) => setEduYear(e.target.value)}
            style={{ ...inputStyle, maxWidth: 120, marginTop: 0 }}
          />
          <Button size="sm" variant="secondary" onClick={addEducation}>
            + Add
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            marginBottom: "var(--space-5)",
          }}
        >
          {(form.education ?? []).length === 0 ? (
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-tertiary)",
              }}
            >
              No education history yet.
            </p>
          ) : (
            (form.education ?? []).map((e, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                }}
              >
                <span>
                  <strong>{e.degree}</strong> — {e.institution}{" "}
                  <span style={{ color: "var(--color-text-tertiary)" }}>
                    {e.year}
                  </span>
                </span>
                <button
                  onClick={() => removeEducation(idx)}
                  style={{ color: "var(--color-error)" }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <hr
          style={{
            border: 0,
            borderTop: "1px solid var(--color-border-soft)",
            margin: "var(--space-4) 0",
          }}
        />

        <h3
          style={{
            fontSize: "var(--text-base)",
            marginBottom: "var(--space-3)",
          }}
        >
          Work experience (職歴)
        </h3>
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginBottom: "var(--space-3)",
            flexWrap: "wrap",
          }}
        >
          <input
            value={expTitle}
            placeholder="Title (e.g. Fullstack Intern)"
            onChange={(e) => setExpTitle(e.target.value)}
            style={{ ...inputStyle, flex: 2, marginTop: 0 }}
          />
          <input
            value={expCompany}
            placeholder="Company"
            onChange={(e) => setExpCompany(e.target.value)}
            style={{ ...inputStyle, flex: 2, marginTop: 0 }}
          />
          <input
            value={expStart}
            placeholder="Start"
            onChange={(e) => setExpStart(e.target.value)}
            style={{ ...inputStyle, maxWidth: 100, marginTop: 0 }}
          />
          <input
            value={expEnd}
            placeholder="End"
            onChange={(e) => setExpEnd(e.target.value)}
            style={{ ...inputStyle, maxWidth: 100, marginTop: 0 }}
          />
          <Button size="sm" variant="secondary" onClick={addExperience}>
            + Add
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {(form.experience ?? []).length === 0 ? (
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-tertiary)",
              }}
            >
              No work experience yet.
            </p>
          ) : (
            (form.experience ?? []).map((x, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                }}
              >
                <span>
                  <strong>{x.title}</strong> @ {x.company}{" "}
                  <span style={{ color: "var(--color-text-tertiary)" }}>
                    {x.start} – {x.end || "Present"}
                  </span>
                </span>
                <button
                  onClick={() => removeExperience(idx)}
                  style={{ color: "var(--color-error)" }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title="Skills & bio" padding="lg">
        <div style={{ marginBottom: "var(--space-4)" }}>
          <label style={labelStyle}>Specialisations</label>
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              marginTop: 4,
              marginBottom: "var(--space-2)",
            }}
          >
            <input
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              placeholder="e.g. IT Software Engineering"
              style={{ ...inputStyle, flex: 1, marginTop: 0 }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                addToList("specialization", newSpec);
                setNewSpec("");
              }}
            >
              Add
            </Button>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
          >
            {(form.specialization ?? []).map((s, i) => (
              <span
                key={i}
                style={{
                  background: "var(--color-accent-soft)",
                  color: "var(--color-accent)",
                  padding: "var(--space-1) var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {s}{" "}
                <button onClick={() => removeFromList("specialization", i)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "var(--space-4)" }}>
          <label style={labelStyle}>Technical skills</label>
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              marginTop: 4,
              marginBottom: "var(--space-2)",
            }}
          >
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. React, TypeScript, Docker"
              style={{ ...inputStyle, flex: 1, marginTop: 0 }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                addToList("skills", newSkill);
                setNewSkill("");
              }}
            >
              Add
            </Button>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
          >
            {(form.skills ?? []).map((s, i) => (
              <span
                key={i}
                style={{
                  background: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                  padding: "var(--space-1) var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {s}{" "}
                <button onClick={() => removeFromList("skills", i)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div style={fieldRow}>
          <div>
            <label style={labelStyle}>Short bio (English)</label>
            <textarea
              value={form.bioId ?? ""}
              placeholder="Describe your background, motivation and strengths..."
              rows={4}
              onChange={(e) => setField("bioId", e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
          <div>
            <label style={labelStyle}>Short bio (Japanese — 自己紹介)</label>
            <textarea
              value={form.bioJp ?? ""}
              placeholder="初めまして。日本で..."
              rows={4}
              onChange={(e) => setField("bioJp", e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            gap: "var(--space-3)",
          }}
        >
          <Button variant="primary" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          <Link to="/student/cv">
            <Button variant="ghost">Open CV builder</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
