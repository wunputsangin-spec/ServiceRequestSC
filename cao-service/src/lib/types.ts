export type RepairStatus = 'pending' | 'in_progress' | 'done' | 'cancelled'
export type UrgencyLevel = 'normal' | 'urgent' | 'critical'
export type PreferredTime = 'now' | 'scheduled'
export type WorkType = 'electric' | 'plumbing' | 'ac' | 'structure' | 'door' | 'other'
export type ActiveFilter = 'all' | 'pending' | 'done'

export interface Employee {
  id?: string
  displayName: string
  lineAvatar: string | null
  employeeCode: string
  building: string
  floor: string
  phone: string
  isRegistered: boolean
  isTechnician?: boolean
}


export interface TimelineStep {
  label: string
  time: string | null
  status: 'done' | 'current' | 'pending'
}

export interface AdminMessage {
  from: string
  text: string
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
  timeline: TimelineStep[]
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
