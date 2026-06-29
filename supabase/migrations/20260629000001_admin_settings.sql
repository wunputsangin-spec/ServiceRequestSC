-- Admin: app_settings table + employees.suspended column

-- ── employees: suspend flag ───────────────────────────────────────────────────
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS suspended boolean NOT NULL DEFAULT false;

-- ── app_settings (key/value JSON store) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS app_settings (
  key        text        PRIMARY KEY,
  value      jsonb       NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_all_settings" ON app_settings;
CREATE POLICY "service_all_settings" ON app_settings USING (true) WITH CHECK (true);

-- ── Seed defaults ─────────────────────────────────────────────────────────────
INSERT INTO app_settings (key, value) VALUES
  ('buildings', '["อาคารสิงห์ คอมเพล็กซ์","สำนักงานใหญ่ สามเสน"]'::jsonb),
  ('floors', '["14","15","19","28","34","36","37","38","39","40","41","อื่นๆ"]'::jsonb),
  ('repair_categories', '[
    {"key":"electric","label":"ไฟฟ้า"},
    {"key":"plumbing","label":"ประปา"},
    {"key":"aircon","label":"แอร์"},
    {"key":"furniture","label":"เฟอร์นิเจอร์"},
    {"key":"meeting","label":"ห้องประชุม"},
    {"key":"other","label":"อื่นๆ"}
  ]'::jsonb),
  ('service_categories', '[
    {"key":"equipment_loan","label":"ยืมอุปกรณ์"},
    {"key":"moving","label":"ย้ายของ"},
    {"key":"meeting_setup","label":"เซ็ตห้องประชุม"},
    {"key":"online_meeting","label":"ประชุมออนไลน์"},
    {"key":"other","label":"อื่นๆ"}
  ]'::jsonb),
  ('line_notify', '{"enabled":true,"groupId":""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
