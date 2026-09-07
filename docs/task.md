# Tasks: JIJP Monorepo Setup

> Status per 2026-09-07: semua phase selesai, rebrand JITA → JIJP done.

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
- [x] `apps/api/` — migrated from `jita-backend/`, refactored server.js (1540 baris) → 14 route files + 7 repos + 3 services + 6 middleware modules. Hardcoded credentials removed, ICE ITB refs genericized ke env, execSync('git') version endpoint removed.
- [x] `apps/web/` — migrated from JITA src/, 18 routes registered, react-hook-form + Zod v4, axios→fetch apiRequest adapter, branding genericized.
- [x] Harmonize Zod v4 di FE + BE (zod ^4.5.4, @hookform/resolvers ^5.9.1)

## Phase 5 — Docker ✅
- [x] `docker-compose.yml` (dev: mysql + api + web)
- [x] `docker-compose.prod.yml` (prod)
- [x] `docker/Dockerfile.api` + `.api.dev`
- [x] `docker/Dockerfile.web` + `.web.dev`
- [x] `docker/nginx.conf` (SPA)

## Phase 6 — CI/CD ✅
- [x] `.github/workflows/ci.yml` (Turborepo-aware, concurrency cancel-in-progress)
- [x] `.github/CODEOWNERS`

## Rebrand JITA → JIJP ✅
- [x] Brand string (BRAND_NAME, MAIL_FROM, CV signature)
- [x] Package scope `@jita/*` → `@jijp/*`
- [x] Docker labels & env vars (jita_db → jijp_db, dll)
- [x] Docs (implementation_plan.md, task.md)
- [x] Git history rewritten via `git-filter-repo` (3 commits)
- [x] File `jita_akordium_analysis.md` di-rename ke `jijp_akordium_analysis.md` (file internal Akordium, bukan deliverable)

## Verification ✅
- [x] `pnpm install` OK (Zod v4.5.4, @hookform/resolvers v5.9.1)
- [x] `pnpm turbo typecheck` — 6/6 PASS
- [x] `pnpm turbo build` — 4/4 PASS (api, web, types, validators)
- [x] Workspace packages resolve (`@jijp/types`, `@jijp/validators`)
- [x] No `JITA`/`jita` strings remain di file content

## Pending (untuk klien present)
- [ ] Ganti `BRAND_NAME`/`BRAND_TAGLINE` di `apps/web/src/lib/constants.ts` dengan nama final klien (saat ini placeholder "JIJP")
- [ ] Isi `.env` lokal dengan `DB_*`, `SESSION_SECRET`, `SMTP_*`, `SSO_*` dari klien
- [ ] Force push ke remote setelah review (sudah ada konfirmasi user)