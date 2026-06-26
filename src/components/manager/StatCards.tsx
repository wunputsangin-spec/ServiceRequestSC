import { ClipboardList, Clock, Wrench, CheckCircle2 } from 'lucide-react'

interface Stats {
  total: number
  pending: number
  approved: number
  assigned: number
  inProgress: number
  done: number
}

export function StatCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'งานทั้งหมด', value: stats.total, Icon: ClipboardList, color: '#DDB056' },
    { label: 'รออนุมัติ', value: stats.pending, Icon: Clock, color: '#B9933B' },
    { label: 'กำลังดำเนินการ', value: stats.assigned + stats.inProgress, Icon: Wrench, color: '#E0902E' },
    { label: 'เสร็จสิ้น', value: stats.done, Icon: CheckCircle2, color: '#43B581' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {cards.map(c => (
        <div key={c.label} style={{
          background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              width: 38, height: 38, borderRadius: 11,
              background: `color-mix(in srgb, ${c.color} 16%, transparent)`,
              display: 'grid', placeItems: 'center', color: c.color,
            }}>
              <c.Icon size={19} />
            </span>
          </div>
          <div>
            <div className="num" style={{ fontSize: 30, fontWeight: 800, color: 'var(--txt)', lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: 12.5, color: 'var(--txt-3)', marginTop: 6 }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
