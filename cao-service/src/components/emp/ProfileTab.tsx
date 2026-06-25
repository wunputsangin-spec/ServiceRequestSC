import { Building2, Phone, BadgeCheck, Briefcase, LogOut, ChevronRight } from 'lucide-react'
import type { Employee } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'

export function ProfileTab({ employee, doneCount, onLogout }: { employee: Employee; doneCount: number; onLogout: () => void }) {
  const rows = [
    { Icon: BadgeCheck, label: 'รหัสพนักงาน', value: employee.employeeCode, mono: true },
    { Icon: Briefcase, label: 'แผนก', value: employee.department },
    { Icon: Building2, label: 'อาคาร / ชั้น', value: `${employee.building} · ชั้น ${employee.floor}` },
    { Icon: Phone, label: 'เบอร์ติดต่อ', value: employee.phone, mono: true },
  ]

  return (
    <div style={{ padding: '20px 16px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Header card */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 20,
        padding: '22px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        {employee.lineAvatar
          ? // eslint-disable-next-line @next/next/no-img-element
            <img src={employee.lineAvatar} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover' }} />
          : <Avatar name={employee.displayName} size={76} gold />}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--txt)' }}>{employee.displayName}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#06C755', marginTop: 5, fontWeight: 600 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#06C755', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 800 }}>L</span>
            เชื่อมต่อ LINE แล้ว
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, width: '100%', marginTop: 4, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold)' }}>{doneCount}</div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>งานเสร็จสิ้น</div>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            borderTop: i === 0 ? 'none' : '1px solid var(--line)',
          }}>
            <span style={{ color: 'var(--gold)', flexShrink: 0 }}><r.Icon size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, color: 'var(--txt-3)' }}>{r.label}</div>
              <div className={r.mono ? 'num' : ''} style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', marginTop: 1 }}>{r.value || '—'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px', cursor: 'pointer', fontFamily: 'inherit',
        background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, width: '100%',
        color: 'var(--st-urgent)',
      }}>
        <LogOut size={18} />
        <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 700 }}>ออกจากระบบ</span>
        <ChevronRight size={17} color="var(--txt-3)" />
      </button>

      <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--txt-3)' }}>CAO Service · บุญรอดบริวเวอรี่</div>
    </div>
  )
}
