# Monorepo Setup: JIJP → Japan Industry Job Platform

Mengonversi project JIJP menjadi monorepo `pnpm workspaces + Turborepo` dengan struktur yang clean, siap untuk rebrand sebagai portofolio Akordium.

> Codebase JIJP asli belum ada di folder ini — plan ini mencakup scaffold struktur monorepo + panduan migrate kode dari repo lama.

---

## Open Questions

> [!IMPORTANT]
> Perlu dijawab sebelum eksekusi:
>
> 1. **Sumber kode JIJP** — Di mana repo asli JIJP berada? (GitHub link / path lokal lain?) Ini penting untuk menentukan apakah kita copy file atau clone dulu sebagai `git subtree`.
> 2. **Nama brand akhir** — Pakai nama apa? Analisis menyebut "Nexora Academy" atau "TalentBridge" sebagai contoh. Atau mau biarkan generic dulu?
> 3. **Database** — Tetap MySQL atau mau support dual (MySQL + PostgreSQL variant)? Berpengaruh ke `packages/db` design.
> 4. **Node version target** — Pakai Node 20 LTS atau 22? Berpengaruh ke engine field di `package.json`.

---

## Proposed Changes

### Struktur Monorepo Target

```
japan-industry-job-platform/
├── apps/
│   ├── web/              # [MOVE] Frontend React 19 + Vite
│   └── api/              # [MOVE] Backend Express.js
├── packages/
│   ├── types/            # [NEW] Shared TypeScript types & enums
│   ├── validators/       # [NEW] Shared Zod schemas (FE + BE)
│   └── ui/               # [OPTIONAL] Shared shadcn/ui components
├── tooling/
│   ├── eslint/           # [NEW] Shared ESLint config
│   └── typescript/       # [NEW] Shared tsconfig bases
├── docker/
│   ├── Dockerfile.web    # [NEW] Production FE image
│   └── Dockerfile.api    # [NEW] Production BE image
├── .github/
│   └── workflows/
│       └── ci.yml        # [NEW] Unified CI pipeline
├── docker-compose.yml    # [NEW] Dev environment (FE + BE + MySQL)
├── docker-compose.prod.yml # [NEW] Production compose
├── turbo.json            # [NEW] Turborepo pipeline config
├── package.json          # [NEW] Workspace root
├── pnpm-workspace.yaml   # [NEW] pnpm workspace definition
└── .env.example          # [NEW] Root env template
```

---

### Phase 1 — Workspace Root Setup

#### [NEW] `package.json` (root)

- `private: true`, `engines: { node: ">=20" }`
- Scripts: `dev`, `build`, `lint`, `test`, `typecheck`
- DevDeps: `turbo`, `typescript`, `prettier`

#### [NEW] `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

#### [NEW] `turbo.json`

Pipeline tasks:

- `build` → dependsOn `^build` (packages dulu, baru apps)
- `dev` → parallel, dengan env passthrough
- `lint`, `typecheck`, `test` → independent per package

#### [NEW] `.npmrc`

- `strict-peer-dependencies=false`
- `shamefully-hoist=false`

---

### Phase 2 — Tooling Packages

#### [NEW] `tooling/typescript/`

- `base.json` — strict TS config base
- `nextjs.json` — kalau nanti ada Next.js app
- `node.json` — untuk Express backend

#### [NEW] `tooling/eslint/`

- `index.js` — ESLint v9 flat config base (shared antara FE dan BE)
- Preset: `@typescript-eslint`, `eslint-plugin-import`

---

### Phase 3 — Shared Packages

#### [NEW] `packages/types/`

Shared TypeScript types yang dipakai FE dan BE:

```typescript
// packages/types/src/index.ts
export type UserRole =
  | "student"
  | "alumni"
  | "corporate"
  | "educator_bilingual"
  | "educator_silver"
  | "admin";
export type DocumentStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus =
  "submitted" | "shortlisted" | "accepted" | "rejected";
export type NotificationType =
  | "document_submitted"
  | "document_approved"
  | "document_rejected"
  | "application_submitted"
  | "application_decided"
  | "scout_received";
export type JLPTLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### [NEW] `packages/validators/`

Shared Zod schemas — ini **key benefit** monorepo: schema sekali tulis, dipakai di FE (form validation) dan BE (request validation):

```typescript
// packages/validators/src/auth.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// packages/validators/src/candidate.ts
export const candidateProfileSchema = z.object({
  nameJapanese: z.string().optional(),
  jlptLevel: z.enum(["N1", "N2", "N3", "N4", "N5"]).optional(),
  // ...
});
```

---

### Phase 4 — Migrate Apps

#### [MOVE] `apps/web/` (Frontend)

- Copy isi folder `frontend/` JIJP yang lama ke sini
- Update `package.json` untuk pakai packages lokal: `@jijp/types`, `@jijp/validators`
- Update `tsconfig.json` extend dari `@jijp/typescript/base`
- Hapus Zod schemas yang duplikat dengan `packages/validators`
- Update import paths

#### [MOVE] `apps/api/` (Backend Express)

- Copy isi folder `backend/` JIJP yang lama ke sini
- Update `package.json` untuk pakai `@jijp/types`, `@jijp/validators`
- **Wajib lakukan (dari analisis):**
  - Hapus credential hardcode di `server.js:148-150`
  - Pindahkan semua config ke `.env`
  - Hapus `execSync('git ...')` di `/api/version`
  - Hapus referensi hardcode `icecenter.itb.ac.id`
- Refactor `server.js` yang 1540 baris → pisah ke router files

---

### Phase 5 — Docker & Dev Environment

#### [NEW] `docker-compose.yml` (Development)

```yaml
services:
  mysql:
    image: mysql:8
    environment: { MYSQL_ROOT_PASSWORD, MYSQL_DATABASE }
    volumes: [mysql_data:/var/lib/mysql]
    ports: ["3306:3306"]

  api:
    build: { context: ./apps/api, dockerfile: ../../docker/Dockerfile.api.dev }
    volumes: [./apps/api:/app]
    ports: ["3001:3001"]
    depends_on: [mysql]
    env_file: ./apps/api/.env

  web:
    build: { context: ./apps/web, dockerfile: ../../docker/Dockerfile.web.dev }
    volumes: [./apps/web:/app]
    ports: ["5173:5173"]
    environment: { VITE_API_URL: "http://localhost:3001" }
```

#### [NEW] `docker/Dockerfile.api` (Production)

- Multi-stage: `node:20-alpine` build → slim runtime
- `pnpm deploy --filter=@jijp/api` untuk isolate deps

#### [NEW] `docker/Dockerfile.web` (Production)

- Build static: `pnpm build --filter=@jijp/web`
- Serve via Nginx

---

### Phase 6 — CI/CD

#### [NEW] `.github/workflows/ci.yml`

```yaml
# Turborepo-aware CI:
# - Cache turbo build artifacts
# - Hanya re-run tasks yang terpengaruh oleh perubahan
jobs:
  ci:
    steps:
      - pnpm install
      - turbo typecheck lint test build
```

---

## Naming Convention

Package scope yang disarankan: `@jijp/*` (atau ganti dengan brand name setelah keputusan rebrand).

| Package           | Name                      |
| ----------------- | ------------------------- |
| Frontend app      | `@jijp/web`               |
| Backend app       | `@jijp/api`               |
| Shared types      | `@jijp/types`             |
| Shared validators | `@jijp/validators`        |
| ESLint config     | `@jijp/eslint-config`     |
| TypeScript config | `@jijp/typescript-config` |

---

## Verification Plan

### Automated Tests

```bash
# Dari root — test semua apps sekaligus
pnpm turbo test

# Individual
pnpm --filter @jijp/web test
pnpm --filter @jijp/api test
```

### Manual Verification

1. `pnpm dev` dari root → FE dan BE jalan bersamaan
2. `docker compose up` → semua service naik (MySQL + API + Web)
3. Build production: `pnpm turbo build` → tidak ada error
4. Pastikan import dari `@jijp/types` dan `@jijp/validators` resolved dengan benar di kedua apps

---

## Estimasi Effort

| Phase     | Task                      | Estimasi       |
| --------- | ------------------------- | -------------- |
| 1         | Workspace root setup      | 1 jam          |
| 2         | Tooling packages          | 1 jam          |
| 3         | Shared types + validators | 2–3 jam        |
| 4         | Migrate + cleanup apps    | 3–4 jam        |
| 5         | Docker dev + prod         | 1–2 jam        |
| 6         | CI/CD                     | 1 jam          |
| **Total** |                           | **~10–12 jam** |

> Kalau sumber kode JIJP belum ada (perlu clone dulu), tambah 1–2 jam untuk setup subtree/copy.
