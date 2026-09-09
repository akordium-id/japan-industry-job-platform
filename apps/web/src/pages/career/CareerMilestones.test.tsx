import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { CAREER_MILESTONES } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

describe("Career Milestones UI Integration with Mock Data", () => {
  it("renders alumni career milestones and proactive recommendation correctly", () => {
    render(
      <div>
        {CAREER_MILESTONES.map((item) => (
          <Card key={item.id} className="test-milestone">
            <h3>{item.title}</h3>
            <p>{item.company}</p>
            {item.isProactive && (
              <Badge variant="accent" dot>
                Rekomendasi AI
              </Badge>
            )}
            <p>{item.description}</p>
          </Card>
        ))}
      </div>,
    );

    expect(screen.getByText("Initial Placement")).toBeDefined();
    expect(
      screen.getAllByText("Sample Manufacturer Co., Ltd.").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("Recommendation: Contract Negotiation Window"),
    ).toBeDefined();
    expect(screen.getByText("Rekomendasi AI")).toBeDefined();
  });
});
