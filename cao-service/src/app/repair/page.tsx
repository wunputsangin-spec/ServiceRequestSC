'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ArrowRight, Send, Camera, X, Zap, Clock } from 'lucide-react'
import { WorkType, UrgencyLevel, PreferredTime } from '@/lib/types'
import { TypeChip } from '@/components/TypeChip'
import { BUILDINGS, FLOORS, ALL_WORK_TYPES } from '@/lib/mock-data'
import { useLiff } from '@/lib/liff'
import { apiFetch } from '@/lib/api'

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
}

const selectWrapStyle: React.CSSProperties = {
  position: 'relative',
}

function SelectField({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div style={selectWrapStyle}>
      <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
        <span style={{ color: value ? '#111827' : '#9CA3AF' }}>{value || placeholder}</span>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <select
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
      {children}
    </div>
  )
}

const URGENCY_CONFIG: Record<UrgencyLevel, { emoji: string; label: string; border: string; bg: string; textColor: string }> = {
  normal: { emoji: '🟢', label: 'ปกติ', border: '#16A34A', bg: '#F0FBF4', textColor: '#15803D' },
  urgent: { emoji: '🟡', label: 'เร่งด่วน', border: '#D97706', bg: '#FFFBEB', textColor: '#B45309' },
  critical: { emoji: '🔴', label: 'เร่งด่วนมาก', border: '#DC2626', bg: '#FEF2F2', textColor: '#B91C1C' },
}

export default function RepairPage() {
  const router = useRouter()
  const { profile } = useLiff()
  const [step, setStep] = useState<1 | 2>(1)
  const [building, setBuilding] = useState('')
  const [floor, setFloor] = useState('')
  const [room, setRoom] = useState('')
  const [types, setTypes] = useState<WorkType[]>([])
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal')
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('now')
  const [photos] = useState<string[]>([])

  const toggleType = (t: WorkType) => {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const step1Valid = building && floor && room && types.length > 0
  const step2Valid = description.trim().length > 0

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !step2Valid || submitting) return
    setSubmitting(true)
    try {
      const res = await apiFetch(profile.lineUid, '/api/requests', {
        method: 'POST',
        body: JSON.stringify({ building, floor, room, types, urgency, description, preferredTime, photos }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert('เกิดข้อผิดพลาด: ' + (err.error ?? res.statusText))
        return
      }
      const data = await res.json()
      router.push(`/success?ticket=${data.ticketNo}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header */}
      <div style={{ height: '50px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', background: '#fff', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => step === 1 ? router.push('/home') : setStep(1)}
          style={{ width: '32px', height: '32px', borderRadius: '9px', border: '1px solid #E5E7EB', display: 'grid', placeItems: 'center', color: '#6B7280', background: '#fff', cursor: 'pointer' }}
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>แจ้งซ่อม</span>
      </div>

      <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: '17px' }}>
          {/* Progress */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A56DB', fontFamily: 'var(--mono)' }}>
                ขั้นตอน {step} / 2
              </span>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {step === 1 ? 'สถานที่และประเภทงาน' : 'รายละเอียดและรูปภาพ'}
              </span>
            </div>
            <div style={{ height: '6px', borderRadius: '999px', background: '#E5E7EB', overflow: 'hidden' }}>
              <div style={{ width: step === 1 ? '50%' : '100%', height: '100%', background: '#1A56DB', borderRadius: '999px', transition: 'width 0.3s' }} />
            </div>
          </div>

          {step === 1 ? (
            <>
              <div>
                <FieldLabel>อาคาร</FieldLabel>
                <SelectField value={building} onChange={setBuilding} options={BUILDINGS} placeholder="เลือกอาคาร" />
              </div>
              <div>
                <FieldLabel>ชั้น</FieldLabel>
                <SelectField value={floor} onChange={setFloor} options={FLOORS} placeholder="เลือกชั้น" />
              </div>
              <div>
                <FieldLabel>ห้อง / จุดที่พบปัญหา</FieldLabel>
                <input
                  style={inputStyle}
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  placeholder="เช่น ห้องประชุม 301"
                />
              </div>
              <div>
                <FieldLabel>
                  ประเภทงาน{' '}
                  <span style={{ color: '#9CA3AF', fontWeight: 500 }}>(เลือกได้หลายข้อ)</span>
                </FieldLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
                  {ALL_WORK_TYPES.map(t => (
                    <TypeChip key={t} type={t} selected={types.includes(t)} onToggle={toggleType} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <FieldLabel>รายละเอียดปัญหา</FieldLabel>
                <textarea
                  style={{ ...inputStyle, height: 'auto', minHeight: '104px', padding: '13px 14px', resize: 'none', lineHeight: 1.55 }}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="อธิบายปัญหาที่พบ..."
                  rows={4}
                />
              </div>

              <div>
                <FieldLabel>ระดับความเร่งด่วน</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px' }}>
                  {(Object.entries(URGENCY_CONFIG) as [UrgencyLevel, typeof URGENCY_CONFIG[UrgencyLevel]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setUrgency(key)}
                      style={{
                        padding: '13px 6px',
                        borderRadius: '13px',
                        background: urgency === key ? cfg.bg : '#fff',
                        border: urgency === key ? `2px solid ${cfg.border}` : '1px solid #E5E7EB',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: urgency === key ? `0 6px 14px -8px ${cfg.border}80` : 'none',
                        fontFamily: 'inherit',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{cfg.emoji}</span>
                      <span style={{ fontSize: '13px', fontWeight: urgency === key ? 700 : 600, color: urgency === key ? cfg.textColor : '#6B7280' }}>
                        {cfg.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>เวลาที่ต้องการให้เข้าซ่อม</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {/* Now */}
                  <button
                    type="button"
                    onClick={() => setPreferredTime('now')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      padding: '13px 14px',
                      borderRadius: '13px',
                      background: preferredTime === 'now' ? '#EFF4FE' : '#fff',
                      border: preferredTime === 'now' ? '2px solid #1A56DB' : '1px solid #E5E7EB',
                      boxShadow: preferredTime === 'now' ? '0 6px 14px -8px rgba(26,86,219,.45)' : 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ width: '34px', height: '34px', borderRadius: '10px', background: preferredTime === 'now' ? '#1A56DB' : '#F3F4F6', color: preferredTime === 'now' ? '#fff' : '#6B7280', display: 'grid', placeItems: 'center', flex: '0 0 34px' }}>
                      <Zap size={18} strokeWidth={2} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: preferredTime === 'now' ? '#1542AB' : '#374151' }}>ตอนนี้ได้เลย</div>
                      <div style={{ fontSize: '12px', color: preferredTime === 'now' ? '#3B68C4' : '#9CA3AF', marginTop: '1px' }}>ให้ช่างเข้าตรวจสอบโดยเร็วที่สุด</div>
                    </div>
                    {preferredTime === 'now' && (
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1A56DB', color: '#fff', display: 'grid', placeItems: 'center', flex: '0 0 20px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    )}
                  </button>
                  {/* Scheduled */}
                  <button
                    type="button"
                    onClick={() => setPreferredTime('scheduled')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '11px',
                      padding: '13px 14px',
                      borderRadius: '13px',
                      background: preferredTime === 'scheduled' ? '#EFF4FE' : '#fff',
                      border: preferredTime === 'scheduled' ? '2px solid #1A56DB' : '1px solid #E5E7EB',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ width: '34px', height: '34px', borderRadius: '10px', background: preferredTime === 'scheduled' ? '#1A56DB' : '#F3F4F6', color: preferredTime === 'scheduled' ? '#fff' : '#6B7280', display: 'grid', placeItems: 'center', flex: '0 0 34px' }}>
                      <Clock size={18} strokeWidth={2} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: preferredTime === 'scheduled' ? '#1542AB' : '#374151' }}>กำหนดช่วงเวลา</div>
                      <div style={{ fontSize: '12px', color: preferredTime === 'scheduled' ? '#3B68C4' : '#9CA3AF', marginTop: '1px' }}>เลือกวันและช่วงเวลาที่สะดวก</div>
                    </div>
                    {preferredTime !== 'scheduled' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7D2E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    )}
                    {preferredTime === 'scheduled' && (
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1A56DB', color: '#fff', display: 'grid', placeItems: 'center', flex: '0 0 20px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <FieldLabel>รูปภาพประกอบ</FieldLabel>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>สูงสุด 3 รูป</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ aspectRatio: '1', borderRadius: '13px', position: 'relative', overflow: 'hidden', background: '#E5EDF8', border: '1px solid #E5E7EB' }}>
                      <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(17,24,39,.6)', color: '#fff', display: 'grid', placeItems: 'center', border: 'none', cursor: 'pointer' }}>
                        <X size={12} strokeWidth={2.6} />
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - photos.length) }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: '1', borderRadius: '13px', background: '#F8FAFF', border: '1.5px dashed #C7D2E4', display: 'grid', placeItems: 'center' }}>
                      <div style={{ display: 'grid', placeItems: 'center', gap: '5px', color: '#9CA3AF', textAlign: 'center' }}>
                        <Camera size={22} strokeWidth={1.8} />
                        <span style={{ fontSize: '10.5px', fontWeight: 600, lineHeight: 1.2 }}>แตะเพื่อ<br />อัปโหลด</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer button */}
        <div style={{ padding: '0 18px 20px', flexShrink: 0 }}>
          {step === 1 ? (
            <button
              type="button"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                height: '52px',
                border: 'none',
                borderRadius: '14px',
                background: step1Valid ? '#1A56DB' : '#9CA3AF',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: step1Valid ? '0 10px 22px -10px rgba(26,86,219,.6)' : 'none',
                cursor: step1Valid ? 'pointer' : 'not-allowed',
              }}
            >
              ถัดไป <ArrowRight size={19} strokeWidth={2.2} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!step2Valid || submitting}
              style={{
                width: '100%',
                height: '52px',
                border: 'none',
                borderRadius: '14px',
                background: step2Valid && !submitting ? '#1A56DB' : '#9CA3AF',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: step2Valid && !submitting ? '0 10px 22px -10px rgba(26,86,219,.6)' : 'none',
                cursor: step2Valid && !submitting ? 'pointer' : 'not-allowed',
              }}
            >
              <Send size={18} strokeWidth={2.1} /> {submitting ? 'กำลังส่ง...' : 'ส่งคำร้อง'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
