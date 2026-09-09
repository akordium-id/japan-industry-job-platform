import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CURRICULUM_MODULES, JIJP_CREDENTIALS } from "@/data/mockData";

describe("Badge & ProgressBar Components with Mock Data", () => {
  it("renders credential status badges correctly", () => {
    const cred = JIJP_CREDENTIALS[0];
    render(
      <Badge variant="success" dot>
        {cred.status.toUpperCase()}
      </Badge>,
    );

    expect(screen.getByText("VALID")).toBeDefined();
  });

  it("renders curriculum module progress bar properly", () => {
    const activeMod = CURRICULUM_MODULES[1];
    render(
      <ProgressBar
        value={activeMod.progress}
        label={activeMod.title}
        variant="accent"
      />,
    );

    expect(screen.getByText(activeMod.title)).toBeDefined();
    expect(screen.getByText("75%")).toBeDefined();
  });
});
