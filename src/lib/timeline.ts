import type { Job, TimelineStep, JobStatus } from './types'
import { STATUS_ORDER, TIMELINE_LABELS } from './constants'

/* Build a 5-step timeline derived from a job's current status. */
export function buildTimeline(job: Job): TimelineStep[] {
  const currentIdx = STATUS_ORDER.indexOf(job.status)

  const subFor = (status: JobStatus): string => {
    switch (status) {
      case 'pending':
        return 'ส่งคำขอเข้าระบบแล้ว'
      case 'approved':
        return 'ผู้จัดการอนุมัติคำขอ'
      case 'assigned':
        return job.assignees.length
          ? `มอบหมายให้ช่าง ${job.assignees.length} คน`
          : 'รอจัดช่างเข้าดำเนินการ'
      case 'in_progress':
        return 'ช่างกำลังดำเนินการแก้ไข'
      case 'done':
        return job.closeNote ?? 'ดำเนินการเสร็จสมบูรณ์'
    }
  }

  return STATUS_ORDER.map((status, idx) => {
    let state: TimelineStep['state'] = 'pending'
    if (idx < currentIdx) state = 'done'
    else if (idx === currentIdx) state = job.status === 'done' ? 'done' : 'current'

    return {
      status,
      label: TIMELINE_LABELS[status],
      sub: subFor(status),
      state,
    }
  })
}
