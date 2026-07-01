'use client'
import { Check, MapPin, UserPlus, Pencil, AlertTriangle } from 'lucide-react'
import type { Job, Technician } from '@/lib/types'
import { StatusPill } from '@/components/ui/StatusPill'
import { Avatar } from '@/components/ui/Avatar'
import { Btn } from '@/components/ui/Btn'
import { CatBadge } from '@/components/emp/catMeta'
import { StatCards } from './StatCards'
import { ExportButton } from './ExportButton'

interface Stats { total: number; pending: number; approved: number; assigned: number; inProgress: number; done: number }

interface OverviewPageProps {
  stats: Stats
  pending: Job[]
  toAssign: Job[]    // approved, no assignees
  active: Job[]      // assigned / in_progress
  techs: Technician[]
  onApprove: (id: string) => void
  onAssign: (job: Job) => void
  onEdit: (job: Job) => void
}

function Panel({ title, count, accent, children }: { title: string; count: number; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: accent }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)' }}>{title}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', background: 'var(--surface-2)', border: '1px solid var(--line-2)', padding: '1px 9px', borderRadius: 999 }}>{count}</span>
      </div>
      {children}
    </div>
  )
}

function MiniJob({ job }: { job: Job }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'center', minWidth: 0, flex: 1 }}>
      <CatBadge cat={job.category} size={40} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)' }}>{job.code}</span>
          {job.urgency === 'urgent' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 800, color: 'var(--st-urgent)' }}><AlertTriangle size={10} />ด่วน</span>}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--txt)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--txt-3)', marginTop: 2 }}>
          <MapPin size={11} /> {job.building.replace('อาคาร', '')} ชั้น {job.floor} · {job.requesterName}
        </div>
      </div>
    </div>
  )
}

export function OverviewPage({ stats, pending, toAssign, active, techs, onApprove, onAssign, onEdit }: OverviewPageProps) {
  const techName = (id: string) => techs.find(t => t.id === id)

  const exportRows = [
    { 'รายการ': 'งานทั้งหมด', 'จำนวน': stats.total },
    { 'รายการ': 'รออนุมัติ', 'จำนวน': stats.pending },
    { 'รายการ': 'อนุมัติแล้ว (รอมอบหมาย)', 'จำนวน': stats.approved },
    { 'รายการ': 'มอบหมายแล้ว', 'จำนวน': stats.assigned },
    { 'รายการ': 'กำลังดำเนินการ', 'จำนวน': stats.inProgress },
    { 'รายการ': 'เสร็จสิ้น', 'จำนวน': stats.done },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>ภาพรวม</h1>
          <p style={{ fontSize: 13.5, color: 'var(--txt-3)', marginTop: 4 }}>สรุปสถานะงานแจ้งซ่อมและบริการทั้งหมด</p>
        </div>
        <ExportButton filename="สรุปภาพรวม" sheetName="Summary" rows={exportRows} />
      </div>

      <StatCards stats={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
        {/* Approval queue */}
        <Panel title="คิวรออนุมัติ" count={pending.length} accent="var(--st-pending)">
          {pending.length === 0
            ? <Empty text="ไม่มีคำขอรออนุมัติ" />
            : pending.map(job => (
                <div key={job.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 12px', background: 'var(--surface-2)', borderRadius: 13, border: '1px solid var(--line)' }}>
                  <MiniJob job={job} />
                  <Btn variant="green" size="sm" onClick={() => onApprove(job.id)} style={{ flexShrink: 0 }}>
                    <Check size={15} /> อนุมัติ
                  </Btn>
                </div>
              ))}
        </Panel>

        {/* Assignment queue */}
        <Panel title="รอมอบหมายช่าง" count={toAssign.length} accent="var(--st-accepted)">
          {toAssign.length === 0
            ? <Empty text="ไม่มีงานรอมอบหมาย" />
            : toAssign.map(job => (
                <div key={job.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 12px', background: 'var(--surface-2)', borderRadius: 13, border: '1px solid var(--line)' }}>
                  <MiniJob job={job} />
                  <Btn variant="gold" size="sm" onClick={() => onAssign(job)} style={{ flexShrink: 0 }}>
                    <UserPlus size={15} /> มอบหมาย
                  </Btn>
                </div>
              ))}
        </Panel>
      </div>

      {/* Active jobs with assignees + edit */}
      <Panel title="งานที่มอบหมายแล้ว" count={active.length} accent="var(--st-assigned)">
        {active.length === 0
          ? <Empty text="ยังไม่มีงานที่กำลังดำเนินการ" />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {active.map(job => (
                <div key={job.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 12px', background: 'var(--surface-2)', borderRadius: 13, border: '1px solid var(--line)' }}>
                  <MiniJob job={job} />
                  <StatusPill status={job.status} size="sm" />
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                    {job.assignees.map((id, i) => {
                      const t = techName(id)
                      return t ? <span key={id} style={{ marginLeft: i === 0 ? 0 : -8 }} title={t.name}><Avatar name={t.name} size={30} /></span> : null
                    })}
                  </div>
                  <Btn variant="dark" size="sm" onClick={() => onEdit(job)} style={{ flexShrink: 0 }}>
                    <Pencil size={13} /> แก้ไขช่าง
                  </Btn>
                </div>
              ))}
            </div>
          )}
      </Panel>
    </>
  )
}

function Empty({ text }: { text: string }) {
  return <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: 'var(--txt-3)' }}>{text}</div>
}
