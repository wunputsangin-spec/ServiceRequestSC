'use client'
import { useState, useRef } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Btn } from '@/components/ui/Btn'
import { Field, TextArea } from '@/components/ui/Field'
import { apiUploadPhoto } from '@/lib/api'

interface CloseJobSheetProps {
  open: boolean
  jobTitle: string
  lineUid: string
  onClose: () => void
  onSubmit: (note: string, before: string[], after: string[]) => void
}

function PhotoGrid({ label, photos, bucket, lineUid, onChange }: {
  label: string
  photos: string[]
  bucket: string
  lineUid: string
  onChange: (next: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files).slice(0, 4 - photos.length)) {
        urls.push(await apiUploadPhoto(lineUid, file, bucket))
      }
      onChange([...photos, ...urls])
    } catch {
      alert('อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <Field label={label} hint="แตะ + เพื่อถ่าย/เลือกรูป">
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)} />
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
        {photos.map((p, i) => (
          <div key={i} style={{
            width: 72, height: 72, borderRadius: 12, position: 'relative', overflow: 'hidden',
            background: 'var(--surface-2)', border: '1px solid var(--line-2)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => onChange(photos.filter((_, idx) => idx !== i))} style={{
              position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
              background: 'var(--st-urgent)', border: '2px solid var(--bg)', color: '#fff',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <X size={11} />
            </button>
          </div>
        ))}
        {photos.length < 4 && (
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            width: 72, height: 72, borderRadius: 12, cursor: uploading ? 'wait' : 'pointer',
            background: 'var(--surface-2)', border: '1px dashed var(--line-2)',
            display: 'grid', placeItems: 'center', color: 'var(--txt-3)',
          }}>
            {uploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
          </button>
        )}
      </div>
    </Field>
  )
}

export function CloseJobSheet({ open, jobTitle, lineUid, onClose, onSubmit }: CloseJobSheetProps) {
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

        <PhotoGrid label="รูปก่อนดำเนินการ" photos={before} bucket="before-photos" lineUid={lineUid} onChange={setBefore} />
        <PhotoGrid label="รูปหลังดำเนินการ" photos={after} bucket="after-photos" lineUid={lineUid} onChange={setAfter} />

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
