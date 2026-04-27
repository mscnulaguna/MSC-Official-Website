import { useEffect, useState, type JSX } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Link } from "react-router-dom"
import { Users } from "lucide-react"
import { getInitials } from "../lib/utils"
import { getApiBaseUrl } from "../lib/api"

const API_BASE = getApiBaseUrl()
const USE_API = false // Set to true when backend is ready

// Unified Guild interface matching API contract
interface Guild {
  id: string
  name: string
  slug: string
  description: string
  memberCount?: number
  roadmap?: any[]
  resources?: any[]
  leads?: any[]
}

const fallbackAvatar = "/images/default-avatar.png"

// fallback guilds sample data in case API fails or returns empty list
// Fallback guilds matching unified Guild interface
const FALLBACK_GUILDS: Guild[] = [
  {
    id: "1",
    name: "Web Development",
    slug: "webdev",
    description: "Learn React, Tailwind, and modern web development tools. Build responsive applications with expert guidance.",
    memberCount: 2847,
  },
  {
    id: "2",
    name: "UI/UX Design",
    slug: "uiux",
    description: "Master user interface and experience design principles. Create beautiful and functional designs that users love.",
    memberCount: 1624,
  },
  {
    id: "3",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Explore cybersecurity fundamentals and ethical hacking. Protect systems and learn defensive strategies.",
    memberCount: 892,
  },
]

const STATIC_BADGES = [
  { label: "Destructive", variant: "destructive" as const },
  { label: "Success", variant: "success" as const },
  { label: "Warning", variant: "warning" as const },
  { label: "Info", variant: "info" as const },
]

// Visual header banner with guild name avatar
const GuildBanner = ({ guild }: { guild: Guild }): JSX.Element => {
  const initials = getInitials(guild.name)

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-none">
      <div className="h-full w-full bg-primary" />

      <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1">
        <Avatar className="h-8 w-8 border border-border bg-card">
          <AvatarImage src={fallbackAvatar} alt={`${guild.name} avatar`} />
          <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-white">{guild.name}</p>
      </div>
    </div>
  )
}

// Display status badges for guild
const GuildBadges = (): JSX.Element => (
  <div className="flex justify-center gap-2">
    {STATIC_BADGES.map((badge) => (
      <Badge key={badge.label} variant={badge.variant}>
        {badge.label}
      </Badge>
    ))}
  </div>
)

// Display member count and join button footer
const GuildFooter = ({ guild }: { guild: Guild }): JSX.Element => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>{guild.memberCount ? `${guild.memberCount.toLocaleString()} members` : "Members"}</span>
      </div>

      <Button asChild>
        <Link to={`/learn/${guild.id}`}>Join</Link>
      </Button>
    </div>
  )
}

// Guild overview text description
const GuildDescription = ({ description }: { description: string }): JSX.Element => (
  <p className="text-sm text-foreground">{description}</p>
)

// Complete guild card with banner, description, badges, and footer
const GuildCard = ({ guild }: { guild: Guild }): JSX.Element => (
  <Card className="w-full overflow-hidden border border-border py-0">
    <GuildBanner guild={guild} />
    <CardContent className="space-y-4 py-6">
      <GuildDescription description={guild.description} />
      <GuildBadges />
      <GuildFooter guild={guild} />
    </CardContent>
  </Card>
)

// Loading placeholder skeleton for guild card
const GuildSkeleton = (): JSX.Element => (
  <Card className="w-full overflow-hidden border border-border py-0 animate-pulse">
    <div className="h-40 w-full bg-muted" />
    <CardContent className="space-y-4 py-6">
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-4/5 rounded bg-muted" />
      <div className="flex gap-2 flex-wrap justify-center">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="h-6 w-16 rounded bg-muted" />
          ))}
      </div>
      <div className="pt-2">
        <div className="h-8 w-24 rounded bg-muted" />
      </div>
    </CardContent>
  </Card>
)

// Main learn page displaying all available guilds
export default function LearnPage(): JSX.Element {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use fallback data when API is disabled
        if (!USE_API) {
          setGuilds(FALLBACK_GUILDS)
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE}/guilds`)

        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`)
        }

        const contentType = res.headers.get("content-type")
        if (!contentType?.includes("application/json")) {
          throw new Error("API returned non-JSON response (server may be unavailable)")
        }

        const json = await res.json()
        const guildData = json.data ?? json

        if (!Array.isArray(guildData)) {
          throw new Error("API returned an invalid guild list")
        }

        setGuilds(guildData)
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load guilds"
        setError(errorMsg)
        setGuilds(FALLBACK_GUILDS)
      } finally {
        setLoading(false)
      }
    }

    fetchGuilds()
  }, [])

  return (
    <main className="bg-background">
      {/* ── HERO SECTION ── */}
      <section className="section-padding pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-4 flex justify-center border-b border-border/10">
        <div className="section-container text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold inline-block gradient-text">
            LEARN
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto">
            Explore our specialized guilds, access learning resources, and apply for membership
            to join a community of passionate learners and professionals.
          </p>

          {error && (
            <p className="sr-only" role="status" aria-live="polite">{error}</p>
          )}
        </div>
      </section>

      {/* ── GUILDS SECTION ── */}
      <section className="section-padding-md flex justify-center">
        <div className="section-container">
          {loading && (
            <div className="flex flex-col gap-6 lg:gap-8">
              {Array(3).fill(null).map((_, i) => (
                <GuildSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && (
            <div className="flex flex-col gap-6 lg:gap-8">
              {guilds.map((guild) => (
                <GuildCard
                  key={guild.id}
                  guild={guild}
                />
              ))}
            </div>
          )}

          {!loading && guilds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No guilds available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}