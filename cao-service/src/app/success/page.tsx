'use client'

import Link from 'next/link'
import { ClipboardList } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 22px 20px' }}>
      {/* Checkmark */}
      <div style={{ position: 'relative', marginTop: '18px' }}>
        <span
          className="animate-ping-slow"
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(22,163,74,.28)' }}
        />
        <div
          className="animate-pop-in"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(150deg,#22C55E,#16A34A)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 14px 30px -10px rgba(22,163,74,.6)',
            position: 'relative',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>

      <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginTop: '22px', letterSpacing: '-0.01em' }}>
        ส่งคำร้องสำเร็จ!
      </div>

      {/* Ticket chip */}
      <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#EFF4FE', border: '1px solid #D5E2FB', padding: '8px 16px', borderRadius: '999px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>เลขที่</span>
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#1A56DB', fontFamily: 'var(--mono)' }}>CAO-2024-0042</span>
      </div>

      {/* Summary card */}
      <div style={{ width: '100%', marginTop: '24px', background: '#F3F4F6', borderRadius: '16px', padding: '6px 16px' }}>
        {[
          { icon: '📍', label: 'อาคาร B · ชั้น 3 · ห้องประชุม 301' },
          { icon: '🔧', label: <>ประเภท: <strong>ไฟฟ้า</strong></> },
          { icon: '🕐', label: <>วันที่แจ้ง: <strong>19 มิ.ย. 2567 · 10:30 น.</strong></> },
        ].map((row, i, arr) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              padding: '13px 0',
              borderBottom: i < arr.length - 1 ? '1px solid #E5E7EB' : 'none',
            }}
          >
            <span style={{ fontSize: '18px' }}>{row.icon}</span>
            <span style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>{row.label}</span>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '9px', background: '#EFF4FE', border: '1px solid #D5E2FB', borderRadius: '13px', padding: '13px 14px' }}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 19px' }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </svg>
        <span style={{ fontSize: '13.5px', color: '#1542AB', fontWeight: 600 }}>ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง</span>
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', marginTop: 'auto', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link href="/my-requests" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              width: '100%',
              height: '52px',
              border: 'none',
              borderRadius: '14px',
              background: '#1A56DB',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 22px -10px rgba(26,86,219,.6)',
              cursor: 'pointer',
            }}
          >
            <ClipboardList size={18} strokeWidth={1.9} /> ติดตามสถานะ
          </button>
        </Link>
        <Link href="/home" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              width: '100%',
              height: '50px',
              border: '1.5px solid #E5E7EB',
              borderRadius: '14px',
              background: '#fff',
              color: '#374151',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            กลับหน้าหลัก
          </button>
        </Link>
      </div>
    </div>
  )
}
