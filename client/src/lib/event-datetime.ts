const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})

function toValidDate(isoString: string): Date | undefined {
  const date = new Date(isoString)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/**
 * Backend-friendly formatting helpers.
 *
 * We store event start time as an ISO string (`startsAt`) because that's the
 * most common shape from APIs/DBs.
 *
 * UI components should format dates/times at render time (instead of storing
 * pre-formatted strings in data), so swapping mock data -> backend later is
 * a 1-file change.
 */
export function formatEventDate(startsAt: string): string {
  const date = toValidDate(startsAt)
  return date ? DATE_FORMATTER.format(date) : startsAt
}

export function formatEventTime(startsAt: string): string {
  const date = toValidDate(startsAt)
  return date ? TIME_FORMATTER.format(date) : ""
}
