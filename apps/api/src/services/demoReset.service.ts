import fs from "node:fs";
import path from "node:path";

import type { Pool } from "mysql2/promise";

import { getPool } from "../db/pool.js";
import { initSchema, seedInitialData } from "../db/seed.js";
import { UPLOAD_ROOT } from "../middleware/upload.js";
import { logger } from "../lib/logger.js";

export interface DemoResetResult {
  success: boolean;
  reason: string;
  resetAt: string;
  purgedFilesCount: number;
  durationMs: number;
}

const FIXTURES_ROOT = path.resolve(process.cwd(), "fixtures/uploads");

const TRANSACTIONAL_TABLES = [
  "notifications",
  "job_applications",
  "course_enrollments",
  "documents",
  "calendar_events",
  "job_postings",
  "companies",
  "course_modules",
  "courses",
  "users",
  "sessions",
] as const;

export async function resetDatabaseTables(p: Pool): Promise<void> {
  await p.query("SET FOREIGN_KEY_CHECKS = 0;");
  try {
    for (const table of TRANSACTIONAL_TABLES) {
      try {
        await p.query(`TRUNCATE TABLE \`${table}\``);
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === "ER_NO_SUCH_TABLE") {
          continue;
        }
        try {
          await p.query(`DELETE FROM \`${table}\``);
        } catch (innerErr) {
          const innerCode = (innerErr as { code?: string }).code;
          if (innerCode !== "ER_NO_SUCH_TABLE") {
            throw innerErr;
          }
        }
      }
    }
  } finally {
    await p.query("SET FOREIGN_KEY_CHECKS = 1;");
  }
}

export function resetUploadFiles(): { purgedCount: number } {
  let purgedCount = 0;
  const subdirs = ["certificate", "ktp", "portfolio", "transcript", "badge"];

  // 1. Purge all uploaded files in UPLOAD_ROOT
  if (fs.existsSync(UPLOAD_ROOT)) {
    const entries = fs.readdirSync(UPLOAD_ROOT, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(UPLOAD_ROOT, entry.name);
      try {
        if (entry.isDirectory()) {
          const inner = fs.readdirSync(fullPath);
          purgedCount += inner.length;
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          purgedCount += 1;
          fs.rmSync(fullPath, { force: true });
        }
      } catch (err) {
        logger.warn(
          { error: (err as Error).message, path: fullPath },
          "[demo-reset] Failed to remove upload file",
        );
      }
    }
  }

  // 2. Ensure subdirectories exist
  for (const d of subdirs) {
    fs.mkdirSync(path.join(UPLOAD_ROOT, d), { recursive: true });
  }

  // 3. Restore master fixtures if present
  if (fs.existsSync(FIXTURES_ROOT)) {
    try {
      fs.cpSync(FIXTURES_ROOT, UPLOAD_ROOT, { recursive: true });
      logger.info(
        { from: FIXTURES_ROOT, to: UPLOAD_ROOT },
        "[demo-reset] Restored initial master fixture files",
      );
    } catch (err) {
      logger.error(
        { error: (err as Error).message },
        "[demo-reset] Failed to restore master fixtures",
      );
    }
  }

  return { purgedCount };
}

export async function performDemoReset(options: {
  reason: string;
  triggerByUserId?: number | undefined;
}): Promise<DemoResetResult> {
  const startTime = Date.now();
  const pool = getPool();

  logger.info(
    { reason: options.reason, triggerByUserId: options.triggerByUserId },
    "[demo-reset] Memulai proses reset demo data dan pembersihan berkas unggahan...",
  );

  // 1. Inisialisasi skema & tabel jika belum ada
  await initSchema(pool);

  // 2. Reset database tables
  await resetDatabaseTables(pool);

  // 3. Reseed initial master data
  await seedInitialData(pool);

  // 3. Purge user uploads and restore initial fixtures
  const { purgedCount } = resetUploadFiles();

  const durationMs = Date.now() - startTime;
  const resetAt = new Date().toISOString();

  logger.info(
    {
      reason: options.reason,
      purgedFilesCount: purgedCount,
      durationMs,
      resetAt,
    },
    "[demo-reset] Reset demo state berhasil diselesaikan secara sempurna.",
  );

  return {
    success: true,
    reason: options.reason,
    resetAt,
    purgedFilesCount: purgedCount,
    durationMs,
  };
}
