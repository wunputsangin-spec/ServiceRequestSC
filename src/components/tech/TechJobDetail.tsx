'use client'
import { useState } from 'react'
import { ArrowLeft, MapPin, Calendar, MessageCircle, Play, Forward, Star, User, AlertTriangle, Image } from 'lucide-react'
import type { Job, Technician } from '@/lib/types'
import { StatusPill } from '@/components/ui/StatusPill'
import { Btn } from '@/components/ui/Btn'
import { Avatar } from '@/components/ui/Avatar'
import { Timeline } from '@/components/emp/Timeline'
import { CatBadge, catMeta } from '@/components/emp/catMeta'
import { CloseJobSheet } from './CloseJobSheet'
import { ForwardSheet } from './ForwardSheet'
import { SLOT_OPTIONS } from '@/lib/constants'

interface TechJobDetailProps {
  job: Job
  tech: Technician
  allTechs: Technician[]
  onBack: () => void
  onStart: () => void
  onClose: (note: string, before: string[], after: string[]) => void
  onForward: (toTechId: string) => void
  onOpenChat: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--txt-2)', letterSpacing: '0.04em', marginBottom: 13 }}>{title}</div>
      {children}
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

function slotLabel(job: Job): string {
  const opt = SLOT_OPTIONS.find(o => o.value === job.slotTime)
  if (!opt) return job.slotTime
  return opt.time ? `${opt.label} · ${opt.time}` : opt.label
}

export function TechJobDetail({ job, tech, allTechs, onBack, onStart, onClose, onForward, onOpenChat }: TechJobDetailProps) {
  const [showClose, setShowClose] = useState(false)
  const [showForward, setShowForward] = useState(false)
  const { label: catLabel } = catMeta(job.category)

  const canStart = job.status === 'assigned'
  const canClose = job.status === 'in_progress'
  const hasPhotos = job.beforePhotos.length > 0 || job.afterPhotos.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        borderBottom: '1px solid var(--line)', background: 'var(--surface)',
      }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--txt-2)', width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)' }}>รายละเอียดงาน</span>
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {/* Title */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>{job.code}</span>
            <StatusPill status={job.status} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
            <CatBadge cat={job.category} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--txt)', lineHeight: 1.35 }}>{job.title}</div>
              <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 3 }}>{catLabel}</div>
            </div>
          </div>
          {job.urgency === 'urgent' && (
            <div style={{
              marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 700, color: 'var(--st-urgent)',
              background: 'color-mix(in srgb,#E15B4C 14%,transparent)',
              border: '1px solid color-mix(in srgb,#E15B4C 30%,transparent)',
              padding: '5px 11px', borderRadius: 999,
            }}>
              <AlertTriangle size={13} /> ด่วน
            </div>
          )}
        </div>

        {/* Info */}
        <Section title="ข้อมูลงาน">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <Row icon={<MapPin size={15} />} label="สถานที่" value={`${job.building} · ชั้น ${job.floor} · ${job.location}`} />
            <Row icon={<Calendar size={15} />} label="เวลานัดหมาย" value={`${job.slotDate} · ${slotLabel(job)}`} />
            <Row icon={<User size={15} />} label="ผู้แจ้ง" value={job.requesterName} />
          </div>
          <div style={{ marginTop: 13, paddingTop: 13, borderTop: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--txt-3)', marginBottom: 5 }}>รายละเอียด</div>
            <div style={{ fontSize: 13.5, color: 'var(--txt-2)', lineHeight: 1.55 }}>{job.description}</div>
          </div>
        </Section>

        {/* Timeline */}
        <Section title="สถานะงาน">
          <Timeline job={job} />
        </Section>

        {/* Photos (if closed) */}
        {hasPhotos && (
          <Section title="รูปประกอบการซ่อม">
            {job.beforePhotos.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 600, marginBottom: 8 }}>ก่อนดำเนินการ ({job.beforePhotos.length} รูป)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {job.beforePhotos.map((_, i) => (
                    <div key={i} style={{ width: 64, height: 64, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', color: 'var(--txt-3)' }}>
                      <Image size={22} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {job.afterPhotos.length > 0 && (
              <div>
                <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 600, marginBottom: 8 }}>หลังดำเนินการ ({job.afterPhotos.length} รูป)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {job.afterPhotos.map((_, i) => (
                    <div key={i} style={{ width: 64, height: 64, borderRadius: 10, background: 'color-mix(in srgb,#43B581 15%,transparent)', border: '1px solid color-mix(in srgb,#43B581 30%,transparent)', display: 'grid', placeItems: 'center', color: 'var(--st-done)' }}>
                      <Image size={22} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {job.closeNote && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                <div style={{ fontSize: 11.5, color: 'var(--txt-3)', fontWeight: 600, marginBottom: 4 }}>สรุปการดำเนินการ</div>
                <div style={{ fontSize: 13.5, color: 'var(--txt)', lineHeight: 1.55 }}>{job.closeNote}</div>
              </div>
            )}
          </Section>
        )}

        {/* Rating */}
        {job.status === 'done' && job.rating !== null && (
          <Section title="คะแนนจากผู้แจ้ง">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={22} color={n <= job.rating! ? '#DDB056' : 'var(--line-2)'} fill={n <= job.rating! ? '#DDB056' : 'transparent'} />
              ))}
              <span className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', marginLeft: 4 }}>{job.rating}.0</span>
            </div>
            {job.feedback && (
              <div style={{ fontSize: 13, color: 'var(--txt-2)', marginTop: 10, lineHeight: 1.5, fontStyle: 'italic' }}>"{job.feedback}"</div>
            )}
          </Section>
        )}
      </div>

      {/* Actions */}
      {(canStart || canClose) && (
        <div style={{
          flexShrink: 0, padding: '12px 16px 18px', borderTop: '1px solid var(--line)', background: 'var(--surface)',
          display: 'flex', gap: 10,
        }}>
          <Btn variant="dark" size="lg" onClick={() => setShowForward(true)} style={{ flex: 0, padding: '0 18px' }}>
            <Forward size={17} /> ส่งต่อ
          </Btn>
          <Btn variant="dark" size="md" onClick={onOpenChat} style={{ flex: 0, padding: '0 16px' }}>
            <MessageCircle size={17} />
          </Btn>
          {canStart && (
            <Btn variant="gold" size="lg" full onClick={onStart}>
              <Play size={16} fill="#161310" /> เริ่มงาน
            </Btn>
          )}
          {canClose && (
            <Btn variant="green" size="lg" full onClick={() => setShowClose(true)}>
              ✓ ปิดงาน
            </Btn>
          )}
        </div>
      )}
      {job.status === 'done' && (
        <div style={{ flexShrink: 0, padding: '12px 16px 18px', borderTop: '1px solid var(--line)', background: 'var(--surface)' }}>
          <Btn variant="dark" size="lg" full onClick={onOpenChat}>
            <MessageCircle size={17} /> แชท
          </Btn>
        </div>
      )}

      <CloseJobSheet
        open={showClose}
        jobTitle={job.title}
        onClose={() => setShowClose(false)}
        onSubmit={(note, before, after) => { setShowClose(false); onClose(note, before, after) }}
      />
      <ForwardSheet
        open={showForward}
        jobTitle={job.title}
        currentTechId={tech.id}
        techs={allTechs}
        onClose={() => setShowForward(false)}
        onForward={(tid) => { setShowForward(false); onForward(tid) }}
      />
    </div>
  )
}
