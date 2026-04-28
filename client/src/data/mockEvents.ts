import type { Event } from "@/types/events"

import sampleBanner from "@/assets/icons/sample-banner.png"
import sample from "@/assets/icons/sample.jpg"

export const EVENTS: Event[] = [
  {
    id: 1,
    title: "AI/ML Workshop",
    // backend-ready: store raw datetime and format in the UI.
    startsAt: "2026-03-01T23:00:00",
    location: "Teams",
    description:
      "Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
    status: "Upcoming",
    image: sampleBanner,
    registered: 32,
    capacity: 50,
    organizers: [
      {
        id: "org-1",
        name: "John Doe",
        email: "john.doe@students.nu-laguna.edu.ph",
      },
      {
        id: "org-2",
        name: "Jane Smith",
        email: "jane.smith@students.nu-laguna.edu.ph",
      },
    ],
    speakers: [
      { id: "sp-1", name: "John Doe" },
      { id: "sp-2", name: "Jane Smith" },
      { id: "sp-3", name: "Joe Johnson" },
    ],
    photos: [
      { id: "ph-1", src: sampleBanner, alt: "Event photo 1" },
      { id: "ph-2", src: sampleBanner, alt: "Event photo 2" },
      { id: "ph-3", src: sampleBanner, alt: "Event photo 3" },
    ],
  },
  {
    id: 2,
    title: "AI/ML Workshop",
    startsAt: "2026-03-01T23:00:00",
    location: "Teams",
    description:
      "Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
    status: "Past",
    image: sampleBanner,
    registered: 32,
    capacity: 50,
    organizers: [
      {
        id: "org-1",
        name: "John Doe",
        email: "john.doe@students.nu-laguna.edu.ph",
      },
      {
        id: "org-2",
        name: "Jane Smith",
        email: "jane.smith@students.nu-laguna.edu.ph",
      },
    ],
    speakers: [
      { id: "sp-1", name: "John Doe" },
      { id: "sp-2", name: "Jane Smith" },
      { id: "sp-3", name: "Joe Johnson" },
    ],
    photos: [
      { id: "ph-1", src: sampleBanner, alt: "Event photo 1" },
      { id: "ph-2", src: sample, alt: "Event photo 2" },
      { id: "ph-3", src: sampleBanner, alt: "Event photo 3" },
    ],
  },
]

export function getEventById(eventId: number): Event | undefined {
  return EVENTS.find((event) => event.id === eventId)
}

export function getUpcomingEvents(): Event[] {
  return EVENTS.filter((event) => event.status === "Upcoming")
}

export function getPastEvents(): Event[] {
  return EVENTS.filter((event) => event.status === "Past")
}
