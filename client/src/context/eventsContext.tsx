import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Event } from '@/types/events'
import { fetchEvents } from '@/lib/events-api'

type EventsContextValue = {
  upcomingEvents: Event[]
  pastEvents: Event[]
  loading: boolean
  loadError: string | null
  refresh: () => Promise<void>
  updateEvent: (updated: Event) => void
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined)

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const [upcoming, past] = await Promise.all([fetchEvents('upcoming'), fetchEvents('past')])
      setUpcomingEvents(upcoming)
      setPastEvents(past)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    load()
    // also refresh on window focus
    const onFocus = () => {
      if (mounted) load()
    }
    window.addEventListener('focus', onFocus)
    return () => {
      mounted = false
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  const updateEvent = (updated: Event) => {
    console.log(`[EventsContext] Updating event ${updated.id}, userRegistered=${updated.userRegistered}`)
    setUpcomingEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === updated.id)
      if (idx >= 0) {
        console.log(`[EventsContext] Found event ${updated.id} in upcoming at index ${idx}`)
        const newArray = [...prev]
        newArray[idx] = updated
        return newArray
      }
      return prev
    })
    setPastEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === updated.id)
      if (idx >= 0) {
        console.log(`[EventsContext] Found event ${updated.id} in past at index ${idx}`)
        const newArray = [...prev]
        newArray[idx] = updated
        return newArray
      }
      return prev
    })
  }

  return (
    <EventsContext.Provider
      value={{ upcomingEvents, pastEvents, loading, loadError, refresh: load, updateEvent }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}

export default EventsProvider
