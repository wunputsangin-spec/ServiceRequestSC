/* ─── Core domain types ─────────────────────────────────────────────── */

export type JobStatus =
  | 'pending'     // รออนุมัติ
  | 'approved'    // อนุมัติแล้ว
  | 'assigned'    // มอบหมายช่างแล้ว
  | 'in_progress' // กำลังดำเนินการ
  | 'done'        // เสร็จสิ้น

export type JobType = 'repair' | 'service'

export type RepairCategory =
  | 'electric'   // ไฟฟ้า
  | 'plumbing'   // ประปา
  | 'aircon'     // แอร์
  | 'furniture'  // เฟอร์นิเจอร์
  | 'meeting'    // ห้องประชุม
  | 'other'

export type ServiceCategory =
  | 'equipment_loan'
  | 'moving'
  | 'meeting_setup'
  | 'online_meeting'
  | 'other'

export type JobCategory = RepairCategory | ServiceCategory

export type Urgency = 'normal' | 'urgent'

export type SlotTime = 'morning' | 'afternoon' | 'evening' | 'custom'

/* ─── Employee ──────────────────────────────────────────────────────── */
export interface Employee {
  id: string
  lineUid: string
  displayName: string
  lineAvatar: string | null
  employeeCode: string
  department: string
  building: string
  floor: string
  phone: string
  isRegistered: boolean
  role: 'employee' | 'technician' | 'manager'
  suspended?: boolean
}

/* ─── Technician ────────────────────────────────────────────────────── */
export interface Technician {
  id: string
  name: string
  initial: string
  skill: string
  load: number       // 0–100
  busy: boolean
  avgRating: number  // 0–5
  totalDone: number
  activeJobs: number
}

/* ─── Chat message ──────────────────────────────────────────────────── */
export interface ChatMessage {
  id: string
  from: 'employee' | 'tech' | 'system'
  senderId: string
  senderName: string
  text: string
  time: string
}

/* ─── Job ────────────────────────────────────────────────────────────── */
export interface Job {
  id: string
  code: string
  type: JobType
  category: JobCategory
  title: string
  building: string
  floor: string
  location: string
  urgency: Urgency
  description: string
  slotDate: string
  slotTime: SlotTime | string
  status: JobStatus
  requesterId: string
  requesterName: string
  requesterLineUid?: string
  assignees: string[]   // Technician.id[]
  photos: string[]
  beforePhotos: string[]
  afterPhotos: string[]
  closeNote: string | null
  rating: number | null
  feedback: string | null
  createdAt: string
  updatedAt: string
  startedAt?: string | null   // เวลาช่างเริ่มดำเนินการ (แสดงผล)
  doneAt?: string | null      // เวลาเสร็จ (แสดงผล)
  createdAtISO?: string       // ISO ดิบ สำหรับวิเคราะห์
  startedAtISO?: string | null
  doneAtISO?: string | null
  chat: ChatMessage[]
}

/* ─── Notification ───────────────────────────────────────────────────── */
export interface Notification {
  id: string
  type: 'status_change' | 'chat' | 'approved' | 'done_rate'
  jobId: string
  jobTitle: string
  text: string
  time: string
  read: boolean
}

/* ─── Timeline step (derived) ────────────────────────────────────────── */
export interface TimelineStep {
  status: JobStatus
  label: string
  sub: string
  state: 'done' | 'current' | 'pending'
}

/* ─────────────────────────────────────────────────────────────────────
   Legacy types — for backward compat with existing pages
   (removed when pages are rebuilt in Phase 2–5)
──────────────────────────────────────────────────────────────────────── */
export type RepairStatus = 'pending' | 'in_progress' | 'done' | 'cancelled'
export type UrgencyLevel = 'normal' | 'urgent' | 'critical'
export type PreferredTime = 'now' | 'scheduled'
export type WorkType = 'electric' | 'plumbing' | 'ac' | 'structure' | 'door' | 'other'
export type ActiveFilter = 'all' | 'pending' | 'done'

export interface AdminMessage {
  from: string
  text: string
}

export interface LegacyTimelineStep {
  label: string
  time: string | null
  status: 'done' | 'current' | 'pending'
}

export interface RepairRequest {
  ticketNo: string
  building: string
  floor: string
  room: string
  types: WorkType[]
  urgency: UrgencyLevel
  description: string
  status: RepairStatus
  createdAt: string
  technician: string | null
  timeline: LegacyTimelineStep[]
  adminMessages: AdminMessage[]
  rating: number | null
  photos: string[]
}

export interface TechRequest extends RepairRequest {
  employeeName: string
  employeePhone: string
  beforePhotos: string[]
  afterPhotos: string[]
  assignedTechnicianId: string | null
}

export interface RepairDraft {
  building: string
  floor: string
  room: string
  types: WorkType[]
  description: string
  urgency: UrgencyLevel
  preferredTime: PreferredTime
  scheduledSlot: string | null
  photos: string[]
  step: 1 | 2
}
