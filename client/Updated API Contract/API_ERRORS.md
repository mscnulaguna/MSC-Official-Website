# Error Codes

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

All error responses from the API follow a single consistent shape:

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired token"
  }
}
```

| Field     | Type   | Description                              |
|-----------|--------|------------------------------------------|
| `code`    | string | Machine-readable error identifier        |
| `message` | string | Human-readable description of the error  |

---

## Error Code Reference

| HTTP Status | Code                 | Description                                                  |
|-------------|----------------------|--------------------------------------------------------------|
| `400`       | `VALIDATION_ERROR`   | Request body or query params failed validation               |
| `401`       | `UNAUTHORIZED`       | Missing or invalid JWT token                                 |
| `403`       | `FORBIDDEN`          | Authenticated but insufficient role/permissions              |
| `404`       | `NOT_FOUND`          | Requested resource does not exist                            |
| `409`       | `CONFLICT`           | Duplicate resource (e.g., already registered for event)      |
| `422`       | `CAPACITY_FULL`      | Event registration is at capacity                            |
| `429`       | `RATE_LIMITED`       | Too many requests — see rate limit headers                   |
| `500`       | `INTERNAL_ERROR`     | Unexpected server-side error                                 |

---

## Rate Limiting

Rate limit headers are included on every response (`RateLimit-*` standard headers):

| Header                  | Description                                      |
|-------------------------|--------------------------------------------------|
| `RateLimit-Limit`       | Maximum requests allowed in the window           |
| `RateLimit-Remaining`   | Requests remaining in the current window         |
| `RateLimit-Reset`       | Seconds until the window resets                  |

**Limits by endpoint type:**

| Endpoint group               | Limit         |
|------------------------------|---------------|
| `POST /auth/login`           | 20 req / min  |
| `POST /auth/refresh`         | 20 req / min  |
| All other `https://api.msc-nulaguna.org/v1/*` routes | 100 req / min |

When the limit is exceeded the server responds with `429`:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests — please try again later"
  }
}
```

---

## Common Scenarios

### Missing or expired token

```http
GET https://api.msc-nulaguna.org/v1/users/me
```

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid JWT token"
  }
}
```

---

### Insufficient role

```http
POST https://api.msc-nulaguna.org/v1/announcements
Authorization: Bearer <member-token>
```

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions for this action"
  }
}
```

---

### Validation failure

```http
POST /api/v1/events
Authorization: Bearer <officer-token>
{ "title": "My Event" }
```

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Required fields: title, description, date, endDate, venue, capacity, type"
  }
}
```

---

### Resource not found

```http
GET /api/v1/events/999
```

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event not found"
  }
}
```

---

### Duplicate / conflict

```http
POST /api/v1/events/1/register
Authorization: Bearer <token>  (user already registered)
```

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "User is already registered for this event"
  }
}
```

---

### Event at capacity

```http
POST /api/v1/events/1/register
Authorization: Bearer <token>  (event is full)
```

```json
{
  "error": {
    "code": "CAPACITY_FULL",
    "message": "Event registration is at capacity"
  }
}
```

---

## Related

- [Authentication](./API_AUTHENTICATION.md)
- [Users & Members](./API_USERS.md)
- [Events & Activities](./API_EVENTS.md)
- [Guilds & Learning](./API_GUILDS.md)
- [Announcements](./API_ANNOUNCEMENTS.md)
- [Partners](./API_PARTNERS.md)
- [Admin User Management](./API_ADMIN.md)
