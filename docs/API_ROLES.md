# Roles & Permissions

## Overview

The API enforces four access levels. Every JWT contains a `role` claim that is checked by the middleware on each request.

| Role      | Description                                              |
|-----------|----------------------------------------------------------|
| `public`  | No token required — unauthenticated request              |
| `member`  | Authenticated student; default role on account creation  |
| `officer` | Elevated trust; can create events and announcements      |
| `admin`   | Full control; manages users, partners, and guilds        |

---

## Permission Matrix

| Endpoint Group                                          | Public | Member | Officer | Admin |
|---------------------------------------------------------|:------:|:------:|:-------:|:-----:|
| `POST /auth/login`, `POST /auth/refresh`                | ✓      | ✓      | ✓       | ✓     |
| `GET /events`, `/guilds`, `/partners`, `/announcements` | ✓      | ✓      | ✓       | ✓     |
| `POST /events/:id/register`                             | –      | ✓      | ✓       | ✓     |
| `GET /guilds/:slug/resources`                           | –      | ✓ ¹    | ✓       | ✓     |
| `POST /guilds/:slug/apply`                              | –      | ✓      | ✓       | ✓     |
| `POST /events` (create event)                           | –      | –      | ✓       | ✓     |
| `POST /announcements`                                   | –      | –      | ✓       | ✓     |
| `POST /events/:id/attendance` (scan)                    | –      | –      | ✓       | ✓     |
| `GET /events/:id/attendance` (list)                     | –      | –      | ✓       | ✓     |
| `GET /users` (member list)                              | –      | –      | ✓       | ✓     |
| `POST /admin/users` (create user)                       | –      | –      | –       | ✓     |
| `POST /admin/users/bulk/import`                         | –      | –      | –       | ✓     |
| `POST /admin/users/bulk-reset`                          | –      | –      | –       | ✓     |
| `PATCH /users/:userId/role`                             | –      | –      | –       | ✓     |
| `POST /users/:userId/deactivate`                        | –      | –      | –       | ✓     |
| `POST /partners` (add partner)                          | –      | –      | –       | ✓     |
| `POST /guilds/:userId/approve` (approve application)    | –      | –      | –       | ✓     |

> ¹ **Guild resources:** A member can only access resources for guilds they have been **approved into**. Officers and admins bypass this membership check.

---

## How It Is Enforced

### Layer 1 — `authMiddleware`
Verifies the `Authorization: Bearer <token>` header and decodes the JWT.  
Applied to every protected route. Returns `401 UNAUTHORIZED` if missing or invalid.

### Layer 2 — `roleMiddleware([...roles])`
Checks `req.user.role` against the allowed roles list.  
Returns `403 FORBIDDEN` if the user's role is not in the list.

### Layer 3 — `adminMiddleware`
Shorthand for `roleMiddleware(['admin'])`, used across all `/admin/*` routes.  
Returns `403 FORBIDDEN` for any non-admin.

### Layer 4 — Controller-level membership check
`GET /guilds/:slug/resources` performs an additional DB query to confirm the authenticated user is an approved member of that specific guild before returning resources.

---

## Route Middleware Summary

```
GET  /events                    → (public)
GET  /events/:id                → (public)
POST /events                    → authMiddleware → roleMiddleware(['officer','admin'])
POST /events/upload/cover       → authMiddleware → roleMiddleware(['officer','admin'])
POST /events/:id/register       → authMiddleware
POST /events/:id/attendance     → authMiddleware → roleMiddleware(['officer','admin'])
GET  /events/:id/attendance     → authMiddleware → roleMiddleware(['officer','admin'])

GET  /guilds                    → (public)
GET  /guilds/:slug              → (public)
POST /guilds/:slug/apply        → authMiddleware
GET  /guilds/:slug/resources    → authMiddleware → [controller membership check]
POST /guilds/:userId/approve    → authMiddleware → roleMiddleware(['admin'])

GET  /announcements             → (public)
POST /announcements             → authMiddleware → roleMiddleware(['officer','admin'])

GET  /partners                  → (public)
POST /partners                  → authMiddleware → roleMiddleware(['admin'])

GET  /users/me                  → authMiddleware
PATCH /users/me                 → authMiddleware
POST /users/me/photo            → authMiddleware
GET  /users/avatars             → authMiddleware
POST /users/me/avatar           → authMiddleware
GET  /users                     → authMiddleware → roleMiddleware(['officer','admin'])
PATCH /users/:userId/role       → authMiddleware → roleMiddleware(['admin'])
POST /users/:userId/deactivate  → authMiddleware → roleMiddleware(['admin'])

POST /admin/users               → authMiddleware → adminMiddleware
POST /admin/users/bulk/import   → authMiddleware → adminMiddleware
POST /admin/users/bulk-reset    → authMiddleware → adminMiddleware
GET  /admin/users               → authMiddleware → adminMiddleware
GET  /admin/users/:userId       → authMiddleware → adminMiddleware
PUT  /admin/users/:userId       → authMiddleware → adminMiddleware
GET  /admin/users/:userId/temporary-password → authMiddleware → adminMiddleware

POST /auth/login                → publicLimiter (20 req/min, no auth)
POST /auth/refresh              → publicLimiter (20 req/min, no auth)
POST /auth/logout               → authMiddleware
POST /auth/change-password      → authMiddleware
PUT  /auth/profile              → authMiddleware
```

---

## Related

- [Error Codes](./API_ERRORS.md) — `401 UNAUTHORIZED`, `403 FORBIDDEN` shapes
- [Authentication](./API_AUTHENTICATION.md) — Token format and expiry
- [Admin User Management](./API_ADMIN.md) — Admin-only operations
