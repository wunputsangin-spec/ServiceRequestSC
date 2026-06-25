'use client'
import { useState, useEffect } from 'react'
import { Check, Star, X } from 'lucide-react'
import type { Job, Technician } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'
import { Btn } from '@/components/ui/Btn'

interface AssignDialogProps {
  job: Job
  techs: Technician[]
  onClose: () => void
  onConfirm: (techIds: string[]) => void
}

function LoadBar({ load }: { load: number }) {
  const color = load >= 80 ? '#E15B4C' : load >= 50 ? '#E0902E' : '#43B581'
  return (
    <div style={{ width: 90, height: 5, borderRadius: 99, background: 'var(--line-2)', overflow: 'hidden' }}>
      <div style={{ width: `${load}%`, height: '100%', background: color }} />
    </div>
  )
}

export function AssignDialog({ job, techs, onClose, onConfirm }: AssignDialogProps) {
  const [selected, setSelected] = useState<string[]>(job.assignees)
  const editing = job.assignees.length > 0

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const toggle = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(8,8,10,.7)', backdropFilter: 'blur(4px)',
      display: 'grid', placeItems: 'center', padding: 24,
    }} className="animate-fadein">
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, maxHeight: '86vh', overflowY: 'auto',
        background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 20,
      }} className="scrollbar-hide animate-popin">
        {/* Header */}
        <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--txt)' }}>
              {editing ? 'แก้ไขช่างผู้รับผิดชอบ' : 'มอบหมายช่าง'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--txt-3)', marginTop: 3 }}>
              <span className="num">{job.code}</span> · {job.title}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--txt-3)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Tech list */}
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {techs.map(t => {
            const active = selected.includes(t.id)
            return (
              <button key={t.id} onClick={() => toggle(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px',
                borderRadius: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                background: active ? 'color-mix(in srgb, var(--gold) 10%, var(--card))' : 'var(--card)',
                border: `1px solid ${active ? 'var(--gold)' : 'var(--line)'}`,
              }}>
                <Avatar name={t.name} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--txt)' }}>{t.name}</span>
                    <span className="num" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>
                      <Star size={12} fill="#DDB056" color="#DDB056" />{t.avgRating.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 2 }}>{t.skill}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 6 }}>
                    <LoadBar load={t.load} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: t.busy ? 'var(--st-urgent)' : 'var(--st-done)' }}>
                      {t.busy ? `งานเต็ม (${t.activeJobs})` : `ว่าง (${t.activeJobs} งาน)`}
                    </span>
                  </div>
                </div>
                <span style={{
                  width: 24, height: 24, flexShrink: 0, borderRadius: 7,
                  border: `2px solid ${active ? 'var(--gold)' : 'var(--line-2)'}`,
                  background: active ? 'var(--gold)' : 'transparent',
                  display: 'grid', placeItems: 'center',
                }}>
                  {active && <Check size={14} color="#161310" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 18px 18px', borderTop: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ flex: 1, fontSize: 12.5, color: 'var(--txt-3)' }}>
            เลือกแล้ว <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{selected.length}</span> คน
          </span>
          <Btn variant="ghost" size="md" onClick={onClose}>ยกเลิก</Btn>
          <Btn variant="gold" size="md" disabled={selected.length === 0} onClick={() => onConfirm(selected)}>
            {editing ? 'บันทึก' : 'มอบหมาย'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
