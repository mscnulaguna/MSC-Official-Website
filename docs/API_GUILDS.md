# Guilds & Learning API

## Overview

Endpoints for browsing guilds, applying for membership, and accessing learning resources.  
Public read endpoints require no authentication.  
Write and gated endpoints require a valid JWT access token:

```
Authorization: Bearer <token>
```

Role requirements are noted per endpoint.

---

## Endpoints

---

### `GET /guilds`

Get the list of all guilds. **Public endpoint — no authentication required.**

#### Response `200 OK`

```json
{
  "data": [
    {
      "id": "1",
      "name": "UI/UX Design",
      "slug": "uiux",
      "description": "A guild focused on user interface and experience design.",
      "image_url": "http://localhost:5000/avatars/guild-uiux.svg",
      "memberCount": 18,
      "leaderName": "Maria Santos"
    },
    {
      "id": "2",
      "name": "Web Development",
      "slug": "webdev",
      "description": "Front-end and back-end web development guild.",
      "image_url": null,
      "memberCount": 24,
      "leaderName": "Juan Dela Cruz"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}
```

| Field         | Type    | Description                         |
|---------------|---------|-------------------------------------|
| `id`          | string  | Guild UUID                          |
| `name`        | string  | Guild display name                  |
| `slug`        | string  | URL-friendly identifier             |
| `description` | string  | Short guild overview                |
| `image_url`   | string  | Guild logo/image URL, or `null`     |
| `memberCount` | integer | Number of active guild members      |
| `leaderName`  | string  | Full name of the guild creator/lead |

#### Error Responses

| Status | Code            | Reason       |
|--------|-----------------|--------------|
| `500`  | `INTERNAL_ERROR`| Server error |

---

### `GET /guilds/:slug`

Get full details for a single guild, including roadmap, leads, and public resources.  
**Public endpoint — no authentication required.**

#### Path Parameters

| Param  | Type   | Required | Description                                    |
|--------|--------|----------|------------------------------------------------|
| `slug` | string | Yes      | Guild slug (e.g., `uiux`, `webdev`, `cybersec`) |

#### Response `200 OK`

```json
{
  "id": "1",
  "name": "UI/UX Design",
  "slug": "uiux",
  "description": "A guild focused on user interface and experience design.",
  "image_url": null,
  "memberCount": 18,
  "roadmap": [
    { "title": "Foundations of Design",   "description": "Learn the core principles of UI/UX." },
    { "title": "Figma Essentials",        "description": "Master the primary design tool." },
    { "title": "User Research Methods",   "description": "Conduct usability studies and interviews." }
  ],
  "leads": [
    { "id": "3", "fullName": "Maria Santos", "email": "maria@students.nu-laguna.edu.ph", "role": "officer" }
  ],
  "resources": [
    {
      "id": "1",
      "title": "Intro to Figma",
      "type": "video",
      "url": "https://www.youtube.com/watch?v=example",
      "level": "beginner",
      "tags": ["figma", "design", "ui"]
    }
  ]
}
```

| Field         | Type    | Description                                                  |
|---------------|---------|--------------------------------------------------------------|
| `id`          | string  | Guild UUID                                                   |
| `name`        | string  | Guild display name (e.g., `UI/UX Design`)                    |
| `slug`        | string  | URL-friendly identifier                                      |
| `description` | string  | Guild overview                                               |
| `image_url`   | string  | Guild logo/image URL, or `null`                              |
| `memberCount` | integer | Number of active guild members                               |
| `roadmap`     | array   | Ordered array of `{ title, description }` milestone objects  |
| `leads`       | array   | Guild leads — members with `officer` or `admin` guild role   |
| `resources`   | array   | Public resources — array of `{ id, title, type, url, level, tags }` objects |

**Lead object shape:**

| Field      | Type   | Description                           |
|------------|--------|---------------------------------------|
| `id`       | string | User UUID                             |
| `fullName` | string | Lead's full name                      |
| `email`    | string | Lead's email address                  |
| `role`     | string | Guild role: `officer` or `admin`      |

#### Error Responses

| Status | Code            | Reason              |
|--------|-----------------|---------------------|
| `404`  | `NOT_FOUND`     | Guild not found     |
| `500`  | `INTERNAL_ERROR`| Server error        |

---

### `POST /guilds/:slug/apply`

Submit a membership application for a guild.  
Requires `Authorization: Bearer <token>`.

#### Path Parameters

| Param  | Type   | Required | Description |
|--------|--------|----------|-------------|
| `slug` | string | Yes      | Guild slug  |

#### Request Body

| Field          | Type   | Required | Description                                          |
|----------------|--------|----------|------------------------------------------------------|
| `motivation`   | string | Yes      | Why the user wants to join (minimum 50 characters)   |
| `experience`   | string | No       | Prior experience or relevant skills                  |
| `portfolioUrl` | string | No       | Link to portfolio or sample work                     |

#### Response `201 Created`

```json
{
  "applicationId": 7,
  "status": "pending",
  "submittedAt": "2026-03-08T10:00:00.000Z",
  "message": "Application submitted successfully"
}
```

| Field           | Type   | Description                             |
|-----------------|--------|-----------------------------------------|
| `applicationId` | string | Application UUID                        |
| `status`        | string | `pending` \| `approved` \| `rejected`   |
| `submittedAt`   | string | ISO 8601 submission timestamp           |

> **Note:** Applications start in `pending` status. An admin reviews and approves/rejects via `POST /admin/:userId/approve`.

#### Error Responses

| Status | Code               | Reason                                          |
|--------|--------------------|-------------------------------------------------|
| `400`  | `VALIDATION_ERROR` | `motivation` missing or under 50 characters     |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token                        |
| `404`  | `NOT_FOUND`        | Guild not found                                 |
| `409`  | `ALREADY_APPLIED`  | User has already applied to this guild          |
| `500`  | `INTERNAL_ERROR`   | Server error                                    |

---

### `GET /guilds/:slug/resources`

Get the learning resources for a guild.  
Requires **guild membership** or **officer / admin** role.

#### Path Parameters

| Param  | Type   | Required | Description |
|--------|--------|----------|-------------|
| `slug` | string | Yes      | Guild slug  |

#### Query Parameters

| Param  | Type   | Required | Description                                           |
|--------|--------|----------|-------------------------------------------------------|
| `level`| string | No       | `beginner` \| `intermediate` \| `advanced`            |
| `type` | string | No       | `video` \| `pdf` \| `quiz` \| `link`                  |

#### Response `200 OK`

```json
{
  "data": [
    {
      "id": "1",
      "title": "Intro to Figma",
      "type": "video",
      "url": "https://www.youtube.com/watch?v=example",
      "level": "beginner",
      "tags": ["figma", "design", "ui"]
    },
    {
      "id": "2",
      "title": "Design Systems PDF",
      "type": "pdf",
      "url": "https://example.com/design-systems.pdf",
      "level": "intermediate",
      "tags": ["design-systems", "components"]
    }
  ],
  "total": 2
}
```

**Resource object shape:**

| Field   | Type   | Description                                            |
|---------|--------|--------------------------------------------------------|
| `id`    | string | Resource UUID                                          |
| `title` | string | Resource title                                         |
| `type`  | string | `video` \| `pdf` \| `quiz` \| `link`                  |
| `url`   | string | Direct URL to the resource                             |
| `level` | string | `beginner` \| `intermediate` \| `advanced`             |
| `tags`  | array  | Array of tag strings (e.g. `["figma", "design"]`)     |

#### Error Responses

| Status | Code            | Reason                                             |
|--------|-----------------|----------------------------------------------------|
| `401`  | `UNAUTHORIZED`  | Missing or invalid token                           |
| `403`  | `FORBIDDEN`     | User is not a guild member, officer, or admin      |
| `404`  | `NOT_FOUND`     | Guild not found                                    |
| `500`  | `INTERNAL_ERROR`| Server error                                       |

---

## Application & Approval Flow

```
User submits application  ──▶  POST /guilds/:slug/apply
                                Returns: applicationId, status = "pending"
          │
          ▼
Admin reviews application ──▶  POST /admin/:userId/approve
                                Body: { guildId }
          │
          ▼
          ✓  Application status → "approved"
             User added to guild_members
             User can now access GET /guilds/:slug/resources
```

---

## Related

- [Authentication](./API_AUTHENTICATION.md) — Login and token management
- [Users & Members](./API_USERS.md) — Member profiles and role management
- [Admin User Management](./API_ADMIN.md) — Approve guild applications
