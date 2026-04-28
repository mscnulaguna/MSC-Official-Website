export type EventStatus = "Upcoming" | "Past"

export type EventSpeaker = {
  id: string
  name: string
  title?: string
  imageUrl?: string
}

export type EventPhoto = {
  id: string
  src: string
  alt: string
}

export type EventOrganizer = {
  id: string
  name: string
  email?: string
  imageUrl?: string
}

export type Event = {
  id: number
  title: string
  /**
   * ISO datetime string.
   * Example: "2026-03-01T23:00:00"
   */
  startsAt: string
  endsAt?: string
  location: string
  description: string
  status: EventStatus
  image: string
  registered: number
  capacity: number

  organizers?: EventOrganizer[]
  speakers?: EventSpeaker[]
  photos?: EventPhoto[]
}
