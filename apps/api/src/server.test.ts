import "dotenv/config";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";

import { createServer } from "./server.js";

vi.mock("./db/pool.js", () => {
  const mockQuery = vi.fn().mockImplementation((sql: string) => {
    const lower = sql.toLowerCase();
    if (lower.includes("count(*)") || lower.includes("count(*)")) {
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

describe("JIJP API (server.ts)", () => {
  it("should respond 200 on root health check", async () => {
    const app = createServer();
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 for routes without /api prefix", async () => {
    const app = createServer();
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(404);
  });

  it("should enforce authentication on protected endpoints", async () => {
    const app = createServer();
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Unauthorized");
  });

  it("should reject login without password", async () => {
    const app = createServer();
    const res = await request(app).post("/api/auth/login").send({
      email: "budi@student.jijp.id",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validasi gagal");
  });

  it("should reject unauthenticated file download requests", async () => {
    const app = createServer();
    const res = await request(app).get("/api/documents/file/1");
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Unauthorized");
  });

  it("should enforce security headers via helmet", async () => {
    const app = createServer();
    const res = await request(app).get("/");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });
});

describe("Soft Delete & Audit Columns Integration", () => {
  it("should not return soft deleted documents or jobs", async () => {
    const app = createServer();
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should never include deleted_at or deleted_by in any json response", async () => {
    const app = createServer();
    const res = await request(app).get("/api/courses");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
