import { performDemoReset } from "../services/demoReset.service.js";

import { closePool } from "./pool.js";

async function main(): Promise<void> {
  console.log(
    "[cli-reset] Memulai reset manual demo state ke initial seeder state...",
  );
  const result = await performDemoReset({ reason: "cli_manual_execution" });
  console.log(
    `[cli-reset] Selesai dalam ${result.durationMs}ms. Berkas dibersihkan: ${result.purgedFilesCount}. Timestamp: ${result.resetAt}`,
  );
  await closePool();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("[cli-reset] Reset gagal:", err);
  await closePool();
  process.exit(1);
});
