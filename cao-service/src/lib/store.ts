'use client'
/* ─── In-memory mock store (resets on refresh) ──────────────────────── */
import type { Job, Technician, Employee, Notification, ChatMessage, JobStatus } from './types'

/* ─── Seed data ─────────────────────────────────────────────────────── */
const seedTechs: Technician[] = [
  { id: 't1', name: 'วิชัย มั่นคง',    initial: 'ว', skill: 'ระบบปรับอากาศ',  load: 75, busy: true,  avgRating: 4.8, totalDone: 142, activeJobs: 3 },
  { id: 't2', name: 'ประเสริฐ สุขใจ', initial: 'ป', skill: 'ระบบไฟฟ้า',       load: 40, busy: false, avgRating: 4.6, totalDone: 98,  activeJobs: 1 },
  { id: 't3', name: 'สมหมาย ดีงาม',   initial: 'ส', skill: 'ระบบประปา',       load: 30, busy: false, avgRating: 4.9, totalDone: 87,  activeJobs: 1 },
  { id: 't4', name: 'นิคม แสงทอง',    initial: 'น', skill: 'งานทั่วไป',        load: 20, busy: false, avgRating: 4.3, totalDone: 61,  activeJobs: 0 },
]

const seedEmployee: Employee = {
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

const seedManager: Employee = {
  id: 'm1',
  lineUid: 'Umanager',
  displayName: 'ปรีชา การุณ',
  lineAvatar: null,
  employeeCode: 'MGR-001',
  department: 'แผนกอาคาร',
  building: 'อาคารสิงห์ คอมเพล็กซ์',
  floor: '34',
  phone: '081-999-0000',
  isRegistered: true,
  role: 'manager',
}

const seedJobs: Job[] = [
  {
    id: 'j1', code: 'RP-2406-0042', type: 'repair', category: 'aircon',
    title: 'แอร์ห้องประชุมไม่เย็น มีน้ำหยด',
    building: 'อาคารสิงห์ คอมเพล็กซ์', floor: '34',
    location: 'ห้องประชุมใหญ่',
    urgency: 'urgent',
    description: 'แอร์ห้องประชุมใหญ่ชั้น 34 ไม่เย็น มีน้ำหยดจากตัวเครื่อง และมีเสียงดังผิดปกติ',
    slotDate: 'พรุ่งนี้ · 26 มิ.ย. 2569', slotTime: 'afternoon',
    status: 'in_progress',
    requesterId: 'e1', requesterName: 'สมชาย ใจดี',
    assignees: ['t1', 't2'],
    photos: [], beforePhotos: [], afterPhotos: [],
    closeNote: null, rating: null, feedback: null,
    createdAt: '2026-06-25T09:12:00', updatedAt: '2026-06-25T10:30:00',
    chat: [
      { id: 'c1', from: 'system', senderId: 'sys', senderName: 'ระบบ', text: 'งาน RP-2406-0042 ได้รับมอบหมายให้ ช่างวิชัย และ ช่างประเสริฐ แล้ว', time: '10:05 น.' },
      { id: 'c2', from: 'tech',   senderId: 't1',  senderName: 'วิชัย', text: 'รับทราบครับ จะเข้าดูช่วงบ่ายนี้เลย', time: '10:12 น.' },
      { id: 'c3', from: 'employee', senderId: 'e1', senderName: 'สมชาย', text: 'ขอบคุณมากครับ รอเลยนะครับ', time: '10:15 น.' },
    ],
  },
  {
    id: 'j2', code: 'RP-2406-0039', type: 'repair', category: 'plumbing',
    title: 'ก๊อกน้ำห้องครัวรั่ว',
    building: 'อาคารสิงห์ คอมเพล็กซ์', floor: '34',
    location: 'ห้องครัว',
    urgency: 'normal',
    description: 'ก๊อกน้ำห้องครัวชั้น 34 รั่วซึม น้ำหยดตลอดเวลา',
    slotDate: 'พรุ่งนี้ · 26 มิ.ย. 2569', slotTime: 'morning',
    status: 'pending',
    requesterId: 'e1', requesterName: 'สมชาย ใจดี',
    assignees: [], photos: [], beforePhotos: [], afterPhotos: [],
    closeNote: null, rating: null, feedback: null,
    createdAt: '2026-06-24T09:00:00', updatedAt: '2026-06-24T09:00:00',
    chat: [],
  },
  {
    id: 'j3', code: 'RP-2406-0051', type: 'repair', category: 'electric',
    title: 'ไฟห้องทำงานกระพริบ ดับเป็นช่วง',
    building: 'อาคารสิงห์ คอมเพล็กซ์', floor: '28',
    location: 'Zone A ฝั่งซ้าย',
    urgency: 'urgent',
    description: 'ไฟบริเวณ Zone A กระพริบและดับเป็นช่วงๆ ทำให้ทำงานไม่ได้',
    slotDate: 'วันนี้ · 25 มิ.ย. 2569', slotTime: 'morning',
    status: 'approved',
    requesterId: 'e1', requesterName: 'สมชาย ใจดี',
    assignees: [], photos: [], beforePhotos: [], afterPhotos: [],
    closeNote: null, rating: null, feedback: null,
    createdAt: '2026-06-25T07:30:00', updatedAt: '2026-06-25T08:00:00',
    chat: [],
  },
  {
    id: 'j4', code: 'RP-2406-0047', type: 'repair', category: 'plumbing',
    title: 'ก๊อกน้ำห้องครัวรั่วซึม',
    building: 'สำนักงานใหญ่ สามเสน', floor: '3',
    location: 'ห้องครัวชั้น 3',
    urgency: 'normal',
    description: 'ก๊อกน้ำห้องครัวรั่วซึมตลอดเวลา',
    slotDate: 'ศุกร์ · 27 มิ.ย. 2569', slotTime: 'afternoon',
    status: 'assigned',
    requesterId: 'e1', requesterName: 'สมชาย ใจดี',
    assignees: ['t1'],
    photos: [], beforePhotos: [], afterPhotos: [],
    closeNote: null, rating: null, feedback: null,
    createdAt: '2026-06-23T14:00:00', updatedAt: '2026-06-24T09:00:00',
    chat: [],
  },
  {
    id: 'j5', code: 'RP-2406-0031', type: 'repair', category: 'electric',
    title: 'ไฟดับในห้องสำนักงานชั้น 40',
    building: 'อาคารสิงห์ คอมเพล็กซ์', floor: '40',
    location: 'สำนักงาน 501',
    urgency: 'urgent',
    description: 'ไฟดับทั้งแถว ทำงานไม่ได้',
    slotDate: 'วันนี้ · 25 มิ.ย. 2569', slotTime: 'morning',
    status: 'done',
    requesterId: 'e1', requesterName: 'สมชาย ใจดี',
    assignees: ['t2'],
    photos: [], beforePhotos: ['before1.jpg'], afterPhotos: ['after1.jpg'],
    closeNote: 'เปลี่ยน circuit breaker ที่ไหม้แล้วทดสอบครบทุกจุด',
    rating: 5, feedback: 'ช่างมาไวมากครับ งานเรียบร้อย',
    createdAt: '2026-06-20T14:00:00', updatedAt: '2026-06-20T16:30:00',
    chat: [],
  },
  {
    id: 'j6', code: 'SV-2406-0001', type: 'service', category: 'meeting_setup',
    title: 'ขอเซ็ตห้องประชุมชั้น 34',
    building: 'อาคารสิงห์ คอมเพล็กซ์', floor: '34',
    location: 'ห้องประชุมใหญ่',
    urgency: 'normal',
    description: 'ขอให้เซ็ตห้องประชุมสำหรับ 20 คน พร้อมอุปกรณ์ AV',
    slotDate: 'จันทร์ · 30 มิ.ย. 2569', slotTime: 'morning',
    status: 'pending',
    requesterId: 'e1', requesterName: 'สมชาย ใจดี',
    assignees: [], photos: [], beforePhotos: [], afterPhotos: [],
    closeNote: null, rating: null, feedback: null,
    createdAt: '2026-06-25T11:00:00', updatedAt: '2026-06-25T11:00:00',
    chat: [],
  },
]

const seedNotifications: Notification[] = [
  { id: 'n1', type: 'status_change', jobId: 'j1', jobTitle: 'แอร์ห้องประชุมไม่เย็น', text: 'วิชัย เริ่มงาน "แอร์ห้องประชุมไม่เย็น" แล้ว', time: '2 นาทีที่แล้ว', read: false },
  { id: 'n2', type: 'chat',          jobId: 'j1', jobTitle: 'แอร์ห้องประชุมไม่เย็น', text: 'ประเสริฐ: จะเอากล้องไปติดตั้งให้พร้อมเทสต์ก่อนครับ', time: '18 นาทีที่แล้ว', read: false },
  { id: 'n3', type: 'approved',      jobId: 'j1', jobTitle: 'แอร์ห้องประชุมไม่เย็น', text: 'คำขอ "แอร์ห้องประชุมไม่เย็น" ได้รับการอนุมัติ', time: '1 ชั่วโมงที่แล้ว', read: true },
  { id: 'n4', type: 'done_rate',     jobId: 'j5', jobTitle: 'ไฟดับในห้องสำนักงาน',  text: '"ไฟดับในห้องสำนักงานชั้น 40" เสร็จเรียบร้อย — ให้คะแนนช่าง', time: 'เมื่อวานนี้', read: true },
]

/* ─── Store class ───────────────────────────────────────────────────── */
class MockStore {
  private jobs: Job[] = [...seedJobs]
  private techs: Technician[] = [...seedTechs]
  private employees: Employee[] = [seedEmployee, seedManager]
  private notifications: Notification[] = [...seedNotifications]
  private jobCounter = 60

  /* ── Jobs ── */
  getJobs() { return [...this.jobs] }
  getJob(id: string) { return this.jobs.find(j => j.id === id) ?? null }
  getJobsByEmployee(empId: string) { return this.jobs.filter(j => j.requesterId === empId) }
  getJobsByTech(techId: string) { return this.jobs.filter(j => j.assignees.includes(techId)) }
  getPendingJobs() { return this.jobs.filter(j => j.status === 'pending') }
  getApprovedJobs() { return this.jobs.filter(j => j.status === 'approved' && j.assignees.length === 0) }
  getActiveJobs() { return this.jobs.filter(j => ['assigned','in_progress'].includes(j.status)) }

  approveJob(id: string) { this.updateJob(id, { status: 'approved' }) }

  assignJob(id: string, techIds: string[]) {
    this.updateJob(id, { status: 'assigned', assignees: techIds })
    techIds.forEach(tid => {
      const t = this.techs.find(t => t.id === tid)
      if (t) { t.activeJobs++; t.busy = t.activeJobs >= 3 }
    })
  }

  startJob(id: string) { this.updateJob(id, { status: 'in_progress' }) }

  closeJob(id: string, closeNote: string, beforePhotos: string[], afterPhotos: string[]) {
    this.updateJob(id, { status: 'done', closeNote, beforePhotos, afterPhotos })
    const job = this.getJob(id)
    job?.assignees.forEach(tid => {
      const t = this.techs.find(t => t.id === tid)
      if (t) { t.activeJobs = Math.max(0, t.activeJobs - 1); t.totalDone++; t.busy = t.activeJobs >= 3 }
    })
  }

  claimJob(id: string, techId: string) {
    const job = this.getJob(id)
    if (!job) return
    const newAssignees = [...job.assignees, techId]
    this.updateJob(id, { status: 'assigned', assignees: newAssignees })
    const t = this.techs.find(t => t.id === techId)
    if (t) { t.activeJobs++; t.busy = t.activeJobs >= 3 }
  }

  forwardJob(id: string, fromTechId: string, toTechId: string) {
    const job = this.getJob(id)
    if (!job) return
    const newAssignees = job.assignees.filter(a => a !== fromTechId).concat(toTechId)
    this.updateJob(id, { assignees: newAssignees })
    const from = this.techs.find(t => t.id === fromTechId)
    const to   = this.techs.find(t => t.id === toTechId)
    if (from) { from.activeJobs = Math.max(0, from.activeJobs - 1); from.busy = from.activeJobs >= 3 }
    if (to)   { to.activeJobs++; to.busy = to.activeJobs >= 3 }
  }

  rateJob(id: string, rating: number, feedback: string) {
    this.updateJob(id, { rating, feedback })
    const job = this.getJob(id)
    job?.assignees.forEach(tid => {
      const t = this.techs.find(t => t.id === tid)
      if (t) {
        t.avgRating = Math.round(((t.avgRating * (t.totalDone - 1)) + rating) / t.totalDone * 10) / 10
      }
    })
  }

  submitJob(payload: Omit<Job, 'id' | 'code' | 'status' | 'assignees' | 'closeNote' | 'rating' | 'feedback' | 'beforePhotos' | 'afterPhotos' | 'chat' | 'createdAt' | 'updatedAt'>): Job {
    this.jobCounter++
    const prefix = payload.type === 'repair' ? 'RP' : 'SV'
    const code = `${prefix}-2406-${String(this.jobCounter).padStart(4, '0')}`
    const now = new Date().toISOString()
    const job: Job = {
      ...payload,
      id: `j${this.jobCounter}`,
      code,
      status: 'pending',
      assignees: [],
      closeNote: null,
      rating: null,
      feedback: null,
      beforePhotos: [],
      afterPhotos: [],
      chat: [],
      createdAt: now,
      updatedAt: now,
    }
    this.jobs.unshift(job)
    return job
  }

  sendChat(jobId: string, msg: Omit<ChatMessage, 'id'>): ChatMessage {
    const job = this.jobs.find(j => j.id === jobId)
    if (!job) throw new Error('Job not found')
    const message: ChatMessage = { ...msg, id: `chat-${Date.now()}` }
    job.chat.push(message)
    return message
  }

  private updateJob(id: string, patch: Partial<Job>) {
    const idx = this.jobs.findIndex(j => j.id === id)
    if (idx !== -1) this.jobs[idx] = { ...this.jobs[idx], ...patch, updatedAt: new Date().toISOString() }
  }

  /* ── Technicians ── */
  getTechs() { return [...this.techs] }
  getTech(id: string) { return this.techs.find(t => t.id === id) ?? null }

  /* ── Employees ── */
  getEmployee(id: string) { return this.employees.find(e => e.id === id) ?? null }
  getCurrentEmployee() { return seedEmployee }
  getCurrentTech() { return this.techs[0] }
  getCurrentManager() { return seedManager }

  /* ── Notifications ── */
  getNotifications(empId: string) { return this.notifications.filter(() => true) }
  markAllRead(empId: string) { this.notifications.forEach(n => { n.read = true }) }
  getUnreadCount() { return this.notifications.filter(n => !n.read).length }

  /* ── Stats ── */
  getStats() {
    return {
      total: this.jobs.length,
      pending: this.jobs.filter(j => j.status === 'pending').length,
      approved: this.jobs.filter(j => j.status === 'approved').length,
      assigned: this.jobs.filter(j => j.status === 'assigned').length,
      inProgress: this.jobs.filter(j => j.status === 'in_progress').length,
      done: this.jobs.filter(j => j.status === 'done').length,
    }
  }
}

/* Singleton — one instance per browser session */
let _store: MockStore | null = null
export function getStore(): MockStore {
  if (!_store) _store = new MockStore()
  return _store
}

/* ─── Legacy mock data compat ────────────────────────────────────────── */
export { seedEmployee as mockEmployee }
export const mockTechs = seedTechs
