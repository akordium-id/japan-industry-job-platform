import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

import { performDemoReset } from "./demoReset.service.js";

let schedulerInterval: NodeJS.Timeout | null = null;
let lastResetDate: string | null = null;
let isResetting = false;

export function getTimeInTimezone(
  date: Date,
  timeZone: string,
): { hour: number; minute: number; dateString: string } {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "";

    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");
    const hour = parseInt(getPart("hour"), 10) || 0;
    const minute = parseInt(getPart("minute"), 10) || 0;

    return {
      hour,
      minute,
      dateString: `${year}-${month}-${day}`,
    };
  } catch {
    // Fallback if timezone string is invalid
    return {
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      dateString: date.toISOString().slice(0, 10),
    };
  }
}

export async function checkAndTriggerReset(): Promise<boolean> {
  if (isResetting) return false;

  const now = new Date();
  const { hour, minute, dateString } = getTimeInTimezone(
    now,
    env.DEMO_RESET_TIMEZONE,
  );

  // Trigger reset at the target hour (default 02:00) within the first 5 minutes of the hour
  if (
    hour === env.DEMO_RESET_HOUR &&
    minute >= 0 &&
    minute <= 5 &&
    lastResetDate !== dateString
  ) {
    isResetting = true;
    try {
      logger.info(
        {
          currentTime: now.toISOString(),
          timezone: env.DEMO_RESET_TIMEZONE,
          localHour: hour,
          localMinute: minute,
          targetHour: env.DEMO_RESET_HOUR,
        },
        "[scheduler] Waktu dini hari tercapai. Memulai reset otomatis demo data ke initial seeder state...",
      );

      await performDemoReset({ reason: "scheduled_nightly" });
      lastResetDate = dateString;
      return true;
    } catch (err) {
      logger.error(
        { error: (err as Error).message, stack: (err as Error).stack },
        "[scheduler] Gagal menjalankan reset otomatis demo",
      );
      return false;
    } finally {
      isResetting = false;
    }
  }

  return false;
}

export function startDemoScheduler(): void {
  if (!env.DEMO_AUTO_RESET_ENABLED) {
    logger.info(
      "[scheduler] Demo auto reset dinonaktifkan via DEMO_AUTO_RESET_ENABLED=false",
    );
    return;
  }

  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  logger.info(
    {
      targetHour: env.DEMO_RESET_HOUR,
      timezone: env.DEMO_RESET_TIMEZONE,
    },
    `[scheduler] Scheduler reset demo aktif: akan reset setiap dini hari pukul ${String(env.DEMO_RESET_HOUR).padStart(2, "0")}:00 (${env.DEMO_RESET_TIMEZONE}).`,
  );

  // Run check every 45 seconds
  schedulerInterval = setInterval(() => {
    checkAndTriggerReset().catch((err) => {
      logger.error(
        { error: (err as Error).message },
        "[scheduler] Error in interval check",
      );
    });
  }, 45_000);

  // Also do not hold event loop process exit if needed
  schedulerInterval.unref();
}

export function stopDemoScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    logger.info("[scheduler] Scheduler reset demo dihentikan.");
  }
}

export function getSchedulerStatus(): {
  enabled: boolean;
  targetHour: number;
  timezone: string;
  lastResetDate: string | null;
  isRunning: boolean;
} {
  return {
    enabled: env.DEMO_AUTO_RESET_ENABLED,
    targetHour: env.DEMO_RESET_HOUR,
    timezone: env.DEMO_RESET_TIMEZONE,
    lastResetDate,
    isRunning: schedulerInterval !== null,
  };
}
