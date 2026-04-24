# MSC NU Laguna — Backend API

REST API for the MSC NU Laguna student portal. Built with **Node.js**, **Express 5**, and **MySQL**.

> Source layout note: backend runtime code lives at the repository root (`server.js`, `app.js`, `routes/`, `controllers/`, etc.). The `server/` folder contains Docker/container-specific files.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MySQL (via mysql2 + connection pool) |
| Auth | JWT (access + refresh tokens) |
| File uploads | Multer |
| Email | Nodemailer (Gmail / M365 SMTP) |
| QR codes | qrcode |

---

## Project Structure

```
repo-root/
├── client/                    # Frontend application (React + Vite)
├── server.js                  # Entry point — server initialization
├── app.js                     # Express app setup (CORS, middleware, routes, error handler)
├── setup-db.js                # One-time DB setup & seed script
├── schema.sql                 # Raw SQL schema (reference copy)
├── config/
│   ├── db.js                  # MySQL connection pool
│   ├── multer.js              # Profile photo upload config
│   └── roles.config.js        # Role hierarchy & permission map
├── controllers/               # Route handler logic
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── event.controller.js
│   ├── guild.controller.js
│   └── ... (more controllers)
├── middlewares/               # Express middleware (auth, admin, role, rateLimit)
├── models/                    # DB query functions
│   ├── event.model.js
│   ├── guild.model.js
│   ├── user.model.js
│   └── ... (more models)
├── routes/                    # Express routers
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── event.routes.js
│   ├── guild.routes.js
│   └── ... (more routes)
├── services/                  # Business logic & integrations
│   ├── email.service.js       # Nodemailer email helpers
│   └── sharepoint.service.js  # SharePoint sync service
├── utils/                     # Shared helpers & utilities
├── docs/                      # Full API documentation (Markdown)
│   ├── API_AUTHENTICATION.md
│   ├── API_EVENTS.md
│   ├── API_GUILDS.md
│   └── ... (more API docs)
├── public/
│   ├── avatars/               # Preset SVG avatars (committed)
│   └── uploads/
│       └── profile-photos/    # User-uploaded photos (git-ignored)
├── uploads/
│   └── event-covers/          # Event cover images (git-ignored)
├── server/                    # Docker & containerization config
│   ├── Dockerfile
│   ├── package.json           # Server container dependencies
│   └── index.js               # Server container entry point
├── docker-compose.yml         # Docker Compose for local dev
├── docker-compose.prod.yml    # Docker Compose for production
└── package.json               # Root project dependencies
```

---

## Setup

> 📋 **New to this repo?** See the full step-by-step guide → **[../SETUP.md](../SETUP.md)**
> 🐳 **Docker reference:** See **[./DOCKER.md](./DOCKER.md)** for compose and Dockerfile details.

### 1. Prerequisites

- Node.js 18+
- MySQL (XAMPP or standalone)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your database credentials, JWT secrets, and SMTP settings. See `.env.example` for all required variables and instructions.

### 4. Create database and seed

```bash
node setup-db.js
```

This creates the `msc_nulaguna` database, all tables, and a default **admin** account:

| Field | Value |
|---|---|
| Email | `cabasec@students.nu-laguna.edu.ph` |
| Password | `Password123` |

> ⚠️ Change this password immediately after first login in production.

### 5. Run the server

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`.

---

## API Modules

**MSC NU Laguna Official Website — API Contract**
Version 1.0 | February 2026

| Property | Value |
|---|---|
| Base URL | `https://api.msc-nulaguna.org/api/v1` |
| API Version | 1.0 |
| Protocol | HTTPS only |
| Auth Method | JWT Bearer Token |
| Content Type | `application/json` |
| Rate Limiting | 100 req/min per IP (authenticated); 20 req/min (public) |

> 🛠️ **Local development:** use `http://localhost:5000/api/v1`

### CORS Policy (Origins)

The API accepts browser requests from these development origins by default:

- `http://localhost`
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

For production, configure additional frontend origins via the `CORS_ORIGINS` environment variable (comma-separated), for example:

```env
CORS_ORIGINS=https://msc-client.azurewebsites.net,https://www.msc-nulaguna.org
```

---

### 🔐 Authentication — `/auth`
📄 [../docs/API_AUTHENTICATION.md](../docs/API_AUTHENTICATION.md)

Handles all login, token management, and password operations.

- No public self-registration — **accounts are created by admins only**
- On first login, users receive a temp password and are forced to set a new one (`requiresPasswordChange`)
- Issues a short-lived **JWT access token** (24h) and a long-lived **refresh token** (30d)
- Users can update their own profile (name, contact, emergency contact) via `PUT /auth/profile`

---

### 🛠️ Admin — `/admin`
📄 [../docs/API_ADMIN.md](../docs/API_ADMIN.md)

Admin-only endpoints for managing the full user roster.

- Create individual users with an auto-generated temporary password (`MSCxxxxXxxx` format)
- **Bulk import** students from CSV — paste the whole class list at once
- View, search, and filter all users with pagination
- Reset passwords for one or many users at once
- **Send credentials email** — fires off a welcome email to selected users with their login details
- All requests require `role: admin` in the JWT

---

### 👤 Users — `/users`
📄 [../docs/API_USERS.md](../docs/API_USERS.md)

Let logged-in members manage their own profile.

- `GET /users/me` — fetch your own profile data
- `PATCH /users/me` — update name, contact number, emergency contact
- `POST /users/me/photo` — upload a profile photo (max 5MB, images only)
- `GET /users/avatars` + `POST /users/me/avatar` — pick from 12 preset SVG avatars instead of uploading a photo
- Officers and admins can also `GET /users` to list all members

---

### 📅 Events — `/events`
📄 [../docs/API_EVENTS.md](../docs/API_EVENTS.md)

Full event lifecycle — from creation to QR-based attendance tracking.

- Anyone can browse events and view details (no login needed)
- Members register for events and receive a **confirmation email with a QR code**
- Officers/admins create events (with cover image upload, agenda, speakers, capacity)
- Attendance is marked by scanning the QR code — the JWT inside the QR is verified server-side
- Supports types: `workshop`, `seminar`, `competition`, `social`
- Events can be scoped to a specific guild or organization-wide

---

### 🏛️ Guilds — `/guilds`
📄 [../docs/API_GUILDS.md](../docs/API_GUILDS.md)

Learning guilds are the core community groups (e.g. Web Dev Guild, Design Guild).

- Anyone can browse guilds and view their details/roadmap (no login needed)
- Members apply to join a guild by submitting a motivation letter + portfolio
- Admins approve or reject applications
- Guild members get access to **learning resources** (videos, PDFs, quizzes, links) filtered by level (beginner/intermediate/advanced)
- Each guild has a `slug` (URL-friendly name) used in all routes (e.g. `/guilds/web-dev`)

---

### 📢 Announcements — `/announcements`
📄 [../docs/API_ANNOUNCEMENTS.md](../docs/API_ANNOUNCEMENTS.md)

Organization-wide and guild-specific announcements.

- Public read — anyone can view announcements without logging in
- Officers and admins can create announcements
- Announcements can be **pinned** to appear at the top
- Can be scoped to a specific guild or posted org-wide (`guild_id: null`)
- Supports an optional image attachment

---

### 🤝 Partners — `/partners`
📄 [../docs/API_PARTNERS.md](../docs/API_PARTNERS.md)

Manages the organization's industry and community partners.

- Public read — anyone can view the partners list
- Admins can add new partners
- Partners have a **tier system**: `bronze`, `silver`, `gold`, `platinum`
- Stores partner logo, website, contact email, and description
- Paginated list with optional tier filter

---

### 🔗 SharePoint Sync — `/integrations`
📄 [../docs/API_SHAREPOINT.md](../docs/API_SHAREPOINT.md)

Syncs user data between the portal and the organization's Microsoft SharePoint.

- Admin-only — uses Microsoft Graph API (Azure AD app registration required)
- Sync a single user or bulk-sync all members
- Async job system — trigger a sync job, then poll for its status
- Useful for keeping SharePoint member lists in sync with the portal database
- Requires `SP_TENANT_ID`, `SP_CLIENT_ID`, `SP_CLIENT_SECRET` in `.env`

---

### 📋 Roles & Permissions
📄 [../docs/API_ROLES.md](../docs/API_ROLES.md)

Three-tier role system enforced via JWT middleware:

| Role | What they can do |
|---|---|
| `member` | Browse public data, register for events, apply to guilds, manage own profile |
| `officer` | Everything members can + create events and announcements |
| `admin` | Everything officers can + manage users, approve applications, access admin panel |

---

### ⚠️ Error Codes
📄 [../docs/API_ERRORS.md](../docs/API_ERRORS.md)

All errors follow a consistent format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid JWT token"
  }
}
```

See `API_ERRORS.md` for the full list of error codes, HTTP status mappings, and what causes each one.

---

## Rate Limiting

| Limiter | Limit | Applied To |
|---|---|---|
| `authLimiter` | 100 req/min | All `/api/v1` routes |
| `publicLimiter` | 20 req/min | `POST /auth/login`, `POST /auth/refresh` |

---

## Environment Variables

See [`.env.example`](../.env.example) for the full list with descriptions.

Key variables:

```
PORT, NODE_ENV
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET, JWT_REFRESH_SECRET
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
```
