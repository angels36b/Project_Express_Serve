# Project_Express_Serve - Логин Moodle - Angel David 
## by Angel David Cantor Florez From ITMO.

# Application Логин Moodle (Express, PostgreSQL)

A full-stack task management web application built with Node.js, Express, PostgreSQL, and vanilla HTML/CSS/JavaScript.

## Development Stages & Layered Architecture

The system follows a strict layered architecture (`routes -> middlewares -> controllers -> services -> repositories -> PostgreSQL`) to separate HTTP transport, validation, business rules, and SQL persistence:

1. **Stage 1 — Database Schema & Role Isolation:** Designed the `tasks` table in PostgreSQL with `UUID` primary keys, `TIMESTAMPTZ` UTC timestamps, and length/type constraints. Configured a least-privilege `grader_user` role granted `SELECT`, `INSERT`, `UPDATE`, and `DELETE` exclusively on `tasks`.
2. **Stage 2 — Configuration & Connection Pooling:** Built environment validation (`src/config/env.js`) and a `pg` connection pool (`src/config/db.js`) with SSL support that translates database outages into HTTP `503` responses.
3. **Stage 3 — Security, Validation & REST Contract:** Implemented constant-time Bearer token authentication (`crypto.timingSafeEqual`), strict trailing-slash routing (`strict routing: true`), and schema validators rejecting unknown fields, invalid UUIDs, or out-of-range strings with HTTP `400`.
4. **Stage 4 — Vanilla Frontend Client:** Created a zero-dependency interface in `public/` that stores the user-supplied token in `sessionStorage` (never hardcoded), displays author metadata from `GET /api/author/`, and executes CRUD operations via Fetch API using safe DOM manipulation.
5. **Stage 5 — Cloud Deployment & Verification:** Deployed the backend over HTTPS and verified persistence and API contract compliance.

## Data Model & Field Mapping

| API JSON Field | PostgreSQL Column | SQL Type       | Notes                           |
| :------------- | :---------------- | :------------- | :------------------------------ |
| `id`           | `id`              | `UUID`         | Server-generated primary key    |
| `ownerLogin`   | `owner_login`     | `VARCHAR(64)`  | Configured Moodle login         |
| `title`        | `title`           | `VARCHAR(200)` | Trimmed string (1–200 chars)    |
| `done`         | `done`            | `BOOLEAN`      | Defaults to `false`             |
| `runId`        | `run_id`          | `VARCHAR(64)`  | Matches `^[A-Za-z0-9_-]{1,64}$` |
| `createdAt`    | `created_at`      | `TIMESTAMPTZ`  | UTC ISO-8601 timestamp          |

## Hosting Options Comparison

* **Render:** Allows deploying Node.js services directly from GitHub with automatic TLS/HTTPS termination.
* **Neon:** Provides serverless PostgreSQL with custom least-privilege roles, for example <<grader_user>>, and does not require a credit card.

* **Timeweb Cloud (Russian Provider):** Offers managed hosting for Node.js applications and PostgreSQL clusters, but requires active bank card verification.

* **Helios (University ITMO Server):** Helios haz nginx/1.30.5 listening on HTTPS port 443 for static content, but it does not offer HTTPS reverse-proxy configuration to route custom Node.js ports, so exposing a high port (:31234) only provides HTTP traffic without TLS encryption.

The combination of Render + Neon was choosen because it solves the three key project requirements in a free and secure way:

Render(Node.js/Express Backend): Allows deploying directly from GitHub with automatic public TLS/HTTPS termination,  secure inhection of environment variables and continuos execution in the cloud withoit depending on an open SSH session or requiring a ban card.

Neon: Offers persisten cloud storage accessible both from Render and externally for automated granding, with native support for granular least-privilege roles.

Together, they separate the compute layer from the data layer through encrypted connections (SSL), guaranteeing external availability and strict compliance with the HTTPS and security contract of the submission.

## Local Setup & Deployment

Configure `.env` from `.env.example`, run `npm install`, initialize tables via `npm run db:init`, and start with `npm start`. Live HTTPS URL: https://project-express-serve.onrender.com
