-- ============================================================
-- VibeCoding Jobs — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database
-- ============================================================


-- ── 1. Jobs table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT        NOT NULL,
    description TEXT        NOT NULL,
    image_url   TEXT,                         -- Public URL from Supabase Storage
    link        TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
