-- seed.sql
-- Sample job listings for vibecoding.work
-- Run this in your Supabase SQL Editor after running schema.sql
--
-- Positions sourced from active listings (Feb 2026):
--   DynamiteJobs, LinkedIn, Lever, Greenhouse, and company career pages

INSERT INTO jobs (title, description, link, image_url, created_at) VALUES

(
  'Vibe Coder',
  'Adaptify is hiring a remote Vibe Coder to build AI-powered marketing and SEO tools. You will use LLM APIs (GPT-4o, Claude) and modern scaffolding tools (Cursor, Bolt, v0) to ship working prototypes in days, not weeks. No traditional sprint ceremonies — you own features end-to-end. Must be comfortable reading AI-generated diffs, prompt-engineering your way through blockers, and iterating fast on customer feedback. Experience with Next.js or Astro preferred. Fully remote, async-first team.',
  'https://www.dynamitejobs.com/position/vibe-coder',
  NULL,
  NOW() - INTERVAL '1 day'
),

(
  'Vibe Coder — Frontend Developer',
  'CO/AI is looking for a Vibe Coder to join our small, fast-moving team building the next generation of AI-native SaaS products. You will prototype and ship full UI features using AI coding assistants (Cursor, Copilot, Claude Code) as your primary workflow. We don''t expect perfection — we expect velocity. Ideal candidate ships polished React/Tailwind UIs, knows when to lean on the AI and when to write it by hand, and treats the prompt as a first-class artifact. Remote-first, competitive equity package.',
  'https://co.ai/careers/vibe-coder-frontend',
  NULL,
  NOW() - INTERVAL '2 days'
),

(
  'AI Pilot — Vibe Coding Specialist',
  'Mindrift (by Toloka AI) is recruiting AI Pilots to help evaluate and improve AI-generated code. As a Vibe Coding Specialist you will assess LLM outputs for correctness, style, and real-world usability — writing targeted prompts, red-teaming edge cases, and rating code quality across Python, TypeScript, and Rust. Flexible hours, contractor role. Ideal for developers who love poking holes in AI output and have strong opinions about what "good code" looks like. No full-time commitment required.',
  'https://mindrift.ai/tasks/vibe-coding-specialist',
  NULL,
  NOW() - INTERVAL '3 days'
),

(
  'Senior Software Engineer — AI Platform',
  'Samsara is growing its AI Platform team and wants engineers who embrace AI-assisted development as a core workflow. You will design and scale the infrastructure that powers ML model serving, real-time inference pipelines, and LLM integrations across Samsara''s fleet-safety products. We expect you to use Copilot, Cursor, or similar tooling daily and to write prompts as carefully as you write code. Go or Python backend, Kubernetes, strong distributed systems fundamentals required. Remote-eligible (US).',
  'https://www.samsara.com/company/careers/roles/software-engineer-ai-platform',
  NULL,
  NOW() - INTERVAL '4 days'
),

(
  'Senior Full Stack Engineer — AI & Data Products',
  'Rocket Money (a Rocket Companies product) is hiring a Senior Full Stack Engineer to lead AI feature development across its personal finance platform. You will build LLM-powered features — smart categorisation, natural-language spending insights, conversational budget coaching — using React, Node.js, and Python. The team actively uses AI coding assistants and expects candidates to be fluent in prompt-driven development. Remote-first, strong benefits, RSU package.',
  'https://www.rocketmoney.com/careers/senior-full-stack-engineer-ai',
  NULL,
  NOW() - INTERVAL '5 days'
),

(
  'Software Engineer — Enterprise (AI-Native Workflow)',
  'Zapier is hiring engineers for its Enterprise Zone who embrace an AI-native development culture. You will build the automation backbone that millions of businesses rely on, using Python and TypeScript, with AI pair-programming tools baked into your daily workflow. We value engineers who treat LLMs as a multiplier — offloading boilerplate, accelerating code review, and exploring solution spaces faster. Fully distributed team across 40+ countries. Generous remote stipend and home-office budget.',
  'https://zapier.com/jobs/software-engineer-enterprise',
  NULL,
  NOW() - INTERVAL '6 days'
),

(
  'Software Engineer — Platform Productivity',
  'Grafana Labs is looking for a Software Engineer to join the Platform Productivity team, focused on improving developer experience for 1,000+ engineers worldwide. You will build internal tooling, CI/CD optimisations, and AI-assisted code-review bots that cut review cycles in half. Deep comfort with Go, GitHub Actions, and prompt engineering required. This is an ideal role for a developer who loves making other developers faster — and who uses AI tools not as a crutch but as a genuine force-multiplier. Remote-global.',
  'https://grafana.com/careers/software-engineer-platform-productivity',
  NULL,
  NOW() - INTERVAL '7 days'
),

(
  'Software Engineer — New Grad 2026 (AI Focus)',
  'Level AI is hiring 2026 new-grad engineers passionate about building AI-first B2B software. You will work directly with LLMs, RAG pipelines, and real-time conversation analytics to transform how enterprise contact centres operate. From day one you will use AI coding assistants as part of your standard workflow and be expected to iterate quickly. We''re a small team with big ambitions — expect real ownership fast. On-site in Mountain View, CA with relocation support.',
  'https://level.ai/careers/software-engineer-2026',
  NULL,
  NOW() - INTERVAL '8 days'
),

(
  'Senior Software Engineer — Remote (AI Products)',
  'Rula is a mental-health platform on a mission to make quality care accessible. We''re looking for a Senior Software Engineer to help build AI-assisted scheduling, clinical documentation, and care-coordination features. You will work in a TypeScript/React/Node stack, shipping features 2–3× faster thanks to our AI-first development culture. We don''t just tolerate Copilot/Cursor usage — we budget time for engineers to master it. Remote across the US, strong healthcare benefits.',
  'https://rula.com/careers/senior-software-engineer-remote',
  NULL,
  NOW() - INTERVAL '9 days'
),

(
  'Software Engineer — Full Stack (Remote)',
  'Handshake connects millions of students with early-career opportunities and is hiring full-stack engineers to help scale its AI-powered job-matching platform. You will build features that use embeddings, semantic search, and LLM re-ranking to surface the right role to the right student at the right moment. Rails backend, React frontend, strong data-modelling skills required. AI tooling is part of our engineering culture — we run internal "vibe coding" hackathons monthly. Remote-US.',
  'https://joinhandshake.com/careers/software-engineer-full-stack',
  NULL,
  NOW() - INTERVAL '10 days'
);
