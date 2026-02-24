-- ============================================================
-- VibeCoding Jobs — Seed Data
-- Real open positions for vibecoders & AI-native developers
-- Found: February 2026
-- Run in Supabase SQL Editor (requires authenticated session
-- or disable RLS temporarily for a direct seed)
-- ============================================================

-- To run as a direct seed (bypassing RLS), wrap in a superuser call:
-- SET LOCAL ROLE postgres; (only works in Supabase SQL Editor)

INSERT INTO jobs (title, description, image_url, link, created_at) VALUES

(
  'Staff Engineer – AI Productivity',
  'Hightouch is hiring a Staff Engineer to own and accelerate their entire AI-assisted development experience. You will manage agentic development environments, build MCP server integrations connecting AI agents to CircleCI, Slack, Datadog, and GitHub, and serve as an internal PM for AI coding agents like Claude Code, Cursor, Copilot, and Devin. Compensation is $180,000–$320,000/year, remote-friendly.',
  'https://logo.clearbit.com/hightouch.com',
  'https://job-boards.greenhouse.io/hightouch/jobs/5809895004',
  NOW() - INTERVAL '1 day'
),

(
  'Staff Software Engineer, Claude Developer Platform (Full Stack)',
  'Anthropic is seeking a product-minded full-stack engineer (7–10+ years) to build developer tooling for the Claude API, including the developer console and production onboarding flows. The role involves partnering with researchers to translate new model capabilities into developer-facing features, with an expectation of heavily using Claude itself in the development process. Compensation is $320,000–$405,000/year in San Francisco (hybrid).',
  'https://logo.clearbit.com/anthropic.com',
  'https://job-boards.greenhouse.io/anthropic/jobs/4561282008',
  NOW() - INTERVAL '2 days'
),

(
  'Software Engineer, Agent SDK – Claude Code',
  'This role owns the Python and TypeScript SDK roadmap that powers autonomous AI agents built on Claude Code. You will design clean agentic APIs, engage with the external developer community to understand friction points, and set the technical direction for one of the most important developer tools in the AI space. Compensation is $320,000–$485,000/year; available in SF, NYC, or Seattle (hybrid).',
  'https://logo.clearbit.com/anthropic.com',
  'https://job-boards.greenhouse.io/anthropic/jobs/5126691008',
  NOW() - INTERVAL '3 days'
),

(
  'Vibe Coder – Full-Stack AI Developer',
  'Adaptify SEO, an AI-first SEO automation platform, is hiring a Vibe Coder to build LLM-powered features using Python FastAPI, Firebase, React, and Next.js. The company operates fully async with no standups, ships fast, and expects you to experiment aggressively with cutting-edge AI capabilities. Fully remote, worldwide, with 28 days PTO and a generous equipment budget.',
  'https://logo.clearbit.com/adaptify.ai',
  'https://tally.so/r/w7V17L',
  NOW() - INTERVAL '4 days'
),

(
  'Sr. Front-End Growth Engineer (AI-First)',
  'Everlywell is looking for a senior React/Next.js engineer who treats AI tools not as novelties but as 10x force multipliers. The role explicitly requires hands-on experience with Cursor, GitHub Copilot, or Codeium to accelerate growth engineering work including A/B testing, e-commerce conversion optimization, and design system development. Requires 4–6+ years of frontend experience.',
  'https://logo.clearbit.com/everlywell.com',
  'https://jobs.lever.co/everlywell/2294c5dc-8eed-46c4-9f74-932c468de8e1',
  NOW() - INTERVAL '5 days'
),

(
  'Senior iOS Engineer (AI-First)',
  'Revi, a Series A-funded in-store digital commerce platform, is hiring a senior iOS engineer who actively integrates and optimizes AI-driven development tools — Cursor, Claude, and GitHub Copilot — for code generation, test creation, and performance tuning. You will own iOS app architecture using Swift and SwiftUI and push the boundaries of what AI-assisted mobile development can achieve.',
  'https://logo.clearbit.com/getrevi.com',
  'https://jobs.lever.co/revi/d9242b19-c9ca-401e-920c-7a8c0c657b4e',
  NOW() - INTERVAL '6 days'
),

(
  'Software Engineer, Internal AI Ops',
  'Entrata is building an internal AI Ops team and requires demonstrable experience leveraging AI-powered development tools (Cursor AI, GitHub Copilot, Tabnine) for code generation, refactoring, and debugging. The role involves building internal tooling and agentic AI solutions using LLM APIs from OpenAI and Anthropic, cloud services (AWS/Azure/GCP), and Python or TypeScript.',
  'https://logo.clearbit.com/entrata.com',
  'https://jobs.lever.co/entrata/aa0c17d7-e2f3-46c7-b24b-3debfd8cc2cf',
  NOW() - INTERVAL '7 days'
),

(
  'Cursor / Claude Code Expert – Full-Stack Engineer',
  'Motia, a startup building an event-driven architecture platform for AI agents, is looking for a full-stack engineer whose primary differentiator is mastery of AI coding tools: Cursor, Windsurf, Claude Code, and Cline. A typical week includes building MCP integrations with Claude Code, adding Cursor-driven UI features, and designing zero-downtime deployment pipelines for AI-generated agent code. Requires 5+ years in software development; fully remote.',
  'https://logo.clearbit.com/motia.dev',
  'https://weworkremotely.com/listings/motia-cursor-windsurf-cline-claude-code-expert-full-stack-engineer',
  NOW() - INTERVAL '8 days'
),

(
  'Game Developer – Vibe Coder',
  'Timedrift is a studio built around elite solo creators that hires AI-native game builders as full-time Game Directors. You will own a game end-to-end — from concept to 1.0 — using vibe coding in Unity to rapidly iterate on feel, input, camera, and UX loops. The studio provides structure and support while you drive daily wins and weekly playable momentum with near-full creative autonomy. Remote, $50,000–$150,000/year.',
  'https://logo.clearbit.com/timedrift.com',
  'https://vibecodecareers.com/job/game-developer-vibe-coder/',
  NOW() - INTERVAL '9 days'
),

(
  'AI Software Engineer',
  'Havenly, the #1 interior design platform in the US, is hiring an engineer who views AI as their primary superpower. The role spans iOS, backend, and eCommerce web codebases — you define AI behavior, evaluate LLM output quality, and ship AI-driven product features end-to-end across a portfolio of brands including Interior Define, Burrow, and The Citizenry. Based in Denver, CO (hybrid), $110,000–$140,000/year.',
  'https://logo.clearbit.com/havenly.com',
  'https://job-boards.greenhouse.io/havenly/jobs/8367486002',
  NOW() - INTERVAL '10 days'
),

(
  'Full-Stack Engineer, B2B – AI-Fluent',
  'DeepLearning.AI is hiring a full-stack engineer to build scalable, enterprise-grade learning experiences. The job explicitly requires high fluency with Claude Code, Cursor, Windsurf, or Cline, and expects candidates to use AI-powered coding tools to deliver innovation at scale. Responsibilities include building B2B platform features like co-branded landing pages, organizational leaderboards, and localization systems.',
  'https://logo.clearbit.com/deeplearning.ai',
  'https://jobs.lever.co/AIFund/095002a8-76d3-4d2b-930a-f6d3e38c56fe',
  NOW() - INTERVAL '11 days'
);
