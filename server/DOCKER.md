# Docker Deployment & Runtime Reference

> **MSC NU Laguna Official Website — Infrastructure Notes** | Version 1.0 | April 2026
>
> | Property | Value |
> |---|---|
> | Scope | Local + Production container orchestration |
> | Compose Files | `docker-compose.yml`, `docker-compose.prod.yml` |
> | Images | Node.js 20 Alpine, Nginx Alpine, MySQL 8.0 |
> | Local Entry URL | `http://localhost` |
> | API Path (local) | `http://localhost/api/v1/*` |

## Overview

This project uses Docker Compose to run a complete stack:

- MySQL database (`db`)
- One-off DB initializer (`db-init`)
- Express API (`server`)
- Nginx-served frontend (`client`)

In local mode, frontend requests under `/api/*` are reverse-proxied by Nginx to the backend service.

---

## File Map

| File | Purpose |
|---|---|
| `docker-compose.yml` | Local full stack (DB + init + API + frontend) |
| `docker-compose.prod.yml` | Production-style deployment using prebuilt images |
| `server/Dockerfile` | Backend image build and runtime definition |
| `client/Dockerfile` | Frontend multi-stage build + Nginx runtime |

---

## `docker-compose.yml` (Local)

### Services

| Service | Role | Why it exists |
|---|---|---|
| `db` | MySQL 8.0 database | Stores application data and serves backend queries |
| `db-init` | Runs `node setup-db.js` once | Creates DB objects and seeds baseline users/data |
| `server` | Express API | Exposes backend endpoints, mounted at `/api/v1/*` |
| `client` | Nginx static host | Serves built frontend and proxies API traffic |

### Key Concepts

1. Service DNS by name: inside the network, `DB_HOST=db` works because Compose service names resolve automatically.
2. Startup sequencing: `server` waits for `db` and successful completion of `db-init`.
3. Durable storage: `db_data` volume keeps MySQL data across rebuilds/restarts.
4. First-run schema bootstrap: `schema.sql` mounted into `/docker-entrypoint-initdb.d/` runs only when DB data dir is empty.

### Local Ports

| Host | Container | Service |
|---|---|---|
| `80` | `80` | `client` |
| `5000` | `80` | `server` |
| `3306` | `3306` | `db` |

### Request Flow (Local)

1. Browser calls `http://localhost/api/v1/events`.
2. `client` (Nginx) proxies `/api/` traffic to `server` service.
3. `server` handles route and queries `db`.

---

## `docker-compose.prod.yml` (Production)

This file uses prebuilt images from GHCR:

- `ghcr.io/mscnulaguna/msc-official-website/msc-server:latest`
- `ghcr.io/mscnulaguna/msc-official-website/msc-client:latest`

### Why separate from local compose?

1. Production should avoid bind mounts used for local iteration.
2. Production should pull immutable image artifacts from CI/CD.
3. Runtime behavior is cleaner and closer to deployed environments.

---

## `server/Dockerfile`

### What it does

1. Uses `node:20-alpine` as base.
2. Sets `/app` as working directory.
3. Copies package manifests then installs production deps.
4. Copies backend source.
5. Exposes port `80` and starts `node server.js`.

### Why this pattern

- Smaller image footprint with Alpine.
- Layer caching for faster rebuilds.
- Explicit runtime command and port.

---

## `client/Dockerfile`

### Multi-stage Build

1. **Builder stage** (`node:20-alpine`)
   - Installs dependencies.
   - Builds Vite app.
   - Accepts `VITE_API_BASE_URL` as build argument.
2. **Runtime stage** (`nginx:alpine`)
   - Copies built `dist/` files to Nginx html directory.
   - Replaces default Nginx config with custom `nginx.conf`.
   - Exposes port `80`.

### Why this pattern

- Keeps runtime image small and fast.
- Removes Node.js toolchain from final frontend image.
- Uses Nginx for static serving and API reverse proxy.

---

## Best Practices Used Here

1. Return `200` with `[]` for empty list endpoints (not `500`).
2. Use one-off init job (`db-init`) for deterministic local bootstrap.
3. Use named volumes for database durability.
4. Keep local and production compose files separate.
5. Keep API behind reverse proxy and configure backend proxy trust.

---

## Troubleshooting Quick Checks

1. `db-init` fails with `ECONNREFUSED`:
   - DB startup race; ensure retry logic in `setup-db.js` is present.
2. API returns `500` for list endpoint with empty DB:
   - Inspect server logs; empty data should still return `200` with `data: []`.
3. Frontend cannot reach API:
   - Verify frontend is using `/api/v1` path and Nginx proxy is configured.
4. Rebuild not reflecting DB changes:
   - Existing `db_data` volume may preserve old state.

---

## Memory Hooks (Trivia)

1. **Compose service names are built-in DNS**:
   if the service is named `db`, that name is the hostname from other containers.
2. **`docker-entrypoint-initdb.d` is first-run only**:
   SQL files there run only when MySQL data directory is empty.
3. **Containers are disposable, volumes are durable**:
   remove/recreate containers freely while preserving DB state in named volumes.
4. **Multi-stage builds are the "pack light" strategy**:
   build with heavy tools, ship only what is needed at runtime.
