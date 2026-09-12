# Japan Industry Job Platform (JIJP)

> **日尼人材交流プラットフォーム** — Official Cross-border Pre-Migration & Industrial Talent Ecosystem

Japan Industry Job Platform (JIJP) adalah platform ekosistem pra-migrasi terintegrasi yang menghubungkan talenta muda terampil dari Indonesia dengan korporasi manufaktur, teknik, dan teknologi di Jepang secara resmi, transparan, dan terstruktur.

---

## 🌟 Fitur Utama Platform

- **The Pathway to Japan (Alur 4 Tahap)**:
  1. _Fondasi Bahasa & Budaya_: Modul persiapan N5–N3, etika korporasi Jepang (_Hou-Ren-So_, _Nemawashi_, _Tatemae_).
  2. _Document Vault Terenkripsi_: Penyimpanan aman KTP, ijazah, sertifikat, dan pembuatan otomatis resume berstandar resmi Jepang (**JIS Rirekisho & Shokumu Keirekisho**).
  3. _AI Smart Matching & Executive Mentorship_: Pencocokan akurat berbasis skor kesiapan kompetensi riil, simulasi wawancara langsung bersama eksekutif purnatugas (_Silver Mentors_ ex-Toyota, dsb).
  4. _Visa COE & Penempatan Resmi_: Fasilitasi jalur visa bilateral resmi (_Specified Skilled Worker / SSW 1 & 2_ serta _Gijinkoku Engineer_).
- **Multi-Role Portals**:
  - **Candidate (Student)**: Dashboard belajar, Document Vault, generator CV JIS, kalender sesi pelatihan, lamaran lowongan.
  - **Corporate HR (Japanese Companies)**: Portal posting lowongan, AI Talent Scout Engine, tinjauan kandidat tervalidasi.
  - **Bilingual Educator & Senior Mentor**: Manajemen kelas, penilaian kesiapan budaya (_Keigo_), jadwal sesi mentoring industri.
  - **Alumni**: Pelacakan jenjang karier (_Career Timeline_), panduan negosiasi kontrak kerja di Jepang.
  - **Administrator**: Verifikasi dokumen resmi, approval perusahaan, audit kepatuhan bilateral.

---

## 🏗️ Struktur Monorepo

Repository ini dikelola menggunakan **Turborepo** dan **pnpm workspace**:

```text
japan-industry-job-platform/
├── apps/
│   ├── api/          # Express REST API (TypeScript, MySQL2, Session Auth, Pino, Swagger)
│   └── web/          # Frontend Web Portal (React 19, Vite, Tailwind CSS v4, Radix UI)
├── packages/
│   ├── types/        # TypeScript type definitions terpadu (shared across apps)
│   └── validators/   # Skema validasi runtime berbasis Zod
└── tooling/
    ├── eslint/       # Konfigurasi ESLint flat-config monorepo
    └── typescript/   # Konfigurasi tsconfig bersama
```

---

## 🚀 Memulai (Quick Start)

### Prasyarat

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0`
- **MySQL**: `>= 8.0`

### 1. Instalasi Dependensi

```bash
pnpm install
```

### 2. Konfigurasi Environment

Salin konfigurasi environment pada backend API:

```bash
# apps/api/.env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jijp_db
DB_USER=root
DB_PASSWORD=your_password
SESSION_SECRET=super_secret_session_key_min_8_chars
CORS_ORIGINS=http://localhost:5173
```

### 3. Database Migration & Seeder

Inisialisasi tabel dan data awal (Admin, Lowongan, Kursus):

```bash
pnpm --filter @jijp/api seed
```

### 4. Menjalankan Development Server

Jalankan seluruh layanan (Frontend & Backend API) secara bersamaan:

```bash
pnpm dev
```

- **Frontend Portal**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **API Swagger Documentation**: `http://localhost:3001/api/docs`

---

## 🛠️ Perintah CLI (Workspace Scripts)

| Perintah         | Deskripsi                                                          |
| :--------------- | :----------------------------------------------------------------- |
| `pnpm dev`       | Menjalankan seluruh aplikasi dalam mode development (_watch mode_) |
| `pnpm build`     | Membangun bundle produksi untuk semua package dan apps             |
| `pnpm lint`      | Menjalankan ESLint pada seluruh codebase monorepo                  |
| `pnpm typecheck` | Menjalankan validasi tipe TypeScript (`tsc --noEmit`)              |
| `pnpm test`      | Menjalankan unit test berbasis Vitest                              |
| `pnpm format`    | Menjalankan formatting kode dengan Prettier                        |

---

## 📜 Lisensi & Standar Kepatuhan

Dikembangkan oleh **Akordium Lab** untuk standar kepatuhan ketenagakerjaan bilateral Indonesia – Jepang (Zero Illegal Deductions, Official Visa Pathways).
