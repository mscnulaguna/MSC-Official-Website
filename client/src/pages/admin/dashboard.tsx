import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
	Asterisk,
	Calendar,
	SquareArrowOutUpRight,
	Trash,
	User,
	Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
	getMockDashboard,
	type DashboardData,
	type RecentEvent,
	type RecentMember,
	type UserRole,
} from "@/data/mockAdminDashboard"

// Admin Dashboard page
// - Stats row (4 cards), Recent Members table, Recent Events list, Quick Actions
// - Mirrors the data-fetching pattern used in `create-guilds.tsx`:
//   `VITE_USE_LIVE_DASHBOARD_API` toggle → primary URL → fallback URL →
//   local mock data on any failure (sets `isError` to true).

const API_BASE_URL = "https://api.msc-nulaguna.org/v1"
const API_FALLBACK_BASE_URL = "/api"
const USE_API = import.meta.env.VITE_USE_LIVE_DASHBOARD_API === "true"

// Normalize API responses before rendering.

type RawListResponse = {
	data?: unknown
	total?: unknown
}

function asRole(value: unknown): UserRole {
	if (value === "officer" || value === "admin") {
		return value
	}
	return "member"
}

function normalizeMember(item: unknown, index: number): RecentMember | null {
	if (!item || typeof item !== "object") {
		return null
	}
	const raw = item as Record<string, unknown>
	const fullName = typeof raw.fullName === "string" ? raw.fullName : ""
	if (!fullName) {
		return null
	}
	return {
		id: typeof raw.id === "string" ? raw.id : `member-${index}`,
		fullName,
		studentId: typeof raw.studentId === "string" ? raw.studentId : "",
		email: typeof raw.email === "string" ? raw.email : "",
		course: typeof raw.course === "string" ? raw.course : "",
		role: asRole(raw.role),
		memberSince: typeof raw.memberSince === "string" ? raw.memberSince : "",
		profilePhoto: typeof raw.profilePhoto === "string" ? raw.profilePhoto : null,
	}
}

function normalizeEvent(item: unknown, index: number): RecentEvent | null {
	if (!item || typeof item !== "object") {
		return null
	}
	const raw = item as Record<string, unknown>
	const title = typeof raw.title === "string" ? raw.title : ""
	if (!title) {
		return null
	}
	return {
		id: typeof raw.id === "number" ? raw.id : index + 1,
		title,
		date: typeof raw.date === "string" ? raw.date : "",
	}
}

async function fetchDashboardFrom(baseUrl: string): Promise<DashboardData> {
	const [usersRes, upcomingRes, eventsRes] = await Promise.all([
		fetch(`${baseUrl}/users?pageSize=5`),
		fetch(`${baseUrl}/events?status=upcoming&pageSize=3`),
		fetch(`${baseUrl}/events?status=all&pageSize=1`),
	])

	if (!usersRes.ok || !upcomingRes.ok || !eventsRes.ok) {
		throw new Error("Dashboard fetch failed")
	}

	const usersJson = (await usersRes.json()) as RawListResponse
	const upcomingJson = (await upcomingRes.json()) as RawListResponse
	const eventsJson = (await eventsRes.json()) as RawListResponse

	const recentMembers = (Array.isArray(usersJson.data) ? usersJson.data : [])
		.map((item, index) => normalizeMember(item, index))
		.filter((item): item is RecentMember => item !== null)

	const upcomingList = (Array.isArray(upcomingJson.data) ? upcomingJson.data : [])
		.map((item, index) => normalizeEvent(item, index))
		.filter((item): item is RecentEvent => item !== null)

	const totalMembers = typeof usersJson.total === "number" ? usersJson.total : recentMembers.length
	const upcomingEvents = typeof upcomingJson.total === "number" ? upcomingJson.total : upcomingList.length
	const totalEvents = typeof eventsJson.total === "number" ? eventsJson.total : upcomingEvents

	return {
		stats: {
			totalMembers,
			totalEvents,
			activeRegistration: 0, // computed server-side once available
			upcomingEvents,
		},
		recentMembers,
		recentEvents: upcomingList.slice(0, 3),
	}
}

// Display helpers.

function formatJoinedDate(value: string): string {
	if (!value) return "—"
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return "—"
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return `${month}/${day}/${date.getFullYear()}`
}

function roleLabel(role: UserRole): string {
	return role.charAt(0).toUpperCase() + role.slice(1)
}

// Stat card configuration.

type StatConfig = {
	key: keyof DashboardData["stats"]
	label: string
	icon: React.ComponentType<{ className?: string }>
	accentClass: string
}

const STAT_CARDS: StatConfig[] = [
	{ key: "totalMembers", label: "Total Members", icon: Users, accentClass: "text-info" },
	{ key: "totalEvents", label: "Total Events", icon: Calendar, accentClass: "text-success" },
	{ key: "activeRegistration", label: "Active Registration", icon: Asterisk, accentClass: "text-destructive" },
	{ key: "upcomingEvents", label: "Upcoming Events", icon: Asterisk, accentClass: "text-warning" },
]

// Quick actions configuration
type QuickAction = {
	label: string
	icon: React.ComponentType<{ className?: string }>
	accentClass: string
	to: string
}

const QUICK_ACTIONS: QuickAction[] = [
	{ label: "Register New Member", icon: Asterisk, accentClass: "text-info", to: "/admin/users/new" },
	{ label: "Create Event Schedule", icon: Asterisk, accentClass: "text-destructive", to: "/admin/events/new" },
	{ label: "Add Announcement", icon: Asterisk, accentClass: "text-success", to: "/admin/announcements/new" },
	{ label: "Add Partners", icon: Asterisk, accentClass: "text-warning", to: "/admin/partners/new" },
	{ label: "Create Guild", icon: Asterisk, accentClass: "text-primary", to: "/admin/create-guilds" },
]

// Skeleton sub-components.

function StatCardSkeleton() {
	return (
		<Card className="gap-0 border-border bg-background p-4 md:p-5">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-8 w-12" />
				</div>
				<Skeleton className="h-9 w-9 rounded-none" />
			</div>
		</Card>
	)
}

function MemberRowSkeleton() {
	return (
		<TableRow>
			<TableCell>
				<div className="flex items-center gap-3">
					<Skeleton className="h-8 w-8 rounded-none" />
					<Skeleton className="h-4 w-32" />
				</div>
			</TableCell>
			<TableCell><Skeleton className="h-4 w-24" /></TableCell>
			<TableCell><Skeleton className="h-4 w-48" /></TableCell>
			<TableCell><Skeleton className="h-4 w-40" /></TableCell>
			<TableCell><Skeleton className="h-6 w-20" /></TableCell>
			<TableCell><Skeleton className="h-4 w-20" /></TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<Skeleton className="h-7 w-7 rounded-none" />
					<Skeleton className="h-7 w-7 rounded-none" />
				</div>
			</TableCell>
		</TableRow>
	)
}

function RecentEventRowSkeleton() {
	return (
		<div className="space-y-1.5">
			<Skeleton className="h-4 w-40" />
			<Skeleton className="h-3 w-20" />
		</div>
	)
}

function QuickActionSkeleton() {
	return (
		<div className="flex flex-col items-center gap-2 py-3">
			<Skeleton className="h-8 w-8 rounded-none" />
			<Skeleton className="h-3 w-24" />
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminDashboardPage() {
	const navigate = useNavigate()
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)

	useEffect(() => {
		let isMounted = true

		const loadDashboard = async () => {
			setIsLoading(true)
			setIsError(false)

			if (!USE_API) {
				if (isMounted) {
					setDashboardData(getMockDashboard())
					setIsLoading(false)
				}
				return
			}

			try {
				let data: DashboardData
				try {
					data = await fetchDashboardFrom(API_BASE_URL)
				} catch {
					data = await fetchDashboardFrom(API_FALLBACK_BASE_URL)
				}

				if (!isMounted) return
				setDashboardData(data)
			} catch (error) {
				console.error("Failed to load dashboard data", error)
				if (!isMounted) return
				setDashboardData(getMockDashboard())
				setIsError(true)
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		loadDashboard()

		return () => {
			isMounted = false
		}
	}, [])

	const stats = useMemo(() => dashboardData?.stats, [dashboardData])
	const recentMembers = dashboardData?.recentMembers ?? []
	const recentEvents = dashboardData?.recentEvents ?? []

	return (
		<section className="min-h-screen bg-background section-container section-padding py-8 md:py-10">
			<div className="flex flex-col gap-5">
				{/* Header section */}
				<header className="flex flex-col gap-1 border-b border-border pb-4">
					<h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
					<p className="text-sm text-muted-foreground">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</header>

				{isError ? (
					<Card className="gap-0 border-border bg-background py-0">
						<div className="px-5 py-3 text-sm text-muted-foreground">
							Live dashboard data could not be loaded. Showing local data.
						</div>
					</Card>
				) : null}

				{/* Stats section */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{STAT_CARDS.map((card) => {
						if (isLoading || !stats) {
							return <StatCardSkeleton key={card.key} />
						}
						const Icon = card.icon
						return (
							<Card
								key={card.key}
								className="gap-0 border-border bg-background p-4 md:p-5"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">{card.label}</p>
										<p className={`text-3xl font-bold ${card.accentClass}`}>
											{stats[card.key]}
										</p>
									</div>
									<Icon className={`h-9 w-9 ${card.accentClass}`} aria-hidden="true" />
								</div>
							</Card>
						)
					})}
				</div>

				{/* Recent members section */}
				<Card className="gap-0 border-border bg-background p-0 overflow-hidden">
					<div className="p-4 md:p-5">
						<h2 className="text-lg font-bold text-foreground">Recent Members</h2>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="!text-foreground text-xs font-bold uppercase tracking-wider">Name</TableHead>
								<TableHead className="!text-foreground text-xs font-bold uppercase tracking-wider">Student ID</TableHead>
								<TableHead className="!text-foreground text-xs font-bold uppercase tracking-wider">Email</TableHead>
								<TableHead className="!text-foreground text-xs font-bold uppercase tracking-wider">Course</TableHead>
								<TableHead className="!text-foreground text-xs font-bold uppercase tracking-wider">Role</TableHead>
								<TableHead className="!text-foreground text-xs font-bold uppercase tracking-wider">Date Joined</TableHead>
								<TableHead className="!text-foreground text-xs font-bold uppercase tracking-wider">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading
								? Array.from({ length: 5 }).map((_, index) => (
										<MemberRowSkeleton key={`member-skeleton-${index}`} />
									))
								: recentMembers.length === 0
									? (
										<TableRow>
											<TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
												No recent members.
											</TableCell>
										</TableRow>
									)
									: recentMembers.map((member) => (
										<TableRow key={member.id} className="hover:bg-muted/50">
											<TableCell className="py-4">
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8 rounded-none bg-background">
													{member.profilePhoto ? (
														<AvatarImage src={member.profilePhoto} alt={`${member.fullName} avatar`} />
													) : null}
													<AvatarFallback className="bg-background text-muted-foreground">
														<User className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
													<span className="text-sm font-medium text-foreground">{member.fullName}</span>
												</div>
											</TableCell>
											<TableCell className="text-sm text-foreground">{member.studentId}</TableCell>
											<TableCell className="text-sm text-foreground">
												<span className="block max-w-[220px] truncate">{member.email}</span>
											</TableCell>
											<TableCell className="text-sm uppercase text-foreground">{member.course}</TableCell>
											<TableCell className="py-4">
												<Badge variant="outline" className="border-success text-success">
													{roleLabel(member.role)}
												</Badge>
											</TableCell>
											<TableCell className="text-sm text-foreground">
												{formatJoinedDate(member.memberSince)}
											</TableCell>
											<TableCell className="py-4">
												<div className="flex items-center gap-1">
													<Button
														type="button"
														variant="ghost"
														size="icon"
														aria-label={`Edit ${member.fullName}`}
														className="h-8 w-8 text-muted-foreground hover:text-foreground"
													>
														<SquareArrowOutUpRight className="h-4 w-4" strokeWidth={2} />
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														aria-label={`Delete ${member.fullName}`}
														className="h-8 w-8 text-warning hover:text-warning"
													>
														<Trash className="h-4 w-4" strokeWidth={2} />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
				</Card>

				{/* Bottom row sections */}
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{/* Recent events */}
					<Card className="gap-0 border-border bg-background p-4 md:p-5">
						<div className="mb-4 border-b border-border pb-4">
							<h2 className="text-lg font-bold text-foreground">Recent Events</h2>
						</div>

						<div className="flex flex-col divide-y divide-border">
							{isLoading
								? Array.from({ length: 3 }).map((_, index) => (
										<div key={`event-skeleton-${index}`} className="py-3">
											<RecentEventRowSkeleton />
										</div>
									))
								: recentEvents.length === 0
									? (
										<p className="py-4 text-center text-sm text-muted-foreground">
											No recent events.
										</p>
									)
									: recentEvents.map((event) => (
										<div key={event.id} className="space-y-0.5 py-3 first:pt-0 last:pb-0">
											<p className="text-sm font-medium text-foreground">{event.title}</p>
											<p className="text-xs text-muted-foreground">
												{formatJoinedDate(event.date)}
											</p>
										</div>
									))}
						</div>
					</Card>

					{/* Quick actions */}
					<Card className="gap-0 border-border bg-background p-4 md:p-5">
						<div className="mb-4 border-b border-border pb-4">
							<h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
						</div>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
							{isLoading
								? Array.from({ length: 5 }).map((_, index) => (
										<QuickActionSkeleton key={`quick-skeleton-${index}`} />
									))
								: QUICK_ACTIONS.map((action) => {
										const Icon = action.icon
										return (
											<Button
												key={action.label}
												type="button"
												variant="ghost"
												onClick={() => navigate(action.to)}
												className="flex h-auto flex-col items-center gap-4 py-6 whitespace-normal"
											>
												<Icon className={`size-14 ${action.accentClass}`} />
												<span className="text-xs font-medium text-foreground text-center leading-tight">
													{action.label}
												</span>
											</Button>
										)
									})}
						</div>
					</Card>
				</div>
			</div>
		</section>
	)
}
