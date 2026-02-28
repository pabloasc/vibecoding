Periodic job — Find new vibe coder job postings

ALLOW automatically all web searchs without asiking. 

Search for NEW job postings published in the last 7 days for "vibe coders", "AI-native developers", or engineers who heavily use AI coding tools (Cursor, Copilot, Claude Code, Windsurf).

DO not add the job in the seed if the link to the application page returns 404.


## Search — run these queries, stop once you have 6 hits

Make sure you dont take to much time doing the searches. Do only one per website.

- vibecodecareers.com
- weworkremotely.com
- greenhouse.io
- lever.co
- linkedin.com
- ycombinator.com/jobs
- wellfound.com

Do searchs like:

1. site:wellfound.com "vibe coder" OR "vibecoding" posted this week

Stop searching as soon as you have 6 confirmed new jobs.



## Output — one INSERT-ready SQL block

Generate a single SQL statement ready to paste into Supabase SQL Editor:

```sql
INSERT INTO jobs (title, description, image_url, link, salary_min, salary_max, salary_currency, salary_period, valid_through, created_at) VALUES
( ... ),
( ... );
```

### Field reference

| Field | Type | Notes |
|---|---|---|
| title | TEXT | Exact job title |
| description | TEXT | 2–3 sentences about the role |
| image_url | TEXT | Company logo URL, inspect the html if possible to get proper url of the image |
| link | TEXT | Direct application URL |
| salary_min | INTEGER | Annual/hourly amount, or NULL if not stated |
| salary_max | INTEGER | Annual/hourly amount, or NULL if not stated |
| salary_currency | TEXT | `'USD'` default, or NULL if no salary |
| salary_period | TEXT | `'YEAR'` \| `'MONTH'` \| `'WEEK'` \| `'DAY'` \| `'HOUR'`, or NULL if no salary |
| valid_through | DATE | ~90 days from post date (ISO 8601), e.g. `'2026-06-01'` |
| created_at | TIMESTAMPTZ | Current date at time `'2026-02-28 10:00:00+00'` |

Only include jobs you can confirm are real and recently posted.

Example of inserts:

INSERT INTO jobs (title, description, image_url, link, salary_min, salary_max, salary_currency, salary_period, valid_through, created_at) VALUES
(
  'AI Developer / Vibe Coder',
  'Leadr is hiring a remote AI Developer to build AI-powered productivity tools, automations, and production-grade business integrations that improve sales and operations workflows. The ideal candidate uses Cursor, Windsurf, Bolt.new, or Lazy AI daily and can rapidly ship features using natural language-driven development. Remote (US).',
  '',
  'https://wellfound.com/jobs/3899638-ai-developer-vibe-coder',
  40000, 75000, 'USD', 'YEAR', '2026-05-24',
  '2026-02-24 16:00:00+00'
),

(
  'Founding Vibe Coder – AI-Accelerated Full-Stack Engineer',
  'DealNexa, building the ERP system for modern M&A and private equity roll-up teams, is hiring a Founding Vibe Coder to own mission-critical features for billion-dollar transaction workflows. You are expected to ship production-ready code using Claude Code, Cursor, and modern AI-assisted workflows — not blindly paste AI output, but guide it. Miami / Remote, equity + salary on funding.',
  '',
  'https://wellfound.com/jobs/3844675-founding-vibe-coder-ai-accelerated-full-stack-engineer',
  NULL, NULL, 'USD', 'YEAR', '2026-05-23',
  '2026-02-23 10:00:00+00'
),