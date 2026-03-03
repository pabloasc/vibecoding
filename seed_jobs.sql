-- ============================================================
-- VibeCoding Jobs — Seed Data (NEW BATCH)
-- Fresh positions found: February 28, 2026
-- Run in Supabase SQL Editor to add these to your database.
-- ============================================================

INSERT INTO jobs (title, description, image_url, link, salary_min, salary_max, salary_currency, salary_period, valid_through, is_remote, locations, employment_type, created_at) VALUES

(
  'Vibe Coder / Software Developer (Low-Code / No-Code)',
  'ATLAS ANALYTICS is hiring a Vibe Coder to build software products using low-code and no-code AI-assisted tools. The role focuses on rapid prototyping and delivery using modern AI coding platforms. Fully remote, open to candidates across Eastern Europe, Georgia, and Ukraine.',
  'https://logo.clearbit.com/atlasanalytics.com',
  'https://wellfound.com/jobs/2306588-vibe-coder-software-developer-low-code-no-code',
  NULL, NULL, NULL, NULL, '2026-05-28',
  true, '{"Eastern Europe","Georgia","Ukraine"}', 'FULL_TIME',
  '2026-02-28 10:00:00+00'
),

(
  'Vibe Coder',
  'LikeMinds is looking for a Vibe Coder to help build their community platform using AI-powered development tools. The role involves using AI coding assistants to rapidly prototype and ship features. Based in Gurugram with remote flexibility.',
  'https://logo.clearbit.com/likeminds.community',
  'https://wellfound.com/jobs/3249959-vibe-coder',
  NULL, NULL, NULL, NULL, '2026-05-28',
  false, '{"India"}', 'FULL_TIME',
  '2026-02-28 10:00:00+00'
),

(
  'Vibe Coding Intern (US Remote)',
  'Untapped Ventures is seeking a Vibe Coding Intern to build internal tools, test emerging AI agents, and support early-stage diligence work to understand AI-native workflows. The role starts February/March 2026 and is fully remote within the US.',
  'https://logo.clearbit.com/untappedventures.com',
  'https://wellfound.com/jobs/3608636-vibe-coding-intern-us-remote',
  NULL, NULL, NULL, NULL, '2026-05-28',
  true, '{"USA"}', 'INTERN',
  '2026-02-28 10:00:00+00'
),

(
  'Remote Junior Engineer – Vibe Coding',
  'Elite Koach is hiring a Remote Junior Engineer to build modern SaaS products using Lovable and AI-assisted coding workflows. No years of experience required — just curiosity and a willingness to learn vibe coding. Fully remote.',
  'https://logo.clearbit.com/elitekoach.com',
  'https://wellfound.com/jobs/3803030-remote-junior-engineer-vibe-coding-fully-remote-using-loverable',
  NULL, NULL, NULL, NULL, '2026-05-28',
  true, '{}', 'FULL_TIME',
  '2026-02-28 10:00:00+00'
);
