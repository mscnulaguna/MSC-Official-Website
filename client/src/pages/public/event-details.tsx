import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Clock, MapPin, Flag, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Carousel } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatEventDate, formatEventTime } from "@/lib/event-datetime"
import { fetchEventById, registerForEvent } from "@/lib/events-api"
import { useEvents } from '@/context/eventsContext'
import type { Event, EventOrganizer, EventPhoto, EventSpeaker } from "@/types/events"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

// organized by section
function OrganizedBySection({ organizers }: Readonly<{ organizers: EventOrganizer[] }>) {
  if (organizers.length === 0) return null

  if (organizers.length === 1) {
    const org = organizers[0]

    return (
      <div className="space-y-3">
        <Separator />
        <h2 className="text-lg font-bold">Organized by</h2>
        <div className="flex w-full max-w-sm items-center gap-3">
          <Avatar>
            {org.imageUrl ? <AvatarImage src={org.imageUrl} alt={org.name} /> : null}
            <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{org.name}</p>
            {org.email ? <p className="text-xs text-muted-foreground">{org.email}</p> : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Separator />
      <h2 className="text-lg font-bold">Organized by</h2>
      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        {organizers.map((org) => (
          <div key={org.id} className="flex w-full max-w-sm items-center gap-3">
            <Avatar>
              {org.imageUrl ? <AvatarImage src={org.imageUrl} alt={org.name} /> : null}
              <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{org.name}</p>
              {org.email ? <p className="text-xs text-muted-foreground">{org.email}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// speakers section (only for completed events)
function SpeakersSection({ speakers }: Readonly<{ speakers: EventSpeaker[] }>) {
  if (speakers.length === 0) return null

  if (speakers.length === 1) {
    const speaker = speakers[0]

    return (
      <section aria-label="Event speakers" className="space-y-4 pt-12">
        <h2 className="text-2xl font-bold text-center text-primary">Event Speakers</h2>
        <div className="flex justify-center">
          <Card className="w-full max-w-sm">
            <CardContent className="space-y-2 p-4 text-center">
              <Avatar className="mx-auto h-20 w-20">
                <AvatarFallback>{getInitials(speaker.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{speaker.name}</p>
                {speaker.title ? (
                  <p className="text-xs text-muted-foreground">{speaker.title}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Event speakers" className="space-y-4 pt-12">
      <h2 className="text-2xl font-bold text-center text-primary">Event Speakers</h2>
      <div className="mx-auto grid max-w-5xl justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {speakers.map((speaker) => (
          <Card key={speaker.id} className="w-full max-w-sm">
            <CardContent className="space-y-2 p-4 text-center">
              <Avatar className="mx-auto h-20 w-20">
                <AvatarFallback>{getInitials(speaker.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{speaker.name}</p>
                {speaker.title ? (
                  <p className="text-xs text-muted-foreground">{speaker.title}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

// event photo section (only for completed events)
function PhotosSection({ photos }: Readonly<{ photos: EventPhoto[] }>) {
  if (photos.length === 0) return null

  return (
    <section aria-label="Event photos" className="space-y-4 pt-12">
      <h2 className="text-2xl font-bold text-center text-primary">Event Photos</h2>

      <Tabs defaultValue="slideshow" className="mx-auto w-full max-w-5xl">
        <div className="flex justify-center">
          <TabsList className="w-fit mb-5">
            <TabsTrigger value="slideshow">Slideshow</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="slideshow">
          <Carousel>
            {photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover"
              />
            ))}
          </Carousel>

          {photos.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto pt-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="h-16 w-24 shrink-0 overflow-hidden border border-border"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="gallery">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group w-full overflow-hidden border border-border transition-colors hover:border-primary"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-56 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

// main event details page
export default function EventDetails() {
  const navigate = useNavigate()
  const params = useParams()
  const eventId = params.eventId
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const { updateEvent, refresh } = useEvents()

  useEffect(() => {
    let isMounted = true

    const loadEvent = async () => {
      if (!eventId) {
        setEvent(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setLoadError(null)

      try {
        const data = await fetchEventById(eventId)

        if (!isMounted) return
        setEvent(data)
      } catch (error) {
        if (!isMounted) return
        setLoadError(error instanceof Error ? error.message : "Failed to load event")
        setEvent(null)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadEvent()

    return () => {
      isMounted = false
    }
  }, [eventId])

  const handleRegister = async () => {
    if (!event || isRegistering) return

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    setIsRegistering(true)
    setRegisterError(null)

    try {
      await registerForEvent(event.id, token)

      const updatedRegistered = event.registered + 1
      const hasCapacity = event.capacity > 0

      const updatedEvent: Event = {
        ...event,
        registered: updatedRegistered,
        userRegistered: true,
        registrationOpen: hasCapacity ? updatedRegistered < event.capacity : true,
      }

      setEvent(updatedEvent)
      updateEvent(updatedEvent)

      console.log(`[EventDetails] Called updateEvent for event ${event.id}, userRegistered=true`)

      toast.success("You're registered! Check your email for confirmation details.", {
        duration: 5000,
      })

      refresh().catch(() => {
        // ignore refresh errors; in-memory update keeps UI responsive
      })
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : "Failed to register for event")
    } finally {
      setIsRegistering(false)
    }
  }

  const isCompleted = event?.status === "Past"
  const isUpcoming = event?.status === "Upcoming"

  const organizers = event?.organizers ?? []
  const speakers = event?.speakers ?? []
  const photos = event?.photos ?? []

  if (loading) {
    return (
      <div className="bg-background">
        <section className="section-container section-padding-md">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-2xl font-bold">Loading event...</h1>
          </div>
        </section>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="bg-background">
        <section className="section-container section-padding-md">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-2xl font-bold">Unable to load event</h1>
            <p className="text-sm text-destructive">{loadError}</p>
            <Button asChild variant="outlinePrimary">
              <Link to="/activities">Back to Activities</Link>
            </Button>
          </div>
        </section>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="bg-background">
        <section className="section-container section-padding-md">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-2xl font-bold">Event not found</h1>
            <Button asChild variant="outlinePrimary">
              <Link to="/activities">Back to Activities</Link>
            </Button>
          </div>
        </section>
      </div>
    )
  }

//   main event details layout
  return (
    <div className="bg-background">
      <div className="w-full border-b border-border">
        <div className="relative h-48 w-full overflow-hidden sm:h-64">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          {/* gradient overlay */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-44 bg-linear-to-l from-background to-transparent sm:w-72" />
        </div>
      </div>

      <section className="section-container section-padding-md">
        <div className="grid gap-8 pt-2 sm:pt-4 lg:grid-cols-[1fr_360px]">
          {/* left: title + about */}
          <div className="space-y-6">
            <section aria-label="Event details" className="space-y-6">
              <div className="space-y-3">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold sm:text-4xl">{event.title}</h1>
                  <div>
                    {isCompleted ? (
                      <Badge variant="success">Completed</Badge>
                    ) : (
                      <Badge variant="accent">Upcoming</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold">About</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </div>

              <OrganizedBySection organizers={organizers} />
            </section>
          </div>

          {/* what you need to know */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What you need to know</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Flag className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Event Type</p>
                    <p className="text-muted-foreground">{event.type
                      ? event.type.charAt(0).toUpperCase() + event.type.slice(1).toLowerCase()
                      : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Event Venue</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{formatEventDate(event.startsAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-muted-foreground">{formatEventTime(event.startsAt)}
                      {event.endsAt ? ` – ${formatEventTime(event.endsAt)}` : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isUpcoming ? (
              <div className="space-y-2">
                <Button
                  variant={
                    event.userRegistered
                      ? "success"
                      : event.registrationOpen === false
                        ? "destructive"
                        : "default"
                  }
                  className="w-full"
                  onClick={handleRegister}
                  disabled={isRegistering || event.userRegistered || event.registrationOpen === false}
                >
                  {isRegistering
                    ? "Registering..."
                    : event.userRegistered
                      ? "Registered"
                      : event.registrationOpen === false
                        ? "Registration Closed"
                        : "Register Now"}
                </Button>
                {registerError ? <p className="text-xs text-destructive">{registerError}</p> : null}
              </div>
            ) : null}

            <Button asChild variant="outlinePrimary" className="w-full">
              <Link to="/activities">Back to Activities</Link>
            </Button>
          </div>
        </div>

        {/* completed-only sections */}
        {isCompleted ? <SpeakersSection speakers={speakers} /> : null}
        {isCompleted ? <PhotosSection photos={photos} /> : null}
      </section>
    </div>
  )
}
