import { useEffect, useState, type JSX, type CSSProperties } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback } from "../components/ui/avatar"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api"

// gradient text style for the hero title
const gradientStyle: CSSProperties = {
  background: "linear-gradient(to right, #00A2ED 0%, #6AAC0E 33%, #FFBB00 66%, #F04E1F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}

// types for guild data returned by the API
interface Guild {
  id: string
  name: string
  slug: string
  description: string
  memberCount: number
  bannerImage?: string
  skills?: string[]
}

// fallback guilds sample data in case API fails or returns empty list
const FALLBACK_GUILDS: Guild[] = [
  {
    id: "1",
    name: "Web Development",
    slug: "webdev",
    description: "Learn React, Tailwind, and modern web development tools. Build responsive applications with expert guidance.",
    memberCount: 120,
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=300&fit=crop",
    skills: ["React", "Tailwind", "JavaScript", "Web Dev"],
  },
  {
    id: "2",
    name: "UI/UX Design",
    slug: "uiux",
    description: "Master user interface and experience design principles. Create beautiful and functional designs that users love.",
    memberCount: 80,
    bannerImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=300&fit=crop",
    skills: ["Design", "Figma", "User Research", "Prototyping"],
  },
  {
    id: "3",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Explore cybersecurity fundamentals and ethical hacking. Protect systems and learn defensive strategies.",
    memberCount: 65,
    bannerImage: "https://images.unsplash.com/photo-1516321318423-f06f70259c13?w=800&h=300&fit=crop",
    skills: ["Security", "Networking", "Ethics", "Defense"],
  },
]

// badges
const SkillBadge = ({ skill, colorIndex }: { skill: string; colorIndex: number }): JSX.Element => {
  const COLORS = [
    "bg-[var(--color-brand-blue)] text-white",
    "bg-[var(--color-brand-red)] text-white",
    "bg-[var(--color-brand-green)] text-white",
    "bg-[var(--color-brand-yellow)] text-white",
  ]
  const colorClass = COLORS[colorIndex % COLORS.length]

  return <Badge className={`${colorClass} rounded-sm`}>{skill}</Badge>
}

// ───────────────── GUILD BANNER ─────────────────
const GuildBanner = ({ guild }: { guild: Guild }): JSX.Element => {
  const initials = guild.name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")

  return (
    <div className="relative h-[150px] sm:h-[200px] bg-gradient-to-r from-[color-mix(in_srgb,var(--color-brand-blue)_80%,white)] to-[var(--color-brand-blue)] flex items-end justify-end pb-3 pr-3">
      {guild.bannerImage ? (
        <img
          src={guild.bannerImage}
          alt={`${guild.name} banner`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600" />
      )}

      <div className="relative z-10 flex items-center gap-3">
        <Avatar className="w-14 h-14 bg-white shadow-md border-2 border-white">
          <AvatarFallback className="text-[var(--color-brand-blue)] font-bold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold text-base sm:text-lg truncate max-w-[140px]">
          {guild.name}
        </span>
      </div>
    </div>
  )
}

// ───────────────── GUILD DESCRIPTION ─────────────────
const GuildDescription = ({ description }: { description: string }): JSX.Element => (
  <p className="body-small text-muted-foreground">{description}</p>
)

// ───────────────── GUILD SKILLS ─────────────────
const GuildSkills = ({ skills }: { skills?: string[] }): JSX.Element | null => {
  if (!skills || skills.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {skills.map((skill, idx) => (
        <SkillBadge key={idx} skill={skill} colorIndex={idx} />
      ))}
    </div>
  )
}

// ───────────────── GUILD FOOTER ─────────────────
const GuildFooter = ({
  memberCount,
  guildSlug,
}: {
  memberCount: number
  guildSlug: string
}): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center pt-4">
      <span className="body-tiny text-muted-foreground font-medium">
        👥 {memberCount} Members
      </span>
      <Button
        onClick={() => navigate(`/guilds/${guildSlug}`)}
        className="bg-[var(--color-brand-blue)] hover:bg-[color-mix(in_srgb,var(--color-brand-blue)_80%,black)] text-white"
      >
        Join
      </Button>
    </div>
  )
}

// ───────────────── GUILD CARD ─────────────────
const GuildCard = ({ guild }: { guild: Guild }): JSX.Element => (
  <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow">
    <GuildBanner guild={guild} />
    <CardContent className="p-6 space-y-4">
      <GuildDescription description={guild.description} />
      <GuildSkills skills={guild.skills} />
      <GuildFooter memberCount={guild.memberCount} guildSlug={guild.slug} />
    </CardContent>
  </Card>
)

// ───────────────── GUILD SKELETON ─────────────────
const GuildSkeleton = (): JSX.Element => (
  <Card className="overflow-hidden border border-border animate-pulse">
    <div className="h-[150px] sm:h-[200px] bg-gray-300" />
    <CardContent className="p-6 space-y-4">
      <div className="h-4 w-2/3 bg-gray-300 rounded" />
      <div className="h-3 w-full bg-gray-300 rounded" />
      <div className="h-3 w-4/5 bg-gray-300 rounded" />
      <div className="flex gap-2 flex-wrap justify-center">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="h-6 w-16 bg-gray-300 rounded-sm" />
          ))}
      </div>
      <div className="pt-2">
        <div className="h-8 w-24 bg-gray-300 rounded" />
      </div>
    </CardContent>
  </Card>
)

// ───────────────── PAGE ─────────────────
export default function LearnPage(): JSX.Element {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE}/guilds`)

        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`)
        }

        const contentType = res.headers.get("content-type")
        if (!contentType?.includes("application/json")) {
          throw new Error("API returned non-JSON response (server may be unavailable)")
        }

        const json = await res.json()
        setGuilds(json.data || json)
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
    <div className="font-sans">
      {/* ── HERO SECTION ── */}
      <section className="py-16 sm:py-20 lg:py-24 mb-12 text-center">
        <div className="w-4/5 mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold inline-block"
            style={gradientStyle}
          >
            LEARN
          </h1>

          <p className="mt-3 text-sm sm:text-base lg:text-lg max-w-4xl mx-auto text-muted-foreground">
            Explore our specialized guilds, access learning resources, and apply for membership
            to join a community of passionate learners and professionals.
          </p>

          {error && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--color-brand-red)]">
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── GUILDS SECTION ── */}
      <section className="py-12 sm:py-16">
        <div className="w-4/5 mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="flex flex-col gap-6">
              {Array(3).fill(null).map((_, i) => (
                <GuildSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && (
            <div className="flex flex-col gap-6">
              {guilds.map((guild) => (
                <GuildCard key={guild.id} guild={guild} />
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
    </div>
  )
}