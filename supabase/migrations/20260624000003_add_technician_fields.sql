-- เพิ่ม is_technician ใน employees
alter table public.employees
  add column if not exists is_technician boolean not null default false;

-- เพิ่ม assigned_technician_id (FK → employees) และรูปก่อน/หลัง
alter table public.repair_requests
  add column if not exists assigned_technician_id uuid references public.employees(id),
  add column if not exists before_photos text[] default '{}',
  add column if not exists after_photos  text[] default '{}';

-- Index สำหรับ query งานของช่าง
create index if not exists repair_requests_technician_id_idx
  on public.repair_requests(assigned_technician_id);

-- RLS policy: ช่างดูคำร้องทั้งหมดได้ (ต้องใช้ service role key อยู่แล้ว)
-- ไม่ต้องเพิ่ม policy เพราะ tech API ใช้ SUPABASE_SECRET_KEY bypass RLS
