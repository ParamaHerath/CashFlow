/**
 * Centralised date formatting helpers.
 *
 * The API returns dates as ISO strings:
 *   - Full date:  "2026-05-24"  (YYYY-MM-DD)
 *   - Year-month: "2026-05"     (YYYY-MM)
 *
 * All helpers accept those raw strings and return human-readable labels.
 */

const THIS_YEAR = new Date().getFullYear();

/**
 * Parses a "YYYY-MM-DD" string into a Date at local noon (avoids UTC-offset
 * midnight issues that can shift the date by one day in some time zones).
 */
function parseLocalDate(iso: string): Date {
	const [year, month, day] = iso.split("-").map(Number);
	return new Date(year, month - 1, day ?? 1, 12, 0, 0);
}

/**
 * Formats a full "YYYY-MM-DD" date for transaction rows.
 *
 * Current year → "May 24"
 * Past year    → "May 24, 2025"
 */
export function formatTransactionDate(iso: string): string {
	const d = parseLocalDate(iso);
	const year = d.getFullYear();

	if (year === THIS_YEAR) {
		return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
	}
	return d.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

/**
 * Formats a "YYYY-MM-DD" date for the weekly spending chart x-axis.
 * Always short: "May 24"
 */
export function formatWeeklyAxisDate(iso: string): string {
	const d = parseLocalDate(iso);
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Formats a "YYYY-MM-DD" date for chart tooltips.
 * Always full: "May 24, 2026"
 */
export function formatChartTooltipDate(iso: string): string {
	const d = parseLocalDate(iso);
	return d.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

/**
 * Formats a "YYYY-MM" year-month string for the monthly balance chart x-axis.
 * e.g. "2026-05" → "May '26"
 */
export function formatMonthAxis(yearMonth: string): string {
	const d = parseLocalDate(`${yearMonth}-01`);
	return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/**
 * Formats a "YYYY-MM" year-month string for chart tooltips.
 * e.g. "2026-05" → "May 2026"
 */
export function formatMonthTooltip(yearMonth: string): string {
	const d = parseLocalDate(`${yearMonth}-01`);
	return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
