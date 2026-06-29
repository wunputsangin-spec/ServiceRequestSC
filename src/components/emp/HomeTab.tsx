import { Wrench, ClipboardList, Plus } from 'lucide-react'
import type { Job, Employee } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'
import { JobCard } from './JobCard'

interface HomeTabProps {
  employee: Employee
  jobs: Job[]
  onNew: () => void
  onOpenJob: (id: string) => void
  onSeeAll: () => void
}

export function HomeTab({ employee, jobs, onNew, onOpenJob, onSeeAll }: HomeTabProps) {
  const active = jobs.filter(j => j.status !== 'done').length
  const done = jobs.filter(j => j.status === 'done').length
  // ซ่อนงานที่เสร็จและประเมินช่างแล้วออกจากหน้าแรก (ยังอยู่ในแท็บงานของฉัน)
  const visible = jobs.filter(j => !(j.status === 'done' && j.rating != null))
  const recent = visible.slice(0, 3)

  return (
    <div style={{ padding: '18px 16px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {employee.lineAvatar
          ? // eslint-disable-next-line @next/next/no-img-element
            <img src={employee.lineAvatar} alt="" style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover' }} />
          : <Avatar name={employee.displayName} size={46} gold />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: 'var(--txt-3)' }}>สวัสดี 👋</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--txt)' }}>{employee.displayName}</div>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display: 'flex', gap: 11 }}>
        {[
          { label: 'กำลังดำเนินการ', value: active, color: 'var(--gold)' },
          { label: 'เสร็จสิ้นแล้ว', value: done, color: 'var(--st-done)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 16, padding: '14px 16px',
          }}>
            <div className="num" style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Primary actions */}
      <div style={{ display: 'flex', gap: 11 }}>
        <button onClick={onNew} style={{
          flex: 1, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          background: 'linear-gradient(150deg,#E8C77A,#C2933E)', border: 'none',
          borderRadius: 18, padding: 16, color: '#161310',
          boxShadow: '0 12px 28px -10px rgba(221,176,86,.5)',
          display: 'flex', flexDirection: 'column', gap: 22, minHeight: 116, justifyContent: 'space-between',
        }}>
          <Wrench size={26} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>แจ้งซ่อม</div>
            <div style={{ fontSize: 11.5, opacity: .75, marginTop: 2 }}>แจ้งปัญหาใหม่</div>
          </div>
        </button>
        <button onClick={onNew} style={{
          flex: 1, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 18, padding: 16, color: 'var(--txt)',
          display: 'flex', flexDirection: 'column', gap: 22, minHeight: 116, justifyContent: 'space-between',
        }}>
          <ClipboardList size={26} color="var(--gold)" />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>ขอบริการ</div>
            <div style={{ fontSize: 11.5, color: 'var(--txt-3)', marginTop: 2 }}>ยืมของ / เซ็ตห้อง</div>
          </div>
        </button>
      </div>

      {/* Recent */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)' }}>งานล่าสุดของฉัน</span>
          {visible.length > 3 && (
            <button onClick={onSeeAll} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              ดูทั้งหมด
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <EmptyState onNew={onNew} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(j => <JobCard key={j.id} job={j} onClick={() => onOpenJob(j.id)} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div style={{
      textAlign: 'center', padding: '30px 20px', borderRadius: 16,
      background: 'var(--card)', border: '1px dashed var(--line-2)',
    }}>
      <div style={{ fontSize: 13.5, color: 'var(--txt-3)' }}>ยังไม่มีรายการ</div>
      <button onClick={onNew} style={{
        marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', color: 'var(--gold)', fontSize: 13.5, fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <Plus size={15} /> สร้างคำขอแรก
      </button>
    </div>
  )
}
