# Users & Members API

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

Endpoints for reading and managing user profiles and member lists.  
Most endpoints require a valid JWT access token:

```
Authorization: Bearer <token>
```

Role requirements are noted per endpoint.

---

## Endpoints

---

### `GET /users/me`

Get the authenticated user's full profile, including their QR code and guild memberships.  
Requires `Authorization: Bearer <token>`.

#### Response `200 OK`

```json
{
  "user": {
    "id": "1",
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz",
    "studentId": "2022-100001",
    "yearLevel": 2,
    "course": "BSIT",
    "role": "member",
    "qrCode": "data:image/png;base64,<base64-encoded-qr>",
    "memberSince": "2026-03-07T10:00:00.000Z",
    "profilePhoto": "/uploads/profile-photos/photo-123.jpg",
    "emergencyContact": "Jane Dela Cruz — 09171234567",
    "contactNumber": "09171234567",
    "requiresPasswordChange": false,
    "guilds": [
      { "id": "1", "name": "Tech Guild", "slug": "tech-guild" }
    ]
  }
}
```

> **Note:** `qrCode` is a full `data:image/png;base64,…` URI ready to render directly in an `<img>` tag.  
> `profilePhoto` and `emergencyContact` may be `null` if not yet set.

#### Error Responses

| Status | Code            | Reason                    |
|--------|-----------------|---------------------------|
| `401`  | `UNAUTHORIZED`  | Missing or invalid token  |
| `404`  | `NOT_FOUND`     | User not found            |
| `500`  | `INTERNAL_ERROR`| Server error              |

---

### `PATCH /users/me`

Update the authenticated user's own profile fields.  
Requires `Authorization: Bearer <token>`.  
All fields are optional — only send what needs to change.

#### Request Body

| Field              | Type    | Required | Description                             |
|--------------------|---------|----------|-----------------------------------------|
| `fullName`         | string  | No       | Updated full name                       |
| `yearLevel`        | integer | No       | Updated year level (1–4)                |
| `course`           | string  | No       | Updated course/program                  |
| `profilePhoto`     | string  | No       | URL or path to profile image            |
| `emergencyContact` | string  | No       | Emergency contact name and number       |
| `contactNumber`    | string  | No       | Personal contact number                 |

#### Response `200 OK`

Returns the full updated user object — same shape as `GET /users/me`.

```json
{
  "user": {
    "id": "1",
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz",
    "studentId": "2022-100001",
    "yearLevel": 2,
    "course": "BSIT",
    "role": "member",
    "qrCode": "data:image/png;base64,<base64-encoded-qr>",
    "memberSince": "2026-03-07T10:00:00.000Z",
    "profilePhoto": null,
    "emergencyContact": null,
    "contactNumber": null,
    "requiresPasswordChange": false,
    "guilds": []
  }
}
```

#### Error Responses

| Status | Code            | Reason                    |
|--------|-----------------|---------------------------|
| `401`  | `UNAUTHORIZED`  | Missing or invalid token  |
| `500`  | `INTERNAL_ERROR`| Server error              |

---

### `POST /users/me/photo`

Upload a profile photo for the authenticated user.  
Requires `Authorization: Bearer <token>`.  
Request must be `multipart/form-data`.

#### Request Body (form-data)

| Field   | Type | Required | Description                             |
|---------|------|----------|-----------------------------------------|
| `photo` | file | Yes      | Image file (JPEG, PNG, etc.; max 5 MB)  |

#### Response `200 OK`

```json
{
  "profilePhoto": "/uploads/profile-photos/photo-1741234567-abc123.jpg",
  "message": "Profile photo uploaded successfully"
}
```

#### Error Responses

| Status | Code            | Reason                        |
|--------|-----------------|-------------------------------|
| `400`  | `NO_FILE`       | No file included in request   |
| `401`  | `UNAUTHORIZED`  | Missing or invalid token      |
| `500`  | `UPLOAD_ERROR`  | Failed to save file           |

---

### `GET /users/avatars`

Get the list of built-in avatar presets a user can choose from.  
Requires `Authorization: Bearer <token>`.

#### Response `200 OK`

```json
{
  "avatars": [
    { "id": "avatar-1",  "name": "Avatar 1",  "path": "https://api.msc-nulaguna.org/avatars/avatar-1.svg" },
    { "id": "avatar-2",  "name": "Avatar 2",  "path": "https://api.msc-nulaguna.org/avatars/avatar-2.svg" },
    "...",
    { "id": "avatar-12", "name": "Avatar 12", "path": "https://api.msc-nulaguna.org/avatars/avatar-12.svg" }
  ]
}
```

> 12 presets are available (`avatar-1` through `avatar-12`).

#### Error Responses

| Status | Code            | Reason                    |
|--------|-----------------|---------------------------|
| `401`  | `UNAUTHORIZED`  | Missing or invalid token  |
| `500`  | `INTERNAL_ERROR`| Server error              |

---

### `POST /users/me/avatar`

Select a built-in avatar preset as the user's profile photo.  
Requires `Authorization: Bearer <token>`.

#### Request Body

| Field      | Type   | Required | Description                             |
|------------|--------|----------|-----------------------------------------|
| `avatarId` | string | Yes      | ID from `GET /users/avatars` (e.g. `"avatar-3"`) |

#### Response `200 OK`

Returns the full updated user object — same shape as `GET /users/me`.

```json
{
  "user": {
    "id": "1",
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz",
    "studentId": "2022-100001",
    "yearLevel": 2,
    "course": "BSIT",
    "role": "member",
    "qrCode": "data:image/png;base64,<base64-encoded-qr>",
    "memberSince": "2026-03-07T10:00:00.000Z",
    "profilePhoto": "http://localhost:5000/avatars/avatar-3.svg",
    "emergencyContact": null,
    "contactNumber": null,
    "guilds": []
  }
}
```

#### Error Responses

| Status | Code               | Reason                          |
|--------|--------------------|---------------------------------|
| `400`  | `INVALID_AVATAR`   | `avatarId` not provided         |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token        |
| `404`  | `AVATAR_NOT_FOUND` | Avatar ID does not exist        |
| `500`  | `INTERNAL_ERROR`   | Server error                    |

---

### `GET /users`

Get a paginated list of all members.  
Requires **officer** or **admin** role.

#### Query Parameters

| Param      | Type    | Required | Description                                      |
|------------|---------|----------|--------------------------------------------------|
| `page`     | integer | No       | Page number (default: `1`)                       |
| `pageSize` | integer | No       | Results per page, max `100` (default: `20`)      |
| `role`     | string  | No       | Filter by role: `member` \| `officer` \| `admin` |
| `guild`    | string  | No       | Filter by guild slug                             |

#### Response `200 OK`

```json
{
  "data": [
    {
      "id": "1",
      "email": "student@students.nu-laguna.edu.ph",
      "fullName": "Juan Dela Cruz",
      "studentId": "2022-100001",
      "yearLevel": 2,
      "course": "BSIT",
      "role": "member",
      "requiresPasswordChange": false,
      "qrCode": "<base64-string>",
      "memberSince": "2026-03-07T10:00:00.000Z",
      "guilds": [
        { "id": "1", "name": "Tech Guild", "slug": "tech-guild" }
      ]
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 20
}
```

> **Note:** `qrCode` in list responses is a compact Base64 string (`USER:<id>:<studentId>`), not a full image data URI. Use `GET /users/me` for the rendered QR image.

#### Error Responses

| Status | Code            | Reason                         |
|--------|-----------------|--------------------------------|
| `401`  | `UNAUTHORIZED`  | Missing or invalid token       |
| `403`  | `FORBIDDEN`     | Insufficient role              |
| `500`  | `INTERNAL_ERROR`| Server error                   |

---

### `PATCH /users/:userId/role`

Change a user's role.  
Requires **admin** role.

#### Path Parameters

| Param    | Type   | Required | Description  |
|----------|--------|----------|--------------|
| `userId` | string | Yes      | User ID      |

#### Request Body

| Field  | Type   | Required | Description                              |
|--------|--------|----------|------------------------------------------|
| `role` | string | Yes      | `member` \| `officer` \| `admin`         |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "User role updated to 'officer'",
  "user": {
    "id": "5",
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Maria Santos",
    "studentId": "2022-100005",
    "role": "officer"
  }
}
```

#### Error Responses

| Status | Code               | Reason                              |
|--------|--------------------|-------------------------------------|
| `400`  | `VALIDATION_ERROR` | Invalid or missing role             |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token            |
| `403`  | `FORBIDDEN`        | Authenticated user is not admin     |
| `404`  | `NOT_FOUND`        | User not found                      |
| `500`  | `INTERNAL_ERROR`   | Server error                        |

---

### `POST /users/:userId/deactivate`

Deactivate a user account (sets `isActive` to `false`).  
Requires **admin** role.

#### Path Parameters

| Param    | Type   | Required | Description |
|----------|--------|----------|-------------|
| `userId` | string | Yes      | User ID     |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": {
    "id": "5",
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Maria Santos",
    "studentId": "2022-100005"
  }
}
```

#### Error Responses

| Status | Code            | Reason                         |
|--------|-----------------|--------------------------------|
| `401`  | `UNAUTHORIZED`  | Missing or invalid token       |
| `403`  | `FORBIDDEN`     | Authenticated user is not admin|
| `404`  | `NOT_FOUND`     | User not found                 |
| `500`  | `INTERNAL_ERROR`| Server error                   |

---

## Related

- [Authentication](./API_AUTHENTICATION.md) — Login, change-password, refresh, logout
- [Admin User Management](./API_ADMIN.md) — Create users, bulk import, password resets
