-- ============================================================
-- VibeCoding Jobs — Seed Data (NEW BATCH)
-- Fresh positions found: March 9, 2026
-- Run in Supabase SQL Editor to add these to your database.
-- ============================================================

INSERT INTO jobs (title, description, image_url, link, salary_min, salary_max, salary_currency, salary_period, valid_through, is_remote, locations, employment_type, created_at) VALUES

(
  '(Vibe Coder/AI-assisted development/Generative AI developer/LLM engineer) with .NET',
  'ConnectTel, Inc. (Connect Tech+Talent) is seeking a .NET Full Stack Developer with strong AI-assisted development experience for a hybrid enterprise engagement in New York, NY (3 days in office). The role involves designing, developing, and maintaining scalable web applications using C#, ASP.NET Core, .NET 6/7/8, and RESTful APIs, alongside responsive front-end interfaces using Angular or React. Candidates must have AI-assisted SDLC experience with tools like Cursor, as well as database experience with SQL Server, PostgreSQL, or MySQL using Entity Framework Core or Dapper. DevOps skills with CI/CD pipelines (Azure DevOps, GitHub Actions, GitLab CI) and Git version control are required. 3–12 years of experience. Salary depends on experience.',
  'https://d3qscgr6xsioh.cloudfront.net/QFhzRfNuQ6nEzEsPxIU1_transformed.png?format=webp',
  'https://www.dice.com/job-detail/b7abc7b6-0902-40d7-a750-7c98fe349545',
  NULL, NULL, NULL, NULL, '2026-06-02',
  false, '{"USA"}', 'FULL_TIME',
  '2026-03-09 10:00:00+00'
),

(
  'AI Developer / Vibe Coder',
  'Coastline Gaming is looking for developers who actively build software using AI tools every day — not someone experimenting with AI concepts, but someone who ships. Responsibilities include developing internal tools, dashboards, and admin interfaces; creating data pipelines and analysis systems; building automations that connect business systems; designing AI agents and internal workflows; developing web applications and customer-facing tools; and integrating platforms, APIs, and data sources. The ideal candidate uses Claude Code daily as their primary development method, has shipped real projects built with AI assistance, has opinions about which model to use for different tasks, understands MCP servers and related technologies, and exhibits fast shipping velocity with a self-directed mindset. They are NOT looking for candidates who talk about AI strategy without shipping, treat manual coding as the gold standard, or rely on a single programming language. Competitive compensation based on experience, capability, and skill. Based in Dublin, hybrid/remote.',
  'https://phrpeopledataukprodsa.blob.core.windows.net/root/Files/Company/45566/108cd747acfe4c2b90e4885ce7bdb86a.png',
  'https://coastlinegaming.peoplehr.net/Pages/JobBoard/Opening.aspx?v=0527a1c9-5342-47c5-9b8f-75f579940740',
  NULL, NULL, NULL, NULL, '2026-03-31',
  false, '{"Ireland"}', 'FULL_TIME',
  '2026-03-09 10:00:00+00'
);
