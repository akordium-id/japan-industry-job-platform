import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { ReadinessGauge } from "./ReadinessGauge";

describe("ReadinessGauge Component", () => {
  it("renders with correct percentage and title", () => {
    render(
      <ReadinessGauge
        score={75}
        title="Skor Kesiapan"
        subtitle="Japan Readiness"
        breakdown={[
          { label: "Verifikasi KTP", passed: true },
          { label: "Sertifikat JLPT", passed: false },
        ]}
      />,
    );

    expect(screen.getByText("75%")).toBeDefined();
    expect(screen.getByText("Skor Kesiapan")).toBeDefined();
    expect(screen.getByText("Verifikasi KTP")).toBeDefined();
    expect(screen.getByText("Sertifikat JLPT")).toBeDefined();
  });

  it("clamps score properly within 0-100", () => {
    render(<ReadinessGauge score={120} />);
    expect(screen.getByText("100%")).toBeDefined();
  });
});
