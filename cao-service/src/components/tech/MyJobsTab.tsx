import { Wrench } from 'lucide-react'
import type { Job, Technician } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'
import { TechJobCard } from './TechJobCard'

interface MyJobsTabProps {
  tech: Technician
  jobs: Job[]
  onOpenJob: (id: string) => void
}

export function MyJobsTab({ tech, jobs, onOpenJob }: MyJobsTabProps) {
  const active = jobs.filter(j => j.status === 'in_progress')
  const assigned = jobs.filter(j => j.status === 'assigned')

  return (
    <div style={{ padding: '18px 16px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tech profile strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <Avatar name={tech.name} size={50} gold />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--txt)' }}>{tech.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--txt-3)', marginTop: 1 }}>{tech.skill}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="num" style={{ fontSize: 22, fontWeight: 800, color: tech.busy ? 'var(--st-urgent)' : 'var(--st-done)' }}>
            {tech.activeJobs}
          </div>
          <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>งานคงค้าง</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'กำลังทำ',  value: active.length,   color: 'var(--st-progress)' },
          { label: 'รอเริ่ม',   value: assigned.length, color: 'var(--gold)' },
          { label: 'ผลงาน',    value: tech.totalDone,  color: 'var(--st-done)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '12px 13px' }}>
            <div className="num" style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* In progress */}
      {active.length > 0 && (
        <JobGroup label="กำลังดำเนินการ" color="var(--st-progress)" jobs={active} onOpenJob={onOpenJob} />
      )}

      {/* Assigned (waiting to start) */}
      {assigned.length > 0 && (
        <JobGroup label="รอเริ่มงาน" color="var(--gold)" jobs={assigned} onOpenJob={onOpenJob} />
      )}

      {active.length === 0 && assigned.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 16, background: 'var(--card)', border: '1px dashed var(--line-2)' }}>
          <Wrench size={32} style={{ opacity: .3, marginBottom: 10 }} />
          <div style={{ fontSize: 13.5, color: 'var(--txt-3)' }}>ไม่มีงานที่กำลังดำเนินการ</div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 4 }}>ไปดูแท็บ "คิวงาน" เพื่อรับงานใหม่</div>
        </div>
      )}
    </div>
  )
}

function JobGroup({ label, color, jobs, onOpenJob }: { label: string; color: string; jobs: Job[]; onOpenJob: (id: string) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', background: 'var(--surface-2)', border: '1px solid var(--line-2)', padding: '1px 8px', borderRadius: 999 }}>{jobs.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {jobs.map(j => <TechJobCard key={j.id} job={j} onClick={() => onOpenJob(j.id)} />)}
      </div>
    </div>
  )
}
