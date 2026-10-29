/**
 * Job & assignment posts — stored in `job_posts` (see job_posts.sql),
 * with the same columns as the profiles table:
 *   name → company, title → job title, link → where to apply, image_url → logo.
 */
import { slugify } from './slug';

export type JobPost = {
  id: string;
  name: string;
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
  user_id: string | null;
  created_at: string;
};

/** Values match Google's JobPosting employmentType; order = order in the post form */
export const JOB_TYPES: Record<string, { label: string; emoji: string }> = {
  FULL_TIME:  { label: 'Full-time job',     emoji: '🚀' },
  PART_TIME:  { label: 'Part-time job',     emoji: '🌗' },
  CONTRACTOR: { label: 'Freelance work',    emoji: '⚡' },
  TEMPORARY:  { label: 'Short assignment',  emoji: '🛠️' },
  INTERN:     { label: 'Internship',        emoji: '🎓' },
};

export function jobType(type: string | null) {
  return JOB_TYPES[type ?? 'FULL_TIME'] ?? JOB_TYPES.FULL_TIME;
}

/** e.g. "junior-react-developer-acme-a6b7c8d9" → /jobs/junior-react-developer-acme-a6b7c8d9/ */
export function jobPostSlug(j: Pick<JobPost, 'id' | 'title' | 'name'>) {
  return `${slugify(`${j.title} ${j.name}`)}-${j.id.slice(0, 8)}`;
}

export function jobPostUrl(j: Pick<JobPost, 'id' | 'title' | 'name'>) {
  return `https://vibecoding.work/jobs/${jobPostSlug(j)}/`;
}

/** Today as YYYY-MM-DD (UTC) */
export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function isExpired(j: Pick<JobPost, 'valid_through'>) {
  return !!j.valid_through && j.valid_through < today();
}

/** PostgREST filter for posts that haven't expired */
export const ACTIVE_JOBS_FILTER = () => `or=(valid_through.is.null,valid_through.gte.${today()})`;

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$' };
const PERIOD_SUFFIX: Record<string, string> = { YEAR: '/yr', MONTH: '/mo', WEEK: '/wk', DAY: '/day', HOUR: '/hr' };

function compact(n: number) {
  return n >= 1000 ? `${Math.round(n / 100) / 10}k`.replace('.0k', 'k') : String(n);
}

/** e.g. "$25–40/hr", "€30k/yr", or null when no pay was given */
export function formatSalary(j: Pick<JobPost, 'salary_min' | 'salary_max' | 'salary_currency' | 'salary_period'>) {
  if (j.salary_min == null && j.salary_max == null) return null;
  const sym = CURRENCY_SYMBOL[j.salary_currency ?? 'USD'] ?? `${j.salary_currency} `;
  const suffix = PERIOD_SUFFIX[j.salary_period ?? 'YEAR'] ?? '';
  const parts = [j.salary_min, j.salary_max].filter((v): v is number => v != null).map(compact);
  const range = parts.length === 2 && parts[0] !== parts[1] ? `${parts[0]}–${parts[1]}` : parts[0];
  return `${sym}${range}${suffix}`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Google for Jobs structured data.
 * https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
export function jobPostingSchema(j: JobPost) {
  const url = jobPostUrl(j);
  const locations = (j.locations ?? []).filter(Boolean);
  const hasSalary = j.salary_min != null || j.salary_max != null;

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': url,
    url,
    title: j.title,
    // Google accepts basic HTML here; keep the poster's line breaks
    description: escapeHtml(j.description).replace(/\n/g, '<br>'),
    datePosted: j.created_at.slice(0, 10),
    ...(j.valid_through ? { validThrough: `${j.valid_through}T23:59:59Z` } : {}),
    employmentType: j.employment_type ?? 'FULL_TIME',
    identifier: { '@type': 'PropertyValue', name: j.name, value: j.id },
    hiringOrganization: {
      '@type': 'Organization',
      name: j.name,
      ...(j.image_url ? { logo: j.image_url } : {}),
    },
    directApply: false,
    occupationalCategory: '15-1252.00 Software Developers',
    experienceRequirements: {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: 0,
    },
    ...(j.is_remote === true
      ? {
          jobLocationType: 'TELECOMMUTE',
          ...(locations.length > 0
            ? { applicantLocationRequirements: locations.map(name => ({ '@type': 'Country', name })) }
            : {}),
        }
      : locations.length > 0
        ? {
            // On-site locations are entered as "City, Country"
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                ...(locations.length > 1 ? { addressLocality: locations[0] } : {}),
                addressCountry: locations[locations.length - 1],
              },
            },
          }
        : {}),
    ...(hasSalary
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: j.salary_currency ?? 'USD',
            value: {
              '@type': 'QuantitativeValue',
              ...(j.salary_min != null ? { minValue: j.salary_min } : {}),
              ...(j.salary_max != null ? { maxValue: j.salary_max } : {}),
              unitText: j.salary_period ?? 'YEAR',
            },
          },
        }
      : {}),
  };
}

/** Active (not expired) posts, newest first. Empty if job_posts.sql hasn't been run yet. */
export async function fetchActiveJobs(supabaseUrl: string, anonKey: string, opts: { type?: string; limit?: number } = {}): Promise<JobPost[]> {
  if (!supabaseUrl || !anonKey) return [];
  const type = opts.type && JOB_TYPES[opts.type] ? `&employment_type=eq.${opts.type}` : '';
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/job_posts?select=*&order=created_at.desc&limit=${opts.limit ?? 200}&${ACTIVE_JOBS_FILTER()}${type}`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
    );
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}
