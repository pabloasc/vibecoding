-- ============================================================
-- vibecoding.work — Projects & upvotes
-- Run this in the Supabase SQL Editor AFTER schema.sql.
-- Safe to re-run.
--
-- A profile (row in `jobs`) can showcase 1..n projects. Signed-in builders
-- who have a profile can upvote other people's projects; the profile page
-- shows who upvoted on hover.
-- ============================================================


-- ── 1. Projects ──────────────────────────────────────────────
-- Ownership follows the profile: whoever owns the profile (jobs.user_id)
-- can add, edit and remove its projects.
CREATE TABLE IF NOT EXISTS projects (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id   UUID        NOT NULL,
    title        TEXT        NOT NULL,
    description  TEXT,
    image_url    TEXT,                     -- logo: public URL in the job-images bucket
    link         TEXT,                     -- live app, repo, demo video…
    position     INTEGER     NOT NULL DEFAULT 0,   -- display order on the profile
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT projects_profile_id_fkey
        FOREIGN KEY (profile_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS projects_profile_id_idx ON projects (profile_id, position);


-- ── 2. Upvotes ───────────────────────────────────────────────
-- One row per (project, user). The upvote count is the number of rows.
-- voter_profile_id is filled by a trigger from the voter's own profile, so the
-- "who upvoted" list always shows real profiles and can't be spoofed.
CREATE TABLE IF NOT EXISTS project_upvotes (
    project_id        UUID        NOT NULL,
    user_id           UUID        NOT NULL DEFAULT auth.uid(),
    voter_profile_id  UUID        NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT project_upvotes_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT project_upvotes_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT project_upvotes_voter_profile_id_fkey
        FOREIGN KEY (voter_profile_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS project_upvotes_voter_profile_id_idx ON project_upvotes (voter_profile_id);

-- Fill in who is voting from the session — the client only sends project_id.
CREATE OR REPLACE FUNCTION set_project_upvote_voter()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.user_id := auth.uid();

    SELECT id INTO NEW.voter_profile_id
    FROM jobs
    WHERE user_id = auth.uid()
    ORDER BY created_at
    LIMIT 1;

    IF NEW.voter_profile_id IS NULL THEN
        RAISE EXCEPTION 'Create your profile to upvote projects.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS project_upvotes_set_voter ON project_upvotes;
CREATE TRIGGER project_upvotes_set_voter
    BEFORE INSERT ON project_upvotes
    FOR EACH ROW EXECUTE FUNCTION set_project_upvote_voter();


-- ── 3. Row Level Security ────────────────────────────────────
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_upvotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read projects"            ON projects;
DROP POLICY IF EXISTS "Owner or admin insert projects"  ON projects;
DROP POLICY IF EXISTS "Owner or admin update projects"  ON projects;
DROP POLICY IF EXISTS "Owner or admin delete projects"  ON projects;
DROP POLICY IF EXISTS "Public read upvotes"             ON project_upvotes;
DROP POLICY IF EXISTS "Builders upvote others"          ON project_upvotes;
DROP POLICY IF EXISTS "Voters remove own upvote"        ON project_upvotes;

-- Anyone can see projects
CREATE POLICY "Public read projects" ON projects
    FOR SELECT USING (true);

-- Only the profile's owner (or the admin) can manage its projects
CREATE POLICY "Owner or admin insert projects" ON projects
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'email' = 'hi@vibecoders.co'
        OR EXISTS (SELECT 1 FROM jobs j WHERE j.id = profile_id AND j.user_id = auth.uid())
    );

CREATE POLICY "Owner or admin update projects" ON projects
    FOR UPDATE
    USING (
        auth.jwt() ->> 'email' = 'hi@vibecoders.co'
        OR EXISTS (SELECT 1 FROM jobs j WHERE j.id = profile_id AND j.user_id = auth.uid())
    )
    WITH CHECK (
        auth.jwt() ->> 'email' = 'hi@vibecoders.co'
        OR EXISTS (SELECT 1 FROM jobs j WHERE j.id = profile_id AND j.user_id = auth.uid())
    );

CREATE POLICY "Owner or admin delete projects" ON projects
    FOR DELETE USING (
        auth.jwt() ->> 'email' = 'hi@vibecoders.co'
        OR EXISTS (SELECT 1 FROM jobs j WHERE j.id = profile_id AND j.user_id = auth.uid())
    );

-- Anyone can see upvotes (that's how "who upvoted" works)
CREATE POLICY "Public read upvotes" ON project_upvotes
    FOR SELECT USING (true);

-- Signed-in builders can upvote, as themselves, and not their own projects.
-- (The trigger above also requires them to have a profile.)
CREATE POLICY "Builders upvote others" ON project_upvotes
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
        AND NOT EXISTS (
            SELECT 1
            FROM projects p
            JOIN jobs j ON j.id = p.profile_id
            WHERE p.id = project_id AND j.user_id = auth.uid()
        )
    );

-- Voters can take their own upvote back
CREATE POLICY "Voters remove own upvote" ON project_upvotes
    FOR DELETE USING (user_id = auth.uid());
