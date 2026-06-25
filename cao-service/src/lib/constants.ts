import type { JobStatus, RepairCategory, ServiceCategory } from './types'

/* ─── Status metadata ───────────────────────────────────────────────── */
export const STATUS_META: Record<JobStatus, {
  label: string
  color: string
  bgAlpha: string   // color-mix alpha tint for backgrounds
  icon: string      // lucide icon name
}> = {
  pending:     { label: 'รออนุมัติ',       color: '#B9933B', bgAlpha: 'color-mix(in srgb,#B9933B 15%,transparent)', icon: 'Clock' },
  approved:    { label: 'อนุมัติแล้ว',     color: '#4F8DD6', bgAlpha: 'color-mix(in srgb,#4F8DD6 15%,transparent)', icon: 'CheckCircle' },
  assigned:    { label: 'มอบหมายงานแล้ว', color: '#46BFA6', bgAlpha: 'color-mix(in srgb,#46BFA6 15%,transparent)', icon: 'HardHat' },
  in_progress: { label: 'กำลังดำเนินการ', color: '#E0902E', bgAlpha: 'color-mix(in srgb,#E0902E 15%,transparent)', icon: 'Wrench' },
  done:        { label: 'เสร็จสิ้น',       color: '#43B581', bgAlpha: 'color-mix(in srgb,#43B581 15%,transparent)', icon: 'CheckCircle2' },
}

/* ─── Repair category metadata ──────────────────────────────────────── */
export const REPAIR_CAT_META: Record<RepairCategory, {
  label: string
  color: string
  icon: string
}> = {
  electric:  { label: 'ไฟฟ้า',       color: '#E0902E', icon: 'Zap' },
  plumbing:  { label: 'ประปา',       color: '#4F8DD6', icon: 'Droplets' },
  aircon:    { label: 'แอร์',         color: '#46BFA6', icon: 'Wind' },
  furniture: { label: 'เฟอร์นิเจอร์', color: '#C58BE0', icon: 'Sofa' },
  meeting:   { label: 'ห้องประชุม',  color: '#DDB056', icon: 'Presentation' },
  other:     { label: 'อื่นๆ',        color: '#8A8F99', icon: 'MoreHorizontal' },
}

/* ─── Service category metadata ─────────────────────────────────────── */
export const SERVICE_CAT_META: Record<ServiceCategory, {
  label: string
  color: string
  icon: string
}> = {
  equipment_loan: { label: 'ยืมอุปกรณ์',     color: '#4F8DD6', icon: 'Package' },
  moving:         { label: 'ย้ายของ',         color: '#E0902E', icon: 'Truck' },
  meeting_setup:  { label: 'เซ็ตห้องประชุม', color: '#46BFA6', icon: 'LayoutDashboard' },
  online_meeting: { label: 'ประชุมออนไลน์',  color: '#C58BE0', icon: 'Monitor' },
  other:          { label: 'อื่นๆ',            color: '#8A8F99', icon: 'MoreHorizontal' },
}

/* ─── Buildings & floors ────────────────────────────────────────────── */
export const BUILDINGS = [
  'อาคารสิงห์ คอมเพล็กซ์',
  'สำนักงานใหญ่ สามเสน',
] as const

export const FLOORS = ['14','15','19','28','34','36','37','38','39','40','41','อื่นๆ'] as const

/* ─── Appointment slot options ──────────────────────────────────────── */
export const SLOT_OPTIONS = [
  { value: 'morning',   label: 'ช่วงเช้า',  time: '09:00–12:00' },
  { value: 'afternoon', label: 'ช่วงบ่าย',  time: '13:00–16:00' },
  { value: 'evening',   label: 'ช่วงเย็น',  time: '16:00–18:00' },
  { value: 'custom',    label: 'ระบุเวลาเอง', time: '' },
] as const

/* ─── Timeline labels ────────────────────────────────────────────────── */
export const TIMELINE_LABELS: Record<JobStatus, string> = {
  pending:     'รออนุมัติ',
  approved:    'อนุมัติแล้ว',
  assigned:    'มอบหมายงาน',
  in_progress: 'กำลังดำเนินการ',
  done:        'เสร็จสิ้น',
}

export const STATUS_ORDER: JobStatus[] = [
  'pending', 'approved', 'assigned', 'in_progress', 'done',
]

/* ─── Rating labels ──────────────────────────────────────────────────── */
export const RATING_LABELS: Record<number, string> = {
  1: 'ควรปรับปรุง',
  2: 'พอใช้',
  3: 'ดี',
  4: 'ดีมาก',
  5: 'ยอดเยี่ยม',
}
