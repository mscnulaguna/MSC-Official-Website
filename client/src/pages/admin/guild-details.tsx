import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
	ArrowLeft,
	Asterisk,
	Check,
	Eye,
	Plus,
	X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { UploadField, DirectBannerEditor, BannerDisplay } from "@/components/ui/custom"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import {
	getMockGuildBySlug,
	FALLBACK_OFFICER_LEADS,
	MOCK_GUILD_APPLICATIONS,
	MOCK_GUILD_RESOURCES,
	getStoredGuildResources,
	saveStoredGuildResources,
	getSuggestedGuildBadgeEntries,
	resolveGuildBadgeEntries,
	resolveGuildBadges,
	upsertStoredGuild,
	type OfficerLead,
	type ApplicationStatus,
	type Guild,
	type GuildApplication,
	type GuildResource,
} from "@/data/mockGuildAdmin"
import { createClientId } from "@/lib/client-id"
import { labelsToBadges, parseBadgeLabels } from "@/lib/guild-admin-utils"

type ResourceFormData = {
	title: string
	type: "video" | "pdf" | "link" | "quiz"
	level: "beginner" | "intermediate" | "advanced"
	url: string
}

type RoadmapStepFormData = {
	id: string
	title: string
	description: string
}

type RoadmapVersion = {
	id: string
	name: string
	steps: RoadmapStepFormData[]
	photoDataUrl: string | null
	createdAt: string
	updatedAt: string
	isActive: boolean
}

type GuildProfileForm = {
	name: string
	description: string
	leadId: string
	badges: string
}

const API_BASE_URL = "https://api.msc-nulaguna.org/v1"
const API_FALLBACK_BASE_URL = "/api"
const USE_API = import.meta.env.VITE_USE_LIVE_GUILD_API === "true"

const DEFAULT_RESOURCE_FORM: ResourceFormData = {
	title: "",
	type: "video",
	level: "beginner",
	url: "",
}

const DEFAULT_GUILD_PROFILE_FORM: GuildProfileForm = {
	name: "",
	description: "",
	leadId: "",
	badges: "",
}

function getLeadIdForGuild(guild: Guild, officerLeads: OfficerLead[]): string {
	if (typeof guild.leadId === "string" && guild.leadId.length > 0) {
		return guild.leadId
	}

	const matchingLead = officerLeads.find(
		(lead) => lead.fullName.toLowerCase() === guild.leaderName.toLowerCase()
	)

	return matchingLead?.id ?? ""
}

function formatApplicationStatus(status: ApplicationStatus): string {
	if (status === "approved") {
		return "Approved"
	}
	if (status === "rejected") {
		return "Rejected"
	}
	return "Pending"
}

function formatResourceType(type: GuildResource["type"]): string {
	if (type === "pdf") {
		return "PDF"
	}
	if (type === "quiz") {
		return "Quiz"
	}
	if (type === "link") {
		return "Link"
	}
	return "Video"
}

function formatResourceLevel(level: GuildResource["level"]): string {
	if (level === "intermediate") {
		return "Intermediate"
	}
	if (level === "advanced") {
		return "Advanced"
	}
	return "Beginner"
}

function formatSubmittedAt(submittedAt: string): string {
	const date = new Date(submittedAt)
	if (Number.isNaN(date.getTime())) {
		return "N/A"
	}

	return date.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	})
}

function createRoadmapStep(index: number): RoadmapStepFormData {
	return {
		id: createClientId(`roadmap-step-${index}`),
		title: "",
		description: "",
	}
}

function normalizeResource(item: unknown, index: number): GuildResource | null {
	if (!item || typeof item !== "object") {
		return null
	}

	const resource = item as Record<string, unknown>
	const title = typeof resource.title === "string" ? resource.title.trim() : ""

	if (!title) {
		return null
	}

	const typeValue =
		typeof resource.type === "string" ? resource.type.toLowerCase() : "video"
	const type: GuildResource["type"] =
		typeValue === "pdf"
			? "pdf"
			: typeValue === "quiz"
				? "quiz"
				: typeValue === "link"
					? "link"
					: "video"

	const levelValue =
		typeof resource.skillLevel === "string"
			? resource.skillLevel.toLowerCase()
			: typeof resource.level === "string"
				? resource.level.toLowerCase()
				: "beginner"
	const level: GuildResource["level"] =
		levelValue === "advanced"
			? "advanced"
			: levelValue === "intermediate"
				? "intermediate"
				: "beginner"

	return {
		id:
			typeof resource.id === "string"
				? resource.id
				: `resource-${index}`,
		title,
		type,
		level,
		url: typeof resource.url === "string" ? resource.url : "",
		tags: Array.isArray(resource.tags)
			? resource.tags.filter((tag): tag is string => typeof tag === "string")
			: [],
	}
}

function normalizeGuildDetails(item: unknown): Guild | null {
	if (!item || typeof item !== "object") {
		return null
	}

	const guild = item as Record<string, unknown>
	const name = typeof guild.name === "string" ? guild.name.trim() : ""
	const slug = typeof guild.slug === "string" ? guild.slug.trim() : ""
	const leads = Array.isArray(guild.leads) ? guild.leads : []
	const firstLead =
		leads.length > 0 && typeof leads[0] === "object" && leads[0] !== null
			? (leads[0] as Record<string, unknown>)
			: null

	if (!name || !slug) {
		return null
	}

	return {
		id: typeof guild.id === "string" ? guild.id : `guild-${slug}`,
		name,
		slug,
		description: typeof guild.description === "string" ? guild.description : "",
		leadId: typeof firstLead?.id === "string" ? firstLead.id : undefined,
		leaderName:
			typeof guild.leaderName === "string"
				? guild.leaderName
				: typeof firstLead?.fullName === "string"
					? firstLead.fullName
					: "Unassigned",
		image_url:
			typeof guild.image_url === "string" || guild.image_url === null
				? guild.image_url
				: null,
		bannerPosition: typeof guild.bannerPosition === "number" ? guild.bannerPosition : 0,
		memberCount: typeof guild.memberCount === "number" ? guild.memberCount : undefined,
	}
}

type RawAdminUsersResponse = {
	data?: unknown
}

function normalizeOfficerLead(item: unknown, index: number): OfficerLead | null {
	if (!item || typeof item !== "object") {
		return null
	}

	const raw = item as Record<string, unknown>
	const id =
		typeof raw.id === "string"
			? raw.id
			: typeof raw.id === "number"
				? String(raw.id)
				: `officer-${index}`
	const fullName = typeof raw.fullName === "string" ? raw.fullName.trim() : ""
	const email = typeof raw.email === "string" ? raw.email : ""
	const role = typeof raw.role === "string" ? raw.role.toLowerCase() : "officer"

	if (!fullName || role !== "officer") {
		return null
	}

	return {
		id,
		fullName,
		email,
		role: "officer",
	}
}

async function fetchOfficerLeadsFrom(baseUrl: string): Promise<OfficerLead[]> {
	const response = await fetch(`${baseUrl}/admin/users?role=officer&pageSize=100`)
	if (!response.ok) {
		throw new Error(`Officer leads fetch failed with status ${response.status}`)
	}

	const json = (await response.json()) as RawAdminUsersResponse
	const rawData = Array.isArray(json?.data) ? json.data : []

	return rawData
		.map((item, index) => normalizeOfficerLead(item, index))
		.filter((item): item is OfficerLead => item !== null)
}

async function fetchGuildDetailsFrom(baseUrl: string, guildSlug: string) {
	const response = await fetch(`${baseUrl}/guilds/${guildSlug}`)
	if (!response.ok) {
		throw new Error(`Guild details fetch failed with status ${response.status}`)
	}

	const json = (await response.json()) as unknown
	return normalizeGuildDetails(json)
}

async function fetchResourcesFrom(baseUrl: string, guildSlug: string) {
	const response = await fetch(`${baseUrl}/guilds/${guildSlug}/resources`)
	if (!response.ok) {
		throw new Error(`Resources fetch failed with status ${response.status}`)
	}

	const json = (await response.json()) as { data?: unknown }
	const rawData = Array.isArray(json?.data) ? json.data : []

	return rawData
		.map((item, index) => normalizeResource(item, index))
		.filter((item): item is GuildResource => item !== null)
}

type UpdateGuildPayload = {
	name: string
	description: string
	leadId?: string
	badges: ReturnType<typeof labelsToBadges>
	bannerPosition: number
}

async function updateGuildFrom(baseUrl: string, guildSlug: string, payload: UpdateGuildPayload): Promise<Guild> {
	const response = await fetch(`${baseUrl}/guilds/${guildSlug}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})

	if (!response.ok) {
		throw new Error(`Guild update failed with status ${response.status}`)
	}

	const json = (await response.json()) as { guild?: unknown; data?: unknown }
	const normalizedGuild = normalizeGuildDetails(json.guild ?? json.data ?? json)
	if (!normalizedGuild) {
		throw new Error("Guild update response could not be normalized")
	}

	return normalizedGuild
}

async function uploadGuildBannerFrom(baseUrl: string, guildSlug: string, file: File, bannerPosition: number): Promise<string | null> {
	const formData = new FormData()
	formData.append("banner", file)
	formData.append("bannerPosition", String(bannerPosition))

	const response = await fetch(`${baseUrl}/guilds/${guildSlug}/banner`, {
		method: "POST",
		body: formData,
	})

	if (!response.ok) {
		throw new Error(`Banner upload failed with status ${response.status}`)
	}

	const json = (await response.json()) as Record<string, unknown>
	return typeof json.image_url === "string" ? json.image_url : null
}

function getRoadmapStorageKey(guildId: string, guildSlug: string): string {
	return `guild-roadmaps-${guildId || guildSlug}`
}

function MembersStatsSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-3">
			{Array.from({ length: 3 }).map((_, index) => (
				<Card key={`stat-skeleton-${index}`} className="gap-0 border-border bg-background py-0">
					<div className="flex items-center justify-between px-5 py-4 md:px-6">
						<div className="space-y-3">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-12" />
						</div>
						<Skeleton className="h-9 w-9" />
					</div>
				</Card>
			))}
		</div>
	)
}

function MembersTableSkeleton() {
	return (
		<Card className="gap-0 border-border bg-background py-0">
			<div className="space-y-4 p-3 md:p-4">
				<Skeleton className="h-7 w-40" />
				<div className="space-y-2">
					<Skeleton className="h-9 w-full" />
					{Array.from({ length: 5 }).map((_, index) => (
						<Skeleton key={`row-skeleton-${index}`} className="h-10 w-full" />
					))}
				</div>
			</div>
		</Card>
	)
}

// Admin Guild Details page
// - Edit guild profile, manage resources, roadmap, and applications
// - Supports uploading a banner image and saving a banner offset (bannerPosition)
export default function GuildDetailsPage() {
	const navigate = useNavigate()
	const params = useParams<{ slug?: string }>()
	const initialMockGuild = getMockGuildBySlug(params.slug)

	const [activeTab, setActiveTab] = useState("members")
	const [guild, setGuild] = useState<Guild>(initialMockGuild)
	const [officerLeads, setOfficerLeads] = useState<OfficerLead[]>(FALLBACK_OFFICER_LEADS)
	const [applications, setApplications] = useState<GuildApplication[]>([])
	const [resources, setResources] = useState<GuildResource[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [isDetailsOpen, setIsDetailsOpen] = useState(false)
	const [selectedApplication, setSelectedApplication] = useState<GuildApplication | null>(null)
	const [isSavingResource, setIsSavingResource] = useState(false)
	const [isSavingRoadmap, setIsSavingRoadmap] = useState(false)
	const [roadmapPhotoFile, setRoadmapPhotoFile] = useState<File | null>(null)
	const [roadmapPhotoPreviewUrl, setRoadmapPhotoPreviewUrl] = useState<string | null>(null)
	const [selectedRoadmapPreviewStep, setSelectedRoadmapPreviewStep] = useState<string | undefined>(undefined)
	const [resourceFile, setResourceFile] = useState<File | null>(null)
	const [resourceForm, setResourceForm] = useState<ResourceFormData>(DEFAULT_RESOURCE_FORM)
	const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStepFormData[]>([
		createRoadmapStep(1),
	])
	const [guildProfileForm, setGuildProfileForm] = useState<GuildProfileForm>(DEFAULT_GUILD_PROFILE_FORM)
	const [isSavingGuildProfile, setIsSavingGuildProfile] = useState(false)
	const [bannerPhotoFile, setBannerPhotoFile] = useState<File | null>(null)
	const [bannerOffsetY, setBannerOffsetY] = useState(guild.bannerPosition || 0)
	// Multiple roadmap versions management
	const [savedRoadmaps, setSavedRoadmaps] = useState<RoadmapVersion[]>([])
	const [editingRoadmapId, setEditingRoadmapId] = useState<string | null>(null)
	const [roadmapName, setRoadmapName] = useState("Roadmap Version 1")

	const stats = useMemo(() => {
		const total = applications.length
		const pending = applications.filter((item) => item.status === "pending").length
		const approved = applications.filter((item) => item.status === "approved").length

		return { total, pending, approved }
	}, [applications])

	useEffect(() => {
		let isMounted = true
		let timeoutId: number | null = null
		const guildSlug = params.slug ?? initialMockGuild.slug

		const loadData = async () => {
			setIsLoading(true)
			setIsError(false)

			if (!USE_API) {
				timeoutId = window.setTimeout(() => {
					if (!isMounted) {
						return
					}

					const storedResources = getStoredGuildResources(guildSlug)

					setGuild(getMockGuildBySlug(guildSlug))
					setApplications(MOCK_GUILD_APPLICATIONS)
					setResources(storedResources.length > 0 ? storedResources : MOCK_GUILD_RESOURCES)
					setIsLoading(false)
				}, 900)
				return
			}

			try {
				let loadedGuild: Guild | null = null
				let loadedResources: GuildResource[] = []

				try {
					loadedGuild = await fetchGuildDetailsFrom(API_BASE_URL, guildSlug)
					loadedResources = await fetchResourcesFrom(API_BASE_URL, guildSlug)
				} catch {
					loadedGuild = await fetchGuildDetailsFrom(API_FALLBACK_BASE_URL, guildSlug)
					loadedResources = await fetchResourcesFrom(API_FALLBACK_BASE_URL, guildSlug)
				}

				if (!isMounted) {
					return
				}

				const storedResources = getStoredGuildResources(guildSlug)

				setGuild(loadedGuild ?? getMockGuildBySlug(guildSlug))
				setApplications(MOCK_GUILD_APPLICATIONS)
				setResources(loadedResources.length > 0 ? loadedResources : storedResources.length > 0 ? storedResources : MOCK_GUILD_RESOURCES)
			} catch (error) {
				console.error("Failed to load guild details", error)

				if (!isMounted) {
					return
				}

				setGuild(getMockGuildBySlug(guildSlug))
				setApplications(MOCK_GUILD_APPLICATIONS)
				setResources(getStoredGuildResources(guildSlug).length > 0 ? getStoredGuildResources(guildSlug) : MOCK_GUILD_RESOURCES)
				setIsError(true)
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}

			return undefined
		}

		void loadData()

		return () => {
			isMounted = false
			if (timeoutId !== null) {
				window.clearTimeout(timeoutId)
			}
		}
	}, [initialMockGuild.slug, params.slug])

	useEffect(() => {
		let isMounted = true

		const loadOfficerLeads = async () => {
			if (!USE_API) {
				return
			}

			try {
				let leads: OfficerLead[]
				try {
					leads = await fetchOfficerLeadsFrom(API_BASE_URL)
				} catch {
					leads = await fetchOfficerLeadsFrom(API_FALLBACK_BASE_URL)
				}

				if (!isMounted || leads.length === 0) {
					return
				}

				setOfficerLeads(leads)
			} catch (error) {
				console.error("Failed to load officer leads", error)
			}
		}

		void loadOfficerLeads()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		setGuildProfileForm({
			name: guild.name,
			description: guild.description,
			leadId: getLeadIdForGuild(guild, officerLeads),
			badges: resolveGuildBadges(guild).join(", "),
		})
	}, [guild, officerLeads])

	// Load roadmap versions from localStorage and migrate legacy slug-based keys to id-based keys.
	useEffect(() => {
		const guildSlug = params.slug ?? initialMockGuild.slug
		const guildId = guild.id || initialMockGuild.id
		const primaryKey = getRoadmapStorageKey(guildId, guildSlug)
		const legacyKey = `guild-roadmaps-${guildSlug}`
		try {
			const stored = localStorage.getItem(primaryKey) ?? localStorage.getItem(legacyKey)
			if (stored) {
				const roadmapList: RoadmapVersion[] = JSON.parse(stored)
				if (Array.isArray(roadmapList)) {
					setSavedRoadmaps(roadmapList)
					if (!localStorage.getItem(primaryKey)) {
						localStorage.setItem(primaryKey, JSON.stringify(roadmapList))
					}
				}
			} else {
				setSavedRoadmaps([])
			}
		} catch (err) {
			console.error("Error loading roadmaps from localStorage:", err)
		}
	}, [guild.id, initialMockGuild.id, initialMockGuild.slug, params.slug])

	const handleOpenDetails = (application: GuildApplication) => {
		setSelectedApplication(application)
		setIsDetailsOpen(true)
	}

	const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
		setApplications((prev) =>
			prev.map((item) => (item.applicationId === id ? { ...item, status } : item))
		)
		if (selectedApplication && selectedApplication.applicationId === id) {
			setSelectedApplication((prev) =>
				prev ? { ...prev, status } : prev
			)
		}
	}

	const handleResourceInputChange =
		(field: keyof ResourceFormData) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setResourceForm((prev) => ({ ...prev, [field]: event.target.value }))
		}

	const handleRoadmapInputChange =
		(stepId: string, field: "title" | "description") =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setRoadmapSteps((prev) =>
				prev.map((step) =>
					step.id === stepId ? { ...step, [field]: event.target.value } : step
				)
			)
		}

	const handleGuildProfileInputChange =
		(field: keyof GuildProfileForm) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setGuildProfileForm((prev) => ({ ...prev, [field]: event.target.value }))
		}

	
	useEffect(() => {
		if (!roadmapPhotoFile || !roadmapPhotoFile.type.startsWith("image/")) {
			setRoadmapPhotoPreviewUrl(null)
			return undefined
		}

		const objectUrl = URL.createObjectURL(roadmapPhotoFile)
		setRoadmapPhotoPreviewUrl(objectUrl)

		return () => {
			URL.revokeObjectURL(objectUrl)
		}
	}, [roadmapPhotoFile])

	
	const handleSaveResource = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSavingResource(true)

		await new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve()
			}, 1000)
		})

		const newResource: GuildResource = {
			id: createClientId("resource"),
			title: resourceForm.title.trim(),
			type: resourceForm.type,
			level: resourceForm.level,
			url: resourceForm.url.trim(),
			tags: resourceFile ? [resourceFile.name] : [],
		}
		const nextResources = [newResource, ...resources]

		setResources(nextResources)
		saveStoredGuildResources(guild.slug, nextResources)
		setIsSavingResource(false)
		setResourceForm(DEFAULT_RESOURCE_FORM)
		setResourceFile(null)
	}

	// Save guild profile using API-first updates, then keep local storage synchronized for fallback flows.
	const handleSaveGuildProfile = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSavingGuildProfile(true)

		let bannerPhotoDataUrl: string | null = guild.image_url || null
		if (bannerPhotoFile) {
			try {
				bannerPhotoDataUrl = await new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = () => resolve(reader.result as string)
					reader.onerror = reject
					reader.readAsDataURL(bannerPhotoFile)
				})
			} catch (err) {
				console.error("Error converting banner photo to data URL:", err)
			}
		}

		const parsedBadges = labelsToBadges(parseBadgeLabels(guildProfileForm.badges))
		const selectedLead = officerLeads.find((lead) => lead.id === guildProfileForm.leadId) ?? null
		const updatePayload: UpdateGuildPayload = {
			name: guildProfileForm.name.trim() || guild.name,
			description: guildProfileForm.description.trim() || guild.description,
			leadId: selectedLead?.id ?? guild.leadId,
			badges: parsedBadges.length > 0 ? parsedBadges : resolveGuildBadgeEntries(guild),
			bannerPosition: bannerOffsetY,
		}

		let nextGuild: Guild = {
			...guild,
			name: updatePayload.name,
			description: updatePayload.description,
			leadId: updatePayload.leadId,
			leaderName: selectedLead?.fullName ?? guild.leaderName,
			badges: updatePayload.badges,
			image_url: bannerPhotoDataUrl,
			bannerPosition: bannerOffsetY,
		}

		try {
			if (USE_API) {
				try {
					nextGuild = await updateGuildFrom(API_BASE_URL, guild.slug, updatePayload)
					if (bannerPhotoFile) {
						const uploadedImageUrl = await uploadGuildBannerFrom(API_BASE_URL, guild.slug, bannerPhotoFile, bannerOffsetY)
						nextGuild.image_url = uploadedImageUrl ?? nextGuild.image_url
					}
				} catch {
					nextGuild = await updateGuildFrom(API_FALLBACK_BASE_URL, guild.slug, updatePayload)
					if (bannerPhotoFile) {
						const uploadedImageUrl = await uploadGuildBannerFrom(API_FALLBACK_BASE_URL, guild.slug, bannerPhotoFile, bannerOffsetY)
						nextGuild.image_url = uploadedImageUrl ?? nextGuild.image_url
					}
				}
			}

			setGuild(nextGuild)
			upsertStoredGuild(nextGuild)
			setBannerPhotoFile(null)
			setBannerOffsetY(nextGuild.bannerPosition || 0)
		} catch (error) {
			console.error("Failed to save guild profile", error)
			setIsError(true)
		} finally {
			setIsSavingGuildProfile(false)
		}
	}

	const handleAddRoadmapStep = () => {
		setRoadmapSteps((prev) => [...prev, createRoadmapStep(prev.length + 1)])
	}

	const handleRemoveRoadmapStep = (stepId: string) => {
			setRoadmapSteps((prev) => (prev.length > 1 ? prev.filter((step) => step.id !== stepId) : prev))
		}

	const handleSaveRoadmap = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSavingRoadmap(true)

		await new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve()
			}, 1000)
		})

		// Convert photo file to data URL for localStorage persistence
		let photoDataUrl: string | null = null
		if (roadmapPhotoFile) {
			try {
				photoDataUrl = await new Promise((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = () => resolve(reader.result as string)
					reader.onerror = reject
					reader.readAsDataURL(roadmapPhotoFile)
				})
			} catch (err) {
				console.error("Error converting photo to data URL:", err)
			}
		}

		const now = new Date().toISOString()
		let updatedRoadmaps: RoadmapVersion[] = []

		if (editingRoadmapId) {
			// Update existing roadmap version
			updatedRoadmaps = savedRoadmaps.map((rm) =>
				rm.id === editingRoadmapId
					? {
							...rm,
							steps: roadmapSteps,
							photoDataUrl: photoDataUrl || rm.photoDataUrl,
							updatedAt: now,
							isActive: true,
						}
					: { ...rm, isActive: false }
			)
		} else {
			// Create new roadmap version
			const newVersion: RoadmapVersion = {
				id: createClientId("roadmap"),
				name: roadmapName,
				steps: roadmapSteps,
				photoDataUrl,
				createdAt: now,
				updatedAt: now,
				isActive: true,
			}

			// Set all existing to inactive, add new one as active
			updatedRoadmaps = [...savedRoadmaps.map((rm) => ({ ...rm, isActive: false })), newVersion]
		}

		// Save all roadmaps to localStorage
		localStorage.setItem(getRoadmapStorageKey(guild.id, guild.slug), JSON.stringify(updatedRoadmaps))
		setSavedRoadmaps(updatedRoadmaps)

		// Reset form
		setIsSavingRoadmap(false)
		setRoadmapSteps([createRoadmapStep(1)])
		setRoadmapPhotoFile(null)
		setRoadmapPhotoPreviewUrl(null)
		setSelectedRoadmapPreviewStep(undefined)
		setEditingRoadmapId(null)
		setRoadmapName("Roadmap Version 1")
	}

	const handleEditRoadmap = (roadmapId: string) => {
		const roadmap = savedRoadmaps.find((rm) => rm.id === roadmapId)
		if (roadmap) {
			setRoadmapSteps(roadmap.steps)
			setRoadmapName(roadmap.name)
			setEditingRoadmapId(roadmapId)
			// Load photo if exists
			if (roadmap.photoDataUrl) {
				setRoadmapPhotoPreviewUrl(roadmap.photoDataUrl)
			}
		}
	}

	const handleDeleteRoadmap = (roadmapId: string) => {
		const updatedRoadmaps = savedRoadmaps.filter((rm) => rm.id !== roadmapId)
		
		// If deleted one was active, make the first remaining one active
		if (updatedRoadmaps.length > 0 && !updatedRoadmaps.some((rm) => rm.isActive)) {
			updatedRoadmaps[0].isActive = true
		}

		localStorage.setItem(getRoadmapStorageKey(guild.id, guild.slug), JSON.stringify(updatedRoadmaps))
		setSavedRoadmaps(updatedRoadmaps)
	}

	const handleMakeRoadmapActive = (roadmapId: string) => {
		const updatedRoadmaps = savedRoadmaps.map((rm) => ({
			...rm,
			isActive: rm.id === roadmapId,
		}))

		localStorage.setItem(getRoadmapStorageKey(guild.id, guild.slug), JSON.stringify(updatedRoadmaps))
		setSavedRoadmaps(updatedRoadmaps)
	}

	const handleCancelEditRoadmap = () => {
		setEditingRoadmapId(null)
		setRoadmapSteps([createRoadmapStep(1)])
		setRoadmapPhotoFile(null)
		setRoadmapPhotoPreviewUrl(null)
		setRoadmapName("Roadmap Version 1")
	}

	const canSaveResource =
		resourceForm.title.trim().length > 0 && resourceForm.url.trim().length > 0 && !isSavingResource

	const canSaveRoadmap =
		roadmapSteps.length > 0 &&
		roadmapSteps.every((step) => step.title.trim().length > 0 && step.description.trim().length > 0) &&
		!isSavingRoadmap

	return (
		<section className="min-h-screen bg-background section-container section-padding py-8 md:py-10">
			<div className="flex flex-col gap-5">
				<header className="space-y-6">
					<div className="flex items-center justify-between border-b border-border pb-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/admin/create-guilds")}
							className="h-9 px-2.5"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</div>

					<div className="space-y-1">
						<h1 className="text-3xl font-bold text-foreground">{guild.name}</h1>
					</div>

					<Card className="gap-0 border-border bg-background py-0">
						<form className="space-y-4 p-3 md:p-4" onSubmit={handleSaveGuildProfile}>
							<div className="space-y-1">
								<h2 className="text-lg font-bold text-foreground">Guild Profile</h2>
								<p className="text-xs text-muted-foreground">
									Update the fields shown on the Learn page.
								</p>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="guild-profile-name">Guild Name</Label>
									<Input
										id="guild-profile-name"
										value={guildProfileForm.name}
										onChange={handleGuildProfileInputChange("name")}
										placeholder="Guild name"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="guild-profile-leader">Guild Lead</Label>
									<Select
										value={guildProfileForm.leadId}
										onValueChange={(value) =>
											setGuildProfileForm((prev) => ({ ...prev, leadId: value }))
										}
									>
										<SelectTrigger id="guild-profile-leader" className="h-9">
											<SelectValue placeholder="Select an officer" />
										</SelectTrigger>
										<SelectContent>
											{officerLeads.map((lead: OfficerLead) => (
												<SelectItem key={lead.id} value={lead.id}>
													{lead.fullName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										Lead name syncs to the selected officer.
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="guild-profile-description">Description</Label>
								<Textarea
									id="guild-profile-description"
									value={guildProfileForm.description}
									onChange={handleGuildProfileInputChange("description")}
									rows={3}
									placeholder="Short description shown on the Learn page"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="guild-profile-badges">Badges / Categories</Label>
								<Input
									id="guild-profile-badges"
									value={guildProfileForm.badges}
									onChange={handleGuildProfileInputChange("badges")}
									placeholder="Frontend, Backend, Full-Stack, Web Apps"
								/>
								<div className="flex flex-wrap gap-2 pt-1">
									{parseBadgeLabels(guildProfileForm.badges).length > 0
										? labelsToBadges(parseBadgeLabels(guildProfileForm.badges)).map((badge) => (
											<Badge key={badge.label} variant={badge.variant} className="px-2 py-0.5 text-[10px]">
												{badge.label}
											</Badge>
										))
										: getSuggestedGuildBadgeEntries(guild).map((badge) => (
											<Badge key={badge.label} variant={badge.variant} className="px-2 py-0.5 text-[10px]">
												{badge.label}
											</Badge>
										))}
								</div>
								<p className="text-xs text-muted-foreground">
									Enter up to 6 labels separated by commas. These appear on the Learn page.
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="guild-profile-banner">Guild Banner Photo</Label>
								{bannerPhotoFile ? (
									<DirectBannerEditor
										imageFile={bannerPhotoFile}
										onSave={(file, offsetY) => {
											setBannerPhotoFile(file)
											setBannerOffsetY(offsetY)
										}}
										onCancel={() => {
											setBannerPhotoFile(null)
											setBannerOffsetY(0)
										}}
										initialOffsetY={bannerOffsetY}
									/>
								) : guild.image_url ? (
									<BannerDisplay
										imageUrl={guild.image_url}
										position={guild.bannerPosition}
										alt="Current banner"
									/>
								) : null}
								<UploadField
									id="guild-profile-banner"
									label=""
									helperText="Drag and drop or click to browse"
									buttonText="Choose banner image"
									accept="image/*"
									selectedFile={bannerPhotoFile}
									onFileSelect={(file) => {
										if (file) {
											setBannerPhotoFile(file)
											setBannerOffsetY(0)
										}
									}}
									previewMode="image"
								/>
								<p className="text-xs text-muted-foreground">
									Optional. Recommended size: 844x500px. Formats: JPG, PNG, WebP. Leave empty to keep current banner.
								</p>
							</div>

							<div className="flex justify-end">
								<Button type="submit" variant="default" disabled={isSavingGuildProfile} className="h-9">
									{isSavingGuildProfile ? "Saving..." : "Save Guild Profile"}
								</Button>
							</div>
						</form>
					</Card>

					<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
						<div className="flex justify-center">
							<TabsList className="h-9 border border-border bg-muted/70 p-0.5">
								<TabsTrigger value="members" className="h-7 px-4 text-xs data-[state=active]:bg-background data-[state=active]:font-semibold">
									Members
								</TabsTrigger>
								<TabsTrigger value="roadmap" className="h-7 px-4 text-xs data-[state=active]:bg-background data-[state=active]:font-semibold">
									Roadmap
								</TabsTrigger>
								<TabsTrigger value="resources" className="h-7 px-4 text-xs data-[state=active]:bg-background data-[state=active]:font-semibold">
									Resources
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="members" className="space-y-4">
							{isError ? (
								<Card className="gap-0 border-border bg-background py-0">
									<div className="px-5 py-3 text-sm text-muted-foreground">
										Live guild application data could not be loaded. Showing fallback data for frontend testing.
									</div>
								</Card>
							) : null}

							{isLoading ? (
								<>
									<MembersStatsSkeleton />
									<MembersTableSkeleton />
								</>
							) : (
								<>
									<div className="grid gap-3 md:grid-cols-3">
										<Card className="gap-0 border-border bg-background py-0">
											<div className="flex items-center justify-between px-5 py-4 md:px-6">
												<div>
													<p className="text-sm text-muted-foreground">Total Application</p>
													<p className="text-4xl font-bold text-foreground">{stats.total}</p>
												</div>
												<Asterisk className="h-9 w-9 text-info" />
											</div>
										</Card>

										<Card className="gap-0 border-border bg-background py-0">
											<div className="flex items-center justify-between px-5 py-4 md:px-6">
												<div>
													<p className="text-sm text-muted-foreground">Pending</p>
													<p className="text-4xl font-bold text-foreground">{stats.pending}</p>
												</div>
												<Asterisk className="h-9 w-9 text-warning" />
											</div>
										</Card>

										<Card className="gap-0 border-border bg-background py-0">
											<div className="flex items-center justify-between px-5 py-4 md:px-6">
												<div>
													<p className="text-sm text-muted-foreground">Approved</p>
													<p className="text-4xl font-bold text-foreground">{stats.approved}</p>
												</div>
												<Asterisk className="h-9 w-9 text-success" />
											</div>
										</Card>
									</div>

									<Card className="gap-0 border-border bg-background py-0">
										<div className="space-y-4 p-3 md:p-4">
											<h2 className="text-2xl font-bold text-foreground">Guild Application</h2>
											<Table>
												<TableHeader>
													<TableRow>
														<TableHead className="h-10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Name</TableHead>
														<TableHead className="h-10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Student ID</TableHead>
														<TableHead className="h-10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Email</TableHead>
														<TableHead className="h-10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Course</TableHead>
														<TableHead className="h-10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
														<TableHead className="h-10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date Submitted</TableHead>
														<TableHead className="h-10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{applications.map((application) => (
														<TableRow key={application.applicationId}>
															<TableCell className="px-3 py-2 text-xs font-medium text-foreground">
																{application.name}
															</TableCell>
															<TableCell className="px-3 py-2 text-xs text-muted-foreground">{application.studentId}</TableCell>
															<TableCell className="px-3 py-2 text-xs text-muted-foreground">{application.email}</TableCell>
															<TableCell className="px-3 py-2 text-xs text-muted-foreground">{application.course}</TableCell>
															<TableCell className="px-3 py-2">
																<Badge
																	variant={
																		application.status === "approved"
																			? "success"
																			: application.status === "rejected"
																				? "destructive"
																				: "warning"
																	}
																	className="min-w-16 justify-center px-2 py-0.5 text-[10px]"
																>
																	{formatApplicationStatus(application.status)}
																</Badge>
															</TableCell>
															<TableCell className="px-3 py-2 text-xs text-muted-foreground">{formatSubmittedAt(application.submittedAt)}</TableCell>
															<TableCell className="px-3 py-2">
																<div className="flex items-center gap-0.5">
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		onClick={() => handleOpenDetails(application)}
																		className="h-7 w-7"
																	>
																		<Eye className="h-3.5 w-3.5 text-info" />
																	</Button>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		onClick={() => handleUpdateStatus(application.applicationId, "approved")}
																		disabled={application.status === "approved"}
																		className="h-7 w-7"
																	>
																		<Check className="h-3.5 w-3.5 text-success" />
																	</Button>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		onClick={() => handleUpdateStatus(application.applicationId, "rejected")}
																		disabled={application.status === "rejected"}
																		className="h-7 w-7"
																	>
																		<X className="h-3.5 w-3.5 text-destructive" />
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</Card>
								</>
							)}
						</TabsContent>

						<TabsContent value="roadmap" className="space-y-4">
							<div className="space-y-1">
								<h2 className="text-3xl font-bold text-foreground">Add Roadmap</h2>
								<p className="text-sm text-muted-foreground">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								</p>
							</div>

							<Card className="gap-0 border-border bg-background py-0">
								<form className="space-y-4 p-3 md:p-4" onSubmit={handleSaveRoadmap}>
									<div className="space-y-1">
										<h3 className="text-2xl font-bold text-foreground">Learning Roadmap</h3>
										<p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
									</div>

									{/* Roadmap name input */}
									<div className="space-y-2">
										<Label htmlFor="roadmap-name">Roadmap Name</Label>
										<Input
											id="roadmap-name"
											placeholder="e.g., Roadmap Version 1"
											value={roadmapName}
											onChange={(e) => setRoadmapName(e.target.value)}
										/>
									</div>

									<div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
										<div className="space-y-3 border border-border p-3">
											<UploadField
												id="roadmap-photo"
												label="Roadmap Photo"
												buttonText="Click to upload a photo"
												helperText="PNG, JPG up to 5MB"
												accept="image/*"
												selectedFile={roadmapPhotoFile}
												onFileSelect={setRoadmapPhotoFile}
												previewMode="image"
											/>

											{roadmapSteps.map((step, index) => (
												<div key={step.id} className="space-y-3 border border-border p-3">
													<div className="flex items-center justify-between">
														<p className="text-sm font-semibold text-foreground">Step {index + 1}</p>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="h-7 w-7"
															onClick={() => handleRemoveRoadmapStep(step.id)}
															disabled={roadmapSteps.length === 1}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>

													<div className="space-y-2">
														<Label htmlFor={`${step.id}-title`}>Title</Label>
														<Input
															id={`${step.id}-title`}
															placeholder="Enter roadmap title"
															value={step.title}
															onChange={handleRoadmapInputChange(step.id, "title")}
														/>
													</div>

													<div className="space-y-2">
														<Label htmlFor={`${step.id}-description`}>Description</Label>
														<Textarea
															id={`${step.id}-description`}
															placeholder="Enter description"
															value={step.description}
															onChange={handleRoadmapInputChange(step.id, "description")}
															rows={3}
														/>
													</div>
												</div>
											))}

											<Button type="button" variant="outlinePrimary" className="h-9 w-full" onClick={handleAddRoadmapStep}>
												<Plus />
												Add Roadmap Step
											</Button>
										</div>

										<Card className="gap-0 border-border bg-background py-0">
											<div className="space-y-3 p-3">
												<div className="space-y-1">
													<h4 className="text-lg font-bold text-foreground">Roadmap Preview</h4>
													<p className="text-xs text-muted-foreground">Live draft updates as you type. Descriptions appear only when a step is expanded.</p>
												</div>

												{roadmapPhotoPreviewUrl ? (
													<img
														src={roadmapPhotoPreviewUrl}
														alt="Roadmap preview"
														className="max-h-56 w-full rounded-md border border-border object-contain"
													/>
												) : (
													<div className="flex min-h-40 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
														Upload a roadmap photo to preview it here.
													</div>
												)}

												<Accordion type="single" collapsible value={selectedRoadmapPreviewStep} onValueChange={setSelectedRoadmapPreviewStep}>
													{roadmapSteps.map((step, index) => (
														<AccordionItem key={`preview-${step.id}`} value={step.id} className="border-b border-border last:border-b-0">
															<AccordionTrigger className="px-0 py-3 hover:no-underline">
																<div className="flex items-center gap-3">
																	<div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${selectedRoadmapPreviewStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
																		{index + 1}
																	</div>
																	<span className="text-left text-sm font-bold text-foreground">
																		{step.title || "Untitled step"}
																	</span>
																</div>
															</AccordionTrigger>
															<AccordionContent className="ml-11 text-sm text-muted-foreground">
																{step.description || "No description yet."}
															</AccordionContent>
														</AccordionItem>
													))}
												</Accordion>
											</div>
										</Card>
									</div>

									<div className="grid gap-3 md:grid-cols-2">
										<Button
											type="button"
											variant="outlineGrey"
											onClick={handleCancelEditRoadmap}
											className="h-9"
										>
											Cancel
										</Button>
										<Button type="submit" variant="default" disabled={!canSaveRoadmap} className="h-9">
											{isSavingRoadmap ? "Saving..." : editingRoadmapId ? "Update Roadmap" : "Save Roadmap"}
										</Button>
									</div>
								</form>
							</Card>

							{/* Saved Roadmaps List */}
							{savedRoadmaps.length > 0 && (
								<Card className="gap-0 border-border bg-background py-0">
									<div className="space-y-4 p-3 md:p-4">
										<div className="space-y-1">
											<h3 className="text-lg font-bold text-foreground">Saved Roadmap Versions</h3>
											<p className="text-xs text-muted-foreground">Manage your roadmap versions. Only one can be active and shown in the learn page.</p>
										</div>

										<div className="space-y-2">
											{savedRoadmaps.map((roadmap) => (
												<div key={roadmap.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
													<div className="flex-1">
														<div className="flex items-center gap-2">
															<h4 className="font-semibold text-foreground">{roadmap.name}</h4>
															{roadmap.isActive && (
																<Badge variant="success" className="text-xs">
																	Active
																</Badge>
															)}
														</div>
														<p className="text-xs text-muted-foreground">
															{roadmap.steps.length} step(s) • Updated {new Date(roadmap.updatedAt).toLocaleDateString()}
														</p>
													</div>

													<div className="flex gap-1">
														{!roadmap.isActive && (
															<Button
																type="button"
																variant="ghost"
																size="sm"
																onClick={() => handleMakeRoadmapActive(roadmap.id)}
																className="text-xs"
															>
																Make Active
															</Button>
														)}
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => handleEditRoadmap(roadmap.id)}
															className="text-xs"
														>
															Edit
														</Button>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => handleDeleteRoadmap(roadmap.id)}
															className="text-xs text-destructive hover:text-destructive"
														>
															Delete
														</Button>
													</div>
												</div>
											))}
										</div>
									</div>
								</Card>
							)}
						</TabsContent>

						<TabsContent value="resources" className="space-y-4">
							<div className="space-y-1">
								<h2 className="text-3xl font-bold text-foreground">Add Resources</h2>
								<p className="text-sm text-muted-foreground">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								</p>
							</div>

							<Card className="gap-0 border-border bg-background py-0">
								<form className="space-y-4 p-3 md:p-4" onSubmit={handleSaveResource}>
									<div className="space-y-1">
										<h3 className="text-2xl font-bold text-foreground">Learning Resources</h3>
										<p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
									</div>

									<div className="space-y-3 border border-border p-3">
										<div className="space-y-2">
											<Label htmlFor="resource-title">Resource Title</Label>
											<Input
												id="resource-title"
												value={resourceForm.title}
												onChange={handleResourceInputChange("title")}
												placeholder="Enter resource title"
											/>
										</div>

										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="resource-type">Type</Label>
												<Select
													value={resourceForm.type}
													onValueChange={(value: GuildResource["type"]) =>
														setResourceForm((prev) => ({ ...prev, type: value }))
													}
												>
													<SelectTrigger id="resource-type">
														<SelectValue placeholder="Select resource type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="video">Video</SelectItem>
														<SelectItem value="pdf">PDF</SelectItem>
														<SelectItem value="link">Link</SelectItem>
														<SelectItem value="quiz">Quiz</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="resource-level">Skill Level</Label>
												<Select
													value={resourceForm.level}
													onValueChange={(value: GuildResource["level"]) =>
														setResourceForm((prev) => ({ ...prev, level: value }))
													}
												>
													<SelectTrigger id="resource-level">
														<SelectValue placeholder="Select skill level" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="beginner">Beginner</SelectItem>
														<SelectItem value="intermediate">Intermediate</SelectItem>
														<SelectItem value="advanced">Advanced</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="resource-url">URL</Label>
											<Input
												id="resource-url"
												value={resourceForm.url}
												onChange={handleResourceInputChange("url")}
												placeholder="https://..."
											/>
										</div>

										<div className="space-y-2">
											<UploadField
												id="resource-file"
												label="Resource File"
												buttonText="Click to upload a file"
												helperText="PDF, DOC, DOCX up to 10MB"
												accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
												selectedFile={resourceFile}
												onFileSelect={setResourceFile}
												previewMode="file"
											/>
										</div>

									</div>

									<div className="grid gap-3 md:grid-cols-2">
										<Button
											type="button"
											variant="outlineGrey"
											onClick={() => setResourceForm(DEFAULT_RESOURCE_FORM)}
											disabled={isSavingResource}
											className="h-9"
										>
											Cancel
										</Button>
										<Button type="submit" variant="default" disabled={!canSaveResource} className="h-9">
											{isSavingResource ? "Saving..." : "Save"}
										</Button>
									</div>
								</form>
							</Card>

							{resources.length > 0 ? (
								<Card className="gap-0 border-border bg-background py-0">
									<div className="space-y-3 p-4 md:p-6">
										<h3 className="text-lg font-bold text-foreground">Existing Resources</h3>
										<div className="space-y-2">
											{resources.map((resource) => (
												<div
													key={resource.id}
													className="flex flex-col gap-2 border border-border bg-background p-3 md:flex-row md:items-center md:justify-between"
												>
													<div>
														<p className="font-semibold text-foreground">{resource.title}</p>
														<p className="text-sm text-muted-foreground">
															{formatResourceType(resource.type)} · {formatResourceLevel(resource.level)}
														</p>
													</div>
													<a
														href={resource.url}
														target="_blank"
														rel="noreferrer"
														className="text-sm font-medium text-primary hover:underline"
													>
														Open Resource
													</a>
												</div>
											))}
										</div>
									</div>
								</Card>
							) : null}
						</TabsContent>
					</Tabs>
				</header>
			</div>

			<Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
				<DialogContent className="max-w-[540px] border-border bg-background p-4 md:p-5">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">Application Details</DialogTitle>
					</DialogHeader>

					<div className="space-y-3">
						<div className="space-y-2">
							<Label htmlFor="why-join" className="text-xs font-medium text-foreground">Why join this guild? <span className="text-destructive">*</span></Label>
							<Textarea
								id="why-join"
								value={selectedApplication?.whyJoin ?? ""}
								readOnly
								rows={3}
								className="min-h-[74px]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="motivation" className="text-xs font-medium text-foreground">Motivation <span className="text-destructive">*</span></Label>
							<Textarea
								id="motivation"
								value={selectedApplication?.motivation ?? ""}
								readOnly
								rows={3}
								className="min-h-[74px]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="experience" className="text-xs font-medium text-foreground">Experience</Label>
							<Textarea
								id="experience"
								value={selectedApplication?.experience ?? ""}
								readOnly
								rows={3}
								className="min-h-[74px]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="portfolio">Portfolio URL (optional)</Label>
							<Input
								id="portfolio"
								value={selectedApplication?.portfolioUrl ?? ""}
								readOnly
							/>
						</div>
					</div>

					<DialogFooter className="grid grid-cols-2 gap-3 pt-2 sm:space-x-0">
						<Button
							type="button"
							variant="outlineSuccess"
							className="h-9"
							onClick={() => {
								if (selectedApplication) {
									handleUpdateStatus(selectedApplication.applicationId, "approved")
								}
								setIsDetailsOpen(false)
							}}
						>
							Approve
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="h-9"
							onClick={() => {
								if (selectedApplication) {
									handleUpdateStatus(selectedApplication.applicationId, "rejected")
								}
								setIsDetailsOpen(false)
							}}
						>
							Reject
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

					</section>
	)
}
