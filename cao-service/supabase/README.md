# Supabase Migrations

## วิธี run migrations

1. เปิด [Supabase Dashboard](https://supabase.com/dashboard/project/nepzcomrwcfhmablwoeh)
2. ไปที่ **SQL Editor**
3. Run ตามลำดับ:
   - `20260624000001_create_employees.sql`
   - `20260624000002_create_repair_requests.sql`

## โครงสร้าง Tables

### `employees`
| Column | Type | หมายเหตุ |
|--------|------|---------|
| id | uuid PK | auto |
| line_uid | text UNIQUE | LINE userId |
| display_name | text | |
| line_avatar | text | URL รูป LINE |
| employee_code | text UNIQUE | EMP-XXXX |
| building | text | |
| floor | text | |
| phone | text | |

### `repair_requests`
| Column | Type | หมายเหตุ |
|--------|------|---------|
| id | uuid PK | auto |
| ticket_no | text UNIQUE | CAO-YYYY-NNNN (auto) |
| employee_id | uuid FK | → employees.id |
| line_uid | text | denorm สำหรับ RLS |
| building / floor / room | text | |
| types | work_type[] | enum array |
| urgency | urgency_level | normal/urgent/critical |
| description | text | |
| photos | text[] | Storage URLs |
| status | repair_status | pending → in_progress → done |
| technician | text | ใส่โดย admin |
| timeline | jsonb | array of steps |
| admin_messages | jsonb | array of messages |
| rating | smallint 1-5 | หลังงานเสร็จ |
