import { Bell, MessageCircle, CheckCircle2, Wrench, Star } from 'lucide-react'
import type { Notification } from '@/lib/types'

const ICON: Record<Notification['type'], { Icon: typeof Bell; color: string }> = {
  status_change: { Icon: Wrench, color: '#E0902E' },
  chat:          { Icon: MessageCircle, color: '#4F8DD6' },
  approved:      { Icon: CheckCircle2, color: '#43B581' },
  done_rate:     { Icon: Star, color: '#DDB056' },
}

interface NotiTabProps {
  notifications: Notification[]
  onOpenJob: (id: string) => void
  onMarkAllRead: () => void
}

export function NotiTab({ notifications, onOpenJob, onMarkAllRead }: NotiTabProps) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ padding: '18px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--txt)' }}>การแจ้งเตือน</div>
        {unread > 0 && (
          <button onClick={onMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            อ่านทั้งหมด
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: 13.5, padding: '50px 0' }}>
          <Bell size={32} style={{ opacity: .4, marginBottom: 10 }} />
          <div>ไม่มีการแจ้งเตือน</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {notifications.map(n => {
            const { Icon, color } = ICON[n.type]
            return (
              <button key={n.id} onClick={() => onOpenJob(n.jobId)} style={{
                width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', gap: 12, padding: 14, borderRadius: 15,
                background: n.read ? 'var(--card)' : 'color-mix(in srgb, var(--gold) 7%, var(--card))',
                border: `1px solid ${n.read ? 'var(--line)' : 'color-mix(in srgb, var(--gold) 28%, transparent)'}`,
              }}>
                <span style={{
                  width: 38, height: 38, flexShrink: 0, borderRadius: 11,
                  background: `color-mix(in srgb, ${color} 16%, transparent)`,
                  display: 'grid', placeItems: 'center', color,
                }}>
                  <Icon size={18} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--txt)', lineHeight: 1.45, fontWeight: n.read ? 500 : 600 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>{n.time}</div>
                </div>
                {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: 4 }} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
