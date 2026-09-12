import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Sparkles } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormData, useLoginMutation } from "@/api/hooks";
import { BRAND_NAME } from "@/lib/constants";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (searchParams.get("session_expired")) {
      setNoticeMsg(
        "Your session has expired. Please sign in again to continue.",
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case "student":
          navigate("/student", { replace: true });
          break;
        case "corporate":
          navigate("/corporate", { replace: true });
          break;
        case "educator_bilingual":
        case "educator_silver":
          navigate("/educator", { replace: true });
          break;
        case "alumni":
          navigate("/career", { replace: true });
          break;
        case "admin":
          navigate("/admin/verifications", { replace: true });
          break;
        default:
          navigate("/student", { replace: true });
          break;
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    setErrorMsg("");
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        const loggedInUser = res?.user;
        if (loggedInUser?.role === "student") navigate("/student");
        else if (loggedInUser?.role === "corporate") navigate("/corporate");
        else if (
          loggedInUser?.role === "educator_bilingual" ||
          loggedInUser?.role === "educator_silver"
        )
          navigate("/educator");
        else if (loggedInUser?.role === "alumni") navigate("/career");
        else if (loggedInUser?.role === "admin")
          navigate("/admin/verifications");
        else navigate("/student");
      },
      onError: (err) => {
        setErrorMsg(
          err instanceof Error ? err.message : "Invalid email or password.",
        );
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--navbar-height))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-12) var(--container-px)",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
            padding: "var(--space-8)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
            <Link
              to="/"
              style={{
                color: "var(--color-accent)",
                fontWeight: 800,
                fontSize: 22,
              }}
            >
              {BRAND_NAME}
            </Link>
            <h1
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-2xl)",
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
                marginTop: "var(--space-1)",
              }}
            >
              クロスボーダー人材プラットフォーム · Portal access
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {noticeMsg && (
              <div
                style={{
                  color: "var(--color-warning)",
                  marginBottom: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-warning-soft)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                  border: "1px solid var(--color-warning)",
                }}
              >
                ⚠️ {noticeMsg}
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  color: "var(--color-error)",
                  marginBottom: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-error-soft)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {errorMsg}
              </div>
            )}

            <div style={{ marginBottom: "var(--space-4)" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: "var(--text-sm)",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                }}
              />
              {errors.email && (
                <span
                  style={{
                    color: "var(--color-error)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {errors.email.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "var(--space-5)" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: "var(--text-sm)",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                }}
              />
              {errors.password && (
                <span
                  style={{
                    color: "var(--color-error)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              style={{
                width: "100%",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-accent)",
                color: "var(--color-text-inverse)",
                borderRadius: "var(--radius-md)",
                fontWeight: "var(--font-semibold)",
                fontSize: "var(--text-sm)",
              }}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div
            style={{
              marginTop: "var(--space-5)",
              textAlign: "center",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            <span>No account?</span>{" "}
            <Link
              to="/register"
              style={{ color: "var(--color-accent)", fontWeight: 600 }}
            >
              Create one
            </Link>
          </div>

          <div
            style={{
              marginTop: "var(--space-6)",
              paddingTop: "var(--space-3)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              type="button"
              onClick={() => setIsDemoOpen((prev) => !prev)}
              aria-expanded={isDemoOpen}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 4px",
                background: "transparent",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                marginBottom: isDemoOpen ? "var(--space-3)" : 0,
                transition: "opacity 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={14} style={{ color: "var(--color-accent)" }} />
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Demo Quick-Login
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-info-soft, #e0f2fe)",
                    color: "var(--color-info, #0284c7)",
                    fontWeight: 600,
                  }}
                >
                  Reset 02:00 WIB
                </span>
                <ChevronDown
                  size={15}
                  style={{
                    color: "var(--color-text-tertiary)",
                    transform: isDemoOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>
            </button>

            {isDemoOpen && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "var(--space-2)",
                  }}
                >
                  {[
                    {
                      role: "Admin",
                      email: "admin@jijp.id",
                      desc: "Verifikasi Dokumen",
                    },
                    {
                      role: "Corporate",
                      email: "corporate@chubu-precision.jp",
                      desc: "Chubu Precision HR",
                    },
                    {
                      role: "Kandidat",
                      email: "budi.santoso@student.jijp.id",
                      desc: "Budi Santoso (N3)",
                    },
                    {
                      role: "Alumni",
                      email: "rina.kusuma@alumni.jijp.id",
                      desc: "Career Timeline",
                    },
                    {
                      role: "Educator",
                      email: "sari.sensei@jijp.id",
                      desc: "Instruktur N3",
                    },
                  ].map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => {
                        setValue("email", acc.email);
                        setValue("password", "password123");
                      }}
                      style={{
                        padding: "6px 8px",
                        textAlign: "left",
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      title={`Klik untuk mengisi akun ${acc.email}`}
                    >
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color: "var(--color-accent)",
                        }}
                      >
                        {acc.role}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--color-text-tertiary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {acc.desc}
                      </div>
                    </button>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-tertiary)",
                    marginTop: "var(--space-2)",
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  Setiap pembaruan data demo akan otomatis di-reset ke initial
                  state setiap pukul 02:00 WIB.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
