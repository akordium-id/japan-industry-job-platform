import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main
      style={{
        padding: "4rem var(--container-px)",
        textAlign: "center",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <h1
        style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-3)" }}
      >
        404
      </h1>
      <p style={{ marginBottom: "var(--space-5)" }}>Page not found.</p>
      <Link
        to="/"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-text-inverse)",
          padding: "var(--space-3) var(--space-5)",
          borderRadius: "var(--radius-md)",
          fontWeight: "var(--font-semibold)",
        }}
      >
        Go home
      </Link>
    </main>
  );
}
