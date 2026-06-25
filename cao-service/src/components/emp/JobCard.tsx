import { ChevronRight, MapPin } from 'lucide-react'
import type { Job } from '@/lib/types'
import { StatusPill } from '@/components/ui/StatusPill'
import { CatBadge } from './catMeta'

export function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
      background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16,
      padding: 14, display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <CatBadge cat={job.category} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)' }}>{job.code}</span>
          {job.urgency === 'urgent' && (
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--st-urgent)' }}>● ด่วน</span>
          )}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {job.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--txt-3)', marginTop: 3 }}>
          <MapPin size={12} /> ชั้น {job.floor} · {job.location}
        </div>
        <div style={{ marginTop: 8 }}><StatusPill status={job.status} size="sm" /></div>
      </div>
      <ChevronRight size={18} color="var(--txt-3)" style={{ flexShrink: 0 }} />
    </button>
  )
}
