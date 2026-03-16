import type { APIRoute } from 'astro';

type Job = {
  id: string;
  title: string;
  description: string;
  link: string;
  is_remote: boolean | null;
  locations: string[] | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null;
  employment_type: string | null;
  created_at: string;
};

export const GET: APIRoute = async () => {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  let jobs: Job[] = [];

  if (url && key) {
    try {
      const res = await fetch(
        `${url}/rest/v1/jobs?select=*&order=created_at.desc`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (res.ok) jobs = await res.json();
    } catch { /* fallthrough */ }
  }

  const lines: string[] = [
    '# vibecoding.work',
    '',
    '> The job board for vibe coders and AI-native developers.',
    '> Browse and apply to jobs at companies that embrace AI-assisted development (Cursor, Claude Code, GitHub Copilot, Windsurf).',
    '',
    `URL: https://vibecoding.work/`,
    `Open positions: ${jobs.length}`,
    '',
    '---',
    '',
    '## Open Positions',
    '',
  ];

  for (const job of jobs) {
    const date = new Date(job.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const remote = job.is_remote === true ? 'Remote' : job.is_remote === false ? 'On-site / Hybrid' : null;
    const locationParts = [remote, ...(job.locations ?? [])].filter(Boolean);
    const location = locationParts.join(', ') || 'Location not specified';
    const salaryParts = [];
    if (job.salary_min != null) salaryParts.push(job.salary_min.toLocaleString());
    if (job.salary_max != null && job.salary_max !== job.salary_min) salaryParts.push(job.salary_max.toLocaleString());
    const salary = salaryParts.length
      ? `${job.salary_currency ?? 'USD'} ${salaryParts.join('–')} / ${(job.salary_period ?? 'YEAR').toLowerCase()}`
      : null;
    const type = job.employment_type?.replace('_', ' ') ?? null;

    lines.push(`### ${job.title}`);
    lines.push(`Posted: ${date}`);
    lines.push(`Location: ${location}`);
    if (type) lines.push(`Employment: ${type}`);
    if (salary) lines.push(`Salary: ${salary}`);
    lines.push(`Apply: ${job.link}`);
    lines.push('');
    lines.push(job.description);
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
