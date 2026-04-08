// Central config for all fallback page types — fully typed.
// To add a new fallback type:
//   1. Add the key to FallbackType
//   2. Add the entry to FALLBACK_CONFIG
//   3. Add its aliases (including hyphenated URL slug) to TYPE_ALIASES
//   No changes needed anywhere else.

// ─── Types ────────────────────────────────────────────────────────────────────

export type FallbackType =
  | "404"
  | "comingSoon"
  | "maintenance"
  | "accessRestricted"
  | "noAnnouncements"
  | "somethingWentWrong";

export interface FallbackEntry {
  label: string;   // Human-readable label
  title: string;   // Displayed heading
  message: string; // Displayed body text
  accent: string;  // CSS color value used for the visual accent
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const FALLBACK_CONFIG: Record<FallbackType, FallbackEntry> = {
  "404": {
    label:   "404 Not Found",
    title:   "Page not found",
    message: "Looks like this page took a field trip without telling us.",
    accent:  "var(--color-brand-blue)",
  },
  "comingSoon": {
    label:   "Coming Soon",
    title:   "We're cooking something...",
    message: "This page is currently in development. Our team is probably arguing over variable names right now.",
    accent:  "var(--color-brand-blue)",
  },
  "maintenance": {
    label:   "Under Maintenance",
    title:   "We'll be back soon",
    message: "We're upgrading this section to make it better than your last project.",
    accent:  "var(--color-brand-blue)",
  },
  "accessRestricted": {
    label:   "Access Restricted",
    title:   "Access restricted",
    message: "This area requires a different level of access. Contact the administrator if you believe this is an error.",
    accent:  "var(--color-brand-blue)",
  },
  "noAnnouncements": {
    label:   "No Announcements",
    title:   "No announcements",
    message: "There are no updates at the moment. Keep an eye out — something exciting may be on the way.",
    accent:  "var(--color-brand-blue)",
  },
  "somethingWentWrong": {
    label:   "Something Went Wrong",
    title:   "Something went wrong",
    message: "Our servers are having a moment. The team is on it — thanks for your patience!",
    accent:  "var(--color-brand-blue)",
  },
};

// ─── Alias map ────────────────────────────────────────────────────────────────
// Keys are normalized (lowercase, hyphens → spaces) before lookup.
// Always include both the spaced AND hyphenated forms so URL slugs work.

export const TYPE_ALIASES: Record<string, FallbackType> = {
  // 404
  "404":                  "404",
  "page not found":       "404",
  // coming soon
  "coming soon":          "comingSoon",
  "coming-soon":          "comingSoon",
  // maintenance
  "maintenance":          "maintenance",
  "under maintenance":    "maintenance",
  "under-maintenance":    "maintenance",
  "we ll be back soon":   "maintenance", // normalized form of "we'll be back soon"
  // access restricted
  "access restricted":    "accessRestricted",
  "access-restricted":    "accessRestricted",
  // no announcements
  "no announcements":     "noAnnouncements",
  "no-announcements":     "noAnnouncements",
  "no updates":           "noAnnouncements",
  // something went wrong
  "something went wrong": "somethingWentWrong",
  "something-went-wrong": "somethingWentWrong",
};

// ─── Helper ───────────────────────────────────────────────────────────────────

export function resolveType(rawType: string | undefined): FallbackType {
  if (!rawType) return "404";

  // Normalize: lowercase, trim, collapse multiple spaces.
  // We do NOT replace hyphens here — hyphenated slugs have their own alias
  // entries above, which is safer than silently mangling arbitrary input.
  const key = rawType.toLowerCase().trim().replace(/\s+/g, " ");

  return TYPE_ALIASES[key] ?? "404";
}