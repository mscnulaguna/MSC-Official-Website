import { getSuggestedGuildBadgeEntries, type BadgeVariant, type GuildBadge } from "@/data/mockGuildAdmin"

export function getBadgeVariant(label: string, index: number): BadgeVariant {
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

export function parseBadgeLabels(value: string): string[] {
	return value
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
		.slice(0, 6)
}

export function labelsToBadges(labels: string[]): GuildBadge[] {
	return labels.length > 0
		? labels.map((label, index) => ({ label, variant: getBadgeVariant(label, index) }))
		: getSuggestedGuildBadgeEntries({ name: "", slug: "" })
}

export function toSlug(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
}
