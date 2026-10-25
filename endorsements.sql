-- ============================================================
-- vibecoding.work — Mentor endorsements
-- Run this in the Supabase SQL Editor AFTER schema.sql.
-- Safe to re-run.
--
-- Mentors (profiles with employment_type = 'MENTOR') can endorse other
-- builders: up to 3 strengths from a fixed list, plus an optional short note.
-- One endorsement per mentor per profile; mentors can edit or remove theirs,
-- and profile owners can remove any endorsement from their own profile.
-- ============================================================


-- ── 1. Table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS endorsements (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id         UUID        NOT NULL,              -- who is endorsed
    mentor_user_id     UUID        NOT NULL DEFAULT auth.uid(),
    mentor_profile_id  UUID        NOT NULL,              -- the mentor's profile (set by trigger)
    strengths          TEXT[]      NOT NULL DEFAULT '{}',
    message            TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT endorsements_profile_id_fkey
        FOREIGN KEY (profile_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT endorsements_mentor_user_id_fkey
        FOREIGN KEY (mentor_user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT endorsements_mentor_profile_id_fkey
        FOREIGN KEY (mentor_profile_id) REFERENCES jobs(id) ON DELETE CASCADE,

    CONSTRAINT endorsements_one_per_mentor UNIQUE (profile_id, mentor_user_id),

    -- Keep in sync with STRENGTHS in src/lib/profile.ts
    CONSTRAINT endorsements_strengths_valid CHECK (
        cardinality(strengths) <= 3
        AND strengths <@ ARRAY[
            'Ships fast', 'Clean code', 'Great communicator', 'Curious learner',
            'Creative problem solver', 'AI-tools pro', 'Team player', 'Takes feedback well'
        ]::TEXT[]
    ),
    CONSTRAINT endorsements_message_length CHECK (message IS NULL OR char_length(message) <= 280),
    CONSTRAINT endorsements_not_empty CHECK (
        cardinality(strengths) > 0 OR char_length(btrim(coalesce(message, ''))) > 0
    )
);

CREATE INDEX IF NOT EXISTS endorsements_profile_id_idx ON endorsements (profile_id, created_at DESC);


-- ── 2. Trigger: who is endorsing ─────────────────────────────
-- The client only sends profile_id, strengths and message. The mentor is taken
-- from the session, so nobody can endorse in someone else's name.
CREATE OR REPLACE FUNCTION set_endorsement_mentor()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        NEW.profile_id := OLD.profile_id;          -- an endorsement can't be moved to another profile
        NEW.created_at := OLD.created_at;
        NEW.updated_at := NOW();
    END IF;

    NEW.mentor_user_id := auth.uid();

    SELECT id INTO NEW.mentor_profile_id
    FROM jobs
    WHERE user_id = auth.uid() AND employment_type = 'MENTOR'
    ORDER BY created_at
    LIMIT 1;

    IF NEW.mentor_profile_id IS NULL THEN
        RAISE EXCEPTION 'Only mentors can endorse builders. Create a mentor profile first.';
    END IF;

    IF EXISTS (SELECT 1 FROM jobs WHERE id = NEW.profile_id AND user_id = auth.uid()) THEN
        RAISE EXCEPTION 'You can''t endorse your own profile.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS endorsements_set_mentor ON endorsements;
CREATE TRIGGER endorsements_set_mentor
    BEFORE INSERT OR UPDATE ON endorsements
    FOR EACH ROW EXECUTE FUNCTION set_endorsement_mentor();


-- ── 3. Row Level Security ────────────────────────────────────
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read endorsements"            ON endorsements;
DROP POLICY IF EXISTS "Mentors endorse"                     ON endorsements;
DROP POLICY IF EXISTS "Mentors edit own endorsement"        ON endorsements;
DROP POLICY IF EXISTS "Mentor, profile owner or admin delete" ON endorsements;

-- Anyone can read endorsements
CREATE POLICY "Public read endorsements" ON endorsements
    FOR SELECT USING (true);

-- Signed-in users endorse as themselves (the trigger checks they're a mentor)
CREATE POLICY "Mentors endorse" ON endorsements
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND mentor_user_id = auth.uid());

-- Mentors can edit their own endorsement
CREATE POLICY "Mentors edit own endorsement" ON endorsements
    FOR UPDATE
    USING      (mentor_user_id = auth.uid())
    WITH CHECK (mentor_user_id = auth.uid());

-- The mentor can withdraw it; the endorsed builder can remove it from their profile; the admin can remove any
CREATE POLICY "Mentor, profile owner or admin delete" ON endorsements
    FOR DELETE USING (
        mentor_user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM jobs j WHERE j.id = profile_id AND j.user_id = auth.uid())
        OR auth.jwt() ->> 'email' = 'hi@vibecoders.co'
    );
