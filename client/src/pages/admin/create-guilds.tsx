import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
	BarChart3,
	BrainCircuit,
	ChevronRight,
	Cog,
	Globe,
	Palette,
	Plus,
	Shield,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadField, DirectBannerEditor } from "@/components/ui/custom"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
	FALLBACK_OFFICER_LEADS,
	getStoredGuilds,
	getSuggestedGuildBadgeEntries,
	upsertStoredGuild,
	type GuildBadge,
	type Guild as ContractGuild,
	type OfficerLead,
} from "@/data/mockGuildAdmin"
import {
	labelsToBadges,
	parseBadgeLabels,
	toSlug,
} from "@/lib/guild-admin-utils"
import { createClientId } from "@/lib/client-id"

// Admin Create Guilds page
// - Displays existing guilds (local or from API)
// - Opens a modal to create a new guild, including optional banner upload
// - Persists new guilds to localStorage via `upsertStoredGuild` when API is not used
type FormData = {
	name: string
	description: string
	leadId: string
	badges: string
	status: "Active" | "Inactive"
	bannerPhotoFile: File | null
}

type GuildView = ContractGuild & {
	status: "Active" | "Inactive"
}

// Default form state for the Create Guild modal
const DEFAULT_FORM_DATA: FormData = {
	name: "",
	description: "",
	leadId: "",
	badges: "",
	status: "Active",
	bannerPhotoFile: null,
}

const API_BASE_URL = "https://api.msc-nulaguna.org/v1"
const API_FALLBACK_BASE_URL = "/api"
const USE_API = import.meta.env.VITE_USE_LIVE_GUILD_API === "true"

function normalizeGuild(item: unknown, index: number): GuildView | null {
	if (!item || typeof item !== "object") {
		return null
	}

	const guild = item as Record<string, unknown>
	const rawName = typeof guild.name === "string" ? guild.name.trim() : ""
	if (!rawName) {
		return null
	}

	const rawId = typeof guild.id === "string" ? guild.id : `guild-${index}`
	const rawSlug =
		typeof guild.slug === "string" && guild.slug.trim().length > 0
			? guild.slug
			: toSlug(rawName)

	return {
		id: rawId,
		name: rawName,
		slug: rawSlug,
		description:
			typeof guild.description === "string" ? guild.description : "",
		leadId: typeof guild.leadId === "string" ? guild.leadId : undefined,
		leaderName:
			typeof guild.leaderName === "string" && guild.leaderName.trim().length > 0
				? guild.leaderName
				: "Unassigned",
		badges:
			Array.isArray(guild.badges) && guild.badges.length > 0
				? (guild.badges as GuildBadge[])
				: getSuggestedGuildBadgeEntries({ name: rawName, slug: rawSlug }),
		memberCount:
			typeof guild.memberCount === "number" ? guild.memberCount : undefined,
		status: "Active",
	}
}

function toGuildView(guild: ContractGuild): GuildView {
	return {
		...guild,
		badges: guild.badges && guild.badges.length > 0 ? guild.badges : getSuggestedGuildBadgeEntries(guild),
		status: "Active",
	}
}

// Fetch guild list from server. Falls back to local stored guilds on error.
async function fetchGuildsFrom(baseUrl: string): Promise<GuildView[]> {
	const response = await fetch(`${baseUrl}/guilds`)
	if (!response.ok) {
		throw new Error(`Guild fetch failed with status ${response.status}`)
	}

	const json = (await response.json()) as { data?: unknown }
	const rawData = Array.isArray(json?.data) ? json.data : []
	return rawData
		.map((item, index) => normalizeGuild(item, index))
		.filter((item): item is GuildView => item !== null)
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

type CreateGuildPayload = {
	name: string
	description: string
	leadId: string
	leadName: string
	badges: GuildBadge[]
	status: "Active" | "Inactive"
}

function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

async function uploadGuildBannerFrom(baseUrl: string, guildSlug: string, file: File): Promise<string | null> {
	const formData = new FormData()
	formData.append("banner", file)
	formData.append("bannerPosition", "0")

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

async function createGuildFrom(baseUrl: string, payload: CreateGuildPayload, bannerPhotoFile: File | null): Promise<GuildView> {
	const response = await fetch(`${baseUrl}/guilds`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: payload.name,
			slug: toSlug(payload.name),
			description: payload.description,
			leadId: payload.leadId,
			badges: payload.badges,
			image_url: null,
			bannerPosition: 0,
		}),
	})

	if (!response.ok) {
		throw new Error(`Guild create failed with status ${response.status}`)
	}

	const json = (await response.json()) as { guild?: unknown; data?: unknown }
	const rawGuild = json.guild ?? json.data ?? json
	const normalizedGuild = normalizeGuild(rawGuild, 0)

	if (!normalizedGuild) {
		throw new Error("Guild create response could not be normalized")
	}

	let imageUrl: string | null = null
	if (bannerPhotoFile) {
		imageUrl = await uploadGuildBannerFrom(baseUrl, normalizedGuild.slug, bannerPhotoFile)
	}

	return {
		...normalizedGuild,
		status: payload.status,
		image_url: imageUrl ?? normalizedGuild.image_url,
	}
}

function guildIcon(name: string) {
	const lower = name.toLowerCase()

	if (lower.includes("website") || lower.includes("web")) {
		return Globe
	}
	if (lower.includes("cyber")) {
		return Shield
	}
	if (lower.includes("data")) {
		return BarChart3
	}
	if (lower.includes("ui") || lower.includes("ux") || lower.includes("design")) {
		return Palette
	}
	if (lower.includes("ai") || lower.includes("ml")) {
		return BrainCircuit
	}
	if (lower.includes("rpa") || lower.includes("automation")) {
		return Cog
	}

	return Globe
}

function GuildRowSkeleton() {
	return (
		<Card className="gap-0 border-border bg-background py-0">
			<div className="grid min-h-20 grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3 md:px-6">
				<Skeleton className="h-6 w-6" />
				<div className="space-y-2">
					<Skeleton className="h-6 w-64" />
					<Skeleton className="h-3.5 w-24" />
				</div>
				<Skeleton className="h-6 w-14" />
				<Skeleton className="h-5 w-5" />
			</div>
		</Card>
	)
}

export default function CreateGuildsPage() {
	const navigate = useNavigate()
	const [guilds, setGuilds] = useState<GuildView[]>([])
	const [officerLeads, setOfficerLeads] = useState<OfficerLead[]>(FALLBACK_OFFICER_LEADS)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
	
	const canSubmit = useMemo(() => {
		return (
			formData.name.trim().length > 0 &&
			formData.description.trim().length > 0 &&
			formData.leadId.length > 0 &&
			!isSubmitting
		)
	}, [formData, isSubmitting])

	useEffect(() => {
		let isMounted = true

		const loadGuilds = async () => {
			setIsLoading(true)
			setIsError(false)

			if (!USE_API) {
				if (isMounted) {
					setGuilds(getStoredGuilds().map(toGuildView))
					setIsLoading(false)
				}
				return
			}

			try {
				let loadedGuilds: GuildView[] = []

				try {
					loadedGuilds = await fetchGuildsFrom(API_BASE_URL)
				} catch {
					loadedGuilds = await fetchGuildsFrom(API_FALLBACK_BASE_URL)
				}

				if (!isMounted) {
					return
				}

				setGuilds(loadedGuilds)
			} catch (error) {
				console.error("Failed to load guilds", error)

				if (!isMounted) {
					return
				}

				setGuilds(getStoredGuilds().map(toGuildView))
				setIsError(true)
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		loadGuilds()

		return () => {
			isMounted = false
		}
	}, [])

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

	const handleOpenChange = (open: boolean) => {
		setIsModalOpen(open)
		if (!open) {
			setFormData(DEFAULT_FORM_DATA)
		}
	}

	const handleInputChange =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormData((prev) => ({ ...prev, [field]: event.target.value }))
		}

	
	// Handle form submit by creating the guild through API when enabled,
	// then keeping local fallback storage in sync for frontend continuity.
	const handleCreateGuild = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!canSubmit) {
			return
		}

		setIsSubmitting(true)

		const selectedLead = officerLeads.find((lead) => lead.id === formData.leadId) ?? null
		const slug = toSlug(formData.name)
		const parsedBadges = labelsToBadges(parseBadgeLabels(formData.badges))
		const payload: CreateGuildPayload = {
			name: formData.name.trim(),
			description: formData.description.trim(),
			leadId: formData.leadId,
			leadName: selectedLead?.fullName ?? "Unassigned",
			badges: parsedBadges,
			status: formData.status,
		}

		let createdGuild: GuildView

		try {
			if (USE_API) {
				try {
					createdGuild = await createGuildFrom(API_BASE_URL, payload, formData.bannerPhotoFile)
				} catch {
					createdGuild = await createGuildFrom(API_FALLBACK_BASE_URL, payload, formData.bannerPhotoFile)
				}
			} else {
				let bannerPhotoDataUrl: string | null = null
				if (formData.bannerPhotoFile) {
					bannerPhotoDataUrl = await readFileAsDataUrl(formData.bannerPhotoFile)
				}

				createdGuild = {
					id: createClientId("guild"),
					name: payload.name,
					slug,
					description: payload.description,
					leadId: payload.leadId,
					leaderName: payload.leadName,
					badges:
						payload.badges.length > 0
							? payload.badges
							: getSuggestedGuildBadgeEntries({ name: payload.name, slug }),
					image_url: bannerPhotoDataUrl,
					memberCount: 0,
					status: payload.status,
				}
			}

			setGuilds((prev) => [createdGuild, ...prev])

			upsertStoredGuild({
				id: createdGuild.id,
				name: createdGuild.name,
				slug: createdGuild.slug,
				description: createdGuild.description,
				leadId: createdGuild.leadId,
				leaderName: createdGuild.leaderName,
				badges: createdGuild.badges,
				image_url: createdGuild.image_url,
				memberCount: createdGuild.memberCount ?? 0,
			})

			setIsModalOpen(false)
			setFormData(DEFAULT_FORM_DATA)
		} catch (error) {
			console.error("Failed to create guild", error)
			setIsError(true)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="min-h-screen bg-background section-container section-padding py-8 md:py-10">
			<div className="flex flex-col gap-5">
				<header className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
					<div className="space-y-1">
						<h1 className="text-4xl font-bold text-foreground">Guilds</h1>
						<p className="text-sm text-muted-foreground">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</p>
					</div>

					<Button
						type="button"
						onClick={() => setIsModalOpen(true)}
						variant="default"
						size="lg"
						className="w-full md:w-auto"
					>
						<Plus/>
						Add Guild
					</Button>
				</header>

				{isError ? (
					<Card className="gap-0 border-border bg-background py-0">
						<div className="px-5 py-3 text-sm text-muted-foreground">
							Live guild data could not be loaded.
						</div>
					</Card>
				) : null}

				<div className="space-y-3">
					{isLoading
						? Array.from({ length: 6 }).map((_, index) => (
								<GuildRowSkeleton key={`guild-skeleton-${index}`} />
							))
						: guilds.length === 0
							? (
								<Card className="gap-0 border-border bg-background py-0">
									<div className="px-5 py-8 text-sm text-muted-foreground">
										No guilds yet. Click Add Guild to create your first guild.
									</div>
								</Card>
							)
							: guilds.map((guild) => {
								const Icon = guildIcon(guild.name)

								return (
									<Card
										key={guild.id}
										className="group gap-0 border-border bg-background py-0"
									>
										<Button
											type="button"
											variant="ghost"
											onClick={() => navigate(`/admin/guilds/${guild.slug}`)}
											className="grid min-h-20 h-auto w-full grid-cols-[auto_1fr_auto_auto] items-center justify-start gap-4 rounded-none px-4 py-3 text-left md:px-6"
										>
											<Icon className="h-6 w-6 text-foreground" />

											<div>
											<h2 className="text-lg font-bold leading-tight text-foreground md:text-xl">
												{guild.name}
											</h2>
											<p className="mt-0.5 text-sm text-muted-foreground">
												{guild.leaderName}
											</p>
										</div>

										<Badge
											variant={guild.status === "Inactive" ? "destructive" : "success"}
											className="justify-self-center px-3 py-0.5 text-xs font-medium"
										>
											{guild.status}
										</Badge>

											<ChevronRight className="h-5 w-5 text-foreground transition-transform group-hover:translate-x-0.5" />
										</Button>
									</Card>
								)
							})}
				</div>
			</div>

			<Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
				<DialogContent className="max-w-md border-border bg-background p-4 md:p-5">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">Create Guild</DialogTitle>
						<DialogDescription>
							Create a new guild that members can join and learn from.
						</DialogDescription>
					</DialogHeader>

					<form className="space-y-3" onSubmit={handleCreateGuild}>
						<div className="space-y-2">
							<Label htmlFor="guild-name" className="text-xs font-medium uppercase tracking-wide text-foreground">
								Guild Name
							</Label>
							<Input
								id="guild-name"
								value={formData.name}
								onChange={handleInputChange("name")}
								placeholder="Enter guild name"
								autoComplete="off"
								className="h-9"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="guild-description" className="text-xs font-medium uppercase tracking-wide text-foreground">
								Description
							</Label>
							<Textarea
								id="guild-description"
								value={formData.description}
								onChange={handleInputChange("description")}
								placeholder="Brief overview of the guild and what members will learn."
								rows={3}
								className="min-h-[78px]"
							/>
						</div>

					<div className="space-y-2">
						<Label htmlFor="guild-banner" className="text-xs font-medium uppercase tracking-wide text-foreground">
							Guild Banner Photo
						</Label>
						{formData.bannerPhotoFile ? (
							<DirectBannerEditor
								imageFile={formData.bannerPhotoFile}
								onSave={(file) => {
									setFormData((prev) => ({ ...prev, bannerPhotoFile: file }))
								}}
								onCancel={() => {
									setFormData((prev) => ({ ...prev, bannerPhotoFile: null }))
								}}
							/>
						) : (
							<UploadField
								id="guild-banner"
								label=""
								helperText="Drag and drop or click to browse"
								buttonText="Choose banner image"
								accept="image/*"
								selectedFile={formData.bannerPhotoFile}
								onFileSelect={(file) => {
									if (file) {
										setFormData((prev) => ({ ...prev, bannerPhotoFile: file }))
									}
								}}
								previewMode="image"
							/>
						)}
						<p className="text-xs text-muted-foreground">
							Optional. Recommended size: 844x500px. Formats: JPG, PNG, WebP
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="guild-badges" className="text-xs font-medium uppercase tracking-wide text-foreground">
								Badges / Categories
							</Label>
							<Input
								id="guild-badges"
								value={formData.badges}
								onChange={handleInputChange("badges")}
								placeholder="Frontend, Backend, Full-Stack, Web Apps"
								autoComplete="off"
								className="h-9"
							/>
							<div className="flex flex-wrap gap-2 pt-1">
								{parseBadgeLabels(formData.badges).length > 0
									? labelsToBadges(parseBadgeLabels(formData.badges)).map((badge) => (
										<Badge key={badge.label} variant={badge.variant} className="px-2 py-0.5 text-[10px]">
											{badge.label}
										</Badge>
									))
									: getSuggestedGuildBadgeEntries({ name: formData.name, slug: toSlug(formData.name || "guild") }).map((badge) => (
										<Badge key={badge.label} variant={badge.variant} className="px-2 py-0.5 text-[10px]">
											{badge.label}
										</Badge>
									))}
							</div>
							<p className="text-xs text-muted-foreground">
								Add up to 6 labels separated by commas. The preview uses badge colors to keep alignment consistent.
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="guild-lead" className="text-xs font-medium uppercase tracking-wide text-foreground">
								Guild Lead
							</Label>
							<Select
								value={formData.leadId}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, leadId: value }))
								}
							>
								<SelectTrigger id="guild-lead" aria-label="Select guild lead" className="h-9">
									<SelectValue placeholder="Select a guild lead" />
								</SelectTrigger>
								<SelectContent>
									{officerLeads.map((lead) => (
										<SelectItem key={lead.id} value={lead.id}>
											{lead.fullName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								For frontend testing. Officer list will come from API users with officer role.
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="guild-status" className="text-xs font-medium uppercase tracking-wide text-foreground">
								Status
							</Label>
							<Select
								value={formData.status}
								onValueChange={(value: "Active" | "Inactive") =>
									setFormData((prev) => ({ ...prev, status: value }))
								}
							>
								<SelectTrigger id="guild-status" aria-label="Select guild status" className="h-9">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								Inactive guilds will not appear in public guild listings.
							</p>
						</div>

						<DialogFooter className="grid grid-cols-2 gap-2 pt-1 sm:space-x-0">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isSubmitting}
								className="h-9"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="default"
								disabled={!canSubmit}
								className="h-9"
							>
								{isSubmitting ? "Creating..." : "Create Guild"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

					</section>
	)
}
