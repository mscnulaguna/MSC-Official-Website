# Section 9 — SharePoint Membership Tracker Integration

Syncs MSC Laguna member data to a Microsoft SharePoint list via the **Microsoft Graph API** (OAuth 2.0 client credentials flow). The website is the authoritative source for all fields except **IsActive**, which SharePoint officers may toggle directly in the tracker.

---

## 9.1 Environment Setup

Add the following variables to your `.env` file before using any SharePoint endpoints.

| Variable | Description |
|---|---|
| `SP_TENANT_ID` | Azure AD tenant (directory) ID |
| `SP_CLIENT_ID` | Azure AD app (client) ID |
| `SP_CLIENT_SECRET` | Azure AD app client secret |
| `SP_SITE_ID` | SharePoint site ID (from Graph API) |
| `SP_LIST_ID` | SharePoint list ID (from Graph API) |
| `SP_HOSTNAME` | SharePoint hostname, e.g. `contoso.sharepoint.com` *(used for display URLs only)* |
| `SP_SITE_PATH` | SharePoint site path, e.g. `sites/MSC` *(used for display URLs only)* |

### Getting the Site ID and List ID

```http
# 1. Find site ID by hostname + path
GET https://graph.microsoft.com/v1.0/sites/{hostname}:/{sitePath}

# 2. Find list ID by display name
GET https://graph.microsoft.com/v1.0/sites/{siteId}/lists?$filter=displayName eq 'Members'
```

---

## 9.2 SharePoint List Schema

Create a SharePoint list named **Members** with these columns:

| Column (Internal Name) | Type | Source | Ownership |
|---|---|---|---|
| `StudentID` | Single line | `users.studentId` | Website |
| `FullName` | Single line | `users.fullName` | Website |
| `Email` | Single line | `users.email` | Website |
| `YearLevel` | Single line | `users.yearLevel` | Website |
| `Course` | Single line | `users.course` | Website |
| `Role` | Single line | `users.role` | Website |
| `Guilds` | Single line | Guild names, comma-separated | Website |
| `MemberSince` | Date/Time (ISO) | `users.created_at` | Website |
| `LastSynced` | Date/Time (ISO) | Set on every sync | Website |
| `IsActive` | Yes/No | `true` on creation only | **SharePoint** |

> **Conflict resolution:** All columns are website-owned and overwritten on every sync **except** `IsActive`. Officers may deactivate members directly in the tracker. `IsActive` is only written by the API on user creation and on explicit admin deactivation (`PATCH /users/:id/deactivate`).

---

## 9.3 Authentication & Token Cache

Tokens are fetched once from:

```
POST https://login.microsoftonline.com/{SP_TENANT_ID}/oauth2/v2.0/token
```

with `grant_type=client_credentials` and `scope=https://graph.microsoft.com/.default`.

The token is **cached in memory for 55 minutes** (5-minute safety buffer before the 60-minute TTL). On a 401/403 response the cache is invalidated and a fresh token is fetched automatically.

---

## 9.4 Automatic Sync Triggers

The following website actions automatically fire a **background (fire-and-forget) sync**. Failures are logged but never block the user-facing response.

| Trigger | Fields Updated |
|---|---|
| `POST /admin/users` — new user created | All fields (new SharePoint item created) |
| `PATCH /users/me` — member updates profile | `FullName`, `YearLevel`, `Course`, `LastSynced` |
| `PATCH /users/:id/role` — admin changes role | `Role`, `LastSynced` |
| `PATCH /users/:id/deactivate` — admin deactivates | `IsActive = false`, `LastSynced` |
| Guild application approved | `Guilds`, `LastSynced` |

---

## 9.5 Manual Sync Endpoints

All endpoints require **Authentication: Bearer `<token>`** and **Role: admin**.

---

### Sync a Single User

```
POST /api/v1/integrations/sharepoint/sync/:userId
```

Manually upsert one user's data to SharePoint. Looks up the user's `StudentID`, finds an existing SharePoint item, and either creates or patches it.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | MSC database user ID |

**Success Response `200 OK`**

```json
{
  "userId": "42",
  "sharePointItemId": "12",
  "action": "updated",
  "syncedAt": "2025-07-10T14:30:00.000Z"
}
```

`action` is either `"created"` or `"updated"`.

**Error Responses**

| Status | Code | Meaning |
|---|---|---|
| `404` | `NOT_FOUND` | User does not exist in database |
| `500` | `SP_AUTH_FAILED` | Missing or invalid Graph API credentials |
| `500` | `SP_SITE_NOT_FOUND` | `SP_SITE_ID` not set in environment |
| `500` | `SP_LIST_NOT_FOUND` | `SP_LIST_ID` not set in environment |
| `500` | `SP_COLUMN_MISMATCH` | SharePoint list schema does not match spec |
| `500` | `SP_RATE_LIMITED` | Graph API throttling (429) |
| `500` | `SP_SYNC_FAILED` | Unexpected Graph API error |

---

### Bulk Sync All Members

```
POST /api/v1/integrations/sharepoint/sync/bulk
```

Queues all active users for background synchronisation and immediately returns a `jobId`. Use `GET /jobs/:jobId` to poll progress.

**Request Body**

```json
{
  "overwrite": false
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `overwrite` | boolean | `false` | `true` = force-write all fields; `false` = standard upsert (both modes use the same SharePoint upsert logic; this field is reserved for future partial-skip optimisation) |

**Success Response `200 OK`**

```json
{
  "queued": 145,
  "jobId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Error Responses**

| Status | Code | Meaning |
|---|---|---|
| `500` | `SP_AUTH_FAILED` | Cannot obtain Graph token |
| `500` | `SP_SITE_NOT_FOUND` | `SP_SITE_ID` not configured |

---

### Get Bulk Job Status

```
GET /api/v1/integrations/sharepoint/jobs/:jobId
```

Poll the progress of a bulk sync job started with `POST /sync/bulk`.

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `jobId` | string | UUID returned by `POST /sync/bulk` |

**Success Response `200 OK`**

```json
{
  "jobId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "running",
  "total": 145,
  "processed": 62,
  "errors": [
    { "userId": "17", "message": "SP_COLUMN_MISMATCH — verify list schema matches spec" }
  ],
  "completedAt": null
}
```

**`status` values**

| Value | Meaning |
|---|---|
| `pending` | Job created, not yet started |
| `running` | Actively syncing users |
| `completed` | All users processed (some may have errors) |
| `failed` | Every single user failed to sync |

> **Note:** In-memory jobs are lost on server restart. Long-running bulk syncs should be monitored before restarting the process.

**Error Responses**

| Status | Code | Meaning |
|---|---|---|
| `404` | `NOT_FOUND` | No job found with that ID |

---

### Get SharePoint Connection Status

```
GET /api/v1/integrations/sharepoint/status
```

Check whether the Graph API token can be obtained and return metadata about the Members list.

**Success Response `200 OK` — Connected**

```json
{
  "connected": true,
  "error": null,
  "lastSyncAt": "2025-07-10T14:30:00.000Z",
  "totalSynced": 145,
  "listUrl": "https://contoso.sharepoint.com/sites/MSC/Lists/Members"
}
```

**Success Response `200 OK` — Not Connected**

```json
{
  "connected": false,
  "error": "SP_AUTH_FAILED",
  "lastSyncAt": null,
  "totalSynced": 0,
  "listUrl": "https://your-tenant.sharepoint.com/sites/MSC/Lists/<SP_LIST_ID>"
}
```

---

## 9.6 Error Code Reference

| Code | HTTP | Cause | Resolution |
|---|---|---|---|
| `SP_AUTH_FAILED` | 500 | `SP_TENANT_ID`, `SP_CLIENT_ID`, or `SP_CLIENT_SECRET` missing / wrong, or token request rejected | Check Azure AD app credentials and API permissions (`Sites.ReadWrite.All`) |
| `SP_SITE_NOT_FOUND` | 500 | `SP_SITE_ID` not set | Set `SP_SITE_ID` in `.env` |
| `SP_LIST_NOT_FOUND` | 500 | `SP_LIST_ID` not set | Set `SP_LIST_ID` in `.env` |
| `SP_COLUMN_MISMATCH` | 500 | Graph returned `invalidRequest` — a column name in the payload does not exist on the list | Verify all column internal names match the schema in §9.2 |
| `SP_RATE_LIMITED` | 500 | Graph API returned HTTP 429 | Automatic retry-after backoff in bulk jobs; for manual sync, retry after the indicated delay |
| `SP_SYNC_FAILED` | 500 | Unexpected Graph API error | Check server logs for the underlying HTTP error |

---

## 9.7 Required Azure AD Permissions

The registered app needs the following **Application** (not Delegated) permission in Azure Active Directory:

| API | Permission | Type |
|---|---|---|
| Microsoft Graph | `Sites.ReadWrite.All` | Application |

After granting the permission, an admin must click **Grant admin consent**.
