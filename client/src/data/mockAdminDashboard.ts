// Admin Dashboard mock data
// ----------------------------------------------------------------------------
// Frontend-ready mock data for the Admin Dashboard page.
// Shapes mirror the real API contracts so the UI is wired against the same
// fields the backend will eventually return:
//   - Members  → GET /users           (see API_USERS.md)
//   - Events   → GET /events          (see API_EVENTS.md)
//
// Used as a fallback when `VITE_USE_LIVE_DASHBOARD_API !== "true"` and any
// time a live fetch fails (so the UI never crashes / renders empty).

export type UserRole = "member" | "officer" | "admin"

// Recent member row — subset of the GET /users response item that the
// dashboard table needs to render.
export type RecentMember = {
	id: string
	fullName: string
	studentId: string
	email: string
	course: string
	role: UserRole
	memberSince: string // ISO 8601
	profilePhoto: string | null
}

// Recent event row — subset of the GET /events response item.
export type RecentEvent = {
	id: number
	title: string
	date: string // ISO 8601
}

export type DashboardStats = {
	totalMembers: number
	totalEvents: number
	activeRegistration: number
	upcomingEvents: number
}

export type DashboardData = {
	stats: DashboardStats
	recentMembers: RecentMember[]
	recentEvents: RecentEvent[]
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const MOCK_RECENT_MEMBERS: RecentMember[] = [
	{
		id: "1",
		fullName: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS Information Technology",
		role: "member",
		memberSince: "2026-03-16T10:00:00.000Z",
		profilePhoto: null,
	},
	{
		id: "2",
		fullName: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS Information Technology",
		role: "member",
		memberSince: "2026-03-16T10:00:00.000Z",
		profilePhoto: null,
	},
	{
		id: "3",
		fullName: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS Information Technology",
		role: "member",
		memberSince: "2026-03-16T10:00:00.000Z",
		profilePhoto: null,
	},
	{
		id: "4",
		fullName: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS Information Technology",
		role: "member",
		memberSince: "2026-03-16T10:00:00.000Z",
		profilePhoto: null,
	},
	{
		id: "5",
		fullName: "John Doe",
		studentId: "2026-000001",
		email: "you@students.nu-laguna.edu.ph",
		course: "BS Information Technology",
		role: "member",
		memberSince: "2026-03-16T10:00:00.000Z",
		profilePhoto: null,
	},
]

const MOCK_RECENT_EVENTS: RecentEvent[] = [
	{ id: 1, title: "AI/ML Workshop", date: "2026-03-16T09:00:00.000Z" },
	{ id: 2, title: "AI/ML Workshop", date: "2026-03-16T09:00:00.000Z" },
	{ id: 3, title: "AI/ML Workshop", date: "2026-03-16T09:00:00.000Z" },
]

export const MOCK_DASHBOARD_DATA: DashboardData = {
	stats: {
		totalMembers: 0,
		totalEvents: 0,
		activeRegistration: 0,
		upcomingEvents: 0,
	},
	recentMembers: MOCK_RECENT_MEMBERS,
	recentEvents: MOCK_RECENT_EVENTS,
}

export function getMockDashboard(): DashboardData {
	// Return a structural copy so consumers cannot accidentally mutate
	// the module-level constant.
	return {
		stats: { ...MOCK_DASHBOARD_DATA.stats },
		recentMembers: MOCK_DASHBOARD_DATA.recentMembers.map((member) => ({ ...member })),
		recentEvents: MOCK_DASHBOARD_DATA.recentEvents.map((event) => ({ ...event })),
	}
}
