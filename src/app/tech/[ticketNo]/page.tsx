'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Send } from 'lucide-react'
import { useLiff } from '@/lib/liff'
import { apiFetch } from '@/lib/api'
import { TechRequest, Employee } from '@/lib/types'
import { StatusPill } from '@/components/StatusPill'
import { WORK_TYPE_CONFIG } from '@/lib/mock-data'

const STATUS_FLOW: Record<string, { next: string; label: string; color: string }> = {
  pending:     { next: 'in_progress', label: 'รับงานนี้',        color: '#1A56DB' },
  in_progress: { next: 'done',        label: 'ทำเสร็จแล้ว ✓',   color: '#16A34A' },
}

export default function TechDetailPage() {
  const { ticketNo } = useParams<{ ticketNo: string }>()
  const router = useRouter()
  const { profile } = useLiff()

  const [request, setRequest]       = useState<TechRequest | null>(null)
  const [technicians, setTechnicians] = useState<Employee[]>([])
  const [loading, setLoading]       = useState(true)
  const [busy, setBusy]             = useState(false)
  const [message, setMessage]       = useState('')
  const [showReassign, setShowReassign] = useState(false)
  const [selectedTech, setSelectedTech] = useState('')

  const load = useCallback(() => {
    if (!profile) return
    apiFetch(profile.lineUid, `/api/tech?filter=all`)
      .then(r => r.json())
      .then(d => {
        const found = (d.requests as TechRequest[])?.find(r => r.ticketNo === ticketNo)
        setRequest(found ?? null)
        setTechnicians(d.technicians ?? [])
      })
      .finally(() => setLoading(false))
  }, [profile, ticketNo])

  useEffect(() => { load() }, [load])

  const doAction = async (action: string, extra?: Record<string, unknown>) => {
    if (!profile || busy) return
    setBusy(true)
    await apiFetch(profile.lineUid, '/api/tech', {
      method: 'POST',
      body: JSON.stringify({ action, ticketNo, techName: profile.displayName, ...extra }),
    })
    await load()
    setBusy(false)
  }

  const handleAccept = () => doAction('accept')

  const handleDone = () => doAction('status', {
    status: 'done',
    adminMessage: message.trim() || undefined,
  })

  const handleReassign = () => {
    if (!selectedTech) return
    doAction('reassign', { newTechLineUid: selectedTech })
    setShowReassign(false)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    await doAction('status', { status: request!.status, adminMessage: message.trim() })
    setMessage('')
  }

  if (loading) return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>กำลังโหลด...</div>
  if (!request) return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>ไม่พบงานนี้</div>

  const flow = STATUS_FLOW[request.status]
  const types = request.types.map(t => WORK_TYPE_CONFIG[t])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', background: '#fff', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <button type="button" onClick={() => router.back()}
          style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid #E5E7EB', display: 'grid', placeItems: 'center', color: '#6B7280', background: '#fff', cursor: 'pointer' }}>
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{ticketNo}</div>
        </div>
        <StatusPill status={request.status} />
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Location + types */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>📍</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{request.building} · ชั้น {request.floor} · {request.room}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {types.map(t => (
              <span key={t.label} style={{ fontSize: 12, fontWeight: 700, color: t.color, background: t.bg, padding: '3px 10px', borderRadius: 999 }}>
                {t.emoji} {t.label}
              </span>
            ))}
            <span style={{ fontSize: 12, fontWeight: 600, color: request.urgency === 'critical' ? '#B91C1C' : request.urgency === 'urgent' ? '#B45309' : '#15803D', background: request.urgency === 'critical' ? '#FEF2F2' : request.urgency === 'urgent' ? '#FFFBEB' : '#F0FBF4', padding: '3px 10px', borderRadius: 999 }}>
              {request.urgency === 'critical' ? '🔴 เร่งด่วนมาก' : request.urgency === 'urgent' ? '🟡 เร่งด่วน' : '🟢 ปกติ'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '14px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 6 }}>รายละเอียดปัญหา</div>
          <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{request.description}</div>
        </div>

        {/* Reporter info */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>ผู้แจ้ง</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>👤 {request.employeeName}</span>
            <a href={`tel:${request.employeePhone}`} style={{ fontSize: 13, color: '#1A56DB', fontWeight: 600, textDecoration: 'none' }}>📞 {request.employeePhone}</a>
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{request.createdAt}</div>
        </div>

        {/* Timeline */}
        {request.timeline.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 10 }}>Timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {request.timeline.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: step.status === 'pending' ? '#E5E7EB' : step.status === 'current' ? '#1A56DB' : '#16A34A', flex: '0 0 8px', marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: step.status === 'pending' ? '#9CA3AF' : '#374151' }}>{step.label}</div>
                    {step.time && <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--mono)' }}>{new Date(step.time).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin messages */}
        {request.adminMessages.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>ข้อความ</div>
            {request.adminMessages.map((m, i) => (
              <div key={i} style={{ background: '#F3F4F6', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1A56DB', marginBottom: 3 }}>{m.from}</div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{m.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Send message box */}
        {request.status !== 'done' && request.status !== 'cancelled' && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>ส่งข้อความถึงผู้แจ้ง</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                rows={2}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                style={{ flex: 1, borderRadius: 12, border: '1px solid #E5E7EB', padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none', color: '#374151' }}
              />
              <button type="button" onClick={handleSendMessage} disabled={!message.trim() || busy}
                style={{ width: 42, borderRadius: 12, border: 'none', background: message.trim() ? '#1A56DB' : '#E5E7EB', color: '#fff', cursor: message.trim() ? 'pointer' : 'default', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Send size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Reassign panel */}
        {showReassign && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E5E7EB', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>โอนงานให้ช่าง</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {technicians.filter(t => t.role === 'technician').map(t => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, border: selectedTech === t.id ? '2px solid #1A56DB' : '1px solid #E5E7EB', background: selectedTech === t.id ? '#EFF4FE' : '#fff', cursor: 'pointer' }}>
                  <input type="radio" name="tech" value={t.id} checked={selectedTech === t.id} onChange={() => setSelectedTech(t.id!)} style={{ display: 'none' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', flex: 1 }}>👤 {t.displayName}</span>
                  {selectedTech === t.id && <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#1A56DB', display: 'grid', placeItems: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setShowReassign(false)}
                style={{ flex: 1, height: 42, borderRadius: 12, border: '1px solid #E5E7EB', background: '#fff', fontSize: 14, fontWeight: 600, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>ยกเลิก</button>
              <button type="button" onClick={handleReassign} disabled={!selectedTech || busy}
                style={{ flex: 2, height: 42, borderRadius: 12, border: 'none', background: selectedTech ? '#1A56DB' : '#9CA3AF', color: '#fff', fontSize: 14, fontWeight: 700, cursor: selectedTech ? 'pointer' : 'default', fontFamily: 'inherit' }}>โอนงาน</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {request.status !== 'done' && request.status !== 'cancelled' && !showReassign && (
        <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button type="button" onClick={() => setShowReassign(true)}
            style={{ height: 50, padding: '0 16px', borderRadius: 14, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 14, fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            โอนงาน
          </button>
          {flow && (
            <button type="button" onClick={flow.next === 'in_progress' ? handleAccept : handleDone} disabled={busy}
              style={{ flex: 1, height: 50, borderRadius: 14, border: 'none', background: busy ? '#9CA3AF' : flow.color, color: '#fff', fontSize: 15, fontWeight: 700, cursor: busy ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: busy ? 'none' : `0 10px 22px -10px ${flow.color}99` }}>
              {busy ? 'กำลังบันทึก...' : flow.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
