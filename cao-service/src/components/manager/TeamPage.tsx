import { Star, Wrench, CheckCircle2 } from 'lucide-react'
import type { Technician } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'

export function TeamPage({ techs }: { techs: Technician[] }) {
  const avgTeam = techs.length ? techs.reduce((s, t) => s + t.avgRating, 0) / techs.length : 0
  const totalActive = techs.reduce((s, t) => s + t.activeJobs, 0)

  return (
    <>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>ทีมช่าง</h1>
        <p style={{ fontSize: 13.5, color: 'var(--txt-3)', marginTop: 4 }}>
          ช่าง {techs.length} คน · คะแนนเฉลี่ยทีม {avgTeam.toFixed(2)} · งานคงค้างรวม {totalActive}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {techs.map(t => (
          <div key={t.id} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <Avatar name={t.name} size={52} gold />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--txt)' }}>{t.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--txt-3)', marginTop: 2 }}>{t.skill}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999,
                color: t.busy ? 'var(--st-urgent)' : 'var(--st-done)',
                background: t.busy ? 'color-mix(in srgb,#E15B4C 13%,transparent)' : 'color-mix(in srgb,#43B581 13%,transparent)',
              }}>
                {t.busy ? 'งานเต็ม' : 'ว่าง'}
              </span>
            </div>

            {/* Workload bar */}
            <div style={{ marginTop: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--txt-3)', marginBottom: 5 }}>
                <span>ภาระงาน</span>
                <span className="num" style={{ fontWeight: 700, color: 'var(--txt-2)' }}>{t.load}%</span>
              </div>
              <div style={{ height: 7, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
                <div style={{
                  width: `${t.load}%`, height: '100%', borderRadius: 99,
                  background: t.load >= 80 ? '#E15B4C' : t.load >= 50 ? '#E0902E' : '#43B581',
                }} />
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', marginTop: 16, paddingTop: 15, borderTop: '1px solid var(--line)' }}>
              <Stat Icon={Star} color="#DDB056" value={t.avgRating.toFixed(1)} label="คะแนนเฉลี่ย" />
              <div style={{ width: 1, background: 'var(--line)' }} />
              <Stat Icon={Wrench} color="#E0902E" value={String(t.activeJobs)} label="งานคงค้าง" />
              <div style={{ width: 1, background: 'var(--line)' }} />
              <Stat Icon={CheckCircle2} color="#43B581" value={String(t.totalDone)} label="งานสำเร็จ" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Stat({ Icon, color, value, label }: { Icon: typeof Star; color: string; value: string; label: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Icon size={14} color={color} />
        <span className="num" style={{ fontSize: 17, fontWeight: 800, color: 'var(--txt)' }}>{value}</span>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--txt-3)', marginTop: 3 }}>{label}</div>
    </div>
  )
}
