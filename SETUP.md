# MSC NU Laguna — Backend Setup Guide

> Hey team 👋 This is everything you need to get the backend running locally and connect your frontend pages to it.  
> Estimated time: **~10 minutes**.

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18 or higher | https://nodejs.org |
| XAMPP (MySQL) | any recent | https://www.apachefriends.org |
| Git | any | https://git-scm.com |

> You only need **MySQL from XAMPP** — the Apache/PHP parts are not used.

---

## Backend Setup (run once)

### 1. Go into the server folder

```bash
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

```bash
cp .env.example .env
```

Open `server/.env` and fill these in:

```env
# Database — default XAMPP has no password
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=msc_nulaguna

# JWT — any long random string works locally
JWT_SECRET=any-long-random-string
JWT_REFRESH_SECRET=another-long-random-string

# Email — only needed if testing the "Send Credentials" admin feature
# Gmail: generate an App Password at myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="MSC NU Laguna <youremail@gmail.com>"
```

> SharePoint variables (`SP_TENANT_ID` etc.) can be left blank — only needed for the sync feature.

### 4. Start MySQL

Open **XAMPP Control Panel** → click **Start** next to **MySQL** → wait for it to go green.

### 5. Create the database and seed test data

```bash
node setup-db.js
```

This creates the `msc_nulaguna` database, all 8 tables, and seeds test accounts. You should see:

```
✓ Database setup complete!
  Email:    cabasec@students.nu-laguna.edu.ph
  Password: Password123
```

> Safe to run multiple times — it won't duplicate anything.

### 6. Start the backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
API Version: v1
```

---

## Frontend Setup (connecting to the backend)

### 1. The proxy is already configured

The `client/vite.config.ts` already has this:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

This means **you don't hardcode `localhost:5000` anywhere in your frontend code**. Just call `/api/v1/...` directly.

### 2. Start the frontend

```bash
cd client
npm run dev
```

Frontend runs at **http://localhost:5173**.

### 3. How to make API calls

Use `fetch` or `axios` with the `/api/v1/` prefix:

```ts
// ✅ Correct — Vite proxy handles forwarding to :5000
const res = await fetch('/api/v1/events')
const data = await res.json()

// ❌ Wrong — don't hardcode the backend URL
const res = await fetch('http://localhost:5000/api/v1/events')
```

With axios:

```ts
import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1' })

// Public data (no login needed)
const { data } = await api.get('/events')
const { data } = await api.get('/guilds')
const { data } = await api.get('/announcements')
const { data } = await api.get('/partners')
```

### 4. Login and using the token

```ts
// 1. Login
const res = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const { token, user } = await res.json()

// 2. Save token
localStorage.setItem('access_token', token)

// 3. Use token on protected routes
const res = await fetch('/api/v1/users/me', {
  headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
})
```

### 5. What's public vs protected

| Endpoint | Auth required? | Who can use it |
|---|---|---|
| `GET /events` | ❌ No | Anyone |
| `GET /guilds` | ❌ No | Anyone |
| `GET /announcements` | ❌ No | Anyone |
| `GET /partners` | ❌ No | Anyone |
| `POST /auth/login` | ❌ No | Anyone |
| `GET /users/me` | ✅ Yes | Logged-in user |
| `POST /events/:id/register` | ✅ Yes | Members |
| `POST /events` | ✅ Yes | Officers + Admins |
| `POST /admin/users` | ✅ Yes | Admin only |

> Full details for every endpoint → see the [`docs/`](docs/) folder.

---

## Test Accounts

After running `node setup-db.js`:

| Role | Email | Password |
|---|---|---|
| **Admin** | `cabasec@students.nu-laguna.edu.ph` | `Password123` |
| **Officer** | `member2@students.nu-laguna.edu.ph` | `Password123` |
| **Member** | `member1@students.nu-laguna.edu.ph` | `Password123` |
| **Member** | `member3@students.nu-laguna.edu.ph` | `Password123` |

> Member accounts will redirect to a **Change Password** screen on first login — this is intentional.

---

## API Endpoints Quick Reference

Base URL (via Vite proxy): `/api/v1`

```
POST   /auth/login                    → login, returns JWT token
POST   /auth/refresh                  → refresh access token
POST   /auth/change-password          → change password (protected)
PUT    /auth/profile                  → update profile (protected)

GET    /events                        → list all events
GET    /events/:id                    → single event details
POST   /events/:id/register           → register for event (protected)

GET    /guilds                        → list all guilds
GET    /guilds/:slug                  → single guild details
GET    /guilds/:slug/resources        → guild learning resources (protected)
POST   /guilds/:slug/apply            → apply to join guild (protected)

GET    /announcements                 → list announcements
GET    /partners                      → list partners

GET    /users/me                      → your profile (protected)
PATCH  /users/me                      → update your profile (protected)
POST   /users/me/photo                → upload profile photo (protected)
GET    /users/avatars                 → list avatar presets (protected)
POST   /users/me/avatar               → select avatar (protected)
```

> See all request/response shapes in [`docs/`](docs/).

---

## API Response Format

All responses follow this shape:

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid JWT token"
  }
}
```

---

## Full API Documentation

All docs are in the [`docs/`](docs/) folder:

| File | What it covers |
|---|---|
| [docs/API_AUTHENTICATION.md](docs/API_AUTHENTICATION.md) | Login, refresh token, change password |
| [docs/API_ADMIN.md](docs/API_ADMIN.md) | Create users, bulk import CSV, send credentials email |
| [docs/API_USERS.md](docs/API_USERS.md) | Profile, avatar, photo upload |
| [docs/API_EVENTS.md](docs/API_EVENTS.md) | Events, registration, QR attendance |
| [docs/API_GUILDS.md](docs/API_GUILDS.md) | Guilds, apply, resources |
| [docs/API_ANNOUNCEMENTS.md](docs/API_ANNOUNCEMENTS.md) | Announcements |
| [docs/API_PARTNERS.md](docs/API_PARTNERS.md) | Partners |
| [docs/API_ROLES.md](docs/API_ROLES.md) | Role hierarchy and permissions |
| [docs/API_ERRORS.md](docs/API_ERRORS.md) | Error codes and HTTP status reference |
| [docs/API_SHAREPOINT.md](docs/API_SHAREPOINT.md) | SharePoint sync (admin only) |

---

## Folder Structure (Backend)

> All files below live inside the `server/` subfolder of the `MSC-Official-Website` repo.

```
server/
├── server.js              ← entry point
├── app.js                 ← Express setup, CORS, routes, error handler
├── setup-db.js            ← run once to create DB and seed data
├── schema.sql             ← raw SQL schema (reference only)
├── .env.example           ← copy to .env and fill in your values
│
├── config/
│   ├── db.js              ← MySQL connection pool
│   ├── multer.js          ← file upload config (profile photos)
│   └── roles.config.js    ← role hierarchy and permission map
│
├── controllers/           ← route logic (auth, admin, users, events, etc.)
├── middlewares/           ← auth guard, role guard, rate limiter
├── models/                ← database query functions
├── routes/                ← Express route definitions
├── services/
│   ├── email.service.js   ← send welcome/credential emails via SMTP
│   └── sharepoint.service.js ← Microsoft Graph API sync
├── utils/                 ← shared helpers (avatars, error codes)
├── docs/                  ← full API documentation
│
├── public/
│   └── avatars/           ← 12 preset SVG avatars (served as static files)
└── uploads/
    └── event-covers/      ← event cover image uploads
```

---

## Common Issues

**`CORS error` in browser console**  
→ Make sure you're calling `/api/v1/...` (not `http://localhost:5000/api/v1/...`) so the Vite proxy handles it.

**`Error: connect ECONNREFUSED 127.0.0.1:3306`**  
→ MySQL isn't running. Open XAMPP and start MySQL.

**`Error: listen EADDRINUSE :::5000`**  
→ Port 5000 is already taken. Change `PORT=5001` in `server/.env`.

**`ER_ACCESS_DENIED_ERROR`**  
→ Wrong DB credentials. Default XAMPP MySQL is `root` with no password.

**`Cannot find module '...'`**  
→ Run `npm install` again inside the `server/` folder.

**Login returns "Invalid email or password"**  
→ Make sure you ran `node setup-db.js` first.
