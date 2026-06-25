/* Backward-compat exports — kept so existing pages compile during Phase 2–5 rewrites */
import type { Employee, RepairRequest, WorkType } from './types'

export const mockEmployee: Employee = {
  id: 'e1',
  lineUid: 'Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  displayName: 'สมชาย ใจดี',
  lineAvatar: null,
  employeeCode: '10482',
  department: 'ฝ่ายการตลาด',
  building: 'อาคารสิงห์ คอมเพล็กซ์',
  floor: '34',
  phone: '081-234-5678',
  isRegistered: true,
  role: 'employee',
}

export const mockRequests: RepairRequest[] = [
  {
    ticketNo: 'RP-2406-0042',
    building: 'อาคารสิงห์ คอมเพล็กซ์',
    floor: '34',
    room: 'ห้องประชุมใหญ่',
    types: ['ac'],
    urgency: 'urgent',
    description: 'แอร์ห้องประชุมใหญ่ชั้น 34 ไม่เย็น มีน้ำหยดจากตัวเครื่อง และมีเสียงดังผิดปกติ',
    status: 'in_progress',
    createdAt: '25 มิ.ย. 2569 · 09:12 น.',
    technician: 'วิชัย มั่นคง',
    timeline: [
      { label: 'รออนุมัติ',       time: '25 มิ.ย. · 09:12', status: 'done' },
      { label: 'อนุมัติแล้ว',     time: '25 มิ.ย. · 09:40', status: 'done' },
      { label: 'มอบหมายงาน',      time: '25 มิ.ย. · 10:05', status: 'done' },
      { label: 'กำลังดำเนินการ',  time: '25 มิ.ย. · 10:30', status: 'current' },
      { label: 'เสร็จสิ้น',        time: null,                status: 'pending' },
    ],
    adminMessages: [
      { from: 'เจ้าหน้าที่ CAO', text: 'ได้รับเรื่องแล้วครับ ช่างจะเข้าตรวจสอบช่วงบ่ายวันนี้' },
    ],
    rating: null,
    photos: [],
  },
  {
    ticketNo: 'RP-2406-0039',
    building: 'อาคารสิงห์ คอมเพล็กซ์',
    floor: '34',
    room: 'ห้องครัว',
    types: ['plumbing'],
    urgency: 'normal',
    description: 'ก๊อกน้ำห้องครัวรั่วซึมตลอดเวลา',
    status: 'pending',
    createdAt: '24 มิ.ย. 2569 · 09:00 น.',
    technician: null,
    timeline: [
      { label: 'รออนุมัติ',      time: '24 มิ.ย. · 09:00', status: 'done' },
      { label: 'อนุมัติแล้ว',    time: null, status: 'pending' },
      { label: 'มอบหมายงาน',     time: null, status: 'pending' },
      { label: 'กำลังดำเนินการ', time: null, status: 'pending' },
      { label: 'เสร็จสิ้น',       time: null, status: 'pending' },
    ],
    adminMessages: [],
    rating: null,
    photos: [],
  },
]

export const WORK_TYPE_CONFIG: Record<WorkType, { label: string; emoji: string; color: string; bg: string }> = {
  electric:  { label: 'ไฟฟ้า',          emoji: '⚡', color: '#E0902E', bg: 'color-mix(in srgb,#E0902E 14%,transparent)' },
  plumbing:  { label: 'ประปา',          emoji: '💧', color: '#4F8DD6', bg: 'color-mix(in srgb,#4F8DD6 14%,transparent)' },
  ac:        { label: 'แอร์',            emoji: '❄️', color: '#46BFA6', bg: 'color-mix(in srgb,#46BFA6 14%,transparent)' },
  structure: { label: 'โครงสร้าง',      emoji: '🏗️', color: '#C58BE0', bg: 'color-mix(in srgb,#C58BE0 14%,transparent)' },
  door:      { label: 'ประตู/หน้าต่าง', emoji: '🚪', color: '#8A8F99', bg: 'color-mix(in srgb,#8A8F99 14%,transparent)' },
  other:     { label: 'อื่นๆ',            emoji: '📦', color: '#8A8F99', bg: 'color-mix(in srgb,#8A8F99 14%,transparent)' },
}

export const BUILDINGS = ['อาคารสิงห์ คอมเพล็กซ์', 'สำนักงานใหญ่ สามเสน']
export const FLOORS = ['14','15','19','28','34','36','37','38','39','40','41','อื่นๆ']
export const ALL_WORK_TYPES: WorkType[] = ['electric', 'plumbing', 'ac', 'structure', 'door', 'other']
