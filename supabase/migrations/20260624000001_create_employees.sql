-- employees: พนักงานที่ลงทะเบียนผ่าน LINE LIFF
create table public.employees (
  id          uuid primary key default gen_random_uuid(),
  line_uid    text unique not null,          -- LINE userId จาก LIFF
  display_name text not null,
  line_avatar  text,                          -- URL รูปโปรไฟล์ LINE
  employee_code text unique not null,         -- รหัสพนักงาน เช่น EMP-0042
  building    text not null,
  floor       text not null,
  phone       text not null,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- อัปเดต updated_at อัตโนมัติ
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger employees_updated_at
  before update on public.employees
  for each row execute function public.set_updated_at();

-- RLS
alter table public.employees enable row level security;

-- พนักงานดูได้เฉพาะข้อมูลตัวเอง
create policy "employees: select own"
  on public.employees for select
  using (line_uid = auth.jwt() ->> 'sub');

-- พนักงานสร้าง record ของตัวเองได้ (ตอนลงทะเบียน)
create policy "employees: insert own"
  on public.employees for insert
  with check (line_uid = auth.jwt() ->> 'sub');

-- พนักงานแก้ไขข้อมูลตัวเองได้
create policy "employees: update own"
  on public.employees for update
  using (line_uid = auth.jwt() ->> 'sub');
