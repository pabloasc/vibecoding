/**
 * Builder profiles are stored in the existing `jobs` table.
 * Column → meaning after the pivot:
 *
 *   title           → headline ("Maya · AI-native frontend builder")
 *   description     → bio: what they've shipped, stack, what they want to learn
 *   image_url       → avatar / profile photo
 *   link            → profile URL (portfolio, GitHub, LinkedIn…)
 *   employment_type → what they're looking for (see LOOKING_FOR)
 *   is_remote       → open to remote work
 *   locations       → where they're based
 *   salary_*        → rate expectation (optional)
 *   valid_through   → open to offers until
 */

export type Profile = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null;
  valid_through: string | null;
  is_remote: boolean | null;
  locations: string[] | null;
  employment_type: string | null;
  created_at: string;
};

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

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$' };
const PERIOD_SUFFIX: Record<string, string> = { YEAR: '/yr', MONTH: '/mo', WEEK: '/wk', DAY: '/day', HOUR: '/hr' };

function compact(n: number) {
  return n >= 1000 ? `${Math.round(n / 100) / 10}k`.replace('.0k', 'k') : String(n);
}

/** e.g. "$25–40/hr", "€30k/yr", or null when no rate was given */
export function formatRate(p: Pick<Profile, 'salary_min' | 'salary_max' | 'salary_currency' | 'salary_period'>) {
  if (p.salary_min == null && p.salary_max == null) return null;
  const sym = CURRENCY_SYMBOL[p.salary_currency ?? 'USD'] ?? `${p.salary_currency} `;
  const suffix = PERIOD_SUFFIX[p.salary_period ?? 'YEAR'] ?? '';
  const parts = [p.salary_min, p.salary_max].filter((v): v is number => v != null).map(compact);
  const range = parts.length === 2 && parts[0] !== parts[1] ? `${parts[0]}–${parts[1]}` : parts[0];
  return `${sym}${range}${suffix}`;
}

/** Locations without the redundant "Worldwide" when remote, shortened to "A, B +n" */
export function locationLabel(p: Pick<Profile, 'locations' | 'is_remote'>) {
  const locs = (p.locations ?? []).filter(l => p.is_remote !== true || l !== 'Worldwide');
  if (locs.length === 0) return null;
  return locs.length > 2 ? `${locs[0]}, ${locs[1]} +${locs.length - 2}` : locs.join(', ');
}

/** "Maya · AI-native frontend builder" → "Maya" — used for avatars and Person.name */
export function displayName(title: string) {
  return title.split(/\s[·|—–-]\s/)[0].trim();
}

export function initials(title: string) {
  const words = displayName(title).split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? '?') + (words[1]?.[0] ?? '')).toUpperCase();
}

export function isNew(iso: string, hours = 72) {
  return Date.now() - new Date(iso).getTime() < hours * 60 * 60 * 1000;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
