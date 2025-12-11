/**
 * Convert a string to Title Case.
 * Splits on spaces, underscores, and hyphens; trims extra whitespace.
 */
export function toTitleCase(value: string): string {
  return value
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
