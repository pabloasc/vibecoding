import type { APIRoute } from 'astro';
import { profileSlug } from '../lib/slug';
import { fetchActiveJobs, jobPostUrl, jobType, formatSalary } from '../lib/jobPost';
import { type Profile, lookingFor, profileName, profileHeadline } from '../lib/profile';

export const GET: APIRoute = async () => {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  let profiles: Profile[] = [];

  if (url && key) {
    try {
      const res = await fetch(
        `${url}/rest/v1/jobs?select=*&order=created_at.desc`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (res.ok) profiles = await res.json();
    } catch { /* fallthrough */ }
  }

  const lines: string[] = [
    '# vibecoding.work',
    '',
    '> A community of developers and vibecoders helping each other get hired.',
    '> Members share their projects, connect, endorse each other and find developer jobs, freelance work and internships.',
    '',
    `URL: https://vibecoding.work/`,
    `Builders: ${profiles.length}`,
    '',
    '---',
    '',
  ];

  const jobs = await fetchActiveJobs(url, key);
  lines.push('## Open jobs & paid assignments', '', `Post a job (free): https://vibecoding.work/post-job`, '');
  for (const j of jobs) {
    const salary = formatSalary(j);
    lines.push(`### ${j.title} — ${j.name}`);
    lines.push(`Type: ${jobType(j.employment_type).label}${j.is_remote ? ' · Remote' : ''}${(j.locations ?? []).length ? ` · ${(j.locations ?? []).join(', ')}` : ''}`);
    if (salary) lines.push(`Pay: ${salary}`);
    if (j.valid_through) lines.push(`Apply by: ${j.valid_through}`);
    lines.push(`Details: ${jobPostUrl(j)}`, `Apply: ${j.link}`, '', j.description, '', '---', '');
  }

  lines.push('## Builders', '');

  for (const p of profiles) {
    const date = new Date(p.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const remote = p.is_remote === true ? 'Open to remote' : p.is_remote === false ? 'Not open to remote' : null;
    const locationParts = [remote, ...(p.locations ?? [])].filter(Boolean);
    const location = locationParts.join(', ') || 'Location not specified';

    const headline = profileHeadline(p);
    lines.push(`### ${profileName(p)}${headline ? ` — ${headline}` : ''}`);
    lines.push(`Joined: ${date}`);
    lines.push(`Looking for: ${lookingFor(p.employment_type).label}`);
    lines.push(`Location: ${location}`);
    lines.push(`Profile: ${p.link}`);
    lines.push(`Page: https://vibecoding.work/profile/${profileSlug(p)}/`);
    lines.push('');
    lines.push(p.description);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
