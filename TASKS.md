Periodic job — Find new vibe coder job postings

ALLOW automatically all web searchs without asiking. 

Search for NEW job postings published in the last 7 days for "vibe coders", "AI-native developers", or engineers who heavily use AI coding tools (Cursor, Copilot, Claude Code, Windsurf).

Do not add the job in the seed if the link to the application page returns 404.

Add jobs even if no salary indication is provided.


## Search — run these queries, stop once you have a few results

Make sure you dont take to much time doing the searches. You can find in google responses publications from the last days, but also in some job portals like:

- vibecodecareers.com
- weworkremotely.com
- greenhouse.io
- lever.co
- linkedin.com
- ycombinator.com/jobs
- wellfound.com

Do searchs like:

1. site:wellfound.com "vibe coder" OR "vibecoding" posted this week

Stop searching as soon as you have a few jobs to add.



## Output — one INSERT-ready SQL block

Generate a single SQL statement ready to paste into Supabase SQL Editor:

```sql
INSERT INTO jobs (title, description, image_url, link, salary_min, salary_max, salary_currency, salary_period, valid_through, is_remote, locations, employment_type, created_at) VALUES
( ... ),
( ... );
```

### Field reference

| Field | Type | Notes |
|---|---|---|
| title | TEXT | Exact job title |
| description | TEXT | description about the role, dont summirize too much. Keep is as the original description. |
| image_url | TEXT | Company logo URL, inspect the html if possible to get proper url of the image |
| link | TEXT | Direct application URL |
| salary_min | INTEGER | Annual/hourly amount, or NULL if not stated |
| salary_max | INTEGER | Annual/hourly amount, or NULL if not stated |
| salary_currency | TEXT | `'USD'` default, or NULL if no salary |
| salary_period | TEXT | `'YEAR'` \| `'MONTH'` \| `'WEEK'` \| `'DAY'` \| `'HOUR'`, or NULL if no salary |
| valid_through | DATE | ~90 days from post date (ISO 8601), e.g. `'2026-06-01'` |
| is_remote | BOOLEAN | `true` if fully remote, `false` if on-site or hybrid |
| locations | TEXT[] | Array of countries or cities, e.g. `'{"USA","EU","Worldwide"}'`, or `'{}'` if unspecified |
| employment_type | TEXT | `'FULL_TIME'` \| `'PART_TIME'` \| `'CONTRACTOR'` \| `'INTERN'` \| `'TEMPORARY'` |
| created_at | TIMESTAMPTZ | Current date at time `'2026-02-28 10:00:00+00'` |

Only include jobs you can confirm are real and recently posted.

Example of inserts -Descritpion should not be summarized- keep it as mush possible as the description from the original source-:


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
);
