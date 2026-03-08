# Partners API

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

Endpoints for listing and adding partner organizations.  
The list endpoint is public. Adding a partner requires an admin JWT token:

```
Authorization: Bearer <token>
```

---

## Endpoints

---

### `GET /partners`

Get all partner organizations. **Public endpoint — no authentication required.**  
Results are ordered alphabetically by name.

#### Response `200 OK`

```json
{
  "data": [
    {
      "id": "1",
      "name": "Acme Corporation",
      "logo": "https://example.com/logos/acme.png",
      "url": "https://acme.com",
      "bio": "A global leader in technology solutions.",
      "tier": "gold"
    },
    {
      "id": "2",
      "name": "Beta Tech",
      "logo": "https://example.com/logos/beta.png",
      "url": "https://betatech.io",
      "bio": "Empowering the next generation of developers.",
      "tier": "silver"
    }
  ],
  "total": 2
}
```

**Partner object fields:**

| Field  | Type   | Description                                        |
|--------|--------|----------------------------------------------------|
| `id`   | string | Partner UUID                                       |
| `name` | string | Partner organization name                          |
| `logo` | string | Logo URL or base64-encoded image                   |
| `url`  | string | Partner website URL                                |
| `bio`  | string | Short description of the organization              |
| `tier` | string | `bronze` \| `silver` \| `gold` \| `platinum`       |

#### Error Responses

| Status | Code            | Reason       |
|--------|-----------------|--------------|
| `500`  | `INTERNAL_ERROR`| Server error |

---

### `POST /partners`

Add a new partner organization.  
Requires **admin** role.

#### Request Body

| Field  | Type   | Required | Description                                  |
|--------|--------|----------|----------------------------------------------|
| `name` | string | Yes      | Partner organization name (must be unique)   |
| `logo` | string | Yes      | Logo URL or base64-encoded image             |
| `url`  | string | Yes      | Partner website URL                          |
| `bio`  | string | Yes      | Short description of the organization        |
| `tier` | string | Yes      | `bronze` \| `silver` \| `gold` \| `platinum` |

#### Response `201 Created`

```json
{
  "partner": {
    "id": "3",
    "name": "CloudBase Inc.",
    "logo": "https://example.com/logos/cloudbase.png",
    "url": "https://cloudbase.io",
    "bio": "Cloud infrastructure for modern teams.",
    "tier": "platinum"
  }
}
```

#### Error Responses

| Status | Code               | Reason                                            |
|--------|--------------------|---------------------------------------------------|
| `400`  | `VALIDATION_ERROR` | One or more required fields missing               |
| `400`  | `VALIDATION_ERROR` | `tier` is not one of the accepted values          |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token                          |
| `403`  | `FORBIDDEN`        | Authenticated user is not admin                   |
| `409`  | `CONFLICT`         | A partner with that name already exists           |
| `500`  | `INTERNAL_ERROR`   | Server error                                      |

---

## Related

- [Authentication](./API_AUTHENTICATION.md) — Login and token management
- [Admin User Management](./API_ADMIN.md) — Admin-only operations
