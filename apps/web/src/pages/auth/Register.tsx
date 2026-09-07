import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
  useRegisterMutation,
} from "@/api/hooks";
import { BRAND_NAME } from "@/lib/constants";

export default function Register() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormData) => {
    setErrorMsg("");
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/student");
      },
      onError: (err) => {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Registration failed, please check your details.",
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
              Create account
            </h1>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-tertiary)",
                marginTop: "var(--space-1)",
              }}
            >
              クロスボーダー人材プラットフォーム · Candidate registration
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
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
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: "var(--text-sm)",
                }}
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="e.g. Budi Santoso"
                autoComplete="name"
                style={{
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
              />
              {errors.name && (
                <span
                  style={{
                    color: "var(--color-error)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {errors.name.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "var(--space-4)" }}>
              <label
                htmlFor="reg-email"
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: "var(--text-sm)",
                }}
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
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
                htmlFor="reg-password"
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: "var(--text-sm)",
                }}
              >
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                {...register("password")}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
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
              disabled={registerMutation.isPending}
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
              {registerMutation.isPending ? "Creating..." : "Create account"}
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
            <span>Already have an account?</span>{" "}
            <Link
              to="/login"
              style={{ color: "var(--color-accent)", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
