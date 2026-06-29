'use client'
import { useState, useEffect } from 'react'
import { Shield, Wrench, User, FlaskConical, ChevronDown, Loader2 } from 'lucide-react'
import { useLiff } from '@/lib/liff'
import { isDevUser } from '@/lib/dev'
import { apiFetch, apiGetEmployee } from '@/lib/api'

const ROLES = [
  { key: 'employee',   label: 'พนักงาน',  Icon: User,   path: '/emp' },
  { key: 'technician', label: 'ช่าง',      Icon: Wrench, path: '/technician' },
  { key: 'manager',    label: 'ผู้จัดการ', Icon: Shield, path: '/manager' },
] as const

export function RoleSwitcher() {
  const { ready, profile } = useLiff()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const allowed = ready && isDevUser(profile?.lineUid)

  useEffect(() => {
    if (!allowed || !profile) return
    apiGetEmployee(profile.lineUid).then(e => setCurrent(e?.role ?? null)).catch(() => {})
  }, [allowed, profile])

  if (!allowed || !profile) return null

  const switchRole = async (role: string, path: string) => {
    if (busy || role === current) {
      // already this role — just navigate
      if (role === current) window.location.href = path
      return
    }
    setBusy(true)
    try {
      const res = await apiFetch(profile.lineUid, '/api/dev/role', {
        method: 'POST', body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error(await res.text())
      setCurrent(role)
      window.location.href = path  // ไปหน้าใหม่ตาม role
    } catch {
      alert('สลับบทบาทไม่สำเร็จ')
      setBusy(false)
    }
  }

  return (
    <div style={{ position: 'fixed', right: 14, bottom: 14, zIndex: 9999, fontFamily: 'var(--font-anuphan), sans-serif' }}>
      {open && (
        <div style={{
          marginBottom: 8, background: 'rgba(22,24,28,.97)', border: '1px solid #DDB05655',
          borderRadius: 14, padding: 10, boxShadow: '0 12px 32px -10px rgba(0,0,0,.6)',
          display: 'flex', flexDirection: 'column', gap: 6, minWidth: 168,
          backdropFilter: 'blur(8px)',
        }} className="animate-popin">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#DDB056', padding: '2px 4px 4px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <FlaskConical size={12} /> โหมดทดสอบ — สลับบทบาท
          </div>
          {ROLES.map(r => {
            const active = r.key === current
            return (
              <button key={r.key} onClick={() => switchRole(r.key, r.path)} disabled={busy}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 10,
                  border: active ? '1px solid #DDB056' : '1px solid #ffffff14',
                  background: active ? 'linear-gradient(180deg,#E8C77A,#DDB056)' : '#ffffff0a',
                  color: active ? '#161310' : '#E6E1D6', fontSize: 13.5, fontWeight: 700,
                  cursor: busy ? 'wait' : 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}>
                <r.Icon size={15} />
                <span style={{ flex: 1 }}>{r.label}</span>
                {active && <span style={{ fontSize: 10, fontWeight: 800 }}>ปัจจุบัน</span>}
              </button>
            )
          })}
        </div>
      )}
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: 52, height: 52, borderRadius: '50%', marginLeft: 'auto',
          background: 'linear-gradient(160deg,#E8C77A,#C2933E)', border: 'none',
          boxShadow: '0 8px 22px -6px rgba(221,176,86,.6)', cursor: 'pointer',
          display: 'grid', placeItems: 'center', color: '#161310',
        }}>
        {busy ? <Loader2 size={22} className="animate-spin" /> : open ? <ChevronDown size={22} /> : <FlaskConical size={22} />}
      </button>
    </div>
  )
}
