# Authentication API

## Overview

User accounts are **created by admins only** — there is no public self-registration.  
The admin creates an account with a generated **temporary password** and shares it with the user.  
On first login the user receives a `requiresPasswordChange: true` flag and **must call `POST /auth/change-password`** before accessing the rest of the system.

---

## Authorization Header

All protected endpoints require a valid JWT access token:

```
Authorization: Bearer <token>
```

---

## Endpoints

---

### `POST /auth/login`

Authenticate a user and return tokens.  
Accepts both the user's permanent password and their temporary password (first-time login).

#### Request Body

| Field      | Type   | Required | Description               |
|------------|--------|----------|---------------------------|
| `email`    | string | Yes      | Registered student email  |
| `password` | string | Yes      | Permanent or temporary password |

#### Response `200 OK`

```json
{
  "success": true,
  "token": "<jwt-access-token>",
  "refreshToken": "<jwt-refresh-token>",
  "user": {
    "id": 1,
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz",
    "studentId": "2022-100001",
    "yearLevel": 2,
    "course": "BSIT",
    "role": "member",
    "requiresPasswordChange": true
  }
}
```

> **Note:** If `requiresPasswordChange` is `true`, the frontend must redirect the user to a change-password screen. The user must call `POST /auth/change-password` before accessing any other feature.

#### Token Expiry

| Token          | Expiry |
|----------------|--------|
| `token`        | 24 hours |
| `refreshToken` | 30 days  |

#### Error Responses

| Status | Code            | Reason                          |
|--------|-----------------|---------------------------------|
| `400`  | `VALIDATION_ERROR` | Email or password missing    |
| `401`  | `UNAUTHORIZED`  | Invalid email or password       |
| `500`  | `INTERNAL_ERROR`| Server error                    |

---

### `POST /auth/change-password`

Change the authenticated user's password.  
**Required on first login** when `requiresPasswordChange` is `true`.  
Requires `Authorization: Bearer <token>`.

#### Request Body

| Field         | Type   | Required | Description                                          |
|---------------|--------|----------|------------------------------------------------------|
| `newPassword` | string | Yes      | Min 8 characters, at least 1 uppercase, 1 number    |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

After a successful password change:
- The temporary password is **cleared**
- `requiresPasswordChange` is set to `false`
- The user can now access all features normally

#### Error Responses

| Status | Code               | Reason                          |
|--------|--------------------|---------------------------------|
| `400`  | `VALIDATION_ERROR` | Password missing or too weak    |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token        |
| `404`  | `NOT_FOUND`        | User not found                  |
| `500`  | `INTERNAL_ERROR`   | Server error                    |

---

### `POST /auth/refresh`

Exchange an expired or expiring access token for a new one using the refresh token.

#### Request Body

| Field          | Type   | Required | Description            |
|----------------|--------|----------|------------------------|
| `refreshToken` | string | Yes      | Valid JWT refresh token |

#### Response `200 OK`

```json
{
  "success": true,
  "token": "<new-jwt-access-token>",
  "refreshToken": "<new-jwt-refresh-token>"
}
```

#### Error Responses

| Status | Code           | Reason                                  |
|--------|----------------|-----------------------------------------|
| `400`  | `VALIDATION_ERROR` | Refresh token missing               |
| `401`  | `UNAUTHORIZED` | Token invalid, expired, or user deleted |

---

### `POST /auth/logout`

Invalidate the current session. Requires `Authorization: Bearer <token>`.

#### Request Body

| Field          | Type   | Required | Description                   |
|----------------|--------|----------|-------------------------------|
| `refreshToken` | string | Yes      | Refresh token to invalidate   |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### `PUT /auth/profile`

Update the authenticated user's full name. Requires `Authorization: Bearer <token>`.

#### Request Body

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `fullName` | string | Yes      | Updated display name |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz",
    "studentId": "2022-100001",
    "yearLevel": 2,
    "course": "BSIT",
    "role": "member"
  }
}
```

#### Error Responses

| Status | Code               | Reason                            |
|--------|--------------------|-----------------------------------|
| `400`  | `VALIDATION_ERROR` | `fullName` missing or empty       |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token          |
| `404`  | `NOT_FOUND`        | User not found                    |
| `500`  | `INTERNAL_ERROR`   | Server error                      |

---

## First-Login Flow

```
Admin creates user  ──▶  POST /admin/users
                         Returns temporary password
          │
          ▼
User logs in with      ──▶  POST /auth/login
temporary password          Response: requiresPasswordChange = true
          │
          ▼
Frontend intercepts    ──▶  Show change-password screen
requiresPasswordChange
          │
          ▼
User sets new password ──▶  POST /auth/change-password
                             Bearer <token from login>
          │
          ▼
          ✓  requiresPasswordChange = false
             User accesses system normally
```

---

## Removed Endpoint

| Endpoint              | Status  | Reason                                              |
|-----------------------|---------|-----------------------------------------------------|
| `POST /auth/register` | Removed | Users no longer self-register. Admin creates all accounts via `POST /admin/users`. |

---

## Related

- [Admin User Management](./API_ADMIN.md) — `POST /admin/users`, `POST /admin/users/bulk/import`, `POST /admin/users/bulk-reset`
