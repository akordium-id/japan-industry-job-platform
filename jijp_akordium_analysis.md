# 📊 Analisis JIJP Web App & Rekomendasi Clone untuk Portofolio Akordium

## 1. Ringkasan Produk: Apa Itu JIJP?

**JIJP (Japan Industry Training Academy)** adalah platform SaaS full-stack yang mempertemukan talenta Indonesia dengan industri kerja Jepang. Ini bukan sekedar CRUD biasa — platform ini punya **4 user role berbeda**, **dokumen workflow dengan verifikasi manual**, **PDF generation**, dan **two-way job matching**.

### Codebase Snapshot

| Komponen | Detail |
|---|---|
| **Frontend** | React 19 + TypeScript + Vite, React Router v7, TanStack Query v5, React Hook Form + Zod, Tailwind CSS v4, shadcn/ui tokens |
| **Backend** | Node.js + Express.js, MySQL 8 + mysql2, Session-based auth, Multer (file upload), PDFKit (CV generation), Nodemailer |
| **Arsitektur** | Feature-based modular: Controller → Service → Repository (thin controller pattern) |
| **Testing** | Vitest + React Testing Library + Playwright E2E |
| **Deployment** | Docker + Nginx, cPanel Passenger support, Coolify-ready |
| **Lokasi deploy** | `https://isense-technology.com/jijp` |

---

## 2. Peta Fitur Lengkap

### 🔐 Auth & Akses
- Register / Login lokal (bcrypt + express-session)
- **SSO ICE Center ITB** (JWT RS256 + auto-provisioning user)
- 6 Role: `student`, `alumni`, `corporate`, `educator_bilingual`, `educator_silver`, `admin`
- Protected routes per role via `ProtectedRoute` HOC
- Rate limiting: global (100 req/min), auth (15 req/min), upload (20/15 menit), CV (10 req/min)

### 👤 Profil Kandidat (Student)
- Edit nama Jepang (Kanji), tanggal lahir, kota asal, telepon
- Level JLPT (N5–N1), spesialisasi teknis (multi-value)
- Riwayat pendidikan (degree, institusi, tahun)
- Riwayat pengalaman kerja (title, perusahaan, periode)
- Skills list + Bio (Indonesia & Jepang)

### 📅 Kalender & Kursus (Learning Track)
- Kalender jadwal kelas dengan tipe event & visibility berbasis role
- Kurikulum 4 fase berjenjang (Bahasa Jepang → Bisnis Jepang → Negosiasi → Sertifikasi)
- Progress tracking per course (enrollment → in_progress → completed)
- Subtopik dengan durasi menit dan label bilingual (ID + JP)

### 📂 Document Vault
- Upload dokumen: KTP, Sertifikat, Portfolio, Transkrip (max 10MB, format: JPG/PNG/WebP/PDF)
- Secure file serving (path traversal protection, auth gate)
- Status per dokumen: `pending` → `approved` / `rejected`
- Smart sort: rejected first, kemudian prioritas KTP → Cert → Transcript → Portfolio
- Notifikasi ke admin saat dokumen di-submit

### 📄 CV Generator (Rirekisho / 履歴書)
- Generate PDF CV standar Jepang secara otomatis dari data profil
- Embed font **Noto Sans CJK JP** (render karakter Kanji/Hiragana di PDF)
- Cek kelengkapan profil sebelum generate
- Corporate bisa download CV kandidat terverifikasi
- Endpoint: `GET /api/cv/export` dan `GET /api/cv/export/:candidateId`

### 💼 Job Board & Matching (Two-Way)
- **Apply** (dari sisi kandidat): browse job, filter by specialization/JLPT/lokasi, apply + notifikasi perusahaan
- **Scout** (dari sisi corporate): cari kandidat terverifikasi, kirim undangan wawancara
- Pagination di job listing
- Aplikasi lifecycle: `submitted` → `shortlisted` → `accepted` / `rejected`
- Notifikasi kandidat via email (SMTP) + in-app saat status lamaran berubah

### 🏢 Corporate Dashboard
- Lihat kandidat scout-able (filter JLPT & spesialisasi)
- Buat & kelola lowongan (CRUD job posting + company management)
- Request interview modal dengan form job selection + pesan
- Download CV kandidat terverifikasi

### 👨‍🏫 Educator Portal
- Lihat data siswa terkait (role: `educator_bilingual`, `educator_silver`)
- Akses ke kalender kelas

### 🛡️ Admin Panel
- Dashboard verifikasi dokumen (pending queue)
- Approve / Reject individual + batch action
- Stats: total student, pending/approved docs, active jobs, total applications
- Notifikasi ke kandidat via email saat verifikasi selesai

### 📊 Career Timeline (Alumni)
- Timeline visual milestone karir pasca-penempatan (placement, promosi, kontrak, sertifikasi)
- Proactive AI recommendations ("Saatnya negosiasi kontrak") dengan dismiss/restore
- Modal booking konsultasi karir
- Career stats & industry benchmark (vs. rata-rata alumni)

### 🔔 Notifikasi In-App
- Bell icon dengan unread count di navbar
- Notifikasi templates: `document_submitted`, `document_approved`, `document_rejected`, `application_submitted`, `application_decided`, `scout_received`
- Multi-channel: In-App + Email SMTP + Webhook (HMAC-signed)

### 🛠️ Infrastruktur Teknis
- Helmet + CORS + Express Rate Limit (security)
- Soft delete pattern (`deleted_at`, `deleted_by`) di semua entitas utama
- Sanitize `deleted_at`/`deleted_by` dari semua response JSON
- Auto schema init + retry (untuk Docker cold start)
- Health check endpoint + Git version info endpoint
- Pino logger dengan request ID tracing
- OpenAPI 3.0 spec + Swagger UI di `/api/docs`

---

## 3. Kekuatan Kode yang Layak Di-highlight ke Klien

| Aspek | Detail |
|---|---|
| **TypeScript strict** | Zero `any`, semua inferret dari Zod schema |
| **Clean Architecture** | Thin controller, service layer, repository — sesuai best practice enterprise |
| **Security layers** | Helmet, CORS whitelist, rate limit per endpoint type, path traversal check, HMAC webhook |
| **Developer experience** | OpenAPI auto-generated, E2E test Playwright, unit test Vitest |
| **Bilingual UX** | Semua konten punya label Bahasa Indonesia + Jepang (aksara Kanji/Hiragana) |
| **PDF engine custom** | PDFKit + custom font CJK → generate dokumen resmi Jepang dari browser |

---

## 4. Rekomendasi: Clone JIJP Jadi Portofolio Akordium

> [!IMPORTANT]
> **TL;DR**: JIJP sangat layak dijadikan portofolio unggulan Akordium. Ini menunjukkan Akordium bisa handle platform kompleks multi-role dengan integrasi nyata (SSO, email, PDF generation). Berikut panduan eksekusinya.

### 4.1. Re-branding & Customisasi Domain

**Yang WAJIB diganti:**
- Nama "JIJP" / "Japan Industry Training Academy" → nama Akordium sendiri atau nama klien fiktif (e.g., **"Nexora Academy"**, **"TalentBridge"**)
- Referensi "ICE Center ITB" → generikkan menjadi "Enterprise SSO Integration"
- URL hardcode `isense-technology.com` → domain demo Akordium
- Logo & warna (saat ini pakai CSS variables, mudah diganti)
- Copyright footer
- Konten mock data (stats, milestone karir, curriculum) → buat yang lebih neutral/universal

**Yang bisa dipertahankan:**
- Semua arsitektur, pattern, dan logika bisnis

### 4.2. Upgrade Stack untuk Lebih Impress Klien

| Area | Kondisi Sekarang | Rekomendasi Upgrade |
|---|---|---|
| **Backend** | Express.js monolith `server.js` 1540 baris | Refactor ke modular yang sudah didesain di AGENTS.md (sudah ada blue print-nya) |
| **Auth** | Express-session (cookie) | Tambah JWT refresh token flow untuk mobile-ready |
| **Database** | MySQL | Bisa tetap, atau tambahkan contoh PostgreSQL variant untuk klien yang prefer Postgres |
| **File Storage** | Local disk (`uploads/`) | Tambah S3/MinIO adapter (sudah ada placeholder di AGENTS.md) |
| **Queue** | Synchronous in-request | Tambah BullMQ (sudah disebut di arsitektur, belum diimplementasi) |
| **CV PDF** | PDFKit basic | Upgrade ke Puppeteer (HTML → PDF) untuk template yang lebih kaya visual |

### 4.3. Fitur Tambahan yang Akan Buat Portofolio Lebih Kuat

**High impact, medium effort:**
1. **Dark mode** — CSS variables sudah siap, tinggal toggle
2. **Real-time notifications** — Socket.io in-app push (ganti dari polling)
3. **Dashboard analytics chart** — Recharts/Chart.js untuk admin stats visual
4. **Multi-language i18n** — react-i18next (konten sudah bilingual, tinggal ekstrak)

**High impact, high effort (worth it untuk showcase):**
5. **AI Matching Score** — Tambah scoring sederhana (JLPT match + specialization overlap) sebagai "AI feature"
6. **Mobile responsive** — CSS sudah lumayan, tapi belum fully optimized untuk mobile
7. **Export ke Excel** — Admin bisa export daftar kandidat/lamaran

### 4.4. Yang HARUS Dibersihkan Sebelum Show ke Klien

> [!WARNING]
> Jangan show versi raw ke klien tanpa ini:

- **Hapus credential hardcode** di `server.js` line 148-150 (`olraitzc_jijpadmin`, password, database name) → pindah ke env-only
- **Hapus referensi ICE ITB** yang sangat spesifik (SSO endpoint hardcode ke `icecenter.itb.ac.id`)
- **Buat demo data yang proper** — seeder yang ada (`seeder.js`) sudah ada tapi perlu cek isinya
- **Swagger UI aktifkan dengan benar** — saat ini OpenAPI JSON masih dummy (`paths: {}` saja)
- **Hapus `execSync('git ...')` di `/api/version`** — ini security leak di production

### 4.5. Presentasi Portofolio yang Disarankan

**Format showcase terbaik:**

```
Akordium Portfolio — TalentBridge Platform
├── Live demo URL (Coolify deployment)
├── Swagger API docs (/api/docs)
├── GitHub repo (private atau public)
└── One-pager PDF:
    ├── Problem statement
    ├── Architecture diagram (sudah ada di README)
    ├── Feature list (4 pilar utama)
    └── Tech stack highlight
```

**Poin jual utama ke klien:**
- "Platform multi-tenant dengan 6 user role"
- "Integrasi SSO enterprise-ready"
- "PDF generation dengan karakter multi-bahasa"
- "Notification system multi-channel (in-app + email + webhook)"
- "Full OpenAPI documentation"
- "Docker-ready, deploy di Coolify"

### 4.6. Estimasi Effort Cleanup + Rebrand

| Task | Estimasi |
|---|---|
| Rebrand nama, warna, logo | 2–3 jam |
| Hapus credential hardcode + ENV cleanup | 1 jam |
| Perbaiki Swagger/OpenAPI spec | 3–4 jam |
| Upgrade seeder dengan data demo yang proper | 2 jam |
| Deploy ke Coolify dengan domain demo | 1–2 jam |
| **Total minimum** | **~10 jam** |

Untuk upgrade stack (modular refactor, BullMQ, S3): estimasi tambahan 2–3 hari.

---

## 5. Kesimpulan

**JIJP adalah kandidat portofolio Akordium yang sangat kuat** karena:

1. **Kompleksitas nyata** — multi-role, file vault, PDF engine, SSO. Ini bukan todo-app.
2. **Arsitektur solid** — clean architecture, TypeScript strict, testing coverage.
3. **Domain yang relevan** — HR-tech / talent management adalah vertical yang banyak dicari klien.
4. **Stack modern** — React 19, TanStack Query v5, Vite 8, semua stack 2025.
5. **Already deployed** — ada bukti nyata di `isense-technology.com/jijp`.

Dengan ~10 jam cleanup + rebrand, ini bisa langsung jadi senjata utama Akordium untuk pitching klien HR-tech, pendidikan, atau job-platform.
