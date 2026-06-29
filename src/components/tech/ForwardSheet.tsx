'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import type { Technician } from '@/lib/types'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Btn } from '@/components/ui/Btn'
import { Avatar } from '@/components/ui/Avatar'
import { Field, TextArea } from '@/components/ui/Field'

interface ForwardSheetProps {
  open: boolean
  jobTitle: string
  currentTechId: string
  techs: Technician[]
  onClose: () => void
  onForward: (techId: string, reason: string) => void
}

export function ForwardSheet({ open, jobTitle, currentTechId, techs, onClose, onForward }: ForwardSheetProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const candidates = techs.filter(t => t.id !== currentTechId)
  const reset = () => { setSelected(null); setReason('') }

  return (
    <BottomSheet open={open} onClose={() => { reset(); onClose() }} title="ส่งต่องาน" subtitle={jobTitle} maxWidth={390}>
      <div style={{ padding: '14px 18px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="เหตุผลการส่งต่อ" required hint="เช่น ต้องใช้ช่างเฉพาะทาง / อะไหล่ไม่พร้อม / งานเกินขอบเขต">
          <TextArea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="อธิบายเหตุผลที่ต้องส่งต่อ…"
            style={{ minHeight: 70 }}
          />
        </Field>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--txt-3)', marginTop: 2 }}>เลือกช่างที่จะรับงานต่อ</div>
        {candidates.map(t => {
          const active = selected === t.id
          return (
            <button key={t.id} onClick={() => setSelected(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
              borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              background: active ? 'color-mix(in srgb, var(--gold) 10%, var(--card))' : 'var(--card-hi)',
              border: `1px solid ${active ? 'var(--gold)' : 'var(--line-2)'}`,
            }}>
              <Avatar name={t.name} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>{t.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--txt-3)', marginTop: 2 }}>{t.skill}</div>
                <div style={{ marginTop: 5, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <LoadBar load={t.load} />
                  <span style={{ fontSize: 11, color: t.busy ? 'var(--st-urgent)' : 'var(--st-done)', fontWeight: 600 }}>
                    {t.busy ? '● งานเต็ม' : '● ว่าง'}
                  </span>
                </div>
              </div>
              {active && (
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--gold)', display: 'grid', placeItems: 'center',
                }}>
                  <Check size={14} color="#161310" strokeWidth={3} />
                </span>
              )}
            </button>
          )
        })}

        <Btn
          variant="gold" size="lg" full
          style={{ marginTop: 4 }}
          disabled={!selected || !reason.trim()}
          onClick={() => { if (selected && reason.trim()) { onForward(selected, reason.trim()); reset() } }}
        >
          ยืนยันส่งต่อ
        </Btn>
      </div>
    </BottomSheet>
  )
}

function LoadBar({ load }: { load: number }) {
  const color = load >= 80 ? '#E15B4C' : load >= 50 ? '#E0902E' : '#43B581'
  return (
    <div style={{ width: 56, height: 4, borderRadius: 99, background: 'var(--line-2)', overflow: 'hidden' }}>
      <div style={{ width: `${load}%`, height: '100%', background: color, borderRadius: 99 }} />
    </div>
  )
}
