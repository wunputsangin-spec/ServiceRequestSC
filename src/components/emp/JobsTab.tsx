'use client'
import { useState } from 'react'
import type { Job, JobStatus } from '@/lib/types'
import { JobCard } from './JobCard'

type Filter = 'all' | 'active' | 'done'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'active', label: 'กำลังดำเนินการ' },
  { key: 'done', label: 'เสร็จสิ้น' },
]

const ACTIVE_STATUSES: JobStatus[] = ['pending', 'approved', 'assigned', 'in_progress']

export function JobsTab({ jobs, onOpenJob }: { jobs: Job[]; onOpenJob: (id: string) => void }) {
  const [filter, setFilter] = useState<Filter>('all')

  const list = jobs.filter(j => {
    if (filter === 'active') return ACTIVE_STATUSES.includes(j.status)
    if (filter === 'done') return j.status === 'done'
    return true
  })

  return (
    <div style={{ padding: '18px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--txt)' }}>งานของฉัน</div>

      {/* Filter chips */}
      <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {FILTERS.map(f => {
          const active = filter === f.key
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              flexShrink: 0, height: 34, padding: '0 15px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12.5, fontWeight: 700,
              background: active ? 'linear-gradient(180deg,#E8C77A,#DDB056)' : 'var(--surface-2)',
              color: active ? '#161310' : 'var(--txt-2)',
              border: `1px solid ${active ? 'transparent' : 'var(--line-2)'}`,
            }}>
              {f.label}
            </button>
          )
        })}
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: 13.5, padding: '40px 0' }}>
          ไม่มีรายการในหมวดนี้
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(j => <JobCard key={j.id} job={j} onClick={() => onOpenJob(j.id)} />)}
        </div>
      )}
    </div>
  )
}
