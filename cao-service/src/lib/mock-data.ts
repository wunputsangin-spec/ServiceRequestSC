import { Employee, RepairRequest, WorkType } from './types'

export const mockEmployee: Employee = {
  displayName: 'สมชาย ใจดี',
  lineAvatar: null,
  employeeCode: 'EMP-0042',
  building: 'Singha Complex',
  floor: '15',
  phone: '081-234-5678',
  isRegistered: true,
}

export const mockRequests: RepairRequest[] = [
  {
    ticketNo: 'CAO-2024-0042',
    building: 'อาคาร B',
    floor: '3',
    room: 'ห้องประชุม 301',
    types: ['electric', 'ac'],
    urgency: 'urgent',
    description:
      'แอร์ในห้องประชุมไม่เย็น มีน้ำหยดจากตัวเครื่องบริเวณมุมห้อง และได้ยินเสียงดังผิดปกติเวลาเปิดใช้งาน รบกวนตรวจสอบด่วนครับ',
    status: 'in_progress',
    createdAt: '19 มิ.ย. 2567 · 10:30 น.',
    technician: 'สมชาย วงศ์ดี',
    timeline: [
      { label: 'แจ้งคำร้อง', time: '19 มิ.ย. · 10:30', status: 'done' },
      { label: 'มอบหมายช่าง · สมชาย วงศ์ดี', time: '19 มิ.ย. · 11:05', status: 'done' },
      { label: 'กำลังดำเนินการ', time: '19 มิ.ย. · 13:00', status: 'current' },
      { label: 'เสร็จสิ้น', time: null, status: 'pending' },
    ],
    adminMessages: [
      {
        from: 'เจ้าหน้าที่ CAO',
        text: 'ได้รับเรื่องแล้วครับ ช่างจะเข้าตรวจสอบช่วงบ่ายวันนี้ ขออภัยในความไม่สะดวก',
      },
    ],
    rating: null,
    photos: [],
  },
  {
    ticketNo: 'CAO-2024-0039',
    building: 'อาคาร A',
    floor: '1',
    room: 'ห้องน้ำชาย',
    types: ['plumbing'],
    urgency: 'normal',
    description: 'ก๊อกน้ำรั่ว น้ำหยดตลอดเวลา รบกวนให้ช่างมาตรวจสอบด้วยครับ',
    status: 'pending',
    createdAt: '18 มิ.ย. 2567 · 09:00 น.',
    technician: null,
    timeline: [
      { label: 'แจ้งคำร้อง', time: '18 มิ.ย. · 09:00', status: 'done' },
      { label: 'มอบหมายช่าง', time: null, status: 'pending' },
      { label: 'กำลังดำเนินการ', time: null, status: 'pending' },
      { label: 'เสร็จสิ้น', time: null, status: 'pending' },
    ],
    adminMessages: [],
    rating: null,
    photos: [],
  },
  {
    ticketNo: 'CAO-2024-0031',
    building: 'อาคาร C',
    floor: '5',
    room: 'สำนักงาน 501',
    types: ['electric'],
    urgency: 'urgent',
    description: 'ไฟดับในห้องสำนักงาน ทั้งแถวโต๊ะทำงาน ไม่สามารถทำงานได้',
    status: 'done',
    createdAt: '10 มิ.ย. 2567 · 14:00 น.',
    technician: 'วิชัย ช่างดี',
    timeline: [
      { label: 'แจ้งคำร้อง', time: '10 มิ.ย. · 14:00', status: 'done' },
      { label: 'มอบหมายช่าง · วิชัย ช่างดี', time: '10 มิ.ย. · 14:30', status: 'done' },
      { label: 'กำลังดำเนินการ', time: '10 มิ.ย. · 15:00', status: 'done' },
      { label: 'เสร็จสิ้น', time: '10 มิ.ย. · 16:30', status: 'done' },
    ],
    adminMessages: [],
    rating: null,
    photos: [],
  },
  {
    ticketNo: 'CAO-2024-0028',
    building: 'อาคาร B',
    floor: '2',
    room: 'ห้องพักผ่อน',
    types: ['ac'],
    urgency: 'normal',
    description: 'แอร์ไม่เย็น อุณหภูมิห้องสูงมาก',
    status: 'done',
    createdAt: '5 มิ.ย. 2567 · 10:00 น.',
    technician: 'ประยุทธ ซ่อมเก่ง',
    timeline: [
      { label: 'แจ้งคำร้อง', time: '5 มิ.ย. · 10:00', status: 'done' },
      { label: 'มอบหมายช่าง · ประยุทธ ซ่อมเก่ง', time: '5 มิ.ย. · 10:30', status: 'done' },
      { label: 'กำลังดำเนินการ', time: '5 มิ.ย. · 11:00', status: 'done' },
      { label: 'เสร็จสิ้น', time: '5 มิ.ย. · 12:30', status: 'done' },
    ],
    adminMessages: [],
    rating: 4,
    photos: [],
  },
]

export const WORK_TYPE_CONFIG: Record<WorkType, { label: string; emoji: string; color: string; bg: string }> = {
  electric: { label: 'ไฟฟ้า', emoji: '⚡', color: '#B45309', bg: '#FEF3E2' },
  plumbing: { label: 'ประปา', emoji: '🚿', color: '#1D4ED8', bg: '#E7F0FB' },
  ac: { label: 'แอร์', emoji: '❄️', color: '#0E7490', bg: '#E0F5F8' },
  structure: { label: 'โครงสร้าง', emoji: '🏗️', color: '#6B7280', bg: '#F3F4F6' },
  door: { label: 'ประตู/หน้าต่าง', emoji: '🚪', color: '#6B7280', bg: '#F3F4F6' },
  other: { label: 'อื่นๆ', emoji: '📦', color: '#6B7280', bg: '#F3F4F6' },
}

export const BUILDINGS = ['Singha Complex', 'สำนักงานใหญ่สามเสน', 'อื่นๆ']
export const FLOORS = Array.from({ length: 40 }, (_, i) => String(i + 1))
export const ALL_WORK_TYPES: WorkType[] = ['electric', 'plumbing', 'ac', 'structure', 'door', 'other']
