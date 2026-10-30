-- ============================================================
-- vibecoding.work — Job & assignment posts
-- Run this in the Supabase SQL Editor AFTER schema.sql.
-- Safe to re-run.
--
-- Companies, founders and nonprofits post paid jobs and assignments for
-- developers and vibecoders. Same fields as the `jobs` (profiles)
-- table, read as a job post:
--   name            → company / organization name   (Google: hiringOrganization)
--   title           → job title
--   description     → what the job or assignment is about
--   image_url       → company logo
--   link            → where to apply (URL or mailto:)
--   salary_*        → pay range (optional, but Google ranks jobs with pay higher)
--   valid_through   → closing date — expired posts drop off the board and Google
--   is_remote       → remote job
--   locations       → countries / cities (for remote: where applicants may live)
--   employment_type → FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN
--   user_id         → who posted it (set automatically)
-- ============================================================

CREATE TABLE IF NOT EXISTS job_posts (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT        NOT NULL,                -- company / organization
    title            TEXT        NOT NULL,
    description      TEXT        NOT NULL,
    image_url        TEXT,
    link             TEXT        NOT NULL,
    salary_min       INTEGER,
    salary_max       INTEGER,
    salary_currency  TEXT        DEFAULT 'USD',
    salary_period    TEXT        DEFAULT 'YEAR',          -- YEAR | MONTH | WEEK | DAY | HOUR
    valid_through    DATE,
    is_remote        BOOLEAN     DEFAULT true,
    locations        TEXT[],
    employment_type  TEXT        DEFAULT 'FULL_TIME',     -- FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN
    user_id          UUID        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_posts_created_at_idx ON job_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS job_posts_user_id_idx    ON job_posts (user_id);


-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read job posts"            ON job_posts;
DROP POLICY IF EXISTS "Authenticated insert job posts"   ON job_posts;
DROP POLICY IF EXISTS "Owner or admin update job posts"  ON job_posts;
DROP POLICY IF EXISTS "Owner or admin delete job posts"  ON job_posts;

-- Anyone can read job posts
CREATE POLICY "Public read job posts" ON job_posts
    FOR SELECT USING (true);

-- Signed-in users can post, always as themselves
CREATE POLICY "Authenticated insert job posts" ON job_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- The poster (or the admin) can edit
CREATE POLICY "Owner or admin update job posts" ON job_posts
    FOR UPDATE
    USING      (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'hi@vibecoders.co')
    WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'hi@vibecoders.co');

-- The poster (or the admin) can delete
CREATE POLICY "Owner or admin delete job posts" ON job_posts
    FOR DELETE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'hi@vibecoders.co');
