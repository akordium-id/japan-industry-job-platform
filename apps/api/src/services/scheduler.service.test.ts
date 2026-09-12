import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { UPLOAD_ROOT } from "../middleware/upload.js";

import { getTimeInTimezone, getSchedulerStatus } from "./scheduler.service.js";
import { resetUploadFiles } from "./demoReset.service.js";

describe("scheduler.service", () => {
  it("computes correct local hour and date for Asia/Jakarta (UTC+7)", () => {
    // 2026-09-12T19:00:00Z -> In Asia/Jakarta (UTC+7), this is 2026-09-13 02:00:00
    const utcDate = new Date("2026-09-12T19:00:00.000Z");
    const result = getTimeInTimezone(utcDate, "Asia/Jakarta");

    expect(result.hour).toBe(2);
    expect(result.minute).toBe(0);
    expect(result.dateString).toBe("2026-09-13");
  });

  it("handles fallback if invalid timezone is passed", () => {
    const utcDate = new Date("2026-09-12T10:30:00.000Z");
    const result = getTimeInTimezone(
      utcDate,
      "Invalid/Timezone_That_Does_Not_Exist",
    );

    expect(result.hour).toBe(10);
    expect(result.minute).toBe(30);
  });

  it("reports current scheduler status with defaults", () => {
    const status = getSchedulerStatus();
    expect(status.targetHour).toBe(2);
    expect(status.timezone).toBe("Asia/Jakarta");
    expect(typeof status.enabled).toBe("boolean");
  });
});

describe("demoReset.service - file cleanup & fixtures", () => {
  const dummyFile = path.join(UPLOAD_ROOT, "ktp", "test-client-upload.tmp");

  beforeEach(() => {
    fs.mkdirSync(path.join(UPLOAD_ROOT, "ktp"), { recursive: true });
    fs.writeFileSync(dummyFile, "dummy client uploaded data for testing reset");
  });

  afterEach(() => {
    if (fs.existsSync(dummyFile)) {
      fs.rmSync(dummyFile, { force: true });
    }
  });

  it("purges user uploaded files and restores master fixtures", () => {
    expect(fs.existsSync(dummyFile)).toBe(true);

    const { purgedCount } = resetUploadFiles();

    // Client uploaded file must be deleted
    expect(fs.existsSync(dummyFile)).toBe(false);
    expect(purgedCount).toBeGreaterThanOrEqual(1);

    // Standard directories must exist
    expect(fs.existsSync(path.join(UPLOAD_ROOT, "certificate"))).toBe(true);
    expect(fs.existsSync(path.join(UPLOAD_ROOT, "ktp"))).toBe(true);
    expect(fs.existsSync(path.join(UPLOAD_ROOT, "portfolio"))).toBe(true);
    expect(fs.existsSync(path.join(UPLOAD_ROOT, "transcript"))).toBe(true);

    // Fixture files should be restored
    const sampleCert = path.join(
      UPLOAD_ROOT,
      "certificate",
      "sample-jlpt-n3.pdf",
    );
    if (
      fs.existsSync(
        path.resolve(
          process.cwd(),
          "fixtures/uploads/certificate/sample-jlpt-n3.pdf",
        ),
      )
    ) {
      expect(fs.existsSync(sampleCert)).toBe(true);
    }
  });
});
