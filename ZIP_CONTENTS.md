# ZIP Contents

Purpose of every important file in `stayease-phase-1-foundation.zip`. Paths are relative to the repository root. The archive contains no `node_modules`, no `.env`, no `.git` directory and no build output.

## Root

| File | Purpose |
| --- | --- |
| `package.json` | Declares the `frontend` and `backend` npm workspaces and the shared scripts: `dev`, `dev:backend`, `dev:frontend`, `build`, `test`, `typecheck`, `db:up`, `db:down`. Also holds `concurrently`. |
| `package-lock.json` | Exact dependency versions for the whole monorepo. Commit it. It makes installs reproducible (`npm ci`). |
| `docker-compose.yml` | PostgreSQL 17 (Alpine) for local development: credentials from `.env`, persistent volume, health check, port 5432 on localhost. |
| `.env.example` | Template for the root `.env`. Contains placeholders only. |
| `.gitignore` | Keeps `.env`, `node_modules`, build output and editor files out of Git. Keeps `.env.example` tracked. |
| `README.md` | Project overview, setup, commands, security notes, status and roadmap. |
| `ZIP_CONTENTS.md` | This file. |

## Backend (`backend/`)

| File | Purpose |
| --- | --- |
| `package.json` | Backend dependencies and scripts (`dev`, `build`, `start`, `typecheck`, `test`, `test:watch`). |
| `tsconfig.json` | Strict TypeScript settings used for type-checking `src`, `tests` and `vitest.config.ts`. |
| `tsconfig.build.json` | Extends `tsconfig.json`; compiles only `src` into `dist` for `npm run build`. |
| `vitest.config.ts` | Test runner configuration (Node environment, `tests/**/*.test.ts`). |
| `src/server.ts` | Starts the HTTP server and shuts it down gracefully on SIGINT/SIGTERM (10 s forced-exit safety timer). |
| `src/app.ts` | Builds the Express app: Helmet, CORS, JSON limit, `/api/v1` routes, 404 and error handlers. Does not listen on a port, so tests can import it. |
| `src/config/env.ts` | Loads the root `.env` and validates `NODE_ENV`, `PORT`, `CLIENT_URL` with Zod. Stops the server on invalid configuration. |
| `src/modules/index.ts` | Registers every feature module under `/api/v1`. New modules are added here. |
| `src/modules/health/health.routes.ts` | Route for `GET /api/v1/health`. |
| `src/modules/health/health.controller.ts` | Turns the service result into the API response envelope. |
| `src/modules/health/health.service.ts` | Returns the health status data. Shows the routes, controller, service pattern for later modules. |
| `src/middleware/notFoundHandler.ts` | Returns a 404 in the standard error envelope for unknown routes. |
| `src/middleware/errorHandler.ts` | Centralized error handling: `ApiError`, malformed JSON (400), oversized body (413), everything else becomes a generic 500. |
| `src/utils/apiResponse.ts` | `sendSuccess` and `sendError`: the single response format used by the API. |
| `src/utils/ApiError.ts` | Error class for failures that are safe to show to clients. |
| `src/database/.gitkeep` | Keeps the folder in Git. Prisma client and repositories arrive in Phase 2. |
| `tests/health.test.ts` | Vitest + Supertest tests: health endpoint (200 and exact JSON), 404 envelope, malformed JSON handling. |

## Frontend (`frontend/`)

| File | Purpose |
| --- | --- |
| `package.json` | Frontend dependencies and scripts (`dev`, `build`, `preview`, `typecheck`). |
| `tsconfig.json` | Strict TypeScript settings for `src` and `vite.config.ts`. |
| `vite.config.ts` | Vite with React and the Tailwind CSS v4 plugin. `envDir: ".."` reads the root `.env`. Fixed port 5173. |
| `index.html` | HTML entry point: title, meta tags, favicon, script entry. |
| `public/favicon.svg` | Browser tab icon. |
| `src/main.tsx` | Mounts the React app. |
| `src/App.tsx` | Root component; renders the landing page. |
| `src/index.css` | Imports Tailwind and defines the navy palette and font stacks as theme tokens. |
| `src/vite-env.d.ts` | Types for Vite and for `VITE_API_BASE_URL`. |
| `src/pages/LandingPage.tsx` | The StayEase landing screen. |
| `src/pages/landingContent.ts` | Roadmap text shown on the landing screen. |
| `src/components/Logo.tsx` | StayEase wordmark. |
| `src/components/StatusBadge.tsx` | Small status label (Running, Connected, Checking, Not reachable). |
| `src/components/SystemStatusCard.tsx` | Initialization/status indicator: shows whether the web app can reach the API. |
| `src/components/RoadmapList.tsx` | Renders the phase list. |
| `src/hooks/useApiHealth.ts` | Hook that calls the health endpoint (5 s timeout) and exposes a re-check function. |
| `src/services/apiClient.ts` | Small `fetch` wrapper that reads `VITE_API_BASE_URL` and unwraps the response envelope. |
| `src/services/healthService.ts` | Health-check call built on the API client. |
| `src/types/api.ts` | TypeScript types mirroring the backend response envelope. |
| `src/assets/.gitkeep` | Keeps the folder in Git. |

## Documentation and placeholders

| File | Purpose |
| --- | --- |
| `docs/architecture/system-architecture.md` | Why modular monolith, monorepo, PostgreSQL, TypeScript, separate frontend/backend, Docker; how modules will communicate. |
| `docs/api/.gitkeep`, `docs/diagrams/.gitkeep`, `docs/screenshots/.gitkeep` | Keep the folders in Git. Filled in later phases. |
| `tests/.gitkeep` | Reserved for end-to-end tests (Playwright). |
| `.github/workflows/.gitkeep` | Reserved for CI workflows. |

`.gitkeep` files are the only near-empty files. Git does not track empty folders, so they exist only to preserve the required structure.
