'use client'
import { useState } from 'react'
import { Camera, X, Check } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Btn } from '@/components/ui/Btn'
import { Field, TextArea } from '@/components/ui/Field'

interface CloseJobSheetProps {
  open: boolean
  jobTitle: string
  onClose: () => void
  onSubmit: (note: string, before: string[], after: string[]) => void
}

function PhotoGrid({ label, photos, onAdd, onRemove }: {
  label: string
  photos: string[]
  onAdd: () => void
  onRemove: (i: number) => void
}) {
  return (
    <Field label={label} hint="แตะ + เพื่อเพิ่มรูป (เดโม่)">
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
        {photos.map((_, i) => (
          <div key={i} style={{
            width: 72, height: 72, borderRadius: 12, position: 'relative',
            background: 'var(--surface-2)', border: '1px solid var(--line-2)',
            display: 'grid', placeItems: 'center',
          }}>
            <Check size={22} color="var(--st-done)" />
            <button onClick={() => onRemove(i)} style={{
              position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
              background: 'var(--st-urgent)', border: '2px solid var(--bg)', color: '#fff',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <X size={11} />
            </button>
          </div>
        ))}
        {photos.length < 4 && (
          <button onClick={onAdd} style={{
            width: 72, height: 72, borderRadius: 12, cursor: 'pointer',
            background: 'var(--surface-2)', border: '1px dashed var(--line-2)',
            display: 'grid', placeItems: 'center', color: 'var(--txt-3)',
          }}>
            <Camera size={24} />
          </button>
        )}
      </div>
    </Field>
  )
}

export function CloseJobSheet({ open, jobTitle, onClose, onSubmit }: CloseJobSheetProps) {
  const [note, setNote] = useState('')
  const [before, setBefore] = useState<string[]>([])
  const [after, setAfter] = useState<string[]>([])

  const valid = note.trim()

  const reset = () => { setNote(''); setBefore([]); setAfter([]) }

  return (
    <BottomSheet open={open} onClose={() => { onClose(); reset() }} title="ปิดงาน" subtitle={jobTitle} maxWidth={390}>
      <div style={{ padding: '18px 20px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="สรุปผลการดำเนินการ" required>
          <TextArea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="อธิบายสิ่งที่ดำเนินการและผลลัพธ์…"
            style={{ minHeight: 90 }}
          />
        </Field>

        <PhotoGrid
          label="รูปก่อนดำเนินการ"
          photos={before}
          onAdd={() => setBefore(p => [...p, `before-${p.length + 1}.jpg`])}
          onRemove={i => setBefore(p => p.filter((_, idx) => idx !== i))}
        />

        <PhotoGrid
          label="รูปหลังดำเนินการ"
          photos={after}
          onAdd={() => setAfter(p => [...p, `after-${p.length + 1}.jpg`])}
          onRemove={i => setAfter(p => p.filter((_, idx) => idx !== i))}
        />

        <Btn
          variant="green" size="lg" full
          disabled={!valid}
          onClick={() => { onSubmit(note.trim(), before, after); reset() }}
        >
          ยืนยันปิดงาน
        </Btn>
      </div>
    </BottomSheet>
  )
}
