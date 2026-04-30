# Announcements API

> **MSC NU Laguna Official Website — API Contract** | Version 1.0 | February 2026
>
> | Property | Value |
> |---|---|
> | Base URL | `https://api.msc-nulaguna.org/v1` |
> | API Version | 1.0 |
> | Protocol | HTTPS only |
> | Auth Method | JWT Bearer Token |
> | Content Type | `application/json` |
> | Rate Limiting | 100 req/min per IP (authenticated); 20 req/min (public) |

## Overview

Endpoints for listing and creating announcements.  
The list endpoint is public. Creating announcements requires a valid JWT access token:

```
Authorization: Bearer <token>
```

---

## Endpoints

---

### `GET /announcements`

Get a paginated list of announcements. **Public endpoint — no authentication required.**  
Results are ordered with pinned announcements first, then by newest.

#### Query Parameters

| Param      | Type    | Required | Description                                    |
|------------|---------|----------|------------------------------------------------|
| `page`     | integer | No       | Page number (default: `1`)                     |
| `pageSize` | integer | No       | Results per page, max `100` (default: `20`)    |
| `pinned`   | boolean | No       | Pass `true` to return only pinned announcements |

#### Response `200 OK`

```json
{
  "data": [
    {
      "id": "1",
      "title": "General Assembly — March 2026",
      "body": "All members are required to attend the **General Assembly** on March 15.",
      "pinned": true,
      "guildId": null,
      "guildName": null,
      "imageUrl": null,
      "createdAt": "2026-03-08T10:00:00.000Z",
      "createdBy": "1",
      "createdByName": "Maria Santos"
    },
    {
      "id": "2",
      "title": "Tech Guild Workshop Registration Open",
      "body": "Registration for the Web Dev Workshop is now open!",
      "pinned": false,
      "guildId": "1",
      "guildName": "Tech Guild",
      "imageUrl": "https://api.msc-nulaguna.org/uploads/announcement-banner.jpg",
      "createdAt": "2026-03-07T09:00:00.000Z",
      "createdBy": "3",
      "createdByName": "Juan Dela Cruz"
    }
  ],
  "total": 12,
  "page": 1,
  "pageSize": 20
}
```

**Announcement object fields:**

| Field           | Type    | Description                                                    |
|-----------------|---------|----------------------------------------------------------------|
| `id`            | string  | Announcement UUID                                              |
| `title`         | string  | Announcement title                                             |
| `body`          | string  | Full content — markdown supported                              |
| `pinned`        | boolean | Whether this announcement is pinned to the top                 |
| `guildId`       | string  | Associated guild UUID, or `null` if org-wide                   |
| `guildName`     | string  | Associated guild name, or `null` if org-wide                   |
| `imageUrl`      | string  | Optional banner image URL, or `null`                           |
| `createdAt`     | string  | ISO 8601 creation timestamp                                    |
| `createdBy`     | string  | UUID of the user who created the announcement                  |
| `createdByName` | string  | Full name of the creator                                       |

#### Error Responses

| Status | Code            | Reason       |
|--------|-----------------|--------------|
| `500`  | `INTERNAL_ERROR`| Server error |

---

### `POST /announcements`

Create a new announcement.  
Requires **officer** or **admin** role.

#### Request Body

| Field      | Type    | Required | Description                                                  |
|------------|---------|----------|--------------------------------------------------------------|
| `title`    | string  | Yes      | Announcement title                                           |
| `body`     | string  | Yes      | Full announcement content (markdown supported)               |
| `pinned`   | boolean | No       | Pin to top of list (default: `false`)                        |
| `guildId`  | string  | No       | Restrict announcement to a specific guild audience           |
| `imageUrl` | string  | No       | Optional banner image URL                                    |

#### Response `201 Created`

```json
{
  "announcement": {
    "id": "3",
    "title": "Upcoming Hackathon 2026",
    "body": "We are excited to announce the **MSC Hackathon 2026**! Register before April 1.",
    "pinned": false,
    "guildId": null,
    "guildName": null,
    "imageUrl": null,
    "createdAt": "2026-03-08T11:00:00.000Z",
    "createdBy": "1",
    "createdByName": "Maria Santos"
  }
}
```

> **Note:** `guildId` is optional. If provided, the guild must exist — an invalid `guildId` returns `400` rather than a server error.  
> Announcements without a `guildId` are org-wide and visible to all members.

#### Error Responses

| Status | Code               | Reason                                        |
|--------|--------------------|-----------------------------------------------|
| `400`  | `VALIDATION_ERROR` | `title` or `body` missing                     |
| `400`  | `VALIDATION_ERROR` | `guildId` provided but guild does not exist   |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token                      |
| `403`  | `FORBIDDEN`        | Authenticated user is not officer or admin    |
| `500`  | `INTERNAL_ERROR`   | Server error                                  |

---

## Related

- [Authentication](./API_AUTHENTICATION.md) — Login and token management
- [Guilds & Learning](./API_GUILDS.md) — Guild details and membership
- [Events & Activities](./API_EVENTS.md) — Event management
