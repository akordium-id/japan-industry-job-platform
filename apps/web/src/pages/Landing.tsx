import { Link } from "react-router-dom";
import {
  ShieldCheck,
  GraduationCap,
  Award,
  Bot,
  TrendingUp,
  Users2,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { BRAND_NAME, PLATFORM_STATS } from "@/lib/constants";

const roles = [
  {
    icon: "🎓",
    label: "Candidates",
    labelJp: "学生・候補者",
    desc: "Access pre-migration curriculum, cultural training, and earn the platform certificate for a Japan career.",
    color: "#3498db",
  },
  {
    icon: "🏢",
    label: "Partner Companies",
    labelJp: "日本企業",
    desc: "Discover validated candidates through AI Smart Matching and cultural readiness scoring.",
    color: "#8e44ad",
  },
  {
    icon: "📚",
    label: "Educators & Mentors",
    labelJp: "教育者・メンター",
    desc: "Bilingual tutors and senior industry mentors guide candidates from basics to live business simulations.",
    color: "#16a085",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Independent Identity",
    desc: "Register directly or link your institutional account. Full control of your data.",
    color: "var(--color-primary)",
  },
  {
    icon: GraduationCap,
    title: "Staged Curriculum",
    desc: "From Japanese language foundations to live business negotiation with Japanese executives.",
    color: "var(--color-role-student)",
  },
  {
    icon: Award,
    title: "Recognised Credentials",
    desc: "Official certificates and program transcripts as proof of work-ready competency.",
    color: "var(--color-success)",
  },
  {
    icon: Bot,
    title: "AI Smart Matching",
    desc: "An intelligent matching engine connects candidates with the most relevant partner companies.",
    color: "var(--color-role-corporate)",
  },
  {
    icon: TrendingUp,
    title: "Career Intelligence",
    desc: "Lifetime career guidance: contract negotiation, promotion, and transfer notifications.",
    color: "var(--color-warning)",
  },
  {
    icon: Users2,
    title: "Senior Mentor Network",
    desc: "Direct mentoring by retired Japanese industry executives for tacit knowledge transfer.",
    color: "var(--color-role-silver)",
  },
];

export default function Landing() {
  const { isAuthenticated, user } = useAuth();

  const getStartedPath = () => {
    if (!isAuthenticated) return "/login";
    switch (user?.role) {
      case "student":
        return "/student";
      case "corporate":
        return "/corporate";
      case "educator_bilingual":
      case "educator_silver":
        return "/educator";
      case "alumni":
        return "/career";
      default:
        return "/login";
    }
  };

  return (
    <div style={{ background: "var(--color-bg)" }}>
      <section
        style={{
          padding: "var(--space-20) var(--container-px)",
          background: `linear-gradient(135deg, var(--color-surface) 0%, var(--color-primary-soft) 100%)`,
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max-width)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "var(--space-12)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                background: "var(--color-surface)",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-border)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-6)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-success)",
                }}
              />
              Official cross-border talent platform
            </div>
            <h1
              style={{
                fontSize: "var(--text-5xl)",
                lineHeight: 1.15,
                marginBottom: "var(--space-3)",
              }}
            >
              {BRAND_NAME}
              <br />
              <span style={{ color: "var(--color-accent)" }}>
                Japan Career Bridge
              </span>
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-tertiary)",
                marginBottom: "var(--space-4)",
              }}
            >
              クロスボーダー人材プラットフォーム
            </p>
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-8)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              An integrated pre-migration ecosystem that prepares talent for
              careers in Japanese industry — from language foundations to
              official placement.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                flexWrap: "wrap",
              }}
            >
              <Link
                to={getStartedPath()}
                style={{
                  background: "var(--color-accent)",
                  color: "var(--color-text-inverse)",
                  padding: "var(--space-3) var(--space-6)",
                  borderRadius: "var(--radius-md)",
                  fontWeight: "var(--font-semibold)",
                }}
              >
                {isAuthenticated ? "Open dashboard" : "Get started"}
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    padding: "var(--space-3) var(--space-6)",
                    borderRadius: "var(--radius-md)",
                    fontWeight: "var(--font-semibold)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Learn more
                </Link>
              )}
            </div>
          </div>
          <div>
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-6)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  paddingBottom: "var(--space-4)",
                  borderBottom: "1px solid var(--color-border-soft)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#c0392b",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#e67e22",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#27ae60",
                  }}
                />
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {BRAND_NAME} Platform
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "var(--space-4)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-2xl)",
                      fontWeight: 700,
                      color: "var(--color-accent)",
                    }}
                  >
                    {PLATFORM_STATS.placementRate}%
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    Placement rate
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-2xl)",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                    }}
                  >
                    {PLATFORM_STATS.totalAlumni}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    Active alumni
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-2xl)",
                      fontWeight: 700,
                      color: "var(--color-success)",
                    }}
                  >
                    {PLATFORM_STATS.partnerCompanies}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    Partners
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "var(--space-4)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  <span>Active curriculum</span>
                  <span>Phase 2 / 4</span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--color-surface-2)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "50%",
                      height: "100%",
                      background: "var(--color-accent)",
                      borderRadius: "var(--radius-full)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" style={{ padding: "var(--space-12) var(--container-px)" }}>
        <div
          style={{
            maxWidth: "var(--content-max-width)",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "var(--space-8)" }}>Who is it for?</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--space-5)",
            }}
          >
            {roles.map((role) => (
              <div
                key={role.label}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-6)",
                  border: "1px solid var(--color-border)",
                  borderTop: `4px solid ${role.color}`,
                  textAlign: "left",
                }}
              >
                <span
                  style={{ fontSize: 32, display: "block", marginBottom: 12 }}
                >
                  {role.icon}
                </span>
                <h3
                  style={{
                    fontSize: "var(--text-lg)",
                    marginBottom: 4,
                  }}
                >
                  {role.label}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-tertiary)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {role.labelJp}
                </p>
                <p style={{ fontSize: "var(--text-sm)" }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="stats"
        style={{
          padding: "var(--space-12) var(--container-px)",
          background: "var(--color-surface-2)",
        }}
      >
        <div style={{ maxWidth: "var(--content-max-width)", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "var(--space-6)",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "var(--text-4xl)",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                }}
              >
                {PLATFORM_STATS.totalAlumni}+
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Certified alumni
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "var(--text-4xl)",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                }}
              >
                {PLATFORM_STATS.placementRate}%
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Placement rate
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "var(--text-4xl)",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                }}
              >
                {PLATFORM_STATS.partnerCompanies}
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Partner companies
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "var(--text-4xl)",
                  fontWeight: 700,
                  color: "var(--color-accent)",
                }}
              >
                {PLATFORM_STATS.avgTimeToPlacement}
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Avg. months to placement
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[var(--content-max-width)] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 inline-block">
              Integrated Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Integrated ecosystem
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Every component is designed to take you from zero to work-ready in Japan.
            </p>
          </div>

          {/* 3 cards in 2 rows on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: "var(--color-surface-2)",
                      color: f.color,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-slate-950 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "var(--space-12) var(--container-px)",
          background: "var(--color-primary)",
          color: "var(--color-text-inverse)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "var(--color-text-inverse)" }}>
            Ready to start your career journey?
          </h2>
          <p
            style={{
              marginBottom: "var(--space-6)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Join the alumni network now working at leading Japanese companies.
          </p>
          <Link
            to="/register"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              padding: "var(--space-3) var(--space-6)",
              borderRadius: "var(--radius-md)",
              fontWeight: "var(--font-semibold)",
              display: "inline-block",
            }}
          >
            Sign up free
          </Link>
        </div>
      </section>

      <footer
        style={{
          padding: "var(--space-8) var(--container-px)",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--content-max-width)",
            margin: "0 auto",
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <span>© 2026 {BRAND_NAME}. All rights reserved.</span>
          <span>クロスボーダー人材プラットフォーム</span>
        </div>
      </footer>
    </div>
  );
}
