-- ============================================================
-- VibeCoding Jobs — Seed Data (NEW BATCH)
-- Fresh positions found: March 11, 2026
-- Run in Supabase SQL Editor to add these to your database.
-- ============================================================

INSERT INTO jobs (title, description, image_url, link, salary_min, salary_max, salary_currency, salary_period, valid_through, is_remote, locations, employment_type, created_at) VALUES

(
  'Senior Vibe Coder',
  'Appnovation is a global, full-service digital partner that combines Strategy, Experience & Design, Engineering and Managed Services. We build digital solutions that deliver real impact today and serve as foundations for future growth.

As a Senior Vibe Coder at Appnovation, you will join our team in a unique role that blends business and technology. We are seeking a highly creative and technically skilled individual who is passionate about innovation with AI, can rapidly prototype business applications using AI tools, and bring these ideas to life. The ideal candidate has a deep understanding of both business and technology, particularly within the pharmaceutical or life sciences sector, and thrives on experimentation and speed.

Key Responsibilities:
- Thrive on experimentation, moving at a rapid pace: build quick hacks in 24–48 hours, develop prototypes within a week, and deploy solutions to production the following week
- Design and develop rapid prototypes of business applications using modern technologies (e.g., React, Python)
- Apply creative problem-solving to address complex commercial and pharmaceutical challenges
- Rapidly understand evolving business needs and translate them into innovative technical prototypes
- Collaborate with an evolving team in Commercial to establish strong relationships and build partnerships
- Stay at the forefront of AI and industry trends, continuously bringing new ideas and technologies to the team

What We''re Looking For:
- Proven experience in software development with a focus on rapid prototyping and application development
- Strong understanding of both the business and technical aspects of application development, particularly within the pharmaceutical or life sciences sector
- Preferred experience with NextJS, N8N, and AI-powered IDEs (e.g., Cursor)
- Familiarity with leading AI platforms and services such as OpenAI, Anthropic, and open-source AI models
- Passionate about leveraging cutting-edge AI tools to build real-world solutions at speed
- Ability to thrive in a fast-paced, experimental environment

What Appnovation Offers:
- Challenging and rewarding work with real impact
- Direct access to cutting-edge AI platforms
- Diverse and inclusive culture
- Growth opportunities for personal and professional development
- A collaborative and innovative work environment
- Exposure to exciting projects and high-profile clients
- Hybrid working model
- Health Benefits Package, Mental Health Support, Personal Days Off, Fertility and Menopause Leave, Fitness Allowance

At Appnovation, we recognize that diverse teams are the strongest teams. We are an Equal Opportunity Employer and encourage applicants from all backgrounds, lived experiences and industries to apply. Accommodations are available upon request throughout the recruitment process.',
  'https://www.appnovation.com/themes/custom/appnovation/assets/images/logos/appnovation_wordmark_simple.svg',
  'https://job-boards.greenhouse.io/appnovation/jobs/8078007002',
  NULL, NULL, NULL, NULL, '2026-06-03',
  false, '{"Canada","USA"}', 'FULL_TIME',
  '2026-03-05 10:00:00+00'
),

(
  'Vibe Coding Instructor & Office Manager',
  'Platinum Edge Tutoring is hiring a Vibe Coding Instructor & Office Manager based in Belcamp, MD.

About the Role:
We''re looking for a passionate, community-minded educator to lead small group coding classes (10–15 students) and help manage our growing Belcamp office. This is a hands-on role that combines teaching and administrative responsibilities in equal measure.

Teaching Responsibilities:
- Lead beginner-friendly vibe coding sessions using AI-assisted and no-code/low-code tools
- Guide participants with zero prior technical experience to build and launch a working application by program end
- Foster an inclusive, encouraging learning environment that welcomes students from all backgrounds
- Develop lesson materials and activities that make technical concepts approachable and exciting

Office & Community Responsibilities:
- Coordinate scheduling, manage logistics, and support student onboarding
- Organize community events and demo days to celebrate student work
- Serve as a point of contact for students and families
- Help build and sustain an engaged creator community beyond the classroom

What We''re Looking For:
- Hands-on experience experimenting with AI coding tools or vibe coding workflows
- Comfort building applications using no-code/low-code platforms (e.g., Bubble, Glide, Webflow, Replit, etc.)
- Strong communication and organizational skills; ability to explain technical ideas simply
- Teaching or mentoring experience is a plus, but not required — we care more about your energy and commitment to community
- Self-starter mentality with a genuine interest in building inclusive tech spaces

How We Define Success:
- Participants complete the program with a working application they built themselves
- Students feel welcomed, supported, and excited about technology
- A sustained, engaged community of creators forms around the program

To Apply:
Submit a brief (1–3 minute) video describing your background and interest to christian@platinumedgetutoring.com',
  'https://images.squarespace-cdn.com/content/v1/55f8a7d8e4b0c432ff779320/826f8016-beb9-45a0-b79e-12994e1b0891/PE+Long+Logo.png',
  'https://www.indeed.com/viewjob?jk=421f32b5f9c41a92',
  20, 40, 'USD', 'HOUR', '2026-06-05',
  false, '{"USA"}', 'PART_TIME',
  '2026-03-07 10:00:00+00'
),

(
  'Civic Tech Software Engineer',
  'Schema Labs is a 4-person non-profit building OpenCouncil (https://opencouncil.gr), an AI platform that makes Greek municipal council meetings accessible to citizens. We take hours-long council sessions and turn them into searchable, per-topic video clips, SMS/email notifications, and speaker analytics.

We''re live with 10 municipalities including Athens, and the project is open source: https://github.com/schemalabz/opencouncil

Stack: TypeScript, Next.js, React, PostgreSQL, Elasticsearch. Heavy use of LLMs for transcription, speaker ID, and turning unstructured PDFs/transcripts into structured data. We use Claude Code, Cursor, and similar tools daily.

What We''re Looking For:
- Minimum 2 years of software engineering experience with a relevant degree
- Strong modern web development skills: TypeScript, Next.js, React, PostgreSQL, Elasticsearch
- AI/LLM software development experience using tools like Claude Code, Cursor, Windsurf, and Greptile
- Genuine commitment to civic tech and democracy-focused technology
- Excellence in at least one of:
  • Data Engineering & LLM Integration — converting unstructured information (PDFs, transcripts, audio) into structured data
  • Frontend Development & UX Design — creating intuitive, accessible interfaces for complex civic information
- Permanently based in Athens (or willing to relocate); fluent in Greek and English
- High self-initiative, sense of responsibility, and genuine interest in the mission

What We Offer:
- Performance bonus up to 30% of annual OpenCouncil profits
- Work-from-home flexibility (up to 3 days per week)
- Lunch provided on office days
- Small team, high ownership, real impact: your work is used by 10+ municipalities and tens of thousands of citizens nationwide

To Apply:
Email jobs@opencouncil.gr with subject ''Job: Civic Tech Software Engineer'' and include your CV or LinkedIn profile plus an optional GitHub link.',
  'https://logo.clearbit.com/schemalabs.gr',
  'https://schemalabs.gr/jobs/civic-tech-software-engineer',
  55000, 65000, 'EUR', 'YEAR', '2026-06-09',
  false, '{"Greece"}', 'FULL_TIME',
  '2026-03-11 10:00:00+00'
),

(
  'Senior Product Manager, Code',
  'Harness is looking for a Senior Product Manager to lead Harness Code Repository — our source control and code collaboration product. You''ll own the strategy and execution for source control, pull requests, governance, and AI-assisted developer workflows, and help integrate code into the broader software delivery lifecycle.

This is an individual contributor role focused on technical execution, enterprise trust, developer experience, and driving adoption across the Harness platform.

What You''ll Do:
- Define product strategy and multi-quarter roadmap for repo fundamentals: PRs, branch protections/policies, reviews/approvals, permissions/RBAC, and auditability
- Deepen and scale integration of Code with the broader Harness platform (build, security, deploy)
- Define success metrics (adoption, migration velocity, PR throughput, time-to-merge) and drive data-informed decisions using telemetry and customer feedback
- Define and deliver AI-assisted workflows grounded in repo/PR context — with clear evaluation criteria, guardrails, and iteration plans
- Partner with engineering and design to ensure AI experiences are trustworthy, controllable, and aligned with enterprise requirements
- Engage customers and prospects to understand workflows and governance needs
- Drive competitive intelligence across source control and adjacent tooling
- Write and manage technical requirements/specs
- Collaborate cross-functionally with GTM, product marketing, and DevRel

What We''re Looking For:
- BSc in Computer Science or equivalent practical experience
- 7+ years total experience, including 2+ years in software development and 5+ years in product management for developer tools, DevOps, SCM, or CI/CD
- Proven track record shipping complex products with measurable adoption and positive developer feedback
- Familiarity with GitHub, GitLab, or Bitbucket ecosystems — how engineers use them, what enterprises need
- Strong technical aptitude: ability to reason about architecture, systems tradeoffs, and API design
- Experience with AI-assisted developer workflows is a strong plus (vibe-coding and using coding copilots/agents for fast prototyping; expects AI-native workflows)
- Enterprise SaaS governance experience a plus

Compensation: $170,000–$185,000 USD base salary annually, depending on experience. Location: Remote, ideally with proximity to Mountain View, CA for occasional on-site collaboration.',
  'https://cdn.prod.website-files.com/6222ca42ea87e1bd1aa1d10c/67c1e03a066112554425a47b_harness-logo%20white.webp',
  'https://job-boards.greenhouse.io/harnessinc/jobs/5074953007',
  170000, 185000, 'USD', 'YEAR', '2026-06-10',
  true, '{"USA"}', 'FULL_TIME',
  '2026-03-10 10:00:00+00'
),

(
  'Director of Technical Operations',
  'Aesthetix CRM is the #1 CRM and marketing automation platform built exclusively for medical aesthetics practices. We are a HIPAA Business Associate running on GoHighLevel with integrations across Twilio, Vercel, Supabase, and more.

We''re hiring a Director of Technical Operations — a player-coach role that combines hands-on troubleshooting with leading and developing a support team, building processes, documentation, and AI-augmented tooling.

What You''ll Do:
- Run daily support operations: ticket triage, escalations, SLAs, quality control, process improvements
- Serve as the top-tier escalation point for complex GoHighLevel issues, automation failures, Twilio/telephony problems, API integrations, and webhook debugging
- Meet directly with clients to scope requirements, diagnose issues, and implement live fixes
- Build and optimize GHL workflows using Zapier, Make, N8N, Active Pieces, and custom integrations
- Use AI tools to write code, build utilities, and accelerate delivery — heavy vibe-coding and AI-conductor focus: you''ll use AI assistants (Claude, ChatGPT, Cursor) to generate scripts and iterate quickly
- Create help articles, SOPs, video walkthroughs, and internal documentation
- Coach and mentor support team members (team of 3+), run 1:1s and performance reviews

What We''re Looking For:
- 2+ years hands-on GoHighLevel experience (required)
- CRM automation experience: Zapier, Make, N8N, Active Pieces
- Ability to write or AI-generate scripts in JavaScript, Python, or TypeScript
- Proven experience using AI assistants effectively (Prompt Engineering / AI-assisted Development)
- Experience producing help docs, knowledge base articles, and video tutorials
- Comfort in client-facing meetings and live troubleshooting
- Strong troubleshooting skills across CRM, telephony, APIs, webhooks, DNS, email delivery
- Experience managing or mentoring a support team of 3+
- Self-starter who can operate independently

Preferred Qualifications:
- Healthcare, health IT, or medical aesthetics background
- Twilio experience (Studio, messaging, voice/IVR)
- EMR systems familiarity (Zenoti, Nextech, PatientNow, Meevo)
- HIPAA awareness and PHI handling experience
- Supabase, Vercel, Google Cloud, or Cloudflare Workers familiarity

Success Milestones:
- 30 days: fully onboarded, understand the stack, handle escalated tickets independently
- 60 days: running daily support operations, taking client calls, shipping initial help articles
- 90 days: founder removed from escalation chain; you fully own the function
- 12 months: become product expert with a clear CTO path

Benefits: 14 days PTO, 7 paid holidays, 401(k) matching after 1 year, fully remote.',
  'https://workablehr.s3.amazonaws.com/uploads/account/logo/669046/logo',
  'https://jobs.workable.com/view/wUqJtiU42SNkXUaa2NUvaP/remote-director-of-technical-operations-in-united-states-at-aesthetix-crm',
  80000, 100000, 'USD', 'YEAR', '2026-06-12',
  true, '{"USA"}', 'FULL_TIME',
  '2026-03-12 10:00:00+00'
),

(
  'AI Product Manager',
  'Imagine Learning is the leading provider of digital-first K–12 curriculum solutions, committed to igniting learning breakthroughs and empowering potential in every student and educator.

We are seeking a mid-level AI Product Manager to develop AI-driven learning experiences that solve real classroom challenges. This role combines user empathy, technical AI fluency, and rapid execution to deliver data-driven innovation with measurable educational impact.

Key Responsibilities:
- Lead user-centered discovery through educator interviews, classroom research, analytics, and cross-functional stakeholder collaboration
- Ship iterative solutions quickly to real classrooms, measuring student and teacher outcomes
- Drive cross-functional alignment across Engineering, Design, Curriculum, Sales, and Marketing
- Operate as an AI-native product manager — using tools like ChatGPT, Claude, Claude Code, Lovable, Replit, and similar platforms to prototype concepts and accelerate analysis
- Develop and launch AI-powered features leveraging LLMs, NLP, and computer vision for K–12 learning
- Design evaluation frameworks addressing hallucinations, bias, safety, and instructional quality in AI features
- Run experiments, define success metrics, and maintain data-driven product decisions
- Champion responsible AI innovation while protecting student privacy and data integrity

Required Qualifications:
- Bachelor''s degree in Computer Science, Product Management, Education, Business, or related field
- Minimum 5 years Product Management experience; at least 3 years with SaaS or AI/ML products
- Proven AI adoption — regularly using AI across your work
- Experience with vibe coding tools such as Figma Make, Claude Code, OpenAI Codex, Replit, v0, Lovable, Bolt, etc.
- Software development and cloud infrastructure understanding
- Agile/Scrum and product discovery expertise
- Strong LLM, prompt design, and responsible AI knowledge
- Data-driven analytical thinking with strong cross-functional collaboration
- Up to 20% travel

Preferred:
- EdTech industry background
- Software engineering or computer science background

Compensation & Benefits:
- Base salary $110,862–$160,000 annually, plus incentive/bonus eligibility
- Zero-premium medical plans, 401(k) match, 16 paid holidays, PTO, winter shutdown
- Fertility/maternity benefits, mental health resources, tuition reimbursement
- Fully remote (US-based)',
  'https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/128x128/437626d72f6cff3f25cd8662c77e5c3b',
  'https://jobs.jobvite.com/careers/imagine-learning/job/oQlPzfwj',
  110862, 160000, 'USD', 'YEAR', '2026-06-13',
  true, '{"USA"}', 'FULL_TIME',
  '2026-03-13 10:00:00+00'
),

(
  'Staff Developer Advocacy Engineer',
  'Grafana Labs is looking for a Staff Developer Advocacy Engineer to join the team responsible for building the Interactive Learning Plugin — an open source, in-product learning experience inside Grafana.

About the Role:
This is a senior individual contributor role at the intersection of production-grade software engineering, developer advocacy, and AI-assisted development. You will create scalable, in-product learning experiences that help users succeed with Grafana and its observability ecosystem.

What You''ll Do:
- Develop and deploy features for the Interactive Learning Plugin, ensuring learning experiences are obvious, smooth, and scalable
- Enhance end-to-end learner journeys with trustworthy progress tracking and completion metrics
- Enable contribution workflows so non-technical contributors can safely generate and manage learning content
- Instrument learning flows with metrics, logs, and traces to surface what is working and where learners get stuck
- Employ fast feedback loops and visibility into production and real user experiences as a core product principle
- Ship code using agent-based tooling such as Claude Code or Cursor alongside rigorous engineering practices
- Participate in on-call rotations with full production ownership
- Generate documentation, design notes, and PR descriptions; communicate decisions internally and externally (~20% of time)

What You''ll Need:
- Robust software engineering fundamentals with production-grade capability and architectural reasoning
- Demonstrated experience with AI-assisted development and agentic workflows — daily use of Claude Code or Cursor is expected
- Working familiarity with Grafana and observability methodologies (dashboards, monitoring, on-call operations)
- Willingness to participate in production on-call rotations
- Strong written communication aptitude for documentation and async collaboration

Nice to Have:
- Open source contribution or maintainer background
- Full-stack capability (front-end or back-end specialization both acceptable)
- TypeScript and/or Go proficiency
- Kubernetes experience
- Observability ecosystem knowledge (Prometheus, Loki, Tempo, Mimir, OpenTelemetry)

Compensation & Benefits:
- Base salary: $174,986 – $209,983 USD annually
- Restricted Stock Units (RSUs)
- Company-funded AI tool budget with frontier model access (GPT-Codex, Claude Opus, Gemini)
- 100% remote with global culture; in-person onboarding provided
- 30 annual leave days plus 3 Grafana Shutdown Days

Grafana Labs is committed to empowering its community through open source and world-class observability software.',
  'https://s4-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/400/744/400/original/GrafanaLabs_Logo.png?1772554471',
  'https://job-boards.greenhouse.io/grafanalabs/jobs/5825937004',
  174986, 209983, 'USD', 'YEAR', '2026-06-12',
  true, '{"USA"}', 'FULL_TIME',
  '2026-03-14 10:00:00+00'
),

(
  'Senior Director, Analyst - AI-Native, Agentic and Low-Code Software Development',
  'Gartner (NYSE: IT) is the world''s leading research and advisory company, serving approximately 14,000 client enterprises across 90 countries and territories. Gartner Analysts are industry thought leaders who create must-have insights, market predictions and best practices for a broad range of world-leading organizations.

About the Role:
A Senior Director, Analyst serves as a leader within Gartner''s Business and Technology Insights (BTI) group, establishing oneself as a credible voice within their designated market. This role sits within Gartner''s Software Engineering Practice, advising engineering leaders worldwide on emerging development techniques — including AI-native, agentic, and low-code software development. Utilizing exceptional research and analytical skills, a Senior Director plays a significant role in producing pragmatic and provocative insights which Gartner clients consume and apply to propel their business toward key objectives.

What You''ll Do:
- Create innovative, thought-provoking, and highly leveraged must-have insights content
- Develop new insights through thought leadership offering compelling, actionable approaches to client needs
- Develop in-depth analysis to identify root causes of client barriers and reframe thinking
- Demonstrate thought leadership in establishing insights positions across analyst teams
- Bring provocative, independent insights to Gartner leaders regarding research agendas
- Research, analyze, and predict market trends to provide actionable insights to clients and vendors
- Provide clients and prospects actionable advice via virtual or face-to-face interactions
- Create and deliver high-value presentation materials for Gartner events and conferences
- Support sales by serving as voice of the market to help teams create content
- Provide high-quality, timely peer review of content
- Build credibility as industry expert representing Gartner insights and methodology
- Participate actively in innovation and research discussions with peers
- Identify process improvements to enhance service delivery
- Mentor and coach junior team members
- Remain client-centric while promoting regular Gartner engagement

What You''ll Need:
- Bachelor''s degree or equivalent experience; graduate degree preferred
- 12+ years of relevant field or industry experience
- Experience leading teams to modernize developer tooling, particularly with tools transforming the software developer lifecycle
- Deep knowledge of AI-related development tools including code assistants and agentic platforms
- Practical knowledge of low-code application tools in professional environments
- Knowledge of leading low-code vendors and ability to identify benefits and risks
- Executive presence with ability to establish immediate credibility with executives
- Strong organizational skills and ability to work under tight deadlines
- Excellence in research and writing ability
- Strong written and verbal proficiency with analytical and presentation skills
- Ability to analyze and synthesize data with critical thinking application
- Strong communication skills explaining complex concepts concisely
- Track record of presenting at large and small-scale speaking engagements
- Strong business and financial acumen
- Deep knowledge of global competitive landscape in subject area
- Ability to work independently while collaborating across multicultural global teams
- Ability to represent Gartner''s research methodology effectively at all levels
- Willingness and ability to travel up to 25% (where applicable)

What Gartner Offers:
- World-class benefits and highly competitive compensation
- Disproportionate rewards for top performers
- Hybrid work environment emphasizing flexibility and collaboration
- 21,000 associates globally supporting client enterprises across 90 countries',
  'https://logo.clearbit.com/gartner.com',
  'https://gartner.wd5.myworkdayjobs.com/EXT/job/Remote---United-Kingdom/Senior-Director--Analyst-----AI-Native--Agentic-and-Low-Code-Software-Development--Remote-UK-and-Remote-Ireland-_108255-1',
  NULL, NULL, NULL, NULL, '2026-06-13',
  true, '{"United Kingdom","Ireland"}', 'FULL_TIME',
  '2026-03-15 10:00:00+00'
);
