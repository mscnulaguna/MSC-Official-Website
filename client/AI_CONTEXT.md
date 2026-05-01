# 🧠 MSC OFFICIAL WEBSITE - COMPLETE AI CONTEXT (STRICT)

This document is the FULL source of truth for frontend development.
DO NOT deviate from this contract.

---

# 🌐 BASE CONFIG

BASE_URL = "https://api.msc-nulaguna.org/v1"
FALLBACK = "/api"

Protocol: HTTPS only  
Content-Type: application/json  

---

# 🔐 AUTHENTICATION

Uses JWT Bearer Token:

Authorization: Bearer <token>

- Access Token expires: 24h
- Refresh Token expires: 30d

---

# 📦 STANDARD RESPONSE FORMAT

Most endpoints return:

{
  "data": []
}

⚠️ ALWAYS:
- Use `json.data`
- NEVER assume raw arrays

---

# 🚨 ERROR FORMAT

{
  "error": {
    "code": "ERROR_CODE",
    "message": "..."
  }
}

---

# ⚠️ HTTP ERROR CODES

- 400 VALIDATION_ERROR
- 401 UNAUTHORIZED
- 403 FORBIDDEN
- 404 NOT_FOUND
- 409 CONFLICT
- 422 CAPACITY_FULL
- 429 RATE_LIMITED
- 500 INTERNAL_ERROR

---

# 🧩 CORE ENTITIES

---

## 👤 USER

interface User {
  id: string
  email: string
  fullName: string
  studentId: string
  yearLevel: number
  course: string
  role: "member" | "officer" | "admin"
  guilds: Guild[]
  qrCode: string
  memberSince: string
}

---

## 🎉 EVENT

### LIST (/events)

interface EventSummary {
  id: string
  title: string
  description: string
  date: string
  coverImage?: string
  type?: "workshop" | "seminar" | "competition" | "social"
}

### DETAILS (/events/:id)

interface Event {
  id: string
  title: string
  description: string
  date: string
  endDate: string
  venue: string
  capacity: number
  registered: number
  guild: {
    id: string
    name: string
    slug: string
  }
  speakers: {
    name: string
    bio: string
    photo: string
  }[]
  agenda: {
    time: string
    activity: string
  }[]
  coverImage: string
  registrationOpen: boolean
}

---

## 🏫 GUILD

interface Guild {
  id: string
  name: string
  slug: string
  description: string
  roadmap: any[]
  memberCount: number
  resources: any[]
  leads: any[]
}

---

## 🤝 PARTNER

interface Partner {
  id: string
  name: string
  logo: string
  url: string
  bio: string
  tier: "bronze" | "silver" | "gold" | "platinum"
}

---

## 📢 ANNOUNCEMENT

interface Announcement {
  id: string
  title: string
  body: string
  pinned: boolean
  guildId?: string
}

---

# 🌐 ENDPOINTS (FRONTEND USAGE)

---

## 🔐 AUTH

### POST /auth/login
### POST /auth/register
### POST /auth/refresh
### POST /auth/logout

---

## 👤 USERS

### GET /users/me
- Requires auth
- Returns full profile

### PATCH /users/me
- Update profile

### GET /users
- Admin/Officer only
- Supports pagination

---

## 🎉 EVENTS

### GET /events

Query params:
- status = upcoming | past | all
- guild = slug
- type = workshop | seminar | competition | social
- page
- pageSize

Returns:
{
  data: EventSummary[],
  total: number,
  page: number
}

---

### GET /events/:id

Returns full Event object

---

### POST /events/:id/register

Returns:
- registrationId
- confirmationCode
- qrCode

---

## 🏫 GUILDS

### GET /guilds
Returns:
{
  data: Guild[]
}

---

### GET /guilds/:slug
Returns full Guild

---

### POST /guilds/:slug/apply

Body:
- motivation (required)
- experience (optional)
- portfolioUrl (optional)

---

### GET /guilds/:slug/resources

Query:
- level = beginner | intermediate | advanced
- type = video | pdf | quiz | link

---

## 📢 ANNOUNCEMENTS

### GET /announcements

Query:
- page
- pageSize
- pinned

---

## 🤝 PARTNERS

### GET /partners

Returns:
{
  data: Partner[]
}

---

# 🎨 UI RULES (STRICT)

- Use Tailwind ONLY
- Use tokens:
  - bg-background
  - text-foreground
  - text-muted-foreground
  - border-border

Brand color:
var(--color-brand-blue)

❌ No inline styles  
❌ No hardcoded colors  

---

# 🧱 COMPONENT RULES

Use shadcn/ui ONLY:

- Card
- Button
- Badge
- Skeleton
- Dialog

Structure:

Card
- CardHeader
- CardContent
- CardFooter

---

# 📐 LAYOUT RULES

Use:

- section-container
- section-padding

Responsive:
- mobile-first
- grid-based layouts

---

# 🔄 REQUIRED STATES

Every page MUST include:

1. Loading state (Skeleton)
2. Error state
3. Empty state

---

# 🔁 FALLBACK STRATEGY

- Always define fallback data
- UI must NEVER crash

---

# ⚠️ DATA RULES

- NEVER invent fields
- ALWAYS follow interfaces
- ALWAYS map `json.data`
- Handle pagination properly

---

# 🔐 ROLE PERMISSIONS

Public:
- events
- guilds
- partners
- announcements

Member:
- register event
- apply guild

Officer/Admin:
- create events
- manage attendance
- manage users

---

# 🧠 IMPLEMENTATION RULES

- Use `useEffect` for fetching
- Use `useState` for state
- Keep logic simple
- Follow existing project patterns

---

# 🚀 GOLDEN RULE

If unsure:

1. Follow API strictly
2. Follow existing pages
3. Do NOT guess fields
4. Keep it simple