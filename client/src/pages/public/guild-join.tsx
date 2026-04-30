import { useMemo, useState, useEffect, type JSX } from "react"
import { Link, useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getInitials } from "@/lib/utils"
import { Users, ExternalLink, ChevronLeft } from "lucide-react"
import purplesnow from "@/assets/shapes/purplesnow.svg"
import {
  getActiveGuildRoadmap,
  getMockGuildBySlug,
  getStoredGuildResources,
  MOCK_GUILD_RESOURCES,
} from "@/data/mockGuildAdmin"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api"
const USE_API = false // Set to true when backend is ready

// Unified Guild interface matching API contract
interface Guild {
  id: string
  name: string
  slug: string
  description: string
  memberCount?: number
  leaderName?: string
  image_url?: string | null
  roadmap?: any[]
  resources?: any[]
  leads?: any[]
}

// Form data interface for join guild
interface JoinGuildFormData {
  whyJoin: string
  motivation: string
  experience: string
  portfolioUrl: string
}

const fallbackAvatar = "/images/default-avatar.png"



// Quick links placeholder data
const QUICK_LINKS = [
  { label: "Documentation", url: "#" },
  { label: "Community Forum", url: "#" },
  { label: "GitHub Repository", url: "#" },
]

// Learning roadmap data
const ROADMAP_ITEMS = Array.from({ length: 7 }, (_, i) => ({
  id: `module-${i + 1}`,
  number: i + 1,
  title: `Module ${i + 1}`,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
}))

// Get active roadmap from localStorage or use defaults
function getRoadmapForGuild(guildSlug?: string): { items: Array<{ id: string; number: number; title: string; description: string }>; photoUrl: string | null } {
  if (!guildSlug) return { items: ROADMAP_ITEMS, photoUrl: null }

  try {
    const activeRoadmap = getActiveGuildRoadmap(guildSlug)
    if (activeRoadmap && Array.isArray(activeRoadmap.steps)) {
      const items = activeRoadmap.steps.map((step: { id: string; title: string; description: string }, index: number) => ({
        id: step.id || `step-${index}`,
        number: index + 1,
        title: step.title,
        description: step.description,
      }))
      return { items, photoUrl: activeRoadmap.photoDataUrl || null }
    }
  } catch (err) {
    console.error("Error reading roadmap from localStorage:", err)
  }

  return { items: ROADMAP_ITEMS, photoUrl: null }
}

type ResourceCard = {
  id: string
  title: string
  description: string
  level: string
  variant: "info" | "destructive" | "success" | "warning"
  url: string
}

function formatResourceLevel(level: string): string {
  if (level === "intermediate") {
    return "Intermediate"
  }

  if (level === "advanced") {
    return "Advanced"
  }

  return "Beginner"
}

function getResourceVariant(level: string): ResourceCard["variant"] {
  if (level === "advanced") {
    return "destructive"
  }

  if (level === "intermediate") {
    return "success"
  }

  return "info"
}

function getResourcesForGuild(guildSlug?: string): ResourceCard[] {
  const storedResources = getStoredGuildResources(guildSlug)
  const source = storedResources.length > 0 ? storedResources : MOCK_GUILD_RESOURCES

  return source.map((resource) => ({
    id: resource.id,
    title: resource.title,
    description: `${resource.type.toUpperCase()} · ${formatResourceLevel(resource.level)}`,
    level: formatResourceLevel(resource.level),
    variant: getResourceVariant(resource.level),
    url: resource.url,
  }))
}

// Join guild form dialog with member application fields
interface JoinGuildDialogProps {
  guild: Guild | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const JoinGuildDialog = ({
  guild,
  isOpen,
  onOpenChange,
}: JoinGuildDialogProps): JSX.Element | null => {
  const [formData, setFormData] = useState<JoinGuildFormData>({
    whyJoin: "",
    motivation: "",
    experience: "",
    portfolioUrl: "",
  })

  const handleInputChange = (
    field: keyof JoinGuildFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        guildId: guild?.id,
        guildSlug: guild?.slug,
        ...formData,
      }

      if (USE_API) {
        const response = await fetch(`${API_BASE}/guilds/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Failed to submit join request")
        }
      }

      // Success feedback
      console.log("Join Guild Form Submitted:", payload)
      window.alert("Your join request has been submitted successfully!")

      // Reset form and close dialog
      setFormData({
        whyJoin: "",
        motivation: "",
        experience: "",
        portfolioUrl: "",
      })
      onOpenChange(false)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      console.error("Join submission error:", errorMsg)
      window.alert("We couldn't submit your join request. Please try again.")
    }
  }

  if (!guild) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Join Guild -{" "}
            <span className="text-primary">{guild.name}</span>
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="whyJoin">
              Why join this guild?
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="whyJoin"
              placeholder="Tell us why you want to be part of this guild."
              value={formData.whyJoin}
              onChange={(e) => handleInputChange("whyJoin", e.target.value)}
              required
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">
              Motivation
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="motivation"
              placeholder="Tell us what sparked your interest in this guild and what you'd like to achieve here."
              value={formData.motivation}
              onChange={(e) => handleInputChange("motivation", e.target.value)}
              required
              className="min-h-20"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              placeholder="Mention any relevant skills, tools, or projects you've worked on."
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio URL (optional)</Label>
            <Input
              id="portfolioUrl"
              type="url"
              placeholder="Got projects? Share them here."
              value={formData.portfolioUrl}
              onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4 w-full">
            <Button
              type="button"
              variant="outlineGrey"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function GuildJoin() {
  const params = useParams()
  const guildName = params.guildName || ""
  const [guild, setGuild] = useState<Guild | null>(null)
  const [roadmapItems, setRoadmapItems] = useState(ROADMAP_ITEMS)
  const [roadmapPhotoUrl, setRoadmapPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoadmapItem, setSelectedRoadmapItem] = useState<string | undefined>(undefined)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [resources, setResources] = useState<ResourceCard[]>([])

  // Fetch guild data from mock data by slug
  useEffect(() => {
    if (!guildName) {
      setLoading(false)
      setError("Guild name not found")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get guild from mock admin guilds by slug
      const guildData = getMockGuildBySlug(guildName)
      
      if (!guildData) {
        throw new Error(`Guild not found: ${guildName}`)
      }

      setGuild(guildData)
      
      // Load roadmap from localStorage
      const { items, photoUrl } = getRoadmapForGuild(guildName)
      setRoadmapItems(items)
      setRoadmapPhotoUrl(photoUrl)
      setResources(getResourcesForGuild(guildName))
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load guild"
      setError(errorMsg)
      setGuild(null)
    } finally {
      setLoading(false)
    }
  }, [guildName])

  const filteredResources = useMemo(() => {
    let filtered = resources

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter(
        (resource) => resource.level.toLowerCase() === selectedTab.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.level.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [resources, searchQuery, selectedTab])

  if (loading) {
    return (
      <div className="bg-background">
        <div className="relative w-full border-b border-border bg-primary">
          <div className="section-container relative h-48 mx-auto" />
        </div>
        <section className="section-container section-padding-md">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
          </div>
        </section>
      </div>
    )
  }

  if (!guild || error) {
    return (
      <div className="bg-background">
        <section className="section-container section-padding-md">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-2xl font-bold">Guild not found</h1>
            <p className="text-sm text-muted-foreground">{error || "This guild could not be found."}</p>
            <Button asChild variant="outlinePrimary">
              <Link to="/learn">Back to Guilds</Link>
            </Button>
          </div>
        </section>
      </div>
    )
  }

  const initials = getInitials(guild.name)

  return (
    <div className="bg-background">
      {/* BANNER - Full width with constrained content */}
      <div className="relative w-full border-b border-border bg-primary">
        <div className="section-container relative h-48 mx-auto">
          <Link
            to="/learn"
            className="absolute top-4 left-4 inline-flex items-center justify-center p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Back to guilds"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="section-container section-padding-md">
        {/* Join Guild Dialog */}
        <JoinGuildDialog
          guild={guild}
          isOpen={isJoinDialogOpen}
          onOpenChange={setIsJoinDialogOpen}
        />

        {/* Guild overview with description and join button */}
        <div className="grid gap-6 lg:grid-cols-[3fr_500px]">
          {/* LEFT CARD - Longer width */}
          <Card className="border border-border p-6 flex flex-col">
            <CardContent className="space-y-6 p-0 flex-1">
              {/* ROW 1: Icon + Title + Avatar Info */}
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0">
                  <img
                    src={guild.image_url || purplesnow}
                    alt="Guild icon"
                    className="h-[60px] w-[60px]"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-foreground">{guild.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-border">
                      <AvatarImage src={fallbackAvatar} alt={guild.name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{guild.name}</span>
                  </div>
                </div>
              </div>

              {/* ROW 2-3: Combined Description */}
              <p className="text-left text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {guild.description}
              </p>
            </CardContent>

            {/* ROW 4: Members Count - Fixed at bottom */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-6 mt-auto">
              <Users className="h-4 w-4" />
              <span>{guild.memberCount ? `${guild.memberCount.toLocaleString()} Members` : "Members"}</span>
            </div>
          </Card>

          {/* RIGHT CARD - Shorter width */}
          <Card className="border border-border p-6">
            <CardContent className="space-y-4 p-0">
              {/* ROW 1: Header */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">Join {guild.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Become a member of our community today.
                </p>
              </div>

              {/* ROW 3: Quick Links Header */}
              <div className="pt-2">
                <p className="font-bold text-foreground">Quick Links</p>
              </div>

              {/* ROW 4: Links */}
              <div className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>

              {/* Last Row: Join Button */}
              <div className="pt-2">
                <Button 
                  className="w-full bg-primary"
                  onClick={() => setIsJoinDialogOpen(true)}
                >
                  Join Guild
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Structured learning modules organized in accordion */}
        <div className="mt-12">
          <Card className="border border-border p-6">
            <CardContent className="space-y-6 p-0">
              <h2 className="text-lg font-bold text-foreground">Learning Roadmap</h2>
              <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                <div className="space-y-6">
                  <Accordion type="single" collapsible value={selectedRoadmapItem} onValueChange={setSelectedRoadmapItem}>
                    {roadmapItems.map((item) => (
                      <AccordionItem key={item.id} value={item.id} className="border-b border-border last:border-b-0">
                        <AccordionTrigger className="flex items-center justify-between hover:no-underline py-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold transition-colors flex-shrink-0 ${
                              selectedRoadmapItem === item.id
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {item.number}
                            </div>
                            <span className="text-foreground font-bold text-left">{item.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground ml-11">
                          {item.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* RIGHT COLUMN: Roadmap Photo Preview */}
                <div className="bg-muted rounded-md h-96 flex items-center justify-center overflow-hidden">
                  {roadmapPhotoUrl ? (
                    <img 
                      src={roadmapPhotoUrl} 
                      alt="Roadmap preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <div className="text-center text-muted-foreground">
                        <p className="text-sm">No roadmap image uploaded yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Searchable and filterable learning resource links */}
        <div className="mt-12">
          <Card className="border border-border p-6">
            <CardContent className="space-y-6 p-0">
              {/* ROW 1: Header */}
              <h2 className="text-lg font-bold text-foreground">Learning Resources</h2>

              {/* ROW 2: Search + Tabs */}
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search learning resources"
                    className="w-full"
                  />
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                    <TabsTrigger value="beginner" className="text-xs sm:text-sm">Beginner</TabsTrigger>
                    <TabsTrigger value="intermediate" className="text-xs sm:text-sm">Intermediate</TabsTrigger>
                    <TabsTrigger value="advanced" className="text-xs sm:text-sm">Advanced</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* ROW 3: Resource Cards */}
              <div className="space-y-3">
                {filteredResources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    className="flex items-center gap-4 border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 text-foreground flex-shrink-0" />
                    
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>

                <Badge variant={resource.variant}>
                      {resource.level}
                    </Badge>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
