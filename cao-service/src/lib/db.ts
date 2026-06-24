import { createClient } from '@/lib/supabase/server'
import { RepairRequest, Employee, TechRequest } from '@/lib/types'

// UID ชั่วคราว — Phase 4 จะแทนด้วย LINE userId จริง
export const DEV_LINE_UID = 'U_mock_dev_001'

// ─── Employee ────────────────────────────────────────────────────────────────

export async function getEmployee(lineUid: string): Promise<Employee | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('line_uid', lineUid)
    .single()
  if (!data) return null
  return {
    displayName: data.display_name,
    lineAvatar: data.line_avatar,
    employeeCode: data.employee_code,
    building: data.building,
    floor: data.floor,
    phone: data.phone,
    isRegistered: true,
  }
}

export async function upsertEmployee(lineUid: string, payload: {
  displayName: string
  lineAvatar?: string | null
  employeeCode: string
  building: string
  floor: string
  phone: string
}): Promise<Employee> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .upsert({
      line_uid: lineUid,
      display_name: payload.displayName,
      line_avatar: payload.lineAvatar ?? null,
      employee_code: payload.employeeCode,
      building: payload.building,
      floor: payload.floor,
      phone: payload.phone,
    }, { onConflict: 'line_uid' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return {
    displayName: data.display_name,
    lineAvatar: data.line_avatar,
    employeeCode: data.employee_code,
    building: data.building,
    floor: data.floor,
    phone: data.phone,
    isRegistered: true,
  }
}

// ─── Repair Requests ─────────────────────────────────────────────────────────

export async function getRepairRequests(lineUid: string): Promise<RepairRequest[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('repair_requests')
    .select('*')
    .eq('line_uid', lineUid)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToRequest)
}

export async function createRepairRequest(lineUid: string, employeeId: string, payload: {
  building: string
  floor: string
  room: string
  types: string[]
  urgency: string
  description: string
  preferredTime?: string | null
  scheduledSlot?: string | null
  photos?: string[]
}): Promise<RepairRequest> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('repair_requests')
    .insert({
      line_uid: lineUid,
      employee_id: employeeId,
      building: payload.building,
      floor: payload.floor,
      room: payload.room,
      types: payload.types,
      urgency: payload.urgency,
      description: payload.description,
      preferred_time: payload.preferredTime ?? null,
      scheduled_slot: payload.scheduledSlot ?? null,
      photos: payload.photos ?? [],
      timeline: [{ label: 'แจ้งคำร้อง', time: new Date().toISOString(), status: 'done' }],
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToRequest(data)
}

export async function rateRepairRequest(lineUid: string, ticketNo: string, rating: number): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('repair_requests')
    .update({ rating })
    .eq('ticket_no', ticketNo)
    .eq('line_uid', lineUid)
  if (error) throw new Error(error.message)
}

// ─── Technician ──────────────────────────────────────────────────────────────

export async function isTechnician(lineUid: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('employees')
    .select('is_technician')
    .eq('line_uid', lineUid)
    .single()
  return data?.is_technician === true
}

export async function getTechnicianList(): Promise<Employee[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('is_technician', true)
    .order('display_name')
  return (data ?? []).map(rowToEmployee)
}

export async function getAllRequests(filter?: 'pending' | 'in_progress' | 'done' | 'all'): Promise<TechRequest[]> {
  const supabase = await createClient()
  let q = supabase
    .from('repair_requests')
    .select('*, employees!repair_requests_employee_id_fkey(display_name, phone)')
    .order('created_at', { ascending: false })
  if (filter && filter !== 'all') q = q.eq('status', filter)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToTechRequest)
}

export async function acceptRequest(ticketNo: string, techLineUid: string): Promise<void> {
  const supabase = await createClient()
  const { data: tech } = await supabase.from('employees').select('id, display_name').eq('line_uid', techLineUid).single()
  if (!tech) throw new Error('ไม่พบข้อมูลช่าง')
  const now = new Date().toISOString()
  const { data: req } = await supabase.from('repair_requests').select('timeline').eq('ticket_no', ticketNo).single()
  const timeline = [...((req?.timeline as object[]) ?? []), { label: `มอบหมายช่าง · ${tech.display_name}`, time: now, status: 'done' }]
  const { error } = await supabase
    .from('repair_requests')
    .update({ status: 'in_progress', technician: tech.display_name, assigned_technician_id: tech.id, timeline })
    .eq('ticket_no', ticketNo)
  if (error) throw new Error(error.message)
}

export async function updateRequestStatus(
  ticketNo: string,
  status: 'in_progress' | 'done' | 'cancelled',
  extra?: { beforePhotos?: string[]; afterPhotos?: string[]; adminMessage?: string; techName?: string }
): Promise<void> {
  const supabase = await createClient()
  const { data: req } = await supabase.from('repair_requests').select('timeline, admin_messages').eq('ticket_no', ticketNo).single()
  const now = new Date().toISOString()

  const statusLabel: Record<string, string> = {
    in_progress: 'กำลังดำเนินการ',
    done: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก',
  }
  const timeline = [...((req?.timeline as object[]) ?? []), { label: statusLabel[status], time: now, status: status === 'done' ? 'done' : 'current' }]
  const adminMessages = extra?.adminMessage
    ? [...((req?.admin_messages as object[]) ?? []), { from: extra.techName ?? 'ช่าง', text: extra.adminMessage, time: now }]
    : req?.admin_messages

  const update: Record<string, unknown> = { status, timeline, admin_messages: adminMessages }
  if (extra?.beforePhotos) update.before_photos = extra.beforePhotos
  if (extra?.afterPhotos) update.after_photos = extra.afterPhotos

  const { error } = await supabase.from('repair_requests').update(update).eq('ticket_no', ticketNo)
  if (error) throw new Error(error.message)
}

export async function reassignRequest(ticketNo: string, newTechLineUid: string): Promise<void> {
  const supabase = await createClient()
  const { data: tech } = await supabase.from('employees').select('id, display_name').eq('line_uid', newTechLineUid).single()
  if (!tech) throw new Error('ไม่พบช่าง')
  const { data: req } = await supabase.from('repair_requests').select('timeline').eq('ticket_no', ticketNo).single()
  const timeline = [...((req?.timeline as object[]) ?? []), { label: `โอนงานให้ · ${tech.display_name}`, time: new Date().toISOString(), status: 'done' }]
  const { error } = await supabase
    .from('repair_requests')
    .update({ technician: tech.display_name, assigned_technician_id: tech.id, timeline })
    .eq('ticket_no', ticketNo)
  if (error) throw new Error(error.message)
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

function rowToEmployee(row: Record<string, unknown>): Employee {
  return {
    id: row.id as string,
    displayName: row.display_name as string,
    lineAvatar: row.line_avatar as string | null,
    employeeCode: row.employee_code as string,
    building: row.building as string,
    floor: row.floor as string,
    phone: row.phone as string,
    isRegistered: true,
    isTechnician: row.is_technician as boolean,
  }
}

function rowToTechRequest(row: Record<string, unknown>): TechRequest {
  const emp = row.employees as { display_name: string; phone: string } | null
  const base = rowToRequest(row)
  return {
    ...base,
    employeeName: emp?.display_name ?? '—',
    employeePhone: emp?.phone ?? '—',
    beforePhotos: (row.before_photos as string[]) ?? [],
    afterPhotos: (row.after_photos as string[]) ?? [],
    assignedTechnicianId: (row.assigned_technician_id as string | null) ?? null,
  }
}

function rowToRequest(row: Record<string, unknown>): RepairRequest {
  const d = new Date(row.created_at as string)
  const thDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
  const thTime = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

  return {
    ticketNo: row.ticket_no as string,
    building: row.building as string,
    floor: row.floor as string,
    room: row.room as string,
    types: row.types as RepairRequest['types'],
    urgency: row.urgency as RepairRequest['urgency'],
    description: row.description as string,
    status: row.status as RepairRequest['status'],
    createdAt: `${thDate} · ${thTime} น.`,
    technician: (row.technician as string | null) ?? null,
    timeline: (row.timeline as RepairRequest['timeline']) ?? [],
    adminMessages: (row.admin_messages as RepairRequest['adminMessages']) ?? [],
    rating: (row.rating as number | null) ?? null,
    photos: (row.photos as string[]) ?? [],
  }
}
