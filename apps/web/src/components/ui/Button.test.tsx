import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Button } from "./Button";

describe("Button Component", () => {
  it("renders correctly with label", () => {
    render(<Button>Klik Saya</Button>);
    expect(screen.getByText("Klik Saya")).toBeDefined();
  });

  it("shows loading spinner when loading is true", () => {
    render(<Button loading>Memuat...</Button>);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("renders asChild without crashing Slot", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/test");
  });
});
