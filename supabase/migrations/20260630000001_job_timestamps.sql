-- เพิ่มเวลาเริ่มดำเนินการ + เวลาเสร็จ สำหรับรายงาน/วิเคราะห์
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS started_at timestamptz,
  ADD COLUMN IF NOT EXISTS done_at    timestamptz;

-- backfill: งานที่ done แล้วแต่ยังไม่มี done_at ใช้ updated_at
UPDATE jobs SET done_at = updated_at WHERE status = 'done' AND done_at IS NULL;
