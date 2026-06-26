'use client'
import { ArrowLeft, MapPin, Calendar, MessageCircle, Star, AlertTriangle } from 'lucide-react'
import type { Job, Technician } from '@/lib/types'
import { StatusPill } from '@/components/ui/StatusPill'
import { Avatar } from '@/components/ui/Avatar'
import { Btn } from '@/components/ui/Btn'
import { Timeline } from './Timeline'
import { CatBadge, catMeta } from './catMeta'
import { SLOT_OPTIONS } from '@/lib/constants'

interface JobDetailProps {
  job: Job
  techs: Technician[]
  onBack: () => void
  onOpenChat: () => void
  onRate: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 18, padding: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)', marginBottom: 13 }}>{title}</div>
      {children}
    </div>
  )
}

function slotLabel(job: Job): string {
  const opt = SLOT_OPTIONS.find(o => o.value === job.slotTime)
  if (!opt) return job.slotTime
  return opt.time ? `${opt.label} · ${opt.time}` : opt.label
}

export function JobDetail({ job, techs, onBack, onOpenChat, onRate }: JobDetailProps) {
  const assignees = job.assignees.map(id => techs.find(t => t.id === id)).filter(Boolean) as Technician[]
  const meta = catMeta(job.category)
  const canChat = job.assignees.length > 0
  const needsRating = job.status === 'done' && job.rating === null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        borderBottom: '1px solid var(--line)', background: 'var(--surface)',
      }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', color: 'var(--txt-2)',
          width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)' }}>รายละเอียดงาน</span>
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {/* Title card */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>{job.code}</span>
            <StatusPill status={job.status} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
            <CatBadge cat={job.category} size={46} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--txt)', lineHeight: 1.35 }}>{job.title}</div>
              <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 3 }}>{meta.label}</div>
            </div>
          </div>
          {job.urgency === 'urgent' && (
            <div style={{
              marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 700, color: 'var(--st-urgent)',
              background: 'color-mix(in srgb, #E15B4C 14%, transparent)',
              border: '1px solid color-mix(in srgb, #E15B4C 30%, transparent)',
              padding: '5px 11px', borderRadius: 999,
            }}>
              <AlertTriangle size={13} /> ด่วน
            </div>
          )}
        </div>

        {/* Meta */}
        <Section title="ข้อมูลคำขอ">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <Row icon={<MapPin size={15} />} label="สถานที่" value={`${job.building} · ชั้น ${job.floor} · ${job.location}`} />
            <Row icon={<Calendar size={15} />} label="วัน-เวลาสะดวก" value={`${job.slotDate} · ${slotLabel(job)}`} />
          </div>
          <div style={{ marginTop: 13, paddingTop: 13, borderTop: '1px solid var(--line)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', marginBottom: 5 }}>รายละเอียด</div>
            <div style={{ fontSize: 13.5, color: 'var(--txt-2)', lineHeight: 1.55 }}>{job.description}</div>
          </div>
        </Section>

        {/* Timeline */}
        <Section title="สถานะงาน">
          <Timeline job={job} />
        </Section>

        {/* Assignees */}
        {assignees.length > 0 && (
          <Section title="ช่างผู้รับผิดชอบ">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {assignees.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <Avatar name={t.name} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>{t.skill}</div>
                  </div>
                  <div className="num" style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12.5, fontWeight: 700, color: 'var(--gold)' }}>
                    <Star size={13} fill="#DDB056" color="#DDB056" /> {t.avgRating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Rating done */}
        {job.status === 'done' && job.rating !== null && (
          <Section title="คะแนนของคุณ">
            <div style={{ display: 'flex', gap: 5 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={22} color={n <= job.rating! ? '#DDB056' : 'var(--line-2)'} fill={n <= job.rating! ? '#DDB056' : 'transparent'} />
              ))}
            </div>
            {job.feedback && (
              <div style={{ fontSize: 13, color: 'var(--txt-2)', marginTop: 10, lineHeight: 1.5 }}>“{job.feedback}”</div>
            )}
          </Section>
        )}
      </div>

      {/* Sticky actions */}
      <div style={{
        flexShrink: 0, padding: '12px 16px 18px', borderTop: '1px solid var(--line)',
        background: 'var(--surface)', display: 'flex', gap: 10,
      }}>
        {needsRating ? (
          <Btn variant="gold" size="lg" full onClick={onRate}>
            <Star size={18} /> ให้คะแนนช่าง
          </Btn>
        ) : (
          <Btn variant={canChat ? 'gold' : 'dark'} size="lg" full disabled={!canChat} onClick={onOpenChat}>
            <MessageCircle size={18} /> {canChat ? 'แชทกับช่าง' : 'รอจัดช่าง'}
          </Btn>
        )}
      </div>
    </div>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--txt-3)', marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, color: 'var(--txt-3)', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13.5, color: 'var(--txt)', fontWeight: 600, marginTop: 1, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  )
}
