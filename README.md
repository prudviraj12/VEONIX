# VEONIX

VEONIX is an AI-powered academic learning and revision platform. This repository is an npm-workspaces monorepo with a React web app and an Express API.

## Quick start

1. Copy `.env.example` to `.env`, `apps/api/.env.example` to `apps/api/.env`, and `apps/web/.env.example` to `apps/web/.env`.
2. Run `docker compose up -d postgres redis`.
3. Run `npm ci`, `npm run db:generate`, `npm run db:migrate`, then `npm run dev`.

For the fully containerized development environment, use `docker compose up --build`.

## Repository layout

- `apps/web` — React, Vite, TypeScript, Tailwind application
- `apps/api` — Express, TypeScript, Prisma API
- `packages` — shared configuration packages
- `docker` — container definitions
- `docs` — architecture and operational documentation
