import Link from 'next/link'
import { getRepairRequests, getEmployee, DEV_LINE_UID } from '@/lib/db'
import { StatusPill } from '@/components/StatusPill'
import { WORK_TYPE_CONFIG } from '@/lib/mock-data'

export default async function HomePage() {
  const [employee, requests] = await Promise.all([
    getEmployee(DEV_LINE_UID),
    getRepairRequests(DEV_LINE_UID),
  ])

  const displayName = employee?.displayName ?? 'คุณ'
  const employeeCode = employee?.employeeCode ?? '—'
  const recent = requests.slice(0, 2)
  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    done: requests.filter(r => r.status === 'done').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Top bar */}
      <div style={{ height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', background: '#fff', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ width: '30px', height: '30px', borderRadius: '9px', background: '#1A56DB', display: 'grid', placeItems: 'center', fontSize: '15px' }}>🔧</span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>CAO Service</span>
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(150deg,#DCE7FB,#AFC6F0)', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 2px #fff, 0 0 0 3px #E5E7EB' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B68C4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Welcome */}
        <div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
            สวัสดี, {displayName.split(' ')[0]} 👋
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '7px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: '#6B7280', background: '#fff', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '999px', fontFamily: 'var(--mono)' }}>
              {employeeCode}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: '#6B7280', background: '#fff', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '999px' }}>
              แผนก IT
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="scrollbar-hide" style={{ display: 'flex', gap: '10px', overflowX: 'auto', margin: '0 -18px', padding: '0 18px' }}>
          {[
            { label: 'รอดำเนินการ', count: stats.pending, dot: '#D97706' },
            { label: 'กำลังดำเนินการ', count: stats.in_progress, dot: '#1A56DB' },
            { label: 'เสร็จสิ้น', count: stats.done, dot: '#16A34A' },
          ].map(s => (
            <div key={s.label} style={{ flex: '0 0 auto', minWidth: '116px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '13px 14px', boxShadow: '0 1px 2px rgba(17,24,39,.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot }} />
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '6px', fontFamily: 'var(--mono)' }}>
                {s.count}
              </div>
            </div>
          ))}
        </div>

        {/* Action grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Link href="/repair" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#1A56DB', borderRadius: '18px', padding: '17px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 12px 26px -10px rgba(26,86,219,.55)', minHeight: '118px', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', fontSize: '23px' }}>🔧</span>
              <span>
                <span style={{ display: 'block', fontSize: '17px', fontWeight: 800, color: '#fff' }}>แจ้งซ่อม</span>
                <span style={{ display: 'block', fontSize: '12px', color: '#C7D9F7', marginTop: '2px' }}>แจ้งปัญหาใหม่</span>
              </span>
            </div>
          </Link>
          <Link href="/my-requests" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '17px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 1px 2px rgba(17,24,39,.04)', minHeight: '118px', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ width: '46px', height: '46px', borderRadius: '13px', background: '#EFF4FE', display: 'grid', placeItems: 'center', fontSize: '23px' }}>📋</span>
              <span>
                <span style={{ display: 'block', fontSize: '17px', fontWeight: 800, color: '#111827' }}>ติดตามงาน</span>
                <span style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>ดูสถานะคำร้อง</span>
              </span>
            </div>
          </Link>
          {[{ emoji: '❓', label: 'สอบถามข้อมูล', sub: 'FAQ / ช่วยเหลือ' }, { emoji: '📞', label: 'ติดต่อ CAO', sub: 'โทร / แชท' }].map(a => (
            <div key={a.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '17px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 1px 2px rgba(17,24,39,.04)', minHeight: '118px', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ width: '46px', height: '46px', borderRadius: '13px', background: '#EFF4FE', display: 'grid', placeItems: 'center', fontSize: '23px' }}>{a.emoji}</span>
              <span>
                <span style={{ display: 'block', fontSize: '17px', fontWeight: 800, color: '#111827' }}>{a.label}</span>
                <span style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{a.sub}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Recent jobs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '11px' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>งานล่าสุดของฉัน</span>
            <Link href="/my-requests" style={{ fontSize: '13px', fontWeight: 600, color: '#1A56DB', textDecoration: 'none' }}>ดูทั้งหมด</Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ fontSize: '14px', color: '#9CA3AF', textAlign: 'center', padding: '24px 0', fontWeight: 600 }}>
              ยังไม่มีรายการแจ้งซ่อม
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recent.map(r => {
                const firstType = r.types[0]
                const cfg = WORK_TYPE_CONFIG[firstType]
                return (
                  <Link key={r.ticketNo} href="/my-requests" style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '13px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 2px rgba(17,24,39,.04)' }}>
                      <span style={{ width: '40px', height: '40px', borderRadius: '11px', background: cfg.bg, display: 'grid', placeItems: 'center', fontSize: '19px', flex: '0 0 40px' }}>
                        {cfg.emoji}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'var(--mono)', fontWeight: 600 }}>{r.ticketNo}</div>
                        <div style={{ fontSize: '13.5px', color: '#374151', fontWeight: 600, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.building} · ชั้น {r.floor} · {r.room}
                        </div>
                      </div>
                      <StatusPill status={r.status} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
