import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/custom"
import { Link, useSearchParams } from "react-router-dom"
import type { Event } from "@/types/events"
import { getPastEvents, getUpcomingEvents } from "@/data/mockEvents"
import { formatEventDate, formatEventTime } from "@/lib/event-datetime"
import { Users, Clock, MapPin, CalendarDays } from "lucide-react"

// renders a single event card
function EventCard({
  event,
  ctaLabel,
}: Readonly<{
  event: Event
  ctaLabel: string
}>) {
  const progressValue = (event.registered / event.capacity) * 100

  return (
    // event card layout
    <Card className="py-0">
      <div className="h-32 w-full overflow-hidden border-b border-border">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
      </div>

      <CardHeader className="space-y-3">
        <div className="space-y-2">
          <CardTitle>{event.title}</CardTitle>

          <div>
            {event.status === "Past" ? (
              <Badge variant="success">Completed</Badge>
            ) : (
              <Badge variant="accent">Upcoming</Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formatEventDate(event.startsAt)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatEventTime(event.startsAt)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3 pt-0">
        <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {event.registered}/{event.capacity} registered
          </span>
        </div>

        <Progress value={progressValue} />
      </CardContent>

      <CardFooter className="pb-3 pt-0">
        <Button asChild className="w-full">
          {/* goes to /activities/:eventId (e.g. /activities/1, /activities/2) */}
          <Link to={`/activities/${event.id}`}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// responsive list wrapper
function EventsGrid({
  events,
  ctaLabel,
}: Readonly<{
  events: Event[]
  ctaLabel: string
}>) {
  if (events.length === 1) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <EventCard event={events[0]} ctaLabel={ctaLabel} />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} ctaLabel={ctaLabel} />
      ))}
    </div>
  )
}

// event tabs
export default function Activities() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') || 'upcoming'
  
  // mock data for now - replace w API calls
  const upcomingEvents = getUpcomingEvents()
  const pastEvents = getPastEvents()

// main page layout
  return (
    <div className="bg-background">
      <section className="section-container section-padding-md">
        <header className="text-center">
          <h1 className={"text-3xl sm:text-4xl lg:text-5xl font-bold inline-block gradient-text"}>
            EVENTS &amp; ACTIVITIES
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Explore upcoming events and past activities.
          </p>
        </header>

        <Tabs value={tabParam} onValueChange={(val) => setSearchParams({ tab: val })} className="mt-8">
          <TabsList className="mx-auto flex h-auto w-fit">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          {/* filters row */}
          <div className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
            <DatePicker/>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event List</Label>
              <Select defaultValue="event">
                <SelectTrigger>
                  <SelectValue placeholder="Select list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="upcoming" className="mt-8">
            {/* replace w fallback ui */}
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No upcoming events available at the moment.
              </p>
            ) : (
              <EventsGrid events={upcomingEvents} ctaLabel="Register Now" />
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-8">
            {pastEvents.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No past events available yet.
              </p>
            ) : (
              <EventsGrid events={pastEvents} ctaLabel="View Details" />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}