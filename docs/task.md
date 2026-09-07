# Tasks: JIJP Monorepo Setup

## Phase 1 — Workspace Root
- [ ] `package.json` root (private, engines, scripts)
- [ ] `pnpm-workspace.yaml`
- [ ] `turbo.json`
- [ ] `.npmrc`
- [ ] `.gitignore` root
- [ ] `.env.example` root

## Phase 2 — Tooling Packages
- [ ] `tooling/typescript/` (base.json, node.json)
- [ ] `tooling/eslint/` (index.js flat config)

## Phase 3 — Shared Packages
- [ ] `packages/types/` (package.json, src/index.ts)
- [ ] `packages/validators/` (package.json, src/index.ts + per-domain schemas)

## Phase 4 — Apps Scaffold
- [ ] `apps/api/` scaffold (package.json, tsconfig.json, src/ structure)
- [ ] `apps/web/` scaffold (package.json, tsconfig.json)

## Phase 5 — Docker
- [ ] `docker-compose.yml` (dev)
- [ ] `docker-compose.prod.yml`
- [ ] `docker/Dockerfile.api`
- [ ] `docker/Dockerfile.web`

## Phase 6 — CI/CD
- [ ] `.github/workflows/ci.yml`

## Verification
- [ ] `pnpm install` berhasil dari root
- [ ] `pnpm turbo build` berhasil
- [ ] Workspace packages saling resolve
