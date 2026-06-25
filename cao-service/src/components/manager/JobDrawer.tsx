'use client'
import { useEffect } from 'react'
import { X, MapPin, Calendar, User, AlertTriangle, Check, UserPlus, Pencil, Star } from 'lucide-react'
import type { Job, Technician } from '@/lib/types'
import { StatusPill } from '@/components/ui/StatusPill'
import { Avatar } from '@/components/ui/Avatar'
import { Btn } from '@/components/ui/Btn'
import { Timeline } from '@/components/emp/Timeline'
import { CatBadge, catMeta } from '@/components/emp/catMeta'
import { SLOT_OPTIONS } from '@/lib/constants'

interface JobDrawerProps {
  job: Job
  techs: Technician[]
  onClose: () => void
  onApprove: (id: string) => void
  onAssign: (job: Job) => void
  onEdit: (job: Job) => void
}

function slotLabel(job: Job): string {
  const opt = SLOT_OPTIONS.find(o => o.value === job.slotTime)
  if (!opt) return job.slotTime
  return opt.time ? `${opt.label} · ${opt.time}` : opt.label
}

export function JobDrawer({ job, techs, onClose, onApprove, onAssign, onEdit }: JobDrawerProps) {
  const assignees = job.assignees.map(id => techs.find(t => t.id === id)).filter(Boolean) as Technician[]
  const { label: catLabel } = catMeta(job.category)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(8,8,10,.6)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end' }} className="animate-fadein">
      <div onClick={e => e.stopPropagation()} style={{
        width: 440, maxWidth: '92vw', height: '100%', overflowY: 'auto',
        background: 'var(--surface)', borderLeft: '1px solid var(--line-2)',
        display: 'flex', flexDirection: 'column',
      }} className="scrollbar-hide">
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', padding: '18px 22px 14px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
          <div>
            <span className="num" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)' }}>{job.code}</span>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--txt)', marginTop: 3 }}>{job.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--txt-3)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CatBadge cat={job.category} size={46} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--txt-3)' }}>{catLabel}</div>
              <div style={{ marginTop: 5 }}><StatusPill status={job.status} /></div>
            </div>
            {job.urgency === 'urgent' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--st-urgent)', background: 'color-mix(in srgb,#E15B4C 14%,transparent)', border: '1px solid color-mix(in srgb,#E15B4C 30%,transparent)', padding: '5px 11px', borderRadius: 999 }}>
                <AlertTriangle size={13} /> ด่วน
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <Row icon={<MapPin size={15} />} label="สถานที่" value={`${job.building} · ชั้น ${job.floor} · ${job.location}`} />
            <Row icon={<Calendar size={15} />} label="วัน-เวลาสะดวก" value={`${job.slotDate} · ${slotLabel(job)}`} />
            <Row icon={<User size={15} />} label="ผู้แจ้ง" value={job.requesterName} />
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', marginBottom: 5 }}>รายละเอียด</div>
            <div style={{ fontSize: 13.5, color: 'var(--txt-2)', lineHeight: 1.55 }}>{job.description}</div>
          </div>

          {assignees.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', marginBottom: 9 }}>ช่างผู้รับผิดชอบ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {assignees.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={t.name} size={34} />
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--txt)' }}>{t.name}</span>
                    <span className="num" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>
                      <Star size={12} fill="#DDB056" color="#DDB056" />{t.avgRating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', marginBottom: 12 }}>ไทม์ไลน์</div>
            <Timeline job={job} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '14px 22px', display: 'flex', gap: 10 }}>
          {job.status === 'pending' && (
            <Btn variant="green" size="md" full onClick={() => onApprove(job.id)}><Check size={16} /> อนุมัติคำขอ</Btn>
          )}
          {job.status === 'approved' && job.assignees.length === 0 && (
            <Btn variant="gold" size="md" full onClick={() => onAssign(job)}><UserPlus size={16} /> มอบหมายช่าง</Btn>
          )}
          {['assigned', 'in_progress'].includes(job.status) && (
            <Btn variant="dark" size="md" full onClick={() => onEdit(job)}><Pencil size={15} /> แก้ไขช่าง</Btn>
          )}
          {job.status === 'done' && (
            <div style={{ flex: 1, textAlign: 'center', fontSize: 13, color: 'var(--st-done)', fontWeight: 700, padding: '10px 0' }}>✓ งานเสร็จสมบูรณ์</div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--txt-3)', marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11.5, color: 'var(--txt-3)', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13.5, color: 'var(--txt)', fontWeight: 600, marginTop: 1, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  )
}
