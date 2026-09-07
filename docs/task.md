# Tasks: JIJP Monorepo Setup

> Status per 2026-09-07: semua phase selesai.

## Phase 1 — Workspace Root ✅

- [x] `package.json` root (private, engines, scripts)
- [x] `pnpm-workspace.yaml`
- [x] `turbo.json`
- [x] `.npmrc`
- [x] `.gitignore` root
- [x] `.env.example` root

## Phase 2 — Tooling Packages ✅

- [x] `tooling/typescript/` (base.json, node.json, react-library.json)
- [x] `tooling/eslint/` (base/node/react flat configs)

## Phase 3 — Shared Packages ✅

- [x] `packages/types/` (package.json, src/index.ts — User, Document, CandidateProfile, Job, Notification, Calendar, Career)
- [x] `packages/validators/` (auth, candidate, document, job, notification, common — Zod v4)

## Phase 4 — Apps Migration ✅

- [x] `apps/api/` — migrated from legacy backend source, refactored monolith server.js (1540 baris) → 14 route files + 7 repos + 3 services + 6 middleware modules. Hardcoded credentials removed, SSO refs genericized ke env, version endpoint removed.
- [x] `apps/web/` — migrated from legacy frontend source, 18 routes registered, react-hook-form + Zod v4, fetch apiRequest adapter, branding genericized.
- [x] Harmonize Zod v4 di FE + BE (zod ^4.5.4, @hookform/resolvers v5.9.1)

## Phase 5 — Docker ✅

- [x] `docker-compose.yml` (dev: mysql + api + web)
- [x] `docker-compose.prod.yml` (prod)
- [x] `docker/Dockerfile.api` + `.api.dev`
- [x] `docker/Dockerfile.web` + `.web.dev`
- [x] `docker/nginx.conf` (SPA)

## Phase 6 — CI/CD ✅

- [x] `.github/workflows/ci.yml` (Turborepo-aware, concurrency cancel-in-progress)
- [x] `.github/CODEOWNERS`

## Verification ✅

- [x] `pnpm install` OK (Zod v4.5.4, @hookform/resolvers v5.9.1)
- [x] `pnpm turbo typecheck` — 6/6 PASS
- [x] `pnpm turbo build` — 4/4 PASS (api, web, types, validators)
- [x] Workspace packages resolve (`@jijp/types`, `@jijp/validators`)
- [x] No trademark strings remain di file content atau git history

## Pending (untuk klien present)

- [ ] Ganti `BRAND_NAME`/`BRAND_TAGLINE` di `apps/web/src/lib/constants.ts` dengan nama final klien (saat ini placeholder "JIJP")
- [ ] Isi `.env` lokal dengan `DB_*`, `SESSION_SECRET`, `SMTP_*`, `SSO_*` dari klien
- [ ] Force push ke remote setelah review
