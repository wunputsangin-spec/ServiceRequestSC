import { ChevronRight, MapPin, Clock } from 'lucide-react'
import type { Job } from '@/lib/types'
import { StatusPill } from '@/components/ui/StatusPill'
import { CatBadge } from '@/components/emp/catMeta'

interface TechJobCardProps {
  job: Job
  onClick: () => void
  /** show claim button in queue mode */
  onClaim?: () => void
}

export function TechJobCard({ job, onClick, onClaim }: TechJobCardProps) {
  const d = new Date(job.updatedAt)
  const relTime = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden',
    }}>
      <button onClick={onClick} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        padding: 14, display: 'flex', gap: 12, alignItems: 'center', background: 'transparent', border: 'none',
      }}>
        <CatBadge cat={job.category} size={46} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className="num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)' }}>{job.code}</span>
            {job.urgency === 'urgent' && (
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--st-urgent)', background: 'color-mix(in srgb,#E15B4C 14%,transparent)', padding: '2px 7px', borderRadius: 999 }}>ด่วน</span>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: 'var(--txt-3)' }}>
              <MapPin size={12} /> {job.building.replace('อาคาร', '')} ชั้น {job.floor}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--txt-3)', flexShrink: 0 }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: 'var(--txt-3)' }}>
              <Clock size={11} /> {relTime}
            </span>
          </div>
          <div style={{ marginTop: 8 }}><StatusPill status={job.status} size="sm" /></div>
        </div>
        <ChevronRight size={18} color="var(--txt-3)" style={{ flexShrink: 0 }} />
      </button>

      {onClaim && (
        <div style={{ borderTop: '1px solid var(--line)', padding: '10px 14px' }}>
          <button onClick={e => { e.stopPropagation(); onClaim() }} style={{
            width: '100%', height: 38, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: 'linear-gradient(180deg,#E8C77A,#DDB056)', color: '#161310',
            fontSize: 13.5, fontWeight: 700,
            boxShadow: '0 4px 14px -6px rgba(221,176,86,.4)',
          }}>
            รับงาน
          </button>
        </div>
      )}
    </div>
  )
}
