# @jijp/api — Japan Industry Job Platform REST API

Backend service resmi untuk **Japan Industry Job Platform (JIJP)**. Dibangun menggunakan Express.js, TypeScript (ESM), MySQL2, Session & JWT authentication, dan terintegrasi dengan Swagger UI serta structured logging berbasis Pino.

---

## 🛠️ Tech Stack & Arsitektur

- **Framework**: Express 4.x + TypeScript (Node.js ESM)
- **Database**: MySQL 8.x (`mysql2/promise` connection pool)
- **Authentication & Session**: `express-session` dengan `express-mysql-session` store & JWT
- **Request Validation**: Zod runtime validation via `@jijp/validators`
- **Logging**: `pino` & `pino-http` (structured JSON logging)
- **Security**: `helmet`, `cors`, `express-rate-limit`, `bcryptjs`
- **File Upload**: `multer` (Document Vault untuk KTP, Ijazah, Sertifikat)
- **Documentation**: `swagger-ui-express` OpenAPI spec

---

## ⚙️ Environment Variables

Buat file `.env` di dalam folder `apps/api/`:

```env
# Server
NODE_ENV=development
PORT=3001
CORS_ORIGINS=http://localhost:5173

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jijp_db
DB_USER=root
DB_PASSWORD=your_password

# Session & Auth
SESSION_SECRET=your_long_secure_session_secret_key

# File Upload (Document Vault)
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10

# Rate Limits (Optional Customization)
RATE_LIMIT_GLOBAL_PER_MIN=100
RATE_LIMIT_AUTH_PER_MIN=15
RATE_LIMIT_UPLOAD_PER_15MIN=20
RATE_LIMIT_CV_PER_MIN=10
```

---

## 🗄️ Database & Seeder

### Inisialisasi Database

API menggunakan query schema otomatis saat startup atau melalui script seeder:

```bash
# Menjalankan migrasi skema dan seeder data awal
pnpm seed
```

Data awal yang disiapkan meliputi:

- Akun Administrator default (`admin@jijp.id` / `password123`)
- Tabel: `users`, `companies`, `job_postings`, `job_applications`, `documents`, `courses`, `course_modules`, `course_enrollments`, `calendar_events`.

### Session Store

Aplikasi menggunakan `express-mysql-session`. Di mode _development_, tabel sesi dibuat secara otomatis (`createDatabaseTable: true`). Untuk kebutuhan produksi manual:

```bash
mysql -u <user> -p <database> < node_modules/express-mysql-session/lib/schema.sql
```

---

## 📖 Dokumentasi Endpoint (Swagger UI)

Setelah server berjalan, dokumentasi interaktif OpenAPI dapat diakses langsung di:

- **Swagger UI**: [`http://localhost:3001/api/docs`](http://localhost:3001/api/docs)
- **OpenAPI JSON Spec**: `GET /api/docs.json`

### Rute Utama API:

| Endpoint Prefix  | Deskripsi                                                   | Role Akses                |
| :--------------- | :---------------------------------------------------------- | :------------------------ |
| `/api/auth`      | Register, Login, Logout, Session check                      | Public / Authenticated    |
| `/api/user`      | Profil kandidat, riwayat CV JIS, skor kompetensi            | Authenticated             |
| `/api/jobs`      | Listing lowongan, perusahaan, lamaran, scout talent         | Student, Corporate, Admin |
| `/api/documents` | Upload & unduh berkas Document Vault (KTP, JLPT, Transkrip) | Student, Admin            |
| `/api/courses`   | Kurikulum pra-migrasi, modul pembelajaran, tracking progres | Student, Educator         |
| `/api/calendar`  | Jadwal sesi bimbingan bahasa, wawancara, dan meeting        | All Roles                 |
| `/api/admin`     | Verifikasi dokumen kandidat dan manajemen sistem            | Administrator             |

---

## 🚀 Perintah Development

```bash
# Menjalankan server dalam mode watch (hot-reload via tsx)
pnpm dev

# Menjalankan migrasi dan seeder data
pnpm seed

# Build TypeScript ke JavaScript produksi (dist/)
pnpm build

# Menjalankan server produksi
pnpm start

# Validasi linting ESLint
pnpm lint

# Unit test via Vitest
pnpm test
```

---

## 🪵 Logging

Logger menggunakan `pino`:

- Di mode **development**, log ditampilkan dalam format JSON / pino-pretty stdout.
- Di mode **production**, log dikeluarkan dalam format JSON terstruktur untuk ingest log collector (seperti Grafana Loki / Datadog / Docker logs).
