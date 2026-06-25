import { Inbox } from 'lucide-react'
import type { Job } from '@/lib/types'
import { TechJobCard } from './TechJobCard'

interface QueueTabProps {
  jobs: Job[]   // approved & unassigned
  onOpenJob: (id: string) => void
  onClaim: (jobId: string) => void
}

export function QueueTab({ jobs, onOpenJob, onClaim }: QueueTabProps) {
  const urgent = jobs.filter(j => j.urgency === 'urgent')
  const normal = jobs.filter(j => j.urgency !== 'urgent')

  return (
    <div style={{ padding: '18px 16px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--txt)' }}>คิวงาน</div>
        <div style={{ fontSize: 12.5, color: 'var(--txt-3)', marginTop: 3 }}>งานที่อนุมัติแล้ว รอช่างรับ</div>
      </div>

      {jobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', borderRadius: 16, background: 'var(--card)', border: '1px dashed var(--line-2)' }}>
          <Inbox size={32} style={{ opacity: .3, marginBottom: 10 }} />
          <div style={{ fontSize: 13.5, color: 'var(--txt-3)' }}>ไม่มีงานในคิว</div>
        </div>
      )}

      {urgent.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--st-urgent)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)' }}>งานด่วน</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--st-urgent)', background: 'color-mix(in srgb,#E15B4C 12%,transparent)', padding: '1px 8px', borderRadius: 999 }}>{urgent.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {urgent.map(j => (
              <TechJobCard key={j.id} job={j} onClick={() => onOpenJob(j.id)} onClaim={() => onClaim(j.id)} />
            ))}
          </div>
        </div>
      )}

      {normal.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--txt-3)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)' }}>งานทั่วไป</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', background: 'var(--surface-2)', border: '1px solid var(--line-2)', padding: '1px 8px', borderRadius: 999 }}>{normal.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {normal.map(j => (
              <TechJobCard key={j.id} job={j} onClick={() => onOpenJob(j.id)} onClaim={() => onClaim(j.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
