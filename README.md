# StayEase

**Hotel Booking & Operations Management Platform**

Repository: <https://github.com/Utkal9/stayease-hotel-management-system>
Assessment: ALGIONS AI LABS PRIVATE LIMITED, Hotel Booking Management System (Full-Stack Web Development)

---

## Project overview

StayEase is a database-backed platform for taking hotel bookings and running day-to-day hotel operations. It is built as a modular monolith in a single monorepo: a React web client, an Express REST API and a PostgreSQL database.

The first release supports one hotel property. The database design (Phase 2) will be capable of supporting several properties later.

## Business problem

Small and mid-sized hotels often manage reservations, room status, check-ins and reporting in separate tools or spreadsheets. That leads to double bookings, stale availability and no single source of truth. StayEase aims to keep availability, bookings and front-desk operations in one consistent system.

## Project objectives

- Let guests search availability and book rooms without double bookings.
- Give staff one place to manage arrivals, departures and room status.
- Give administrators reports on occupancy and activity, with an audit trail.
- Stay maintainable and explainable: simple architecture, strict typing, automated tests.

## Architecture overview

| Decision | Choice |
| --- | --- |
| Style | Modular monolith (one deployable backend, feature modules inside it) |
| Repository | Monorepo with npm workspaces (`frontend`, `backend`) |
| API | Versioned REST under `/api/v1` |
| Backend layering | Routes, Controllers, Services, Repositories (from Phase 2), Middleware, Validation, Config, Utils |
| Database | PostgreSQL 17 with Prisma ORM (from Phase 2) |

Details and reasoning: [docs/architecture/system-architecture.md](docs/architecture/system-architecture.md).

## Technology stack

**In use now (Phase 1)**

- Frontend: React, TypeScript, Vite, Tailwind CSS v4 (via `@tailwindcss/vite`)
- Backend: Node.js, Express, TypeScript, Zod (environment validation), Helmet, CORS, dotenv
- Database: PostgreSQL 17 (Alpine) in Docker Compose
- Tooling: npm workspaces, concurrently, tsx, Vitest, Supertest, Git, GitHub, Docker

**Fixed for later phases, intentionally not installed yet**

- Prisma ORM and migrations (Phase 2)
- bcrypt and jsonwebtoken (Phase 3, authentication)
- React Testing Library (when frontend tests are introduced), Playwright (end-to-end tests)
- Postman is used by hand against the API; no code dependency

**Planned after the assessment MVP:** LangChain.js, an LLM provider, RAG, Redis, background jobs, email notifications.

## Repository structure

```
stayease-hotel-management-system/
├── frontend/            React + TypeScript + Vite web client
│   ├── public/          Static files (favicon)
│   └── src/
│       ├── components/  Reusable UI components
│       ├── pages/       Page-level components
│       ├── hooks/       Custom React hooks
│       ├── services/    API client and API calls
│       ├── types/       Shared TypeScript types
│       └── assets/      Images and fonts (empty for now)
├── backend/             Express + TypeScript REST API
│   ├── src/
│   │   ├── config/      Environment configuration
│   │   ├── modules/     Feature modules (health today; more per phase)
│   │   ├── middleware/  404 and centralized error handling
│   │   ├── database/    Reserved for Prisma client and repositories (Phase 2)
│   │   ├── utils/       Response helpers, ApiError
│   │   ├── app.ts       Builds the Express app (no listening)
│   │   └── server.ts    Starts the server, handles graceful shutdown
│   └── tests/           Vitest + Supertest tests
├── docs/                Architecture, diagrams, API docs, screenshots
├── tests/               Reserved for end-to-end tests (Playwright, later)
├── .github/workflows/   Reserved for CI (later)
├── docker-compose.yml   PostgreSQL 17 for local development
├── .env.example         Template for the root .env file
└── package.json         Workspace root and shared scripts
```

## Prerequisites

- macOS with zsh (Apple Silicon is supported)
- Node.js 20.19 or newer. Node 22 LTS is recommended. Check with `node -v`.
- npm 10 or newer (comes with Node)
- Docker Desktop for Mac, only needed for the PostgreSQL container
- Git

## Local installation

```bash
# From the repository root
npm install
```

npm workspaces installs both applications in one step and creates a single `package-lock.json`.

## Environment setup

Copy the template and keep the copy private:

```bash
cp .env.example .env
```

The single root `.env` is read by the backend, by Vite (`envDir` points to the root) and by Docker Compose.

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend port (default 4000) |
| `CLIENT_URL` | The one frontend origin allowed by CORS |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credentials for the Docker database |
| `DATABASE_URL` | Prepared for Prisma. Not used in Phase 1. |
| `VITE_API_BASE_URL` | API address used by the browser. Public: never put secrets in `VITE_` variables. |

`POSTGRES_PASSWORD=change_me_local_only` is a placeholder for local development only. `.env` is ignored by Git.

Note: PostgreSQL in Docker requires a password for connections from your Mac, so Phase 2 will add the password to `DATABASE_URL`.

## Docker database setup

```bash
npm run db:up                 # same as: docker compose up -d postgres
docker compose ps             # STATUS should become "healthy"
npm run db:down               # stop the container (data stays in the Docker volume)
```

The image is `postgres:17-alpine`, which is multi-architecture and runs natively on Apple Silicon. Data is stored in the named volume `stayease_postgres_data`. To delete the data as well: `docker compose down -v`.

The backend does not connect to the database yet, so Phase 1 runs without Docker.

## Development commands

Run from the repository root.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts backend and frontend together |
| `npm run dev:backend` | Starts only the API (auto-restarts on changes) |
| `npm run dev:frontend` | Starts only the web app |
| `npm run build` | Builds both applications |
| `npm run typecheck` | Type-checks both applications |
| `npm run test` | Runs all tests |
| `npm run db:up` / `npm run db:down` | Starts / stops the PostgreSQL container |

## URLs

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:4000>
- Health check: <http://localhost:4000/api/v1/health>

The frontend uses a fixed port (5173) because the backend allows CORS only from `CLIENT_URL`.

## Health-check endpoint

```bash
curl http://localhost:4000/api/v1/health
```

```json
{
  "success": true,
  "message": "StayEase API is running",
  "data": {
    "service": "stayease-backend",
    "status": "healthy"
  }
}
```

All API errors use one envelope:

```json
{
  "success": false,
  "message": "Route not found: GET /api/v1/nope",
  "error": { "code": "NOT_FOUND" }
}
```

## Testing

```bash
npm run test                     # all workspaces
npm run test --workspace backend # backend only
npm run test:watch --workspace backend
```

Current tests (backend, Vitest + Supertest): health endpoint response, 404 envelope, malformed JSON handling. There are no frontend tests yet.

## Security precautions

- `.env` is never committed. Only `.env.example` is tracked.
- No secrets in source code. `VITE_` variables are public by design.
- Helmet sets HTTP security headers; `x-powered-by` is disabled.
- CORS allows one configured origin.
- JSON request bodies are limited to 100 kB.
- Internal error details are never returned to clients; 5xx responses use a generic message.
- The Docker database port is bound to `127.0.0.1` and uses development-only credentials.
- Environment variables are validated at startup; invalid configuration stops the server.

## Current implementation status

**Phase 1, project foundation: implemented.**

- Monorepo with npm workspaces and shared scripts
- React + TypeScript + Vite + Tailwind CSS v4 landing screen with a live API status indicator
- Express + TypeScript API: Helmet, CORS, JSON limit, response envelope, 404 and error handlers, graceful shutdown, `GET /api/v1/health`
- Docker Compose for PostgreSQL 17 with health check and persistent volume
- Backend tests (Vitest + Supertest)
- Documentation

Not implemented yet by design: authentication, hotel and room management, bookings, payments, dashboards, AI features.

## Upcoming development phases

1. Project foundation and environment (this phase)
2. Database architecture, ER diagram, Prisma schema and migrations
3. Authentication and authorization
4. Hotel, room type, room and amenity management
5. Room rates and availability search
6. Booking engine and pricing
7. Concurrency protection and temporary holds
8. Simulated payments and guest booking history
9. Staff dashboard and check-in/check-out
10. Admin dashboard and reports
11. Audit logging and security hardening
12. Complete frontend integration and responsive UI
13. Unit, integration and end-to-end testing
14. Documentation, technical report and demonstration
15. Final verification and submission

An AI hotel concierge (LangChain.js and RAG) will be considered after the assessment MVP works.
