-- ============================================================
-- vibecoding.work — Supabase Schema
-- The launchpad for junior developers and vibecoders: builders post profiles,
-- mentors and teams browse them. Profiles live in the original `jobs` table.
-- Run this in the Supabase SQL Editor to set up your database
-- ============================================================


-- ── 1. Profiles (stored in the `jobs` table) ─────────────────
-- Column → meaning on the site (form label in quotes):
--   title           → "Headline"             e.g. 'Maya · AI-native frontend builder'
--   description     → "About you"
--   image_url       → "Avatar"
--   link            → "Profile URL"          GitHub, portfolio, LinkedIn…
--   employment_type → "Looking for"          MENTORSHIP | INTERN | CONTRACTOR (freelance)
--                                            | TEMPORARY (short project) | PART_TIME | FULL_TIME
--   is_remote       → "Open to remote work"
--   locations       → "Based in"
--   salary_*        → "Rate expectation"
--   valid_through   → "Open to offers until"
CREATE TABLE IF NOT EXISTS jobs (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
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
    employment_type  TEXT        DEFAULT 'FULL_TIME', -- MENTORSHIP | INTERN | CONTRACTOR | TEMPORARY | PART_TIME | FULL_TIME
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- NOTE: URL slugs are derived at request time as slugify(title) + '-' + id[0:8]
-- e.g. /profile/maya-ainative-frontend-builder-a6b7c8d9/  (legacy /job/… URLs 301-redirect here)
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

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Public read" ON jobs
    FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated insert" ON jobs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only the admin can update
CREATE POLICY "Admin update" ON jobs
    FOR UPDATE USING (auth.jwt() ->> 'email' = 'hi@vibecoders.co');

-- Only the admin can delete
CREATE POLICY "Admin delete" ON jobs
    FOR DELETE USING (auth.jwt() ->> 'email' = 'hi@vibecoders.co');


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
