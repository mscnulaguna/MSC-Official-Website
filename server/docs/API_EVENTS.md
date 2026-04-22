# Events & Activities API

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

Endpoints for listing, creating, registering for, and tracking attendance at events.  
Public read endpoints require no authentication.  
Write and management endpoints require a valid JWT access token:

```
Authorization: Bearer <token>
```

Role requirements are noted per endpoint.

---

## Endpoints

---

### `GET /events`

Get a paginated list of events. **Public endpoint — no authentication required.**

#### Query Parameters

| Param      | Type    | Required | Description                                                  |
|------------|---------|----------|--------------------------------------------------------------|
| `status`   | string  | No       | `upcoming` \| `past` \| `all` (default: `all`)               |
| `guild`    | string  | No       | Filter by guild slug (e.g. `tech-guild`)                     |
| `type`     | string  | No       | `workshop` \| `seminar` \| `competition` \| `social`         |
| `page`     | integer | No       | Page number (default: `1`)                                   |
| `pageSize` | integer | No       | Results per page, max `50` (default: `50`)                   |

#### Response `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "title": "Web Dev Workshop 2026",
      "description": "A hands-on workshop covering modern web development.",
      "date": "2026-04-10T09:00:00.000Z",
      "endDate": "2026-04-10T17:00:00.000Z",
      "venue": "NU Laguna — Tech Lab 301",
      "capacity": 50,
      "registered": 12,
      "guild": { "id": 1, "name": "Tech Guild", "slug": "tech-guild" },
      "speakers": [
        { "name": "Dr. Ana Reyes", "bio": "Full-stack engineer with 10 years of experience.", "photo": null }
      ],
      "agenda": [
        { "time": "09:00", "activity": "Registration & Welcome" },
        { "time": "09:30", "activity": "Intro to React" }
      ],
      "coverImage": "/event-covers/cover-1741234567-abc123.jpg",
      "type": "workshop"
    }
  ],
  "total": 8,
  "page": 1,
  "pageSize": 50
}
```

#### Error Responses

| Status | Code            | Reason       |
|--------|-----------------|--------------|
| `500`  | `INTERNAL_ERROR`| Server error |

---

### `GET /events/:id`

Get full details for a single event. **Public endpoint — no authentication required.**

#### Path Parameters

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| `id`  | string | Yes      | Event UUID  |

#### Response `200 OK`

```json
{
  "id": 1,
  "title": "Web Dev Workshop 2026",
  "description": "A hands-on workshop covering modern web development.",
  "date": "2026-04-10T09:00:00.000Z",
  "endDate": "2026-04-10T17:00:00.000Z",
  "venue": "NU Laguna — Tech Lab 301",
  "capacity": 50,
  "registered": 12,
  "guild": { "id": 1, "name": "Tech Guild", "slug": "tech-guild" },
  "speakers": [
    { "name": "Dr. Ana Reyes", "bio": "Full-stack engineer.", "photo": null }
  ],
  "agenda": [
    { "time": "09:00", "activity": "Registration & Welcome" },
    { "time": "09:30", "activity": "Intro to React" }
  ],
  "coverImage": "/event-covers/cover-1741234567-abc123.jpg",
  "type": "workshop",
  "registrationOpen": true,
  "userRegistered": false
}
```

> **Note:** `registrationOpen` is computed — it is `true` when `endDate` is in the future **and** the event is not at full capacity.  
> `userRegistered` is always `false` on this public endpoint (no auth context).

#### Error Responses

| Status | Code            | Reason              |
|--------|-----------------|---------------------|
| `404`  | `NOT_FOUND`     | Event not found     |
| `500`  | `INTERNAL_ERROR`| Server error        |

---

### `POST /events`

Create a new event.  
Requires **officer** or **admin** role.

#### Request Body

| Field         | Type    | Required | Description                                              |
|---------------|---------|----------|----------------------------------------------------------|
| `title`       | string  | Yes      | Event title                                              |
| `description` | string  | Yes      | Full event description                                   |
| `date`        | string  | Yes      | ISO 8601 start datetime (e.g. `"2026-04-10T09:00:00Z"`) |
| `endDate`     | string  | Yes      | ISO 8601 end datetime                                    |
| `venue`       | string  | Yes      | Venue name and address                                   |
| `capacity`    | integer | Yes      | Maximum number of attendees                              |
| `type`        | string  | Yes      | `workshop` \| `seminar` \| `competition` \| `social`    |
| `guildId`     | string  | No       | Associated guild UUID                                    |
| `coverImage`  | string  | No       | URL or base64-encoded image (see `POST /events/upload/cover` for file uploads) |
| `agenda`      | array   | No       | Array of `{ time, activity }` objects                    |
| `speakers`    | array   | No       | Array of `{ name, bio, photo }` objects                  |

#### Response `201 Created`

```json
{
  "event": {
    "id": 1,
    "title": "Web Dev Workshop 2026",
    "description": "A hands-on workshop covering modern web development.",
    "date": "2026-04-10T09:00:00.000Z",
    "endDate": "2026-04-10T17:00:00.000Z",
    "venue": "NU Laguna — Tech Lab 301",
    "capacity": 50,
    "registered": 0,
    "guild": { "id": 1, "name": "Tech Guild", "slug": "tech-guild" },
    "speakers": [],
    "agenda": [],
    "coverImage": null,
    "type": "workshop",
    "registrationOpen": true
  }
}
```

#### Error Responses

| Status | Code               | Reason                                                  |
|--------|--------------------|---------------------------------------------------------|
| `400`  | `VALIDATION_ERROR` | One or more required fields missing                     |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token                                |
| `403`  | `FORBIDDEN`        | Authenticated user is not officer or admin              |
| `500`  | `INTERNAL_ERROR`   | Server error                                            |

---

### `POST /events/upload/cover`

Upload an event cover image and get back a URL to use in `POST /events`.  
Requires **officer** or **admin** role.  
Request must be `multipart/form-data`.

#### Request Body (form-data)

| Field        | Type | Required | Description                             |
|--------------|------|----------|-----------------------------------------|
| `coverImage` | file | Yes      | Image file (JPEG, PNG, etc.; max 5 MB)  |

#### Response `200 OK`

```json
{
  "success": true,
  "imageUrl": "/event-covers/cover-1741234567-abc123.jpg",
  "message": "Event cover image uploaded successfully"
}
```

> Use `imageUrl` as the `coverImage` field when creating an event with `POST /events`.

#### Error Responses

| Status | Code               | Reason                         |
|--------|--------------------|--------------------------------|
| `400`  | `VALIDATION_ERROR` | No file included               |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token       |
| `403`  | `FORBIDDEN`        | Insufficient role              |
| `500`  | `INTERNAL_ERROR`   | Server error                   |

---

### `POST /events/:id/register`

Register the authenticated user for an event.  
Requires `Authorization: Bearer <token>`.

#### Path Parameters

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| `id`  | string | Yes      | Event UUID  |

#### Response `200 OK`

```json
{
  "registrationId": 42,
  "confirmationCode": "A1B2C3D4E",
  "qrCode": "data:image/png;base64,<base64-encoded-qr>",
  "eventId": 1,
  "userId": 7
}
```

> **Note:** `qrCode` is a full `data:image/png;base64,…` URI. The QR payload is a signed JWT containing `userId`, `eventId`, and `confirmationCode`. Present this QR at the event for attendance scanning.

#### Error Responses

| Status | Code               | Reason                                  |
|--------|--------------------|-----------------------------------------|
| `400`  | `VALIDATION_ERROR` | Event ID missing                        |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token                |
| `404`  | `NOT_FOUND`        | Event not found                         |
| `409`  | `CONFLICT`         | User already registered for this event  |
| `422`  | `CAPACITY_FULL`    | Event has reached maximum capacity      |
| `500`  | `INTERNAL_ERROR`   | Server error                            |

---

### `POST /events/:id/attendance`

Mark a user's attendance via QR code scan or direct user ID.  
Requires **officer** or **admin** role.

#### Path Parameters

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| `id`  | string | Yes      | Event UUID  |

#### Request Body

| Field    | Type   | Required | Description                                                           |
|----------|--------|----------|-----------------------------------------------------------------------|
| `qrCode` | string | Yes*     | Scanned QR code value (the JWT string from registration)              |
| `userId` | string | No       | User UUID — alternative if QR code is unavailable (one of the two is required) |

> At least one of `qrCode` or `userId` must be provided.

#### Response `200 OK`

```json
{
  "attended": true,
  "userId": 7,
  "userName": "Juan Dela Cruz",
  "timestamp": "2026-04-10T09:15:00.000Z"
}
```

#### Error Responses

| Status | Code               | Reason                                      |
|--------|--------------------|---------------------------------------------|
| `400`  | `VALIDATION_ERROR` | Neither `qrCode` nor `userId` provided      |
| `400`  | `VALIDATION_ERROR` | QR code does not match this event           |
| `400`  | `VALIDATION_ERROR` | Invalid or expired QR code                  |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token                    |
| `403`  | `FORBIDDEN`        | Insufficient role                           |
| `404`  | `NOT_FOUND`        | Event or registration not found             |
| `500`  | `INTERNAL_ERROR`   | Server error                                |

---

### `GET /events/:id/attendance`

Get the attendance list for an event (only users who have been marked as attended).  
Requires **officer** or **admin** role.

#### Path Parameters

| Param | Type   | Required | Description |
|-------|--------|----------|-------------|
| `id`  | string | Yes      | Event UUID  |

#### Response `200 OK`

```json
{
  "data": [
    {
      "userId": 7,
      "name": "Juan Dela Cruz",
      "timestamp": "2026-04-10T09:15:00.000Z"
    }
  ],
  "count": 1,
  "registrationCount": 12
}
```

| Field               | Type    | Description                            |
|---------------------|---------|----------------------------------------|
| `data`              | array   | Users who were marked as attended      |
| `count`             | integer | Total attendees (scanned in)           |
| `registrationCount` | integer | Total registered (including no-shows)  |

#### Error Responses

| Status | Code            | Reason                          |
|--------|-----------------|---------------------------------|
| `401`  | `UNAUTHORIZED`  | Missing or invalid token        |
| `403`  | `FORBIDDEN`     | Insufficient role               |
| `404`  | `NOT_FOUND`     | Event not found                 |
| `500`  | `INTERNAL_ERROR`| Server error                    |

---

## Registration & QR Flow

```
User registers       ──▶  POST /events/:id/register
                          Returns: confirmationCode + qrCode (data URI)
          │
          ▼
User presents QR     ──▶  Officer scans QR image
at event entrance         (reads JWT string from QR)
          │
          ▼
Officer submits scan ──▶  POST /events/:id/attendance
                          Body: { qrCode: "<jwt-string>" }
          │
          ▼
          ✓  attended = true
             Attendance timestamp recorded
```

---

## Related

- [Authentication](./API_AUTHENTICATION.md) — Login and token management
- [Users & Members](./API_USERS.md) — Member profiles and role management
