# StayEase System Architecture

This document explains the architectural decisions made in Phase 1 and the reasoning behind them.

## High-level view

```
┌──────────────┐   HTTP/JSON    ┌─────────────────────────┐    SQL     ┌────────────────┐
│  Browser     │ ─────────────▶ │  Backend (Express, TS)  │ ─────────▶ │ PostgreSQL 17  │
│  React + Vite│  /api/v1/...   │  modular monolith       │  (Phase 2) │ (Docker)       │
└──────────────┘                └─────────────────────────┘            └────────────────┘
```

In Phase 1 the browser talks to the API (health check). The database container is ready, and the backend connects to it from Phase 2.

## Why a modular monolith

- One deployable unit keeps development, debugging and deployment simple for a single developer and a 15-day timeline.
- Modules (`health` today; `auth`, `rooms`, `bookings`, ... later) have clear boundaries inside one codebase, so the structure is already organized for growth.
- Booking needs transactions across data (availability, holds, payments). Inside one process and one database this is a normal database transaction. Across microservices it would need distributed coordination.
- If one module ever needs to be split out, its boundary is already defined.

Microservices were deliberately not chosen: they add network calls, deployment complexity and failure modes that the project does not need.

## Why a monorepo

- Frontend and backend live in one GitHub repository, so one change can update the API and its client together.
- npm workspaces give one `npm install`, one lockfile and shared root scripts (`npm run dev`, `build`, `test`, `typecheck`).
- One place for documentation, environment template and Docker configuration.
- The applications remain separate packages with separate dependencies and build steps.

## Why PostgreSQL instead of MongoDB

- Hotel data is relational: hotels, room types, rooms, guests, bookings, payments, staff. Foreign keys and constraints protect that structure.
- Booking correctness needs transactions and constraints. PostgreSQL provides ACID transactions, row locking and constraint types that help prevent double bookings, which Phase 7 depends on.
- Reports (occupancy, revenue) are natural SQL queries with joins and aggregation.
- Prisma has first-class PostgreSQL support, including migrations.

MongoDB suits flexible, document-shaped data. Bookings are not that.

## Why TypeScript

- Strict typing catches mistakes at compile time, before the code runs.
- Shared vocabulary: API shapes are typed on the backend and mirrored on the frontend (`frontend/src/types/api.ts`).
- Better editor support and safer refactoring as the project grows across 15 phases.
- Zod will add runtime validation at API boundaries; TypeScript types are erased at runtime and cannot do that alone.

## Why frontend and backend are separated

- The frontend is a static bundle; the backend is a long-running service. They have different build, hosting and scaling needs.
- The REST API is a clear contract. It can be tested with Supertest and Postman without a browser, and a mobile app could reuse it later.
- Security rules (authentication, validation, authorization) are enforced on the server, never trusted to the client.
- CORS is configured to allow only the configured frontend origin.

## Backend layering

| Layer | Responsibility |
| --- | --- |
| Routes | Map URL and HTTP method to a controller |
| Controllers | Read the request, call a service, send the response envelope |
| Services | Business rules. No knowledge of HTTP. |
| Repositories | Database access through Prisma (introduced in Phase 2) |
| Middleware | Cross-cutting concerns: 404, error handling, later authentication |
| Validation | Zod schemas for request data (from the first feature that accepts input) |
| Config | Environment loading and validation |
| Utils | Small shared helpers (response envelope, `ApiError`) |

The `health` module shows the pattern: `health.routes.ts`, `health.controller.ts`, `health.service.ts`. New modules follow the same shape and register their router in `backend/src/modules/index.ts`.

`app.ts` builds the Express app and `server.ts` starts it. The split lets tests import the app without opening a port.

## Consistent API contract

Every response uses one envelope, so the frontend can handle all calls the same way.

Success: `{ "success": true, "message": "...", "data": { ... } }`
Error: `{ "success": false, "message": "...", "error": { "code": "..." } }`

## How Docker supports reproducible development

- `docker-compose.yml` defines the exact database version (`postgres:17-alpine`), so every machine runs the same PostgreSQL.
- Credentials come from the root `.env`, not from the compose file.
- A named volume keeps data between restarts; `docker compose down -v` gives a clean database.
- A health check (`pg_isready`) shows when the database can accept connections.
- The image is multi-architecture, so it runs natively on Apple Silicon.

Only the database runs in Docker. The Node applications run directly on the host for fast reloads.

## How future modules will communicate

Modules live in one process, so they communicate through plain TypeScript calls, not network calls.

- A module exposes its **service functions** as its public interface.
- Other modules call those services. They never reach into another module's repositories or database tables directly.
- Example (planned): the `bookings` service calls the `availability` service to check a room, then writes the booking inside one database transaction.
- Shared concerns (authentication middleware, error handling, response helpers) live in `middleware/` and `utils/`.
- Database changes go through Prisma migrations so the schema is versioned in Git.

These boundaries keep dependencies pointing one way and make each module testable on its own.

## Scope of Phase 1

Implemented: project foundation, health endpoint, error handling, Docker database, landing screen, tests.
Not implemented (reserved for later phases): database schema, authentication, hotel and booking features, AI features.
