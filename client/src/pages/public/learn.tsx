import { useEffect, useState, type JSX } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { BannerDisplay } from "../../components/ui/custom"
import { Link } from "react-router-dom"
import { Users } from "lucide-react"
import { getInitials } from "../../lib/utils"
import {
  getStoredGuilds,
  resolveGuildBadges,
  type Guild as AdminGuild,
} from "../../data/mockGuildAdmin"

type Guild = AdminGuild

const fallbackAvatar = "/images/default-avatar.png"

const BADGE_VARIANTS = ["info", "destructive", "success", "warning"] as const

function getBadgeVariant(label: string, index: number) {
  const value = label.toLowerCase()

  if (value.includes("frontend") || value.includes("ui") || value.includes("design")) {
    return "info" as const
  }

  if (value.includes("backend") || value.includes("security") || value.includes("automation")) {
    return "destructive" as const
  }

  if (value.includes("full") || value.includes("data") || value.includes("machine") || value.includes("cloud")) {
    return "success" as const
  }

  if (value.includes("web") || value.includes("research") || value.includes("workflow")) {
    return "warning" as const
  }

  return BADGE_VARIANTS[index % BADGE_VARIANTS.length]
}

// Visual header banner with guild name avatar
const GuildBanner = ({ guild }: { guild: Guild }): JSX.Element => {
  return (
    <BannerDisplay
      imageUrl={guild.image_url}
      position={guild.bannerPosition}
      alt={`${guild.name} banner`}
      className="relative h-48 w-full overflow-hidden rounded-none bg-primary"
    >
      <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1">
        <Avatar className="h-8 w-8 border border-border bg-card">
          <AvatarImage src={fallbackAvatar} alt={`${guild.leaderName} avatar`} />
          <AvatarFallback className="text-xs font-medium">{getInitials(guild.leaderName)}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-white font-medium">{guild.name}</p>
      </div>
    </BannerDisplay>
  )
}

const GuildBadges = ({ guild }: { guild: Guild }): JSX.Element => {
  const badges = resolveGuildBadges(guild)

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {badges.map((badge, index) => (
        <Badge key={badge} variant={getBadgeVariant(badge, index)}>
          {badge}
        </Badge>
      ))}
    </div>
  )
}

// Display member count and join button footer
const GuildFooter = ({ guild }: { guild: Guild }): JSX.Element => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>
          {typeof guild.memberCount === "number"
            ? `${guild.memberCount.toLocaleString()} members`
            : "Members"}
        </span>
      </div>

      <Button asChild>
        <Link to={`/learn/${guild.slug}`}>Join</Link>
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
      <GuildBadges guild={guild} />
      <GuildFooter guild={guild} />
    </CardContent>
  </Card>
)

// Loading placeholder skeleton for guild card
const GuildSkeleton = (): JSX.Element => (
  <Card className="w-full overflow-hidden border border-border py-0 animate-pulse">
    <div className="h-48 w-full bg-muted" />
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
    const loadGuilds = () => {
      setLoading(true)
      setError(null)
      setGuilds(getStoredGuilds())
      setLoading(false)
    }

    loadGuilds()

    const handleGuildDataUpdate = () => {
      loadGuilds()
    }

    window.addEventListener("guild-data-updated", handleGuildDataUpdate)

    return () => {
      window.removeEventListener("guild-data-updated", handleGuildDataUpdate)
    }
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