-- ============================================================
-- VibeCoding Jobs — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database
-- ============================================================


-- ── 1. Jobs table ────────────────────────────────────────────
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
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- NOTE: URL slugs are derived at build time as slugify(title) + '-' + id[0:8]
-- e.g. /job/staff-engineer-ai-productivity-a6b7c8d9/
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
  ADD COLUMN IF NOT EXISTS valid_through   DATE;

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can read jobs
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
-- Creates a public bucket called "job-images" for job cover images
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
