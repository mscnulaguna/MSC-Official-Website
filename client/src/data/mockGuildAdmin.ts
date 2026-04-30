export type Guild = {
	id: string
	name: string
	slug: string
	description: string
	leadId?: string
	leaderName: string
	badges?: GuildBadge[]
	image_url?: string | null
	bannerPosition?: number
	memberCount?: number
}

export type BadgeVariant =
	| "default"
	| "secondary"
	| "destructive"
	| "outline"
	| "success"
	| "warning"
	| "info"
	| "accent"

export type GuildBadge = {
	label: string
	variant: BadgeVariant
}

export type OfficerLead = {
	id: string
	fullName: string
	email: string
	role: "officer"
}

export type ApplicationStatus = "pending" | "approved" | "rejected"

export type GuildApplication = {
	applicationId: string
	name: string
	studentId: string
	email: string
	course: string
	status: ApplicationStatus
	submittedAt: string
	whyJoin: string
	motivation: string
	experience: string
	portfolioUrl: string
}

export type GuildResource = {
	id: string
	title: string
	type: "video" | "pdf" | "link" | "quiz"
	level: "beginner" | "intermediate" | "advanced"
	url: string
	tags: string[]
}

export type RoadmapVersionRecord = {
	id: string
	name: string
	steps: Array<{
		id: string
		title: string
		description: string
	}>
	photoDataUrl: string | null
	createdAt: string
	updatedAt: string
	isActive: boolean
}

const GUILD_DIRECTORY_STORAGE_KEY = "msc-guild-directory"
const GUILD_RESOURCES_STORAGE_PREFIX = "msc-guild-resources-"
const GUILD_ROADMAP_STORAGE_PREFIX = "guild-roadmaps-"

const DEFAULT_GUILD_BADGE_MAP: Record<string, GuildBadge[]> = {
	"website-development-guild": [
		{ label: "Frontend", variant: "info" },
		{ label: "Backend", variant: "destructive" },
		{ label: "Full-Stack", variant: "success" },
		{ label: "Web Apps", variant: "warning" },
	],
	"cybersecurity-guild": [
		{ label: "Ethical Hacking", variant: "destructive" },
		{ label: "Network Security", variant: "info" },
		{ label: "Blue Team", variant: "success" },
		{ label: "Threat Analysis", variant: "warning" },
	],
	"data-analytics-guild": [
		{ label: "SQL", variant: "info" },
		{ label: "Visualization", variant: "warning" },
		{ label: "Data Storytelling", variant: "success" },
		{ label: "BI", variant: "destructive" },
	],
	"ui-ux-design-guild": [
		{ label: "Wireframing", variant: "info" },
		{ label: "Prototyping", variant: "warning" },
		{ label: "Design Systems", variant: "success" },
		{ label: "Research", variant: "destructive" },
	],
	"ai-ml-guild": [
		{ label: "Machine Learning", variant: "success" },
		{ label: "AI Tools", variant: "info" },
		{ label: "Data Modeling", variant: "warning" },
		{ label: "LLMs", variant: "destructive" },
	],
	"rpa-guild": [
		{ label: "Automation", variant: "success" },
		{ label: "Workflow", variant: "warning" },
		{ label: "Scripting", variant: "info" },
		{ label: "Process Design", variant: "destructive" },
	],
}

function canUseStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function readStorageArray<T>(key: string): T[] {
	if (!canUseStorage()) {
		return []
	}

	try {
		const stored = window.localStorage.getItem(key)
		if (!stored) {
			return []
		}

		const parsed = JSON.parse(stored) as unknown
		return Array.isArray(parsed) ? (parsed as T[]) : []
	} catch {
		return []
	}
}

function writeStorageArray<T>(key: string, value: T[]) {
	if (!canUseStorage()) {
		return
	}

	window.localStorage.setItem(key, JSON.stringify(value))
	window.dispatchEvent(new Event("guild-data-updated"))
}

function mergeGuildsBySlug(baseGuilds: Guild[], storedGuilds: Guild[]) {
	const merged = new Map<string, Guild>()

	for (const guild of baseGuilds) {
		merged.set(guild.slug, guild)
	}

	for (const guild of storedGuilds) {
		merged.set(guild.slug, guild)
	}

	return Array.from(merged.values())
}

function toSlug(value: string) {
	return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")
}

function inferBadgeVariant(label: string, index: number): BadgeVariant {
	const value = label.toLowerCase()

	if (value.includes("frontend") || value.includes("ui") || value.includes("design")) {
		return "info"
	}

	if (value.includes("backend") || value.includes("security") || value.includes("automation")) {
		return "destructive"
	}

	if (value.includes("full") || value.includes("data") || value.includes("machine") || value.includes("cloud")) {
		return "success"
	}

	if (value.includes("web") || value.includes("research") || value.includes("workflow")) {
		return "warning"
	}

	const variants: BadgeVariant[] = ["info", "destructive", "success", "warning"]
	return variants[index % variants.length]
}

function normalizeBadgeEntry(value: unknown, index: number): GuildBadge | null {
	if (typeof value === "string") {
		const label = value.trim()
		if (!label) {
			return null
		}

		return { label, variant: inferBadgeVariant(label, index) }
	}

	if (!value || typeof value !== "object") {
		return null
	}

	const badge = value as Record<string, unknown>
	const label = typeof badge.label === "string" ? badge.label.trim() : ""
	if (!label) {
		return null
	}

	const variant = typeof badge.variant === "string" ? badge.variant : undefined
	const safeVariant: BadgeVariant =
		variant === "secondary" ||
		variant === "destructive" ||
		variant === "outline" ||
		variant === "success" ||
		variant === "warning" ||
		variant === "info" ||
		variant === "accent" ||
		variant === "default"
			? variant
			: inferBadgeVariant(label, index)

	return { label, variant: safeVariant }
}

function normalizeBadgeList(value: unknown): GuildBadge[] | undefined {
	if (!Array.isArray(value)) {
		return undefined
	}

	const badges = value
		.map((item, index) => normalizeBadgeEntry(item, index))
		.filter((item): item is GuildBadge => item !== null)

	return badges.length > 0 ? badges.slice(0, 6) : undefined
}

export function getSuggestedGuildBadgeEntries(guild?: Pick<Guild, "name" | "slug">): GuildBadge[] {
	if (!guild) {
		return [
			{ label: "Community", variant: "info" },
			{ label: "Learning", variant: "success" },
			{ label: "Projects", variant: "warning" },
		]
	}

	return (
		DEFAULT_GUILD_BADGE_MAP[guild.slug] ??
		DEFAULT_GUILD_BADGE_MAP[toSlug(guild.name)] ??
		[
			{ label: "Community", variant: "info" },
			{ label: "Learning", variant: "success" },
			{ label: "Projects", variant: "warning" },
		]
	)
}

export function resolveGuildBadgeEntries(guild: Pick<Guild, "name" | "slug" | "badges">): GuildBadge[] {
	const badges = normalizeBadgeList(guild.badges)
	return badges && badges.length > 0 ? badges : getSuggestedGuildBadgeEntries(guild)
}

export function resolveGuildBadges(guild: Pick<Guild, "name" | "slug" | "badges">): string[] {
	return resolveGuildBadgeEntries(guild).map((badge) => badge.label)
}

export function getStoredGuilds(): Guild[] {
	return mergeGuildsBySlug(MOCK_ADMIN_GUILDS, readStorageArray<Guild>(GUILD_DIRECTORY_STORAGE_KEY))
}

export function saveStoredGuilds(guilds: Guild[]) {
	writeStorageArray(GUILD_DIRECTORY_STORAGE_KEY, guilds)
}

export function upsertStoredGuild(guild: Guild) {
	const current = readStorageArray<Guild>(GUILD_DIRECTORY_STORAGE_KEY)
	const next = current.some((item) => item.slug === guild.slug)
		? current.map((item) => (item.slug === guild.slug ? guild : item))
		: [guild, ...current]

	saveStoredGuilds(next)
	return mergeGuildsBySlug(MOCK_ADMIN_GUILDS, next)
}

export function getGuildBySlug(slug?: string): Guild {
	const guilds = getStoredGuilds()

	if (!slug) {
		return guilds[0] ?? MOCK_ADMIN_GUILDS[0]
	}

	return guilds.find((guild) => guild.slug === slug) ?? MOCK_ADMIN_GUILDS[0]
}

export function getStoredGuildResources(slug?: string): GuildResource[] {
	if (!slug) {
		return []
	}

	return readStorageArray<GuildResource>(`${GUILD_RESOURCES_STORAGE_PREFIX}${slug}`)
}

export function saveStoredGuildResources(slug: string, resources: GuildResource[]) {
	writeStorageArray(`${GUILD_RESOURCES_STORAGE_PREFIX}${slug}`, resources)
}

export function getActiveGuildRoadmap(slug?: string): RoadmapVersionRecord | null {
	if (!slug) {
		return null
	}

	const roadmaps = readStorageArray<RoadmapVersionRecord>(`${GUILD_ROADMAP_STORAGE_PREFIX}${slug}`)
	return roadmaps.find((roadmap) => roadmap.isActive) ?? roadmaps[0] ?? null
}

export const FALLBACK_OFFICER_LEADS: OfficerLead[] = [
	{
		id: "officer-maria-santos",
		fullName: "Maria Santos",
		email: "maria@students.nu-laguna.edu.ph",
		role: "officer",
	},
	{
		id: "officer-juan-dela-cruz",
		fullName: "Juan Dela Cruz",
		email: "juan@students.nu-laguna.edu.ph",
		role: "officer",
	},
	{
		id: "officer-alex-reyes",
		fullName: "Alex Reyes",
		email: "alex@students.nu-laguna.edu.ph",
		role: "officer",
	},
	{
		id: "officer-john-doe",
		fullName: "John Doe",
		email: "john@students.nu-laguna.edu.ph",
		role: "officer",
	},
]

export function getOfficerLeadById(leadId?: string): OfficerLead | null {
	if (!leadId) {
		return null
	}

	return FALLBACK_OFFICER_LEADS.find((lead) => lead.id === leadId) ?? null
}

export const MOCK_ADMIN_GUILDS: Guild[] = [
	{
		id: "guild-web",
		name: "Website Development Guild",
		slug: "website-development-guild",
		description: "Frontend and backend web engineering guild.",
		leadId: "officer-maria-santos",
		leaderName: "Maria Santos",
		badges: [
			{ label: "Frontend", variant: "info" },
			{ label: "Backend", variant: "destructive" },
			{ label: "Full-Stack", variant: "success" },
			{ label: "Web Apps", variant: "warning" },
		],
		image_url: null,
		memberCount: 0,
	},
	{
		id: "guild-cyber",
		name: "Cybersecurity Guild",
		slug: "cybersecurity-guild",
		description: "Security fundamentals and practical defense guild.",
		leadId: "officer-juan-dela-cruz",
		leaderName: "Juan Dela Cruz",
		badges: [
			{ label: "Ethical Hacking", variant: "destructive" },
			{ label: "Network Security", variant: "info" },
			{ label: "Blue Team", variant: "success" },
			{ label: "Threat Analysis", variant: "warning" },
		],
		image_url: null,
		memberCount: 0,
	},
	{
		id: "guild-data",
		name: "Data Analytics Guild",
		slug: "data-analytics-guild",
		description: "Data storytelling, SQL, and dashboarding guild.",
		leadId: "officer-alex-reyes",
		leaderName: "Alex Reyes",
		badges: [
			{ label: "SQL", variant: "info" },
			{ label: "Visualization", variant: "warning" },
			{ label: "Data Storytelling", variant: "success" },
			{ label: "BI", variant: "destructive" },
		],
		image_url: null,
		memberCount: 0,
	},
	{
		id: "guild-uiux",
		name: "UI/UX Design Guild",
		slug: "ui-ux-design-guild",
		description: "Design systems, usability, and interaction guild.",
		leadId: "officer-john-doe",
		leaderName: "John Doe",
		badges: [
			{ label: "Wireframing", variant: "info" },
			{ label: "Prototyping", variant: "warning" },
			{ label: "Design Systems", variant: "success" },
			{ label: "Research", variant: "destructive" },
		],
		image_url: null,
		memberCount: 0,
	},
	{
		id: "guild-aiml",
		name: "AI/ML Guild",
		slug: "ai-ml-guild",
		description: "Applied AI and model experimentation guild.",
		leadId: "officer-maria-santos",
		leaderName: "Maria Santos",
		badges: [
			{ label: "Machine Learning", variant: "success" },
			{ label: "AI Tools", variant: "info" },
			{ label: "Data Modeling", variant: "warning" },
			{ label: "LLMs", variant: "destructive" },
		],
		image_url: null,
		memberCount: 0,
	},
	{
		id: "guild-rpa",
		name: "RPA Guild",
		slug: "rpa-guild",
		description: "Process automation and workflow tooling guild.",
		leadId: "officer-juan-dela-cruz",
		leaderName: "Juan Dela Cruz",
		badges: [
			{ label: "Automation", variant: "success" },
			{ label: "Workflow", variant: "warning" },
			{ label: "Scripting", variant: "info" },
			{ label: "Process Design", variant: "destructive" },
		],
		image_url: null,
		memberCount: 0,
	},
]

export const MOCK_GUILD_APPLICATIONS: GuildApplication[] = [
	{
		applicationId: "app-1",
		name: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS INFORMATION TECHNOLOGY",
		status: "approved",
		submittedAt: "2026-03-16T10:00:00.000Z",
		whyJoin: "I want to join because I want to grow my frontend and backend development skills through project-based collaboration.",
		motivation: "I am motivated to contribute to real systems and learn from upperclassmen and officers who already shipped production projects.",
		experience: "Built class projects using React, TypeScript, and Node.js with REST APIs and responsive UI patterns.",
		portfolioUrl: "github.com/johndoe",
	},
	{
		applicationId: "app-2",
		name: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS INFORMATION TECHNOLOGY",
		status: "pending",
		submittedAt: "2026-03-16T11:00:00.000Z",
		whyJoin: "I want to join because I want to improve my engineering workflow and write cleaner code in a team setting.",
		motivation: "I want structured mentorship and accountability so I can progress faster and contribute confidently to org projects.",
		experience: "Familiar with JavaScript fundamentals, Git branching, and basic deployment using Vercel.",
		portfolioUrl: "github.com/johndoe",
	},
	{
		applicationId: "app-3",
		name: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS INFORMATION TECHNOLOGY",
		status: "pending",
		submittedAt: "2026-03-16T12:00:00.000Z",
		whyJoin: "I want to join because I enjoy building user-facing features and solving practical problems with software.",
		motivation: "I want to gain confidence presenting technical ideas and collaborating in code reviews with peers.",
		experience: "Created small full-stack apps with React frontend and Express backend using MongoDB.",
		portfolioUrl: "github.com/johndoe",
	},
	{
		applicationId: "app-4",
		name: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS INFORMATION TECHNOLOGY",
		status: "pending",
		submittedAt: "2026-03-16T13:00:00.000Z",
		whyJoin: "I want to join because I want to gain more hands-on experience in modern web stacks and tooling.",
		motivation: "I am motivated by the chance to contribute to meaningful org initiatives while learning industry practices.",
		experience: "Worked on course capstones with React, Firebase, and Figma-based UI implementation.",
		portfolioUrl: "github.com/johndoe",
	},
	{
		applicationId: "app-5",
		name: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS INFORMATION TECHNOLOGY",
		status: "rejected",
		submittedAt: "2026-03-16T14:00:00.000Z",
		whyJoin: "I want to join because this guild aligns with my long-term goal of becoming a full-stack engineer.",
		motivation: "I want to improve my project architecture decisions and become better at writing maintainable code.",
		experience: "Developed responsive pages with Tailwind CSS and integrated APIs using async state handling.",
		portfolioUrl: "github.com/johndoe",
	},
]

export const MOCK_GUILD_RESOURCES: GuildResource[] = [
	{
		id: "resource-1",
		title: "Frontend Foundations",
		type: "video",
		level: "beginner",
		url: "https://example.com/frontend-foundations",
		tags: ["frontend", "react", "typescript"],
	},
	{
		id: "resource-2",
		title: "Component Architecture Handbook",
		type: "pdf",
		level: "intermediate",
		url: "https://example.com/component-architecture",
		tags: ["architecture", "components"],
	},
]

export function getMockGuildBySlug(slug?: string): Guild {
	return getGuildBySlug(slug)
}
