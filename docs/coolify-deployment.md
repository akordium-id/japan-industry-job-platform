# Panduan Deployment Coolify (JIJP Monorepo)

Dokumen ini menjelaskan langkah-langkah deployment monorepo **Japan Industry Job Platform (JIJP)** menggunakan Coolify dengan arsitektur **Unified Docker Compose** (Opsi A).

---

## Ringkasan Arsitektur

- **Single Domain**: Domain utama (misal `https://jijp.akordium.id`) diarahkan ke container `web` (Nginx).
- **Reverse Proxy `/api`**: Nginx otomatis mem-forward semua request `/api/*` ke container backend `api:3001` secara internal.
- **Zero CORS / Cookie Issues**: Karena satu origin, session cookie (`httpOnly`, `sameSite: "lax"`, `secure`) langsung bekerja tanpa kendala third-party cookie restrictions.
- **Auto-Migrate & Auto-Seed**: Container `api` otomatis menunggu kesiapan MySQL, menjalankan inisialisasi skema database secara idempotent, dan memastikan akun administrator awal tersedia.
- **Data Persistence**: Data MySQL disimpan di Docker named volume `mysql_data`, dan berkas berkas yang diunggah (CV, sertifikat, avatar) disimpan di Docker named volume `uploads_data`.

---

## Langkah-langkah Deployment di Coolify

### 1. Buat Resource Baru di Coolify

1. Buka dashboard Coolify Anda.
2. Pilih **Projects** &rarr; pilih Environment target.
3. Klik **+ New Resource** &rarr; pilih **Docker Compose**.
4. Pilih sumber kode: **Git Repository (GitHub/GitLab/Custom Git)** dan pilih repository `japan-industry-job-platform`.
5. Tentukan branch yang akan di-deploy (misal `main`).

### 2. Atur Konfigurasi Compose File

1. Di tab konfigurasi resource, temukan **Docker Compose Location**.
2. Arahkan ke (bisa biarkan default `docker-compose.yml` atau `docker-compose.prod.yml`):
   ```text
   docker-compose.yml
   ```
3. Set **Base Directory** ke:
   ```text
   /
   ```

### 3. Masukkan Environment Variables

1. Buka tab **Environment Variables** di resource Coolify.
2. Buka berkas `.env.coolify.example` di repo ini sebagai referensi, lalu isi nilai-nilainya:

| Variabel           | Keterangan / Contoh Nilai                                             |
| ------------------ | --------------------------------------------------------------------- |
| `NODE_ENV`         | `production`                                                          |
| `SESSION_SECRET`   | String acak minimal 32 karakter (generate via `openssl rand -hex 32`) |
| `DB_NAME`          | `jijp_db`                                                             |
| `DB_USER`          | `jijp_user`                                                           |
| `DB_PASSWORD`      | Password database yang aman                                           |
| `DB_ROOT_PASSWORD` | Password root MySQL yang aman                                         |
| `VITE_API_URL`     | _Biarkan kosong_ (agar menggunakan relative path `/api`)              |

_(Opsional: Jika menggunakan SMTP email, isi variabel `SMTP_*`)_

### 4. Konfigurasi Domain

1. Pada daftar service di compose Coolify, pilih service **`web`**.
2. Masukkan FQDN domain Anda di input **Domains**, contoh:
   ```text
   https://jijp.akordium.id
   ```
3. Coolify (Traefik) akan otomatis mengatur sertifikat SSL Let's Encrypt dan merutekan traffic port 80/443 ke container `web`.

### 5. Deploy

1. Klik tombol **Deploy**.
2. Pantau log build dan container.
3. Setelah deployment selesai:
   - Container `mysql` siap.
   - Container `api` menjalankan script migrasi skema dan melayani `GET /api/health` dengan respons `{"success": true, "data": {"status": "ok", "db": "up"}}`.
   - Container `web` melayani tampilan frontend dan meneruskan request API.

---

## Akun Awal & Pasca Deploy

Saat pertama kali database diinisialisasi, sistem secara otomatis membuatkan akun admin bawaan (idempotent, tidak akan menimpa jika sudah ada):

- **Email**: `admin@jijp.id`
- **Password**: `password123`

> [!IMPORTANT]
> Segera ganti password akun administrator setelah berhasil login pertama kali di halaman profil admin!
