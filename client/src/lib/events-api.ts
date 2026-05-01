import type { Event } from "@/types/events"
import { getApiBaseUrl } from "@/lib/api"

type ApiEvent = {
  id: number | string
  title?: string
  description?: string
  date?: string
  startDate?: string
  startsAt?: string
  endDate?: string
  venue?: string
  location?: string
  capacity?: number
  maxParticipants?: number
  registered?: number
  coverImage?: string | null
  image?: string | null
  status?: string
  registrationOpen?: boolean
  userRegistered?: boolean
  organizers?: Event["organizers"]
  speakers?: Event["speakers"]
  photos?: Event["photos"]
}

type EventsListResponse = {
  data?: ApiEvent[]
}

const API_BASE = getApiBaseUrl()

function inferStatus(dateValue?: string, endDateValue?: string): Event["status"] {
  const reference = endDateValue || dateValue

  if (!reference) {
    return "Upcoming"
  }

  const parsed = new Date(reference)
  if (Number.isNaN(parsed.getTime())) {
    return "Upcoming"
  }

  return parsed.getTime() < Date.now() ? "Past" : "Upcoming"
}

function mapStatus(rawStatus?: string, dateValue?: string, endDateValue?: string): Event["status"] {
  const normalized = rawStatus?.toLowerCase()

  if (normalized === "past" || normalized === "completed") {
    return "Past"
  }

  if (normalized === "upcoming") {
    return "Upcoming"
  }

  return inferStatus(dateValue, endDateValue)
}

function normalizeEvent(raw: ApiEvent): Event {
  const startsAt = raw.date || raw.startDate || raw.startsAt || ""
  const endDate = raw.endDate

  if (raw.userRegistered) {
    console.log(`[API] Event ${raw.id}: userRegistered=${raw.userRegistered}`)
  }

  return {
    id: Number(raw.id),
    title: raw.title || "Untitled Event",
    startsAt,
    endsAt: endDate,
    location: raw.venue || raw.location || "Venue TBA",
    description: raw.description || "No description provided.",
    status: mapStatus(raw.status, startsAt, endDate),
    image: raw.coverImage || raw.image || "",
    registered: raw.registered ?? 0,
    capacity: raw.capacity ?? raw.maxParticipants ?? 0,
    organizers: raw.organizers,
    speakers: raw.speakers,
    photos: raw.photos,
    registrationOpen: raw.registrationOpen,
    userRegistered: raw.userRegistered,
  }
}

export async function fetchEvents(status: "upcoming" | "past" | "all" = "all"): Promise<Event[]> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/events?status=${status}`, { headers })

  if (!response.ok) {
    throw new Error(`Failed to load events: ${response.status}`)
  }

  const payload = (await response.json()) as EventsListResponse
  return (payload.data || []).map(normalizeEvent)
}

export async function fetchEventById(eventId: string | number): Promise<Event | null> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/events/${eventId}`, { headers })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to load event: ${response.status}`)
  }

  const payload = (await response.json()) as ApiEvent
  return normalizeEvent(payload)
}

export async function registerForEvent(eventId: string | number, token: string) {
  const response = await fetch(`${API_BASE}/events/${eventId}/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let message = "Failed to register for event"

    try {
      const payload = await response.json()
      message = payload?.error?.message || message
    } catch {
      // Ignore JSON parse errors and use fallback message.
    }

    throw new Error(message)
  }

  return response.json()
}
