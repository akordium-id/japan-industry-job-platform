#!/bin/sh
set -e

echo "[entrypoint] Memeriksa koneksi database & menjalankan inisialisasi skema..."
node dist/db/migrate.js

echo "[entrypoint] Memulai API server..."
exec "$@"
