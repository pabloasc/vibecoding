import type { APIRoute } from 'astro';
import { profileSlug } from '../lib/slug';
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
    '> The launchpad for junior developers and vibecoders.',
    '> Builders post their profile; mentors, founders and teams find them for mentorship, internships, freelance projects and first professional roles.',
    '',
    `URL: https://vibecoding.work/`,
    `Builders: ${profiles.length}`,
    '',
    '---',
    '',
    '## Builders',
    '',
  ];

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
