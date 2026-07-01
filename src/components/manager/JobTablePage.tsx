'use client'
import { useState } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import type { Job, JobStatus, JobType, Technician } from '@/lib/types'
import { StatusPill } from '@/components/ui/StatusPill'
import { Avatar } from '@/components/ui/Avatar'
import { catMeta } from '@/components/emp/catMeta'
import { STATUS_META } from '@/lib/constants'
import { ExportButton } from './ExportButton'

interface JobTablePageProps {
  jobs: Job[]
  techs: Technician[]
  onOpen: (job: Job) => void
}

const STATUS_FILTERS: { key: JobStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: STATUS_META.pending.label },
  { key: 'approved', label: STATUS_META.approved.label },
  { key: 'assigned', label: STATUS_META.assigned.label },
  { key: 'in_progress', label: STATUS_META.in_progress.label },
  { key: 'done', label: STATUS_META.done.label },
]

const TYPE_FILTERS: { key: JobType | 'all'; label: string }[] = [
  { key: 'all', label: 'ทุกประเภท' },
  { key: 'repair', label: 'แจ้งซ่อม' },
  { key: 'service', label: 'ขอบริการ' },
]

export function JobTablePage({ jobs, techs, onOpen }: JobTablePageProps) {
  const [status, setStatus] = useState<JobStatus | 'all'>('all')
  const [type, setType] = useState<JobType | 'all'>('all')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [q, setQ] = useState('')

  const rows = jobs.filter(j => {
    if (status !== 'all' && j.status !== status) return false
    if (type !== 'all' && j.type !== type) return false
    if (urgentOnly && j.urgency !== 'urgent') return false
    if (q && !(`${j.code} ${j.title} ${j.requesterName} ${j.location}`.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  const techName = (id: string) => techs.find(t => t.id === id)

  const exportRows = rows.map(j => ({
    'รหัส': j.code,
    'หัวข้อ': j.title,
    'ประเภท': j.type === 'repair' ? 'แจ้งซ่อม' : 'ขอบริการ',
    'หมวดหมู่': catMeta(j.category).label,
    'อาคาร': j.building,
    'ชั้น': j.floor,
    'จุด/ห้อง': j.location,
    'ความเร่งด่วน': j.urgency === 'urgent' ? 'ด่วน' : 'ปกติ',
    'สถานะ': STATUS_META[j.status].label,
    'ผู้แจ้ง': j.requesterName,
    'ช่างผู้รับผิดชอบ': j.assignees.map(id => techName(id)?.name).filter(Boolean).join(', '),
    'คะแนน': j.rating ?? '',
    'รายละเอียด': j.description,
    'วันที่แจ้ง': j.createdAt,
  }))

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>รายการแจ้งซ่อม</h1>
          <p style={{ fontSize: 13.5, color: 'var(--txt-3)', marginTop: 4 }}>คำขอทั้งหมดในระบบ · {rows.length} รายการ</p>
        </div>
        <ExportButton filename="รายการแจ้งซ่อม" sheetName="Jobs" rows={exportRows} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)' }} />
            <input
              value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหารหัส / หัวข้อ / ผู้แจ้ง…"
              style={{
                width: '100%', height: 40, padding: '0 14px 0 38px', borderRadius: 11,
                background: 'var(--surface-2)', border: '1px solid var(--line-2)',
                color: 'var(--txt)', fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {TYPE_FILTERS.map(f => {
              const active = type === f.key
              return (
                <button key={f.key} onClick={() => setType(f.key)} style={chip(active)}>{f.label}</button>
              )
            })}
          </div>
          <button onClick={() => setUrgentOnly(v => !v)} style={{
            ...chip(urgentOnly),
            color: urgentOnly ? '#161310' : 'var(--st-urgent)',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <AlertTriangle size={13} /> เฉพาะด่วน
          </button>
        </div>

        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => {
            const active = status === f.key
            return <button key={f.key} onClick={() => setStatus(f.key)} style={chip(active)}>{f.label}</button>
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['รหัส', 'หัวข้อ', 'สถานที่', 'ผู้แจ้ง', 'ช่าง', 'สถานะ'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt-3)' }}>ไม่พบรายการตามเงื่อนไข</td></tr>
            )}
            {rows.map(job => {
              const { label: catLabel, color } = catMeta(job.category)
              return (
                <tr key={job.id} onClick={() => onOpen(job)} style={{ borderTop: '1px solid var(--line)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="num" style={{ fontWeight: 700, color: 'var(--gold)' }}>{job.code}</span>
                    {job.urgency === 'urgent' && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, color: 'var(--st-urgent)' }}>● ด่วน</span>}
                  </td>
                  <td style={{ padding: '12px 14px', maxWidth: 240 }}>
                    <div style={{ fontWeight: 600, color: 'var(--txt)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                    <div style={{ fontSize: 11.5, color, marginTop: 1 }}>{catLabel}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--txt-2)', whiteSpace: 'nowrap' }}>ชั้น {job.floor} · {job.location}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--txt-2)', whiteSpace: 'nowrap' }}>{job.requesterName}</td>
                  <td style={{ padding: '12px 14px' }}>
                    {job.assignees.length === 0
                      ? <span style={{ color: 'var(--txt-3)' }}>—</span>
                      : <div style={{ display: 'flex' }}>
                          {job.assignees.map((id, i) => {
                            const t = techName(id)
                            return t ? <span key={id} style={{ marginLeft: i === 0 ? 0 : -8 }} title={t.name}><Avatar name={t.name} size={28} /></span> : null
                          })}
                        </div>}
                  </td>
                  <td style={{ padding: '12px 14px' }}><StatusPill status={job.status} size="sm" /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

function chip(active: boolean): React.CSSProperties {
  return {
    height: 34, padding: '0 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap',
    background: active ? 'linear-gradient(180deg,#E8C77A,#DDB056)' : 'var(--surface-2)',
    color: active ? '#161310' : 'var(--txt-2)',
    border: `1px solid ${active ? 'transparent' : 'var(--line-2)'}`,
  }
}
