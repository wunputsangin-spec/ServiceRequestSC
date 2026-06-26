-- Phase 5: Add role/department to employees, create jobs + job_chats tables

-- ── employees: add role + department ─────────────────────────────────────────
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS role      text NOT NULL DEFAULT 'employee'
    CHECK (role IN ('employee','technician','manager')),
  ADD COLUMN IF NOT EXISTS department text NOT NULL DEFAULT '';

-- Backfill from is_technician
UPDATE employees
SET role = CASE WHEN is_technician THEN 'technician' ELSE 'employee' END
WHERE role = 'employee' AND is_technician = TRUE;

-- ── job code sequence ─────────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS job_code_seq START 1;

CREATE OR REPLACE FUNCTION generate_job_code()
RETURNS text LANGUAGE sql AS $$
  SELECT 'SR-' || LPAD(nextval('job_code_seq')::text, 4, '0');
$$;

-- ── jobs table ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text        NOT NULL UNIQUE DEFAULT generate_job_code(),
  type           text        NOT NULL CHECK (type IN ('repair','service')),
  category       text        NOT NULL,
  title          text        NOT NULL,
  building       text        NOT NULL,
  floor          text        NOT NULL,
  location       text        NOT NULL DEFAULT '',
  urgency        text        NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal','urgent')),
  description    text        NOT NULL DEFAULT '',
  slot_date      text        NOT NULL DEFAULT '',
  slot_time      text        NOT NULL DEFAULT '',
  status         text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','assigned','in_progress','done')),
  requester_id   text        NOT NULL,  -- Employee.id
  requester_name text        NOT NULL,
  requester_line_uid text    NOT NULL DEFAULT '',
  assignees      text[]      NOT NULL DEFAULT '{}',
  photos         text[]      NOT NULL DEFAULT '{}',
  before_photos  text[]      NOT NULL DEFAULT '{}',
  after_photos   text[]      NOT NULL DEFAULT '{}',
  close_note     text,
  rating         integer,
  feedback       text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_jobs_updated_at ON jobs;
CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── job_chats table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_chats (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  from_role   text        NOT NULL CHECK (from_role IN ('employee','tech','system')),
  sender_id   text        NOT NULL,
  sender_name text        NOT NULL,
  text        text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_chats_job_id ON job_chats(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_requester ON jobs(requester_line_uid);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- ── RLS (permissive — auth handled by Next.js API with service_role key) ──────
ALTER TABLE jobs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_chats  ENABLE ROW LEVEL SECURITY;

-- Allow all via service_role (server-side API routes use SUPABASE_SECRET_KEY)
CREATE POLICY IF NOT EXISTS "service_all_jobs"      ON jobs      USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_all_job_chats" ON job_chats USING (true) WITH CHECK (true);

-- ── Technician stats view (derived from jobs) ─────────────────────────────────
CREATE OR REPLACE VIEW technician_stats AS
SELECT
  e.id,
  e.line_uid,
  e.display_name AS name,
  e.department   AS skill,
  COUNT(j.id) FILTER (WHERE j.status NOT IN ('done') AND e.id = ANY(j.assignees))   AS active_jobs,
  COUNT(j.id) FILTER (WHERE j.status = 'done'        AND e.id = ANY(j.assignees))   AS total_done,
  COALESCE(AVG(j.rating) FILTER (WHERE j.rating IS NOT NULL AND e.id = ANY(j.assignees)), 0) AS avg_rating
FROM employees e
LEFT JOIN jobs j ON e.id = ANY(j.assignees)
WHERE e.role = 'technician'
GROUP BY e.id, e.line_uid, e.display_name, e.department;
