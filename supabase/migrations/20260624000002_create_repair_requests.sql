-- repair_requests: ตาราง คำร้องแจ้งซ่อม
create type public.repair_status as enum ('pending', 'in_progress', 'done', 'cancelled');
create type public.urgency_level as enum ('normal', 'urgent', 'critical');
create type public.work_type    as enum ('electric', 'plumbing', 'ac', 'structure', 'door', 'other');

create table public.repair_requests (
  id            uuid primary key default gen_random_uuid(),
  ticket_no     text unique not null,                        -- CAO-YYYY-NNNN
  employee_id   uuid not null references public.employees(id) on delete cascade,
  line_uid      text not null,                               -- denormalized สำหรับ RLS

  -- Location
  building      text not null,
  floor         text not null,
  room          text not null,

  -- Request details
  types         work_type[] not null,
  urgency       urgency_level not null default 'normal',
  description   text not null,
  preferred_time text,                                       -- 'now' | 'scheduled'
  scheduled_slot text,                                       -- เช่น "พรุ่งนี้ 09:00-12:00"
  photos        text[] default '{}',                         -- array of Storage URLs

  -- Status & assignment
  status        repair_status not null default 'pending',
  technician    text,                                        -- ชื่อช่าง (ใส่โดย admin)

  -- Timeline (JSONB array)
  timeline      jsonb not null default '[]',

  -- Admin messages (JSONB array)
  admin_messages jsonb not null default '[]',

  -- Rating (1-5 ดาว หลังงานเสร็จ)
  rating        smallint check (rating between 1 and 5),

  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

-- Auto-update updated_at
create trigger repair_requests_updated_at
  before update on public.repair_requests
  for each row execute function public.set_updated_at();

-- Ticket number sequence: CAO-YYYY-NNNN
create sequence public.ticket_seq start 1;

create or replace function public.generate_ticket_no()
returns trigger language plpgsql as $$
begin
  new.ticket_no := 'CAO-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.ticket_seq')::text, 4, '0');
  return new;
end;
$$;

create trigger repair_requests_ticket_no
  before insert on public.repair_requests
  for each row execute function public.generate_ticket_no();

-- Indexes
create index repair_requests_line_uid_idx  on public.repair_requests(line_uid);
create index repair_requests_status_idx    on public.repair_requests(status);
create index repair_requests_created_at_idx on public.repair_requests(created_at desc);

-- RLS
alter table public.repair_requests enable row level security;

-- พนักงานดูได้เฉพาะคำร้องของตัวเอง
create policy "repair_requests: select own"
  on public.repair_requests for select
  using (line_uid = auth.jwt() ->> 'sub');

-- พนักงานสร้างคำร้องของตัวเองได้
create policy "repair_requests: insert own"
  on public.repair_requests for insert
  with check (line_uid = auth.jwt() ->> 'sub');

-- พนักงานอัปเดตได้เฉพาะ rating (หลังงานเสร็จ)
create policy "repair_requests: update rating"
  on public.repair_requests for update
  using (line_uid = auth.jwt() ->> 'sub')
  with check (line_uid = auth.jwt() ->> 'sub');
