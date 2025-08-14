# Test Case Generator — Skeleton

This repository is a **blank scaffold** for the Workik AI assignment.

## What you get
- Monorepo structure with `apps/web` (React) and `apps/api` (Express + TypeScript)
- Shared types in `packages/shared`
- Docker files and `docker-compose.yml` (optional)
- `.env.example` files to copy into `.env`

## How to start (local dev)
1) In one terminal:
```
cd apps/api
cp .env.example .env
# Fill env vars
pnpm i
pnpm dev
```
2) In another terminal:
```
cd apps/web
cp .env.example .env
# Fill VITE_API_BASE_URL
pnpm i
pnpm dev
```

## Insert code step by step
Each file has `// TODO:` markers. Replace stubs with your real logic.
"# testgen" 
