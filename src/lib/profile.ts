/**
 * Builder profiles are stored in the existing `jobs` table.
 * Column → meaning after the pivot:
 *
 *   name            → builder's name ("Maya Chen")
 *   title           → headline ("AI-native frontend builder")
 *   description     → bio: what they've shipped, stack, what they want to learn
 *   image_url       → avatar / profile photo
 *   link            → profile URL (portfolio, GitHub, LinkedIn…)
 *   employment_type → what they're looking for (see LOOKING_FOR)
 *   is_remote       → open to remote work
 *   locations       → where they're based
 *   salary_*        → unused (kept in the table, not shown or edited)
 *   valid_through   → open to offers until
 *   user_id         → the builder who owns the profile (set by the DB on insert)
 */

export const ADMIN_EMAIL = 'hi@vibecoders.co';

export type Profile = {
  id: string;
  name: string | null;
  title: string;
  description: string;
  image_url: string | null;
  link: string;
  valid_through: string | null;
  is_remote: boolean | null;
  locations: string[] | null;
  employment_type: string | null;
  user_id: string | null;
  created_at: string;
};

/** Owners can edit their own profile; the admin can edit any. Mirrors the RLS policies in schema.sql. */
export function canEdit(user: { id: string; email?: string } | null | undefined, p: Pick<Profile, 'user_id'>) {
  if (!user) return false;
  return user.email === ADMIN_EMAIL || (p.user_id != null && p.user_id === user.id);
}

export const LOOKING_FOR: Record<string, { label: string; emoji: string }> = {
  MENTORSHIP: { label: 'Mentorship',      emoji: '🧭' },
  INTERN:     { label: 'Internship',      emoji: '🎓' },
  CONTRACTOR: { label: 'Freelance gigs',  emoji: '⚡' },
  TEMPORARY:  { label: 'Short project',   emoji: '🛠️' },
  PART_TIME:  { label: 'Part-time role',  emoji: '🌗' },
  FULL_TIME:  { label: 'Full-time role',  emoji: '🚀' },
};

export function lookingFor(type: string | null) {
  return LOOKING_FOR[type ?? 'FULL_TIME'] ?? LOOKING_FOR.FULL_TIME;
}

/** Locations without the redundant "Worldwide" when remote, shortened to "A, B +n" */
export function locationLabel(p: Pick<Profile, 'locations' | 'is_remote'>) {
  const locs = (p.locations ?? []).filter(l => p.is_remote !== true || l !== 'Worldwide');
  if (locs.length === 0) return null;
  return locs.length > 2 ? `${locs[0]}, ${locs[1]} +${locs.length - 2}` : locs.join(', ');
}

// Profiles created before the `name` column existed put it in the title: "Maya · AI-native builder"
const LEGACY_SEPARATOR = /\s[·|—–-]\s/;

/** The builder's name — falls back to the start of a legacy "Name · headline" title */
export function profileName(p: Pick<Profile, 'name' | 'title'>) {
  return p.name?.trim() || p.title.split(LEGACY_SEPARATOR)[0].trim();
}

/** The headline without the name — empty when a legacy title has nothing but the name */
export function profileHeadline(p: Pick<Profile, 'name' | 'title'>) {
  if (p.name?.trim()) return p.title;
  const parts = p.title.split(LEGACY_SEPARATOR);
  return parts.length > 1 ? parts.slice(1).join(' · ').trim() : '';
}

export function initials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? '?') + (words[1]?.[0] ?? '')).toUpperCase();
}

export function isNew(iso: string, hours = 72) {
  return Date.now() - new Date(iso).getTime() < hours * 60 * 60 * 1000;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
