# API Discrepancy Report

This report documents API contract gaps and mismatches found while refactoring admin pages.

Scope:
- `client/src/pages/admin/dashboard.tsx`
- `client/src/pages/admin/create-guilds.tsx`
- `client/src/pages/admin/guild-details.tsx`
- Existing contract files under `client/src/Updated API Contract/`

Date: 2026-04-30

---

## Executive Summary

| Metric | Count |
|---|---:|
| Endpoints reviewed | 12 |
| Fully aligned | 6 |
| Partially aligned | 4 |
| Missing or ambiguous | 2 |
| Critical discrepancies | 2 |

---

## Endpoint Alignment Matrix

| Endpoint | Used By Frontend | Contract Status | Frontend Status | Severity | Notes |
|---|---|---|---|---|---|
| `GET /guilds` | Create Guilds list | Defined in `API_GUILDS.md` | Implemented with base/fallback | Low | Response normalization needed for optional fields |
| `POST /guilds` | Create Guilds submit | Defined in `API_GUILDS_ADMIN.md` | Implemented during refactor | Medium | `status` is frontend-only and not contract-defined |
| `POST /guilds/:slug/banner` | Create Guilds, Guild Profile | Defined in `API_GUILDS_ADMIN.md` | Implemented during refactor | Low | Multipart handling now aligned |
| `GET /admin/users?role=officer` | Lead select dropdown | Defined in `API_GUILDS_ADMIN.md` and `API_ADMIN.md` | Implemented with fallback list | Low | Added API-first with fallback officers |
| `GET /guilds/:slug` | Guild details | Defined in `API_GUILDS.md` | Implemented | Medium | Contract uses `leads[]`; UI relies on single displayed lead |
| `PUT /guilds/:slug` | Save guild profile | Defined in `API_GUILDS_ADMIN.md` | Implemented during refactor | Low | Payload now follows partial update contract |
| `GET /guilds/:slug/resources` | Guild resources tab | Defined in `API_GUILDS.md` | Implemented | Medium | Frontend tolerates `skillLevel` and `level`; contract only documents `level` |
| `GET /admin/guilds/:slug/applications` | Guild applications table | Recommended in `API_GUILDS_ADMIN.md` | Not implemented | High | UI currently relies on mock data |
| `POST /admin/guilds/:slug/applications/:applicationId/approve` | Approve action | Recommended in `API_GUILDS_ADMIN.md` | Not implemented | High | UI status updates are local-only |
| `POST /admin/guilds/:slug/applications/:applicationId/reject` | Reject action | Recommended in `API_GUILDS_ADMIN.md` | Not implemented | High | UI status updates are local-only |
| `GET /users?pageSize=5` | Dashboard members | Implied by users contract files | Implemented | Low | Works as list endpoint integration |
| `GET /events?...` | Dashboard stats/events | Defined in events contract | Implemented | Low | Fallback logic present |

---

## Critical Discrepancies

### 1. Guild application admin workflow is not contract-complete

Severity: High

Current behavior:
- Members tab in guild details uses local mock applications and local status mutation.

Missing contract coverage for actual implementation path:
- `GET /admin/guilds/:slug/applications`
- `POST /admin/guilds/:slug/applications/:applicationId/approve`
- `POST /admin/guilds/:slug/applications/:applicationId/reject`

Impact:
- Approve/reject actions do not persist server-side.
- Dashboard and learn sync cannot be trusted in multi-user scenarios.

Suggested response shape for listing applications:

```json
{
  "data": [
    {
      "applicationId": "app-123",
      "userId": "user-001",
      "name": "Juan Dela Cruz",
      "studentId": "2026-000001",
      "email": "juan@students.nu-laguna.edu.ph",
      "course": "BS INFORMATION TECHNOLOGY",
      "status": "pending",
      "submittedAt": "2026-03-16T08:00:00.000Z",
      "whyJoin": "...",
      "motivation": "...",
      "experience": "...",
      "portfolioUrl": "https://..."
    }
  ],
  "total": 1
}
```

Suggested approve/reject response shape:

```json
{
  "success": true,
  "application": {
    "applicationId": "app-123",
    "status": "approved"
  }
}
```

### 2. Lead model shape is split between `leaderName` and `leads[]`

Severity: High

Observed contract behavior:
- `GET /guilds` documents `leaderName`.
- `GET /guilds/:slug` documents `leads` array objects.

Frontend impact:
- UI edit forms expect single `leadId` and single display name.
- Additional leads in `leads[]` are currently reduced to first lead for edit/display.

Suggested contract clarification:
- Keep `leaderName` for lightweight list endpoints.
- Define canonical editable lead field for admin update payload:
  - Option A: single `leadId`
  - Option B: `leadIds: string[]`
- Define deterministic mapping to public fields.

---

## Medium Discrepancies

### 1. Guild status field is UI-only

Current frontend form has `status: "Active" | "Inactive"`.

Contract gap:
- `POST /guilds` and `PUT /guilds/:slug` in current contract do not define a `status` field.

Recommendation:
- Either formalize `status` in guild contract and storage model, or remove it from frontend payload and treat as local-only draft metadata.

### 2. Resource level field naming ambiguity

Current frontend accepts both:
- `level`
- `skillLevel`

Contract defines only:
- `level`

Recommendation:
- Standardize to `level` only and mark `skillLevel` as legacy fallback if needed.

---

## Suggested Payload Alignment

### Create guild payload (recommended)

```json
{
  "name": "Website Development Guild",
  "slug": "website-development-guild",
  "description": "Frontend and backend web engineering guild.",
  "leadId": "officer-maria-santos",
  "badges": [
    { "label": "Frontend", "variant": "info" },
    { "label": "Backend", "variant": "destructive" }
  ],
  "bannerPosition": 0
}
```

### Update guild payload (recommended)

```json
{
  "name": "Website Development Guild",
  "description": "Updated description",
  "leadId": "officer-maria-santos",
  "badges": [
    { "label": "Frontend", "variant": "info" }
  ],
  "bannerPosition": 12
}
```

### Banner upload payload (recommended)

Multipart form data fields:
- `banner`: file
- `bannerPosition`: integer string

---

## Non-Breaking Contract Improvements

1. Add explicit badge variant enum in contract examples and schema notes.
2. Add application listing and mutation response schemas under admin guilds contract.
3. Add lead cardinality note (single vs multi-lead) and update write payload docs accordingly.
4. Add optional backward-compat note for legacy `skillLevel` if backend still emits it.

---

## Notes

- Existing contract markdown files were intentionally not modified.
- This report is additive and intended for frontend-backend sync discussion before merge.
