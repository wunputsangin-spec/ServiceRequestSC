'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RepairRequest, ActiveFilter } from '@/lib/types'
import { JobCard } from '@/components/JobCard'

const FILTERS: { key: ActiveFilter; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รอดำเนินการ' },
  { key: 'done', label: 'เสร็จสิ้น' },
]

function EmptyState() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: '16px' }}>
      <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(150deg,#EFF4FE,#DCE7FB)', display: 'grid', placeItems: 'center', fontSize: '48px' }}>
        📋
      </div>
      <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827', textAlign: 'center', letterSpacing: '-0.01em' }}>
        ยังไม่มีรายการแจ้งซ่อม
      </div>
      <div style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', lineHeight: 1.6 }}>
        คุณยังไม่มีรายการแจ้งซ่อม<br />กดปุ่มด้านล่างเพื่อแจ้งซ่อมได้เลย
      </div>
      <Link href="/repair" style={{ textDecoration: 'none' }}>
        <button
          type="button"
          style={{
            height: '48px',
            padding: '0 24px',
            border: 'none',
            borderRadius: '14px',
            background: '#1A56DB',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 22px -10px rgba(26,86,219,.6)',
            cursor: 'pointer',
          }}
        >
          🔧 แจ้งซ่อมเลย
        </button>
      </Link>
    </div>
  )
}

export default function MyRequestsPage() {
  const [filter, setFilter] = useState<ActiveFilter>('all')
  const [requests, setRequests] = useState<RepairRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/requests')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRequests(data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = requests.filter(r => {
    if (filter === 'all') return true
    if (filter === 'pending') return r.status === 'pending' || r.status === 'in_progress'
    if (filter === 'done') return r.status === 'done' || r.status === 'cancelled'
    return true
  })

  const handleRate = async (ticketNo: string, rating: number) => {
    setRequests(prev => prev.map(r => r.ticketNo === ticketNo ? { ...r, rating } : r))
    await fetch('/api/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketNo, rating }),
    })
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 600 }}>กำลังโหลด...</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header + tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '12px 18px 0', flexShrink: 0 }}>
        <div style={{ fontSize: '19px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em', marginBottom: '12px' }}>
          งานแจ้งซ่อมของฉัน
        </div>
        <div style={{ display: 'flex', gap: '22px' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 10px',
                fontSize: '14px',
                fontWeight: filter === f.key ? 700 : 500,
                color: filter === f.key ? '#1A56DB' : '#9CA3AF',
                borderBottom: filter === f.key ? '2.5px solid #1A56DB' : '2.5px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(r => (
            <JobCard
              key={r.ticketNo}
              request={r}
              defaultExpanded={r.ticketNo === 'CAO-2024-0042'}
              onRate={handleRate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
