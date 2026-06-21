'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { BUILDINGS } from '@/lib/mock-data'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '48px',
  padding: '0 14px',
  borderRadius: '12px',
  background: '#fff',
  border: '1px solid #E5E7EB',
  fontSize: '15px',
  color: '#111827',
  fontFamily: 'inherit',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: 'สมชาย ใจดี',
    employeeCode: '',
    building: 'Singha Complex',
    floor: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/home')
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '26px 20px 20px' }}>
      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px' }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(150deg,#DCE7FB,#AFC6F0)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 10px 22px -8px rgba(26,86,219,.4)',
              overflow: 'hidden',
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#3B68C4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          </div>
          <span
            style={{
              position: 'absolute',
              right: '-3px',
              bottom: '0',
              width: '24px',
              height: '24px',
              borderRadius: '8px',
              background: '#06C755',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '12px',
              fontWeight: 800,
              border: '3px solid #F8FAFF',
            }}
          >
            L
          </span>
        </div>
        <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>
          เชื่อมต่อจาก LINE · Somchai J.
        </div>
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginTop: '18px' }}>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>
          ลงทะเบียนพนักงาน
        </div>
        <div style={{ fontSize: '13.5px', color: '#6B7280', marginTop: '5px' }}>
          กรุณากรอกข้อมูลเพื่อเริ่มใช้งาน
        </div>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: '20px',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 1px 3px rgba(17,24,39,.05), 0 12px 28px -20px rgba(17,24,39,.2)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <label style={{ display: 'block' }}>
          <FieldLabel>ชื่อ-นามสกุล</FieldLabel>
          <input
            style={inputStyle}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="ชื่อ-นามสกุล"
          />
        </label>

        <label style={{ display: 'block' }}>
          <FieldLabel>รหัสพนักงาน</FieldLabel>
          <input
            style={inputStyle}
            value={form.employeeCode}
            onChange={e => setForm(f => ({ ...f, employeeCode: e.target.value }))}
            placeholder="เช่น 12154"
          />
        </label>

        <label style={{ display: 'block' }}>
          <FieldLabel>อาคารที่ประจำ</FieldLabel>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                height: '48px',
                padding: '0 14px',
                borderRadius: '12px',
                background: '#fff',
                border: '1px solid #E5E7EB',
                fontSize: '15px',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="18" rx="1.5" />
                  <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h6v5H9z" />
                </svg>
                {form.building}
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <select
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
              }}
              value={form.building}
              onChange={e => setForm(f => ({ ...f, building: e.target.value }))}
            >
              {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '6px' }}>
            {BUILDINGS.join(' · ')}
          </div>
        </label>

        <label style={{ display: 'block' }}>
          <FieldLabel>ชั้นที่ประจำ</FieldLabel>
          <input
            style={inputStyle}
            value={form.floor}
            onChange={e => setForm(f => ({ ...f, floor: e.target.value }))}
            placeholder="เช่น 34"
          />
        </label>

        <label style={{ display: 'block' }}>
          <FieldLabel>หมายเลขโทรศัพท์</FieldLabel>
          <input
            style={inputStyle}
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="08X-XXX-XXXX"
          />
        </label>

        <button
          type="submit"
          style={{
            marginTop: '3px',
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
          ลงทะเบียน
          <ArrowRight size={19} strokeWidth={2.2} />
        </button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '14px' }}>
        🔒 ข้อมูลของท่านจะถูกเก็บรักษาเป็นความลับ
      </div>
    </div>
  )
}
