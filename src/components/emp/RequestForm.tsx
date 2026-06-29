'use client'
import { useState, useRef, useMemo } from 'react'
import { ArrowLeft, Camera, X, AlertTriangle, Loader2, Clock } from 'lucide-react'
import type { Employee, JobType, JobCategory, Urgency, SlotTime, Job } from '@/lib/types'
import { Field, SelectField, TextInput, TextArea } from '@/components/ui/Field'
import { Btn } from '@/components/ui/Btn'
import { CatBadge, catMeta } from './catMeta'
import { apiUploadPhoto } from '@/lib/api'
import { REPAIR_CAT_META, SERVICE_CAT_META, BUILDINGS, FLOORS, SLOT_OPTIONS } from '@/lib/constants'

type SubmitPayload = Omit<Job, 'id' | 'code' | 'status' | 'assignees' | 'closeNote' | 'rating' | 'feedback' | 'beforePhotos' | 'afterPhotos' | 'chat' | 'createdAt' | 'updatedAt'>

const TH_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

// สร้างตัวเลือกวันที่ 7 วันถัดไปจากวันนี้ (พ.ศ.)
function buildDateOptions(): string[] {
  const opts: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const prefix = i === 0 ? 'วันนี้' : i === 1 ? 'พรุ่งนี้' : TH_DAYS[d.getDay()]
    opts.push(`${prefix} · ${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`)
  }
  return opts
}

interface RequestFormProps {
  employee: Employee
  onBack: () => void
  onSubmit: (payload: SubmitPayload) => void
}

export function RequestForm({ employee, onBack, onSubmit }: RequestFormProps) {
  const DATE_OPTIONS = useMemo(buildDateOptions, [])
  const [type, setType] = useState<JobType>('repair')
  const [category, setCategory] = useState<JobCategory>('electric')
  const [title, setTitle] = useState('')
  const [building, setBuilding] = useState(employee.building || BUILDINGS[0])
  const [floor, setFloor] = useState(employee.floor || '')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState<Urgency>('normal')
  const [description, setDescription] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [slotDate, setSlotDate] = useState(DATE_OPTIONS[0])
  const [slotTime, setSlotTime] = useState<SlotTime>('morning')
  const [photos, setPhotos] = useState<{ url: string; preview: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    const picked = Array.from(files).slice(0, 4 - photos.length)
    const locals = picked.map(f => ({ url: '', preview: URL.createObjectURL(f) }))
    const base = photos.length
    let next = [...photos, ...locals]
    setPhotos(next)
    try {
      for (let i = 0; i < picked.length; i++) {
        const url = await apiUploadPhoto(employee.lineUid, picked[i], 'photos')
        next = next.map((p, idx) => idx === base + i ? { ...p, url } : p)
        setPhotos(next)
      }
    } catch {
      alert('อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่')
      setPhotos(photos)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const catEntries = Object.entries(type === 'repair' ? REPAIR_CAT_META : SERVICE_CAT_META)
  const valid = title.trim() && floor && location.trim() && description.trim()

  const switchType = (t: JobType) => {
    setType(t)
    setCategory((t === 'repair' ? 'electric' : 'equipment_loan') as JobCategory)
  }

  const submit = () => {
    if (!valid) return
    onSubmit({
      type, category, title: title.trim(), building, floor, location: location.trim(),
      urgency, description: description.trim(),
      slotDate: scheduled ? slotDate : 'ไม่ระบุ',
      slotTime: scheduled ? slotTime : 'custom',
      requesterId: employee.id, requesterName: employee.displayName,
      photos: photos.map(p => p.url).filter(Boolean),
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        borderBottom: '1px solid var(--line)', background: 'var(--surface)',
      }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', color: 'var(--txt-2)',
          width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)' }}>สร้างคำขอใหม่</span>
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Segmented type */}
        <div style={{
          display: 'flex', gap: 4, padding: 4, borderRadius: 14,
          background: 'var(--surface-2)', border: '1px solid var(--line-2)',
        }}>
          {([['repair', 'แจ้งซ่อม'], ['service', 'ขอบริการ']] as const).map(([val, label]) => (
            <button key={val} onClick={() => switchType(val)} style={{
              flex: 1, height: 40, border: 'none', borderRadius: 10, cursor: 'pointer',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              background: type === val ? 'linear-gradient(180deg,#E8C77A,#DDB056)' : 'transparent',
              color: type === val ? '#161310' : 'var(--txt-2)',
              boxShadow: type === val ? '0 4px 14px -6px rgba(221,176,86,.5)' : 'none',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Category grid */}
        <Field label="ประเภท" required>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
            {catEntries.map(([key]) => {
              const cat = key as JobCategory
              const { label, color } = catMeta(cat)
              const active = category === cat
              return (
                <button key={key} onClick={() => setCategory(cat)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                  padding: '13px 6px', borderRadius: 14, cursor: 'pointer',
                  background: active ? `color-mix(in srgb, ${color} 14%, transparent)` : 'var(--surface-2)',
                  border: `1px solid ${active ? color : 'var(--line-2)'}`,
                  fontFamily: 'inherit',
                }}>
                  <CatBadge cat={cat} size={38} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: active ? 'var(--txt)' : 'var(--txt-2)' }}>{label}</span>
                </button>
              )
            })}
          </div>
        </Field>

        {/* Title */}
        <Field label="หัวข้อ" required>
          <TextInput value={title} onChange={e => setTitle(e.target.value)} placeholder="เช่น แอร์ห้องประชุมไม่เย็น" />
        </Field>

        {/* Location */}
        <Field label="อาคาร" required>
          <SelectField value={building} onChange={setBuilding} options={BUILDINGS.map(b => ({ value: b, label: b }))} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12 }}>
          <Field label="ชั้น" required>
            <SelectField value={floor} onChange={setFloor} placeholder="เลือกชั้น" options={FLOORS.map(f => ({ value: f, label: `ชั้น ${f}` }))} />
          </Field>
          <Field label="จุด/ห้อง" required>
            <TextInput value={location} onChange={e => setLocation(e.target.value)} placeholder="เช่น ห้องประชุมใหญ่" />
          </Field>
        </div>

        {/* Description */}
        <Field label="รายละเอียด" required>
          <TextArea value={description} onChange={e => setDescription(e.target.value)} placeholder="อธิบายปัญหาหรือสิ่งที่ต้องการให้ละเอียด…" />
        </Field>

        {/* Urgency */}
        <Field label="ความเร่งด่วน">
          <div style={{ display: 'flex', gap: 10 }}>
            {([['normal', 'ปกติ'], ['urgent', 'ด่วน']] as const).map(([val, label]) => {
              const active = urgency === val
              const isUrgent = val === 'urgent'
              const c = isUrgent ? '#E15B4C' : '#43B581'
              return (
                <button key={val} onClick={() => setUrgency(val)} style={{
                  flex: 1, height: 48, borderRadius: 13, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  fontSize: 14, fontWeight: 700,
                  background: active ? `color-mix(in srgb, ${c} 14%, transparent)` : 'var(--surface-2)',
                  border: `1px solid ${active ? c : 'var(--line-2)'}`,
                  color: active ? c : 'var(--txt-2)',
                }}>
                  {isUrgent && <AlertTriangle size={15} />} {label}
                </button>
              )
            })}
          </div>
        </Field>

        {/* Schedule toggle + date/slot */}
        <Field label="วัน-เวลาที่สะดวก">
          {!scheduled ? (
            <button onClick={() => setScheduled(true)} style={{
              width: '100%', height: 48, borderRadius: 13, cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 14, fontWeight: 700, color: 'var(--gold)',
              background: 'var(--surface-2)', border: '1px dashed color-mix(in srgb, var(--gold) 45%, var(--line-2))',
            }}>
              <Clock size={16} /> กำหนดเวลา
            </button>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <button onClick={() => setScheduled(false)} style={{
                  background: 'transparent', border: 'none', color: 'var(--txt-3)', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <X size={13} /> ไม่ระบุเวลา
                </button>
              </div>
              <SelectField value={slotDate} onChange={setSlotDate} options={DATE_OPTIONS.map(d => ({ value: d, label: d }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginTop: 10 }}>
                {SLOT_OPTIONS.filter(o => o.value !== 'custom').map(o => {
                  const active = slotTime === o.value
                  return (
                    <button key={o.value} onClick={() => setSlotTime(o.value as SlotTime)} style={{
                      padding: '11px 10px', borderRadius: 13, cursor: 'pointer', fontFamily: 'inherit',
                      textAlign: 'left',
                      background: active ? 'color-mix(in srgb, var(--gold) 14%, transparent)' : 'var(--surface-2)',
                      border: `1px solid ${active ? 'var(--gold)' : 'var(--line-2)'}`,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--txt)' : 'var(--txt-2)' }}>{o.label}</div>
                      <div className="num" style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>{o.time}</div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </Field>

        {/* Photos */}
        <Field label="แนบรูปภาพ" hint="แตะเพื่อถ่าย/เลือกรูป (สูงสุด 4 รูป)">
          <input
            ref={fileRef} type="file" accept="image/*" multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {photos.map((p, i) => (
              <div key={i} style={{
                width: 100, height: 100, borderRadius: 14, position: 'relative', overflow: 'hidden',
                background: 'var(--surface-2)', border: '1px solid var(--line-2)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {!p.url && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center' }}>
                    <Loader2 size={20} color="#fff" className="animate-spin" />
                  </div>
                )}
                <button onClick={() => setPhotos(ph => ph.filter((_, idx) => idx !== i))} style={{
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
                width: 100, height: 100, borderRadius: 14, cursor: uploading ? 'wait' : 'pointer',
                background: 'var(--surface-2)', border: '1px dashed var(--line-2)',
                display: 'grid', placeItems: 'center', color: 'var(--txt-3)',
              }}>
                {uploading ? <Loader2 size={26} className="animate-spin" /> : <Camera size={26} />}
              </button>
            )}
          </div>
        </Field>
      </div>

      {/* Submit */}
      <div style={{
        flexShrink: 0, padding: '12px 16px 18px', borderTop: '1px solid var(--line)', background: 'var(--surface)',
      }}>
        <Btn variant="gold" size="lg" full disabled={!valid} onClick={submit}>ส่งคำขอ</Btn>
      </div>
    </div>
  )
}
