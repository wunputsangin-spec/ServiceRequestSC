import { createClient } from '@/lib/supabase/server'
import { RepairRequest, Employee } from '@/lib/types'

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

// ─── Row mapper ───────────────────────────────────────────────────────────────

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
