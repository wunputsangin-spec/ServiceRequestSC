'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useLiff } from '@/lib/liff'
import { apiFetch } from '@/lib/api'
import { TechRequest } from '@/lib/types'
import { StatusPill } from '@/components/StatusPill'
import { WORK_TYPE_CONFIG } from '@/lib/mock-data'

const FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รอรับงาน' },
  { key: 'in_progress', label: 'กำลังทำ' },
  { key: 'done', label: 'เสร็จแล้ว' },
] as const

const URGENCY_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  normal:   { label: 'ปกติ',       color: '#15803D', bg: '#F0FBF4' },
  urgent:   { label: 'เร่งด่วน',   color: '#B45309', bg: '#FFFBEB' },
  critical: { label: 'เร่งด่วนมาก', color: '#B91C1C', bg: '#FEF2F2' },
}

export default function TechPage() {
  const { profile } = useLiff()
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'done'>('all')
  const [requests, setRequests] = useState<TechRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!profile) return
    setLoading(true)
    apiFetch(profile.lineUid, `/api/tech?filter=${filter}`)
      .then(async r => {
        if (r.status === 403) { setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้'); return }
        const d = await r.json()
        setRequests(d.requests ?? [])
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [profile, filter])

  useEffect(() => { load() }, [load])

  if (error) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
      <div style={{ fontSize: 40 }}>🔒</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{error}</div>
      <Link href="/home" style={{ fontSize: 14, color: '#1A56DB', fontWeight: 600 }}>กลับหน้าหลัก</Link>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header */}
      <div style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', background: '#fff', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: '#1A56DB', display: 'grid', placeItems: 'center', fontSize: 15 }}>🔧</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>งานช่าง</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{profile?.displayName}</div>
          </div>
        </div>
        <Link href="/home" style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textDecoration: 'none' }}>ออก</Link>
      </div>

      {/* Filter tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 18px', display: 'flex', gap: 20, flexShrink: 0 }}>
        {FILTERS.map(f => (
          <button key={f.key} type="button" onClick={() => setFilter(f.key)}
            style={{ background: 'none', border: 'none', padding: '11px 0', fontSize: 13.5, fontWeight: filter === f.key ? 700 : 500, color: filter === f.key ? '#1A56DB' : '#9CA3AF', borderBottom: filter === f.key ? '2.5px solid #1A56DB' : '2.5px solid transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>กำลังโหลด...</div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>ไม่มีงานในขณะนี้</div>
        ) : requests.map(r => {
          const cfg = WORK_TYPE_CONFIG[r.types[0]]
          const urg = URGENCY_BADGE[r.urgency]
          return (
            <Link key={r.ticketNo} href={`/tech/${r.ticketNo}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: '13px 14px', boxShadow: '0 1px 3px rgba(17,24,39,.05)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, display: 'grid', placeItems: 'center', fontSize: 17, flex: '0 0 36px' }}>{cfg.emoji}</span>
                    <div>
                      <div style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'var(--mono)', fontWeight: 600 }}>{r.ticketNo}</div>
                      <div style={{ fontSize: 13, color: '#374151', fontWeight: 700 }}>{r.building} · ชั้น {r.floor}</div>
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </div>

                {/* Room + description */}
                <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, paddingLeft: 44 }}>
                  {r.room} — <span style={{ color: '#374151' }}>{r.description.slice(0, 50)}{r.description.length > 50 ? '…' : ''}</span>
                </div>

                {/* Footer row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 44 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: urg.color, background: urg.bg, padding: '2px 8px', borderRadius: 999 }}>{urg.label}</span>
                    {r.technician && <span style={{ fontSize: 11, color: '#6B7280' }}>👤 {r.technician}</span>}
                  </div>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{r.createdAt.split('·')[0].trim()}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
