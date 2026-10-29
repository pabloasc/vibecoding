/**
 * Builder profiles are stored in the existing `jobs` table.
 * Column → meaning after the pivot:
 *
 *   name            → builder's name ("Maya Chen")
 *   title           → headline ("AI-native frontend builder")
 *   description     → bio: what they've shipped, stack, what they want to learn
 *   image_url       → avatar / profile photo
 *   link            → profile URL (portfolio, GitHub, LinkedIn…)
 *   employment_type → what they're looking for, or MENTOR for mentors (see LOOKING_FOR)
 *   is_remote       → open to remote work
 *   locations       → where they're based
 *   salary_*        → unused (kept in the table, not shown or edited)
 *   valid_through   → unused (kept in the table, not shown or edited)
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
  is_remote: boolean | null;
  locations: string[] | null;
  employment_type: string | null;
  user_id: string | null;
  created_at: string;
  /** Present when fetched with PROFILE_LIST_SELECT */
  endorsements?: { count: number }[];
};

/**
 * Fetch a page of profiles (newest first) with their endorsement counts.
 * Falls back to plain profiles if endorsements.sql hasn't been run yet.
 * Returns the raw Response so callers can read the Content-Range total.
 */
export async function fetchProfileList(supabaseUrl: string, anonKey: string, from: number, to: number, filter = '') {
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Range: `${from}-${to}`,
    Prefer: 'count=exact',
  };
  const url = (select: string) => `${supabaseUrl}/rest/v1/jobs?select=${select}&order=created_at.desc${filter ? `&${filter}` : ''}`;
  const res = await fetch(url('*,endorsements(count)'), { headers });
  return res.ok ? res : fetch(url('*'), { headers });
}

/** A project showcased on a profile — see projects.sql */
export type Project = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link: string | null;
  position: number;
  created_at: string;
  project_upvotes?: ProjectUpvote[];
};

/** One upvote, with the voter's profile embedded (for the "upvoted by" list) */
export type ProjectUpvote = {
  user_id: string;
  voter: Pick<Profile, 'id' | 'name' | 'title'> | null;
};

/** PostgREST select for a profile's projects, including who upvoted each one */
export const PROJECTS_SELECT =
  '*,project_upvotes(user_id,voter:jobs!project_upvotes_voter_profile_id_fkey(id,name,title))';

/** A mentor's endorsement of a profile — see endorsements.sql */
export type Endorsement = {
  id: string;
  profile_id: string;
  mentor_user_id: string;
  strengths: string[];
  message: string | null;
  created_at: string;
  mentor: Pick<Profile, 'id' | 'name' | 'title' | 'image_url'> | null;
};

/** Strengths mentors can pick (max 3). Keep in sync with the CHECK constraint in endorsements.sql */
export const STRENGTHS: { label: string; emoji: string }[] = [
  { label: 'Ships fast',              emoji: '🚀' },
  { label: 'Clean code',              emoji: '✨' },
  { label: 'Great communicator',      emoji: '💬' },
  { label: 'Curious learner',         emoji: '🧠' },
  { label: 'Creative problem solver', emoji: '🧩' },
  { label: 'AI-tools pro',            emoji: '🤖' },
  { label: 'Team player',             emoji: '🤝' },
  { label: 'Takes feedback well',     emoji: '🌱' },
];

export function strengthEmoji(label: string) {
  return STRENGTHS.find(s => s.label === label)?.emoji ?? '⭐';
}

/** PostgREST select for a profile's endorsements, with the mentor's profile embedded */
export const ENDORSEMENTS_SELECT =
  '*,mentor:jobs!endorsements_mentor_profile_id_fkey(id,name,title,image_url)';

/** Number of endorsements when the profile was fetched with `endorsements(count)` */
export function endorsementCount(p: { endorsements?: { count: number }[] }) {
  return p.endorsements?.[0]?.count ?? 0;
}

/** Owners can edit their own profile; the admin can edit any. Mirrors the RLS policies in schema.sql. */
export function canEdit(user: { id: string; email?: string } | null | undefined, p: Pick<Profile, 'user_id'>) {
  if (!user) return false;
  return user.email === ADMIN_EMAIL || (p.user_id != null && p.user_id === user.id);
}

type LookingFor = {
  label: string;
  emoji: string;
  /** Text on the form option when it differs from `label` */
  formLabel?: string;
  /** Still displayed on existing profiles, but no longer offered in the form */
  legacy?: boolean;
};

// Order = order of the form options; the first one is preselected
export const LOOKING_FOR: Record<string, LookingFor> = {
  INTERN:     { label: 'Internship',      emoji: '🎓' },
  CONTRACTOR: { label: 'Freelance work',  emoji: '⚡' },
  TEMPORARY:  { label: 'Short project',   emoji: '🛠️' },
  PART_TIME:  { label: 'Part-time role',  emoji: '🌗' },
  FULL_TIME:  { label: 'Full-time role',  emoji: '🚀' },
  MENTOR:     { label: 'Mentor',          emoji: '🧑‍🏫', formLabel: 'Become a mentor' },
  MENTORSHIP: { label: 'Mentorship',      emoji: '🧭', legacy: true },
};

export function lookingFor(type: string | null) {
  return LOOKING_FOR[type ?? 'FULL_TIME'] ?? LOOKING_FOR.FULL_TIME;
}

/** Call to action for a profile link: "Connect on LinkedIn", "Follow on GitHub" or a generic fallback */
export function connectLabel(link: string, name: string) {
  let host = '';
  try { host = new URL(link).hostname.replace(/^www\./, ''); } catch { /* not a URL */ }
  if (host.endsWith('linkedin.com')) return 'Connect on LinkedIn';
  if (host === 'github.com')         return 'Follow on GitHub';
  return `Visit ${name}'s profile`;
}

export function isMentor(type: string | null) {
  return type === 'MENTOR';
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
