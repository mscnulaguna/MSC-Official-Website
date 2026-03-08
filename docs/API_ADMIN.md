# Admin — User Management API

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

All endpoints require `Authorization: Bearer <token>` with **admin** role.

---

### `POST /admin/users`

Create a single user account with a system-generated temporary password.  
The user must change their password on first login.

#### Request Body

| Field       | Type    | Required | Description                                      |
|-------------|---------|----------|--------------------------------------------------|
| `email`     | string  | Yes      | Must end with `@students.nu-laguna.edu.ph`       |
| `fullName`  | string  | Yes      | Full name of the student                         |
| `studentId` | string  | Yes      | University student ID (must be unique)           |
| `yearLevel` | integer | Yes      | Year level (1–4)                                 |
| `course`    | string  | Yes      | Course/program enrolled in                       |
| `role`      | string  | No       | `member` (default) \| `officer` \| `admin`       |

#### Response `201 Created`

```json
{
  "success": true,
  "message": "User created successfully with temporary password",
  "user": {
    "id": 12,
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz",
    "studentId": "2022-100010",
    "yearLevel": 2,
    "course": "BSIT",
    "role": "member"
  },
  "temporaryPassword": "Temp4821xKpQ",
  "note": "Share this temporary password with the user. They will be required to change it on first login."
}
```

#### Error Responses

| Status | Code               | Reason                                |
|--------|--------------------|---------------------------------------|
| `400`  | `VALIDATION_ERROR` | Missing required field or bad email   |
| `409`  | `CONFLICT`         | Email or student ID already exists    |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token              |
| `403`  | `FORBIDDEN`        | Authenticated user is not admin       |
| `500`  | `INTERNAL_ERROR`   | Server error                          |

---

### `POST /admin/users/bulk/import`

Create multiple user accounts at once from CSV data.  
Each user gets a unique temporary password.

#### Request Body

```json
{
  "users": [
    {
      "email": "student1@students.nu-laguna.edu.ph",
      "fullName": "Maria Santos",
      "studentId": "2022-100011",
      "yearLevel": 3,
      "course": "BSCS",
      "role": "member"
    }
  ]
}
```

| Field           | Type  | Required | Description                          |
|-----------------|-------|----------|--------------------------------------|
| `users`         | array | Yes      | Array of user objects (same fields as single create) |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Successfully created 2 users",
  "created": 2,
  "failed": 1,
  "results": [
    {
      "email": "student1@students.nu-laguna.edu.ph",
      "fullName": "Maria Santos",
      "studentId": "2022-100011",
      "temporaryPassword": "Temp7741aBcD"
    }
  ],
  "errors": [
    {
      "row": 2,
      "email": "student2@students.nu-laguna.edu.ph",
      "error": "Email already registered"
    }
  ]
}
```

---

### `GET /admin/users`

Get a paginated list of all users.

#### Query Parameters

| Param      | Type    | Default | Description                              |
|------------|---------|---------|------------------------------------------|
| `page`     | integer | `1`     | Page number                              |
| `pageSize` | integer | `20`    | Results per page                         |
| `role`     | string  | —       | Filter by role: `member`, `officer`, `admin` |

#### Response `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "student@students.nu-laguna.edu.ph",
      "fullName": "Juan Dela Cruz",
      "studentId": "2022-100001",
      "yearLevel": 2,
      "course": "BSIT",
      "role": "member",
      "isActive": true,
      "requiresPasswordChange": false,
      "created_at": "2026-03-07T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

---

### `GET /admin/users/:userId`

Get full details for a single user.

#### Response `200 OK`

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz",
    "studentId": "2022-100001",
    "yearLevel": 2,
    "course": "BSIT",
    "role": "member",
    "isActive": true,
    "requiresPasswordChange": false,
    "created_at": "2026-03-07T10:00:00.000Z",
    "updated_at": "2026-03-07T10:00:00.000Z"
  }
}
```

---

### `PUT /admin/users/:userId`

Update a user's details (fullName, yearLevel, course).

#### Request Body

| Field       | Type    | Required | Description           |
|-------------|---------|----------|-----------------------|
| `fullName`  | string  | No       | Updated full name     |
| `yearLevel` | integer | No       | Updated year level    |
| `course`    | string  | No       | Updated course        |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": { ... }
}
```

---

### `GET /admin/users/:userId/temporary-password`

Retrieve the current temporary password for a user who has not yet logged in.  
Temporary passwords **expire after 24 hours**.

#### Response `200 OK`

```json
{
  "success": true,
  "user": {
    "id": 12,
    "email": "student@students.nu-laguna.edu.ph",
    "fullName": "Juan Dela Cruz"
  },
  "temporaryPassword": "Temp4821xKpQ",
  "note": "Share this temporary password with the user. They will be required to change it on first login."
}
```

#### Error Responses

| Status | Code                   | Reason                                          |
|--------|------------------------|-------------------------------------------------|
| `400`  | `NO_TEMP_PASSWORD`     | User already changed their password             |
| `400`  | `TEMP_PASSWORD_EXPIRED`| Temporary password older than 24h, reset needed |

---

### `POST /admin/users/send-credentials`

Send a welcome email containing login credentials to one or more selected users.  
Uses the user's existing temporary password if they have not logged in yet; generates a fresh one if they already changed it.  
Emails are delivered to the student's `@students.nu-laguna.edu.ph` Outlook inbox via the configured SMTP sender.

> Requires `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` to be set in `.env`. Silently skips if SMTP is not configured.

#### Request Body

| Field     | Type              | Required | Description                       |
|-----------|-------------------|----------|-----------------------------------|
| `userIds` | array of integers | Yes      | IDs of users to email credentials |

```json
{
  "userIds": [3, 7, 12]
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Credentials sent to 3 user(s)",
  "sent": 3,
  "failed": 0,
  "results": [
    {
      "userId": "3",
      "email": "student@students.nu-laguna.edu.ph",
      "fullName": "Juan Dela Cruz"
    }
  ]
}
```

If some emails failed:

```json
{
  "success": true,
  "message": "Credentials sent to 2 user(s)",
  "sent": 2,
  "failed": 1,
  "results": [ ... ],
  "errors": [
    { "userId": "12", "error": "Invalid login: 535 Authentication failed" }
  ]
}
```

#### Error Responses

| Status | Code               | Reason                          |
|--------|--------------------|---------------------------------|
| `400`  | `VALIDATION_ERROR` | `userIds` missing or empty      |
| `401`  | `UNAUTHORIZED`     | Missing or invalid token        |
| `403`  | `FORBIDDEN`        | Authenticated user is not admin |
| `500`  | `INTERNAL_ERROR`   | Server error                    |

---

### `POST /admin/users/bulk-reset`

Reset passwords for multiple users at once. Each user gets a new temporary password and `requiresPasswordChange` is set back to `true`.

#### Request Body

| Field     | Type             | Required | Description              |
|-----------|------------------|----------|--------------------------|
| `userIds` | array of integers | Yes     | IDs of users to reset    |

```json
{
  "userIds": [3, 7, 12]
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Reset passwords for 3 user(s)",
  "reset": 3,
  "failed": 0,
  "results": [
    {
      "userId": 3,
      "email": "student@students.nu-laguna.edu.ph",
      "fullName": "Juan Dela Cruz",
      "temporaryPassword": "Temp3310mZqR"
    }
  ]
}
```

---

## Related

- [Authentication](./API_AUTHENTICATION.md) — Login, change-password, refresh, logout
