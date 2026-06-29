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

type Photo = { url: string; preview: string }

function PhotoGrid({ label, photos, bucket, lineUid, onChange }: {
  label: string
  photos: Photo[]
  bucket: string
  lineUid: string
  onChange: (next: Photo[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    const picked = Array.from(files).slice(0, 4 - photos.length)
    // show local previews immediately
    const locals = picked.map(f => ({ url: '', preview: URL.createObjectURL(f) }))
    let next = [...photos, ...locals]
    onChange(next)
    try {
      for (let i = 0; i < picked.length; i++) {
        const url = await apiUploadPhoto(lineUid, picked[i], bucket)
        next = next.map((p, idx) => idx === photos.length + i ? { ...p, url } : p)
        onChange(next)
      }
    } catch {
      alert('อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่')
      onChange(photos) // rollback to before this batch
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <Field label={label} hint="แตะ + เพื่อถ่าย/เลือกรูป">
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {photos.map((p, i) => (
          <div key={i} style={{
            width: 104, height: 104, borderRadius: 14, position: 'relative', overflow: 'hidden',
            background: 'var(--surface-2)', border: '1px solid var(--line-2)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {!p.url && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center' }}>
                <Loader2 size={22} color="#fff" className="animate-spin" />
              </div>
            )}
            <button onClick={() => onChange(photos.filter((_, idx) => idx !== i))} style={{
              position: 'absolute', top: 5, right: 5, width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(0,0,0,.6)', border: 'none', color: '#fff',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <X size={14} />
            </button>
          </div>
        ))}
        {photos.length < 4 && (
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            width: 104, height: 104, borderRadius: 14, cursor: uploading ? 'wait' : 'pointer',
            background: 'var(--surface-2)', border: '1px dashed var(--line-2)',
            display: 'grid', placeItems: 'center', color: 'var(--txt-3)', gap: 4,
          }}>
            {uploading ? <Loader2 size={26} className="animate-spin" /> : <Camera size={26} />}
          </button>
        )}
      </div>
    </Field>
  )
}

export function CloseJobSheet({ open, jobTitle, lineUid, onClose, onSubmit }: CloseJobSheetProps) {
  const [note, setNote] = useState('')
  const [before, setBefore] = useState<Photo[]>([])
  const [after, setAfter] = useState<Photo[]>([])

  const valid = note.trim()
  const reset = () => { setNote(''); setBefore([]); setAfter([]) }
  const urls = (ps: Photo[]) => ps.map(p => p.url).filter(Boolean)

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
          onClick={() => { onSubmit(note.trim(), urls(before), urls(after)); reset() }}
        >
          ยืนยันปิดงาน
        </Btn>
      </div>
    </BottomSheet>
  )
}
