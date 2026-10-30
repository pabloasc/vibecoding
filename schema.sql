-- ============================================================
-- vibecoding.work — Supabase Schema
-- A community of developers and vibecoders: builders post profiles,
-- mentors and teams browse them. Profiles live in the original `jobs` table.
-- Run this in the Supabase SQL Editor to set up your database
-- ============================================================


-- ── 1. Profiles (stored in the `jobs` table) ─────────────────
-- Column → meaning on the site (form label in quotes):
--   name            → "Your name"            e.g. 'Maya Chen'
--   title           → "Headline"             e.g. 'AI-native frontend builder'
--   description     → "About you"
--   image_url       → "Avatar"
--   link            → "Profile URL"          GitHub, portfolio, LinkedIn…
--   employment_type → "Looking for"          INTERN | CONTRACTOR (freelance) | TEMPORARY (short project)
--                                            | PART_TIME | FULL_TIME
--                                            (MENTOR, MENTORSHIP: legacy, no longer offered in the form)
--   is_remote       → "Open to remote work"
--   locations       → "Based in"
--   salary_*        → not used by the site anymore (kept so no data is lost)
--   valid_through   → not used by the site anymore (kept so no data is lost)
--   user_id         → the builder who owns the profile (set automatically on insert)
CREATE TABLE IF NOT EXISTS jobs (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT,                    -- builder's name (NULL on profiles created before the column existed)
    title            TEXT        NOT NULL,
    description      TEXT        NOT NULL,
    image_url        TEXT,                    -- Public URL from Supabase Storage or external URL
    link             TEXT        NOT NULL,
    salary_min       INTEGER,                 -- e.g. 80000
    salary_max       INTEGER,                 -- e.g. 150000
    salary_currency  TEXT        DEFAULT 'USD',
    salary_period    TEXT        DEFAULT 'YEAR', -- YEAR | MONTH | WEEK | DAY | HOUR
    valid_through    DATE,                    -- job expiry date (ISO 8601)
    is_remote        BOOLEAN     DEFAULT true,
    locations        TEXT[],                  -- e.g. '{"USA","Germany","Worldwide"}' — empty/null means unspecified
    employment_type  TEXT        DEFAULT 'FULL_TIME', -- INTERN | CONTRACTOR | TEMPORARY | PART_TIME | FULL_TIME | MENTOR
    user_id          UUID        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- NOTE: URL slugs are derived at request time as slugify(name + ' ' + title) + '-' + id[0:8]
-- e.g. /profile/maya-chen-ainative-frontend-builder-a6b7c8d9/  (legacy /job/… URLs 301-redirect here)
-- No slug column is needed — the first 8 chars of the UUID guarantee uniqueness.

-- ── Migration: add Google JobPosting structured-data fields ──
-- Run this block in Supabase SQL Editor if the table already exists.
-- Safe to re-run — IF NOT EXISTS prevents duplicate column errors.
--
-- salary_period allowed values: YEAR | MONTH | WEEK | DAY | HOUR
-- These map directly to Google's MonetaryAmountDistribution unitText values.

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS salary_min      INTEGER,
  ADD COLUMN IF NOT EXISTS salary_max      INTEGER,
  ADD COLUMN IF NOT EXISTS salary_currency TEXT    DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS salary_period   TEXT    DEFAULT 'YEAR',
  ADD COLUMN IF NOT EXISTS valid_through   DATE,
  ADD COLUMN IF NOT EXISTS is_remote       BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS locations       TEXT[],
  ADD COLUMN IF NOT EXISTS employment_type TEXT    DEFAULT 'FULL_TIME';

-- ── Migration: profile ownership ─────────────────────────────
-- Lets builders edit and delete their own profile.
-- user_id is filled automatically with the creator's account (DEFAULT auth.uid()),
-- and the RLS policies below only let that same user (or the admin) change the row.
-- Safe to re-run.
--
-- Rows created BEFORE this column existed have user_id = NULL (the old table never
-- recorded who created them), so only the admin can edit those. To give one back
-- to the person who originally created it:
--   UPDATE jobs SET user_id = (SELECT id FROM auth.users WHERE email = 'original-creator@example.com')
--   WHERE id = '<profile id>';

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs (user_id);

-- ── Migration: separate name field ───────────────────────────
-- Safe to re-run. Older profiles keep name = NULL; the site then falls back to
-- the part of the title before " · " (e.g. 'Maya · Builder' → 'Maya').
-- Optional backfill that splits such titles into name + headline:
--   UPDATE jobs
--   SET name  = split_part(title, ' · ', 1),
--       title = substr(title, length(split_part(title, ' · ', 1)) + 4)
--   WHERE name IS NULL AND title LIKE '% · %';

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS name TEXT;

-- ── Row Level Security ───────────────────────────────────────
-- Safe to re-run: every policy is dropped (including the old admin-only ones) and recreated.
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read"            ON jobs;
DROP POLICY IF EXISTS "Authenticated insert"   ON jobs;
DROP POLICY IF EXISTS "Admin update"           ON jobs;
DROP POLICY IF EXISTS "Admin delete"           ON jobs;
DROP POLICY IF EXISTS "Owner or admin update"  ON jobs;
DROP POLICY IF EXISTS "Owner or admin delete"  ON jobs;

-- Anyone can read profiles
CREATE POLICY "Public read" ON jobs
    FOR SELECT USING (true);

-- Signed-in users can create profiles, always owned by themselves
CREATE POLICY "Authenticated insert" ON jobs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

-- Owners can update their own profile (and can't hand it to someone else); the admin can update any
CREATE POLICY "Owner or admin update" ON jobs
    FOR UPDATE
    USING      (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'hi@vibecoders.co')
    WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'hi@vibecoders.co');

-- Owners can delete their own profile; the admin can delete any
CREATE POLICY "Owner or admin delete" ON jobs
    FOR DELETE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'hi@vibecoders.co');


-- ── 2. Storage bucket ────────────────────────────────────────
-- Creates a public bucket called "job-images" for profile avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-images', 'job-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view images
CREATE POLICY "Public read images" ON storage.objects
    FOR SELECT USING (bucket_id = 'job-images');

-- Only authenticated users can upload images
CREATE POLICY "Authenticated upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'job-images'
        AND auth.role() = 'authenticated'
    );

-- Only the admin can delete images
CREATE POLICY "Admin delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'job-images'
        AND auth.jwt() ->> 'email' = 'hi@vibecoders.co'
    );
