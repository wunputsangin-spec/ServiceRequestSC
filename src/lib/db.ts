import { createClient } from '@/lib/supabase/server'
import type { Job, Employee, ChatMessage, Technician, RepairRequest, TechRequest } from '@/lib/types'

// ─── helpers ─────────────────────────────────────────────────────────────────

function thaiDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export async function getEmployee(lineUid: string): Promise<Employee | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('line_uid', lineUid)
    .single()
  if (!data) return null
  return rowToEmployee(data)
}

export async function upsertEmployee(lineUid: string, payload: {
  displayName: string
  lineAvatar?: string | null
  employeeCode: string
  department?: string
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
      department: payload.department ?? '',
      building: payload.building,
      floor: payload.floor,
      phone: payload.phone,
    }, { onConflict: 'line_uid' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToEmployee(data)
}

export async function getTechnicianList(): Promise<Technician[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('role', 'technician')
    .order('display_name')

  const { data: jobs } = await supabase
    .from('jobs')
    .select('assignees, status, rating')

  return (data ?? []).map(row => {
    const id = row.id as string
    const allJobRows = (jobs ?? []) as { assignees: string[]; status: string; rating: number | null }[]
    const activeJobs = allJobRows.filter(j => j.assignees.includes(id) && j.status !== 'done').length
    const doneJobs   = allJobRows.filter(j => j.assignees.includes(id) && j.status === 'done')
    const totalDone  = doneJobs.length
    const ratedDone  = doneJobs.filter(j => j.rating != null)
    const avgRating  = ratedDone.length
      ? ratedDone.reduce((s, j) => s + (j.rating ?? 0), 0) / ratedDone.length
      : 0
    const load = Math.min(100, Math.round((activeJobs / 3) * 100))
    const name = row.display_name as string
    return {
      id, name,
      initial: name.charAt(0),
      skill: (row.department as string) || 'ช่างซ่อมบำรุง',
      load, busy: activeJobs >= 3,
      avgRating: Math.round(avgRating * 10) / 10,
      totalDone, activeJobs,
    } satisfies Technician
  })
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function getJobs(opts?: {
  lineUid?: string
  techId?: string
  status?: string
}): Promise<Job[]> {
  const supabase = await createClient()
  let q = supabase.from('jobs').select('*').order('created_at', { ascending: false })
  if (opts?.lineUid) q = q.eq('requester_line_uid', opts.lineUid)
  if (opts?.status && opts.status !== 'all') q = q.eq('status', opts.status)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  let rows = (data ?? []).map(rowToJob)
  if (opts?.techId) rows = rows.filter(j => j.assignees.includes(opts.techId!))
  return rows
}

export async function getJob(id: string): Promise<Job | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('jobs').select('*').eq('id', id).single()
  if (!data) return null
  return rowToJob(data)
}

export async function createJob(lineUid: string, payload: {
  type: string
  category: string
  title: string
  building: string
  floor: string
  location: string
  urgency: string
  description: string
  slotDate: string
  slotTime: string
  requesterId: string
  requesterName: string
  photos?: string[]
}): Promise<Job> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      type: payload.type,
      category: payload.category,
      title: payload.title,
      building: payload.building,
      floor: payload.floor,
      location: payload.location,
      urgency: payload.urgency,
      description: payload.description,
      slot_date: payload.slotDate,
      slot_time: payload.slotTime,
      requester_id: payload.requesterId,
      requester_name: payload.requesterName,
      requester_line_uid: lineUid,
      photos: payload.photos ?? [],
      status: 'approved',  // ข้ามขั้นอนุมัติ — เข้าคิวช่างทันที
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToJob(data)
}

export async function updateJob(id: string, patch: Partial<{
  status: string
  assignees: string[]
  closeNote: string
  rating: number
  feedback: string
  beforePhotos: string[]
  afterPhotos: string[]
}>): Promise<Job> {
  const supabase = await createClient()
  const dbPatch: Record<string, unknown> = {}
  if (patch.status       !== undefined) dbPatch.status        = patch.status
  if (patch.assignees    !== undefined) dbPatch.assignees     = patch.assignees
  if (patch.closeNote    !== undefined) dbPatch.close_note    = patch.closeNote
  if (patch.rating       !== undefined) dbPatch.rating        = patch.rating
  if (patch.feedback     !== undefined) dbPatch.feedback      = patch.feedback
  if (patch.beforePhotos !== undefined) dbPatch.before_photos = patch.beforePhotos
  if (patch.afterPhotos  !== undefined) dbPatch.after_photos  = patch.afterPhotos
  const { data, error } = await supabase
    .from('jobs')
    .update(dbPatch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToJob(data)
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function getJobChats(jobId: string): Promise<ChatMessage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('job_chats')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at')
  if (error) throw new Error(error.message)
  return (data ?? []).map(row => ({
    id: row.id as string,
    from: row.from_role as ChatMessage['from'],
    senderId: row.sender_id as string,
    senderName: row.sender_name as string,
    text: row.text as string,
    time: new Date(row.created_at as string)
      .toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
  }))
}

export async function addJobChat(jobId: string, msg: {
  from: 'employee' | 'tech' | 'system'
  senderId: string
  senderName: string
  text: string
}): Promise<ChatMessage> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('job_chats')
    .insert({ job_id: jobId, from_role: msg.from, sender_id: msg.senderId, sender_name: msg.senderName, text: msg.text })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return {
    id: data.id as string,
    from: data.from_role as ChatMessage['from'],
    senderId: data.sender_id as string,
    senderName: data.sender_name as string,
    text: data.text as string,
    time: new Date(data.created_at as string)
      .toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
  }
}

// ─── Row mappers ──────────────────────────────────────────────────────────────

function rowToEmployee(row: Record<string, unknown>): Employee {
  return {
    id: row.id as string,
    lineUid: row.line_uid as string,
    displayName: row.display_name as string,
    lineAvatar: row.line_avatar as string | null,
    employeeCode: row.employee_code as string,
    department: (row.department as string) ?? '',
    building: row.building as string,
    floor: row.floor as string,
    phone: row.phone as string,
    isRegistered: true,
    role: (row.role ?? (row.is_technician ? 'technician' : 'employee')) as Employee['role'],
    suspended: (row.suspended as boolean) ?? false,
  }
}

function rowToJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    code: row.code as string,
    type: row.type as Job['type'],
    category: row.category as Job['category'],
    title: row.title as string,
    building: row.building as string,
    floor: row.floor as string,
    location: row.location as string,
    urgency: row.urgency as Job['urgency'],
    description: row.description as string,
    slotDate: row.slot_date as string,
    slotTime: row.slot_time as string,
    status: row.status as Job['status'],
    requesterId: row.requester_id as string,
    requesterName: row.requester_name as string,
    assignees: (row.assignees as string[]) ?? [],
    photos: (row.photos as string[]) ?? [],
    beforePhotos: (row.before_photos as string[]) ?? [],
    afterPhotos: (row.after_photos as string[]) ?? [],
    closeNote: (row.close_note as string | null) ?? null,
    rating: (row.rating as number | null) ?? null,
    feedback: (row.feedback as string | null) ?? null,
    createdAt: thaiDateTime(row.created_at as string),
    updatedAt: thaiDateTime(row.updated_at as string),
    chat: [],
  }
}

// ─── Legacy stubs (for old API routes) ───────────────────────────────────────

export async function getRepairRequests(lineUid: string): Promise<RepairRequest[]> {
  const jobs = await getJobs({ lineUid })
  return jobs.map(j => ({
    ticketNo: j.code,
    building: j.building,
    floor: j.floor,
    room: j.location,
    types: [],
    urgency: j.urgency === 'urgent' ? 'urgent' : 'normal',
    description: j.description,
    status: j.status === 'pending' ? 'pending' : j.status === 'done' ? 'done' : 'in_progress',
    createdAt: j.createdAt,
    technician: null,
    timeline: [],
    adminMessages: [],
    rating: j.rating,
    photos: j.photos,
  }))
}

export async function createRepairRequest(lineUid: string, employeeId: string, payload: {
  building: string; floor: string; room: string; description: string; urgency: string
}): Promise<RepairRequest> {
  const job = await createJob(lineUid, {
    type: 'repair', category: 'other',
    title: `ซ่อม ${payload.building} ชั้น ${payload.floor}`,
    building: payload.building, floor: payload.floor,
    location: payload.room, urgency: payload.urgency,
    description: payload.description, slotDate: '', slotTime: '',
    requesterId: employeeId, requesterName: '',
  })
  return {
    ticketNo: job.code, building: job.building, floor: job.floor, room: job.location,
    types: [], urgency: 'normal', description: job.description,
    status: 'pending', createdAt: job.createdAt, technician: null,
    timeline: [], adminMessages: [], rating: null, photos: [],
  }
}

export async function rateRepairRequest(lineUid: string, ticketNo: string, rating: number): Promise<void> {
  const supabase = await createClient()
  const { data } = await supabase.from('jobs').select('id').eq('code', ticketNo).single()
  if (!data) return
  await updateJob(data.id as string, { rating })
}

export async function isTechnician(lineUid: string): Promise<boolean> {
  const emp = await getEmployee(lineUid)
  return emp?.role === 'technician'
}

export async function getAllRequests(): Promise<TechRequest[]> {
  const jobs = await getJobs()
  return jobs.map(j => ({
    ticketNo: j.code, building: j.building, floor: j.floor, room: j.location,
    types: [], urgency: 'normal', description: j.description,
    status: j.status === 'pending' ? 'pending' : j.status === 'done' ? 'done' : 'in_progress',
    createdAt: j.createdAt, technician: null, timeline: [], adminMessages: [],
    rating: j.rating, photos: j.photos,
    employeeName: j.requesterName, employeePhone: '',
    beforePhotos: j.beforePhotos, afterPhotos: j.afterPhotos,
    assignedTechnicianId: j.assignees[0] ?? null,
  }))
}

export async function acceptRequest(): Promise<void> { /* stub */ }
export async function updateRequestStatus(): Promise<void> { /* stub */ }
export async function reassignRequest(): Promise<void> { /* stub */ }

// ─── Admin: User management ────────────────────────────────────────────────────

export async function listEmployees(): Promise<Employee[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('display_name')
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToEmployee)
}

export async function adminUpdateEmployee(id: string, patch: Partial<{
  displayName: string
  employeeCode: string
  department: string
  building: string
  floor: string
  phone: string
  role: string
  suspended: boolean
}>): Promise<Employee> {
  const supabase = await createClient()
  const dbPatch: Record<string, unknown> = {}
  if (patch.displayName  !== undefined) dbPatch.display_name  = patch.displayName
  if (patch.employeeCode !== undefined) dbPatch.employee_code = patch.employeeCode
  if (patch.department   !== undefined) dbPatch.department    = patch.department
  if (patch.building     !== undefined) dbPatch.building      = patch.building
  if (patch.floor        !== undefined) dbPatch.floor         = patch.floor
  if (patch.phone        !== undefined) dbPatch.phone         = patch.phone
  if (patch.role         !== undefined) {
    dbPatch.role = patch.role
    dbPatch.is_technician = patch.role === 'technician'
  }
  if (patch.suspended    !== undefined) dbPatch.suspended     = patch.suspended

  const { data, error } = await supabase
    .from('employees')
    .update(dbPatch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return rowToEmployee(data)
}

export async function adminDeleteEmployee(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Admin: App settings ───────────────────────────────────────────────────────

export type AppSettings = {
  buildings: string[]
  floors: string[]
  repair_categories: { key: string; label: string }[]
  service_categories: { key: string; label: string }[]
  line_notify: { enabled: boolean; groupId: string }
}

export async function getSettings(): Promise<AppSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('app_settings').select('key, value')
  if (error) throw new Error(error.message)
  const map = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  return {
    buildings:          (map.buildings as string[]) ?? [],
    floors:             (map.floors as string[]) ?? [],
    repair_categories:  (map.repair_categories as { key: string; label: string }[]) ?? [],
    service_categories: (map.service_categories as { key: string; label: string }[]) ?? [],
    line_notify:        (map.line_notify as { enabled: boolean; groupId: string }) ?? { enabled: true, groupId: '' },
  }
}

export async function updateSetting(key: string, value: unknown): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('app_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) throw new Error(error.message)
}
