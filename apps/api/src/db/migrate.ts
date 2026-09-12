import mysql from "mysql2/promise";

import { env } from "../config/env.js";

import { runSeed } from "./seed.js";
import { closePool } from "./pool.js";

async function waitForDatabase(
  maxRetries = 30,
  intervalMs = 2000,
): Promise<void> {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const conn = await mysql.createConnection({
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        connectTimeout: 5000,
      });
      await conn.ping();
      await conn.end();
      console.log(
        `[migrate] Terhubung ke MySQL (${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME})`,
      );
      return;
    } catch (err) {
      console.log(
        `[migrate] Menunggu database siap (${env.DB_HOST}:${env.DB_PORT})... percobaan ${i}/${maxRetries}`,
      );
      if (i === maxRetries) {
        throw new Error(
          `Gagal terhubung ke database setelah ${maxRetries} kali percobaan: ${(err as Error).message}`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
}

async function main(): Promise<void> {
  console.log("[migrate] Memulai pemeriksaan migrasi database...");
  await waitForDatabase();
  console.log("[migrate] Menjalankan inisialisasi skema & seed dasar...");
  await runSeed();
  console.log("[migrate] Inisialisasi skema & seed berhasil diselesaikan.");
  await closePool();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("[migrate] Migrasi gagal:", err);
  await closePool();
  process.exit(1);
});
