'use client'
import { useMemo } from 'react'
import { ClipboardList, CheckCircle2, Clock, Star } from 'lucide-react'
import type { Job, JobStatus, Technician } from '@/lib/types'
import { STATUS_META } from '@/lib/constants'
import { catMeta } from '@/components/emp/catMeta'
import { ExportButton } from './ExportButton'

interface AnalyticsPageProps {
  jobs: Job[]
  techs: Technician[]
}

const STATUS_ORDER: JobStatus[] = ['pending', 'approved', 'assigned', 'in_progress', 'done']

function fmtDuration(mins: number): string {
  if (!isFinite(mins) || mins <= 0) return '—'
  if (mins < 60) return `${Math.round(mins)} นาที`
  const h = Math.floor(mins / 60), m = Math.round(mins % 60)
  return m ? `${h} ชม. ${m} น.` : `${h} ชม.`
}

export function AnalyticsPage({ jobs }: AnalyticsPageProps) {
  const metrics = useMemo(() => {
    const total = jobs.length
    const done = jobs.filter(j => j.status === 'done')
    const rated = done.filter(j => j.rating != null)
    const avgRating = rated.length ? rated.reduce((s, j) => s + (j.rating ?? 0), 0) / rated.length : 0

    // เวลาแก้ไขเฉลี่ย (เริ่ม → เสร็จ)
    const durations = done
      .filter(j => j.startedAtISO && j.doneAtISO)
      .map(j => (new Date(j.doneAtISO!).getTime() - new Date(j.startedAtISO!).getTime()) / 60000)
      .filter(m => m >= 0)
    const avgWork = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0

    // ตามสถานะ
    const byStatus = STATUS_ORDER.map(s => ({
      key: s, label: STATUS_META[s].label, color: STATUS_META[s].color,
      count: jobs.filter(j => j.status === s).length,
    }))

    // ตามหมวดหมู่ (top)
    const catMap = new Map<string, number>()
    jobs.forEach(j => catMap.set(j.category, (catMap.get(j.category) ?? 0) + 1))
    const byCategory = [...catMap.entries()]
      .map(([cat, count]) => ({ key: cat, label: catMeta(cat as Job['category']).label, color: catMeta(cat as Job['category']).color, count }))
      .sort((a, b) => b.count - a.count)

    // แนวโน้ม 14 วัน (ตามวันที่แจ้ง)
    const days: { label: string; count: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i)
      const next = new Date(d); next.setDate(d.getDate() + 1)
      const count = jobs.filter(j => {
        if (!j.createdAtISO) return false
        const t = new Date(j.createdAtISO).getTime()
        return t >= d.getTime() && t < next.getTime()
      }).length
      days.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, count })
    }

    return { total, doneCount: done.length, avgRating, avgWork, byStatus, byCategory, days }
  }, [jobs])

  const exportRows = metrics.byStatus.map(s => ({ 'สถานะ': s.label, 'จำนวนงาน': s.count }))

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>วิเคราะห์งาน</h1>
          <p style={{ fontSize: 13.5, color: 'var(--txt-3)', marginTop: 4 }}>ภาพรวมเชิงสถิติและแนวโน้มงานแจ้งซ่อม/บริการ</p>
        </div>
        <ExportButton filename="รายงานวิเคราะห์งาน" sheetName="Analytics" rows={exportRows} title="รายงานวิเคราะห์งาน" />
      </div>

      {/* KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <KPI icon={<ClipboardList size={18} />} color="#DDB056" label="งานทั้งหมด" value={String(metrics.total)} />
        <KPI icon={<CheckCircle2 size={18} />} color="#43B581" label="เสร็จสิ้น" value={String(metrics.doneCount)}
          sub={metrics.total ? `${Math.round(metrics.doneCount / metrics.total * 100)}%` : ''} />
        <KPI icon={<Clock size={18} />} color="#4F8DD6" label="เวลาแก้ไขเฉลี่ย" value={fmtDuration(metrics.avgWork)} />
        <KPI icon={<Star size={18} />} color="#E0902E" label="คะแนนเฉลี่ย" value={metrics.avgRating ? metrics.avgRating.toFixed(2) : '—'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, alignItems: 'start' }}>
        <Card title="งานตามสถานะ">
          <HBars data={metrics.byStatus} />
        </Card>
        <Card title="งานตามหมวดหมู่">
          <HBars data={metrics.byCategory} />
        </Card>
      </div>

      <Card title="แนวโน้มงานแจ้ง 14 วันล่าสุด">
        <TrendChart days={metrics.days} />
      </Card>
    </>
  )
}

function KPI({ icon, color, label, value, sub }: { icon: React.ReactNode; color: string; label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 16 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 12 }}>
        <span className="num" style={{ fontSize: 26, fontWeight: 800, color: 'var(--txt)', lineHeight: 1 }}>{value}</span>
        {sub && <span style={{ fontSize: 13, fontWeight: 700, color }}>{sub}</span>}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--txt-3)', marginTop: 6 }}>{label}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}

// แนวนอน: bar ปลายมน + label + ตัวเลขกำกับ (direct label)
function HBars({ data }: { data: { key: string; label: string; color: string; count: number }[] }) {
  const max = Math.max(1, ...data.map(d => d.count))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map(d => (
        <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 96, flexShrink: 0, fontSize: 12.5, color: 'var(--txt-2)', textAlign: 'right' }}>{d.label}</span>
          <div style={{ flex: 1, height: 22, background: 'var(--surface-2)', borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: `${(d.count / max) * 100}%`, minWidth: d.count ? 4 : 0, height: '100%', background: d.color, borderRadius: 6 }} />
          </div>
          <span className="num" style={{ width: 34, flexShrink: 0, fontSize: 13, fontWeight: 700, color: 'var(--txt)' }}>{d.count}</span>
        </div>
      ))}
    </div>
  )
}

// พื้นที่/เส้น แนวโน้มรายวัน
function TrendChart({ days }: { days: { label: string; count: number }[] }) {
  const W = 720, H = 180, padL = 28, padB = 28, padT = 12, padR = 8
  const max = Math.max(1, ...days.map(d => d.count))
  const innerW = W - padL - padR, innerH = H - padT - padB
  const x = (i: number) => padL + (days.length === 1 ? innerW / 2 : (i / (days.length - 1)) * innerW)
  const y = (v: number) => padT + innerH - (v / max) * innerH
  const line = days.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.count).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(days.length - 1).toFixed(1)} ${padT + innerH} L ${x(0).toFixed(1)} ${padT + innerH} Z`
  const ticks = [0, Math.ceil(max / 2), max]

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 480, display: 'block' }} role="img" aria-label="แนวโน้มงานแจ้งรายวัน">
        {/* gridlines + y ticks */}
        {ticks.map(t => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
            <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--txt-3)">{t}</text>
          </g>
        ))}
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DDB056" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#DDB056" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" stroke="#DDB056" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {days.map((d, i) => (
          <g key={i}>
            {d.count > 0 && <circle cx={x(i)} cy={y(d.count)} r={3} fill="#DDB056" stroke="var(--card)" strokeWidth={1.5} />}
            {i % 2 === 0 && <text x={x(i)} y={H - 8} textAnchor="middle" fontSize={9.5} fill="var(--txt-3)" className="num">{d.label}</text>}
          </g>
        ))}
      </svg>
    </div>
  )
}
