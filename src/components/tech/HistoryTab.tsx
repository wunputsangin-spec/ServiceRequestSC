import { History, Star } from 'lucide-react'
import type { Job } from '@/lib/types'
import { CatBadge, catMeta } from '@/components/emp/catMeta'

interface HistoryTabProps {
  doneJobs: Job[]
  avgRating: number
  totalDone: number
  onOpenJob: (id: string) => void
}

export function HistoryTab({ doneJobs, avgRating, totalDone, onOpenJob }: HistoryTabProps) {
  return (
    <div style={{ padding: '18px 16px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Summary card */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20,
        padding: '18px 20px', display: 'flex', gap: 0,
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="num" style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold)' }}>{avgRating.toFixed(1)}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 3, margin: '5px 0' }}>
            {[1,2,3,4,5].map(n => (
              <Star key={n} size={14} color={n <= Math.round(avgRating) ? '#DDB056' : 'var(--line-2)'} fill={n <= Math.round(avgRating) ? '#DDB056' : 'transparent'} />
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--txt-3)' }}>คะแนนเฉลี่ย</div>
        </div>
        <div style={{ width: 1, background: 'var(--line)', margin: '0 8px' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="num" style={{ fontSize: 32, fontWeight: 800, color: 'var(--st-done)' }}>{totalDone}</div>
          <div style={{ fontSize: 11.5, color: 'var(--txt-3)', marginTop: 10 }}>งานเสร็จสิ้น</div>
        </div>
      </div>

      {/* History list */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--txt)', marginBottom: 12 }}>ประวัติงาน</div>
        {doneJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 16, background: 'var(--card)', border: '1px dashed var(--line-2)' }}>
            <History size={32} style={{ opacity: .3, marginBottom: 10 }} />
            <div style={{ fontSize: 13.5, color: 'var(--txt-3)' }}>ยังไม่มีประวัติงาน</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {doneJobs.map(j => <HistoryCard key={j.id} job={j} onClick={() => onOpenJob(j.id)} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const { label } = catMeta(job.category)
  const d = new Date(job.updatedAt)
  const dateStr = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
      background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14,
      padding: 14, display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <CatBadge cat={job.category} size={42} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)' }}>{job.code}</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--txt)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {job.title}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--txt-3)', marginTop: 2 }}>{label} · {dateStr}</div>
        {job.rating !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            {[1,2,3,4,5].map(n => (
              <Star key={n} size={13} color={n <= job.rating! ? '#DDB056' : 'var(--line-2)'} fill={n <= job.rating! ? '#DDB056' : 'transparent'} />
            ))}
            {job.feedback && (
              <span style={{ fontSize: 11, color: 'var(--txt-3)', marginLeft: 3 }}>มีคอมเมนต์</span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}
