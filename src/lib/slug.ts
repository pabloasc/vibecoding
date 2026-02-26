/**
 * Convert any string into a URL-safe slug.
 * e.g. "Staff Engineer – AI Productivity" → "staff-engineer-ai-productivity"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')   // strip non-alphanumeric (keeps spaces)
    .trim()
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-')           // collapse multiple hyphens
    .substring(0, 60)              // max length
    .replace(/-+$/, '');           // trim trailing hyphens
}

/**
 * Build the canonical URL slug for a job.
 * Uses the first 8 chars of the UUID to guarantee uniqueness
 * even if two jobs share the same title.
 * e.g. "staff-engineer-ai-productivity-a6b7c8d9"
 */
export function jobSlug(id: string, title: string): string {
  return `${slugify(title)}-${id.slice(0, 8)}`;
}
