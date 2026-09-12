import "dotenv/config";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

import { createServer } from "../server.js";

vi.mock("../db/pool.js", () => {
  const mockQuery = vi.fn().mockImplementation((sql: string) => {
    const lower = sql.toLowerCase();
    if (lower.includes("count(*)")) {
      return Promise.resolve([{ total: 0 }]);
    }
    return Promise.resolve([[]]);
  });

  return {
    getPool: () => ({
      query: mockQuery,
    }),
    closePool: vi.fn(),
  };
});

vi.mock("../services/demoReset.service.js", () => ({
  performDemoReset: vi.fn().mockResolvedValue({
    success: true,
    reason: "test_reason",
    resetAt: "2026-09-12T00:00:00.000Z",
    purgedFilesCount: 5,
    durationMs: 42,
  }),
  resetUploadFiles: vi.fn().mockReturnValue({ purgedCount: 5 }),
}));

describe("Admin Demo Reset & Status Endpoints", () => {
  it("rejects unauthorized access to /api/admin/demo-status", async () => {
    const app = createServer();
    const res = await request(app).get("/api/admin/demo-status");
    expect(res.status).toBe(403);
  });

  it("rejects unauthorized access to /api/admin/reset-demo", async () => {
    const app = createServer();
    const res = await request(app).post("/api/admin/reset-demo");
    expect(res.status).toBe(403);
  });
});
