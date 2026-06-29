'use client'
import { useState, useEffect } from 'react'
import { Plus, X, Building2, Layers, Tag, Bell, Save } from 'lucide-react'
import { Btn } from '@/components/ui/Btn'
import { apiGetSettings, apiUpdateSetting, type AppSettings } from '@/lib/api'

interface AdminSettingsPageProps {
  lineUid: string
  onToast: (msg: string) => void
  onSettingsChange?: (s: AppSettings) => void
}

export function AdminSettingsPage({ lineUid, onToast, onSettingsChange }: AdminSettingsPageProps) {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetSettings(lineUid)
      .then(s => { setSettings(s); setLoading(false) })
      .catch(() => setLoading(false))
  }, [lineUid])

  const save = async (key: string, value: unknown, msg: string) => {
    try {
      await apiUpdateSetting(lineUid, key, value)
      setSettings(prev => {
        const next = prev ? { ...prev, [key]: value } : prev
        if (next) onSettingsChange?.(next)
        return next
      })
      onToast(msg)
    } catch {
      onToast('บันทึกไม่สำเร็จ')
    }
  }

  if (loading || !settings) {
    return (
      <>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>ตั้งค่าระบบ</h1>
        <p style={{ fontSize: 13.5, color: 'var(--txt-3)' }}>กำลังโหลด…</p>
      </>
    )
  }

  return (
    <>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>ตั้งค่าระบบ</h1>
        <p style={{ fontSize: 13.5, color: 'var(--txt-3)', marginTop: 4 }}>จัดการตัวเลือกในฟอร์มและการแจ้งเตือน</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        <ListCard
          icon={<Building2 size={17} />} title="อาคาร"
          items={settings.buildings}
          placeholder="เพิ่มชื่ออาคาร…"
          onSave={(items) => save('buildings', items, 'บันทึกรายการอาคารแล้ว')}
        />
        <ListCard
          icon={<Layers size={17} />} title="ชั้น"
          items={settings.floors}
          placeholder="เพิ่มชั้น เช่น 42…"
          onSave={(items) => save('floors', items, 'บันทึกรายการชั้นแล้ว')}
        />
        <CategoryCard
          title="หมวดหมู่งานซ่อม"
          items={settings.repair_categories}
          onSave={(items) => save('repair_categories', items, 'บันทึกหมวดหมู่งานซ่อมแล้ว')}
        />
        <CategoryCard
          title="หมวดหมู่ขอบริการ"
          items={settings.service_categories}
          onSave={(items) => save('service_categories', items, 'บันทึกหมวดหมู่บริการแล้ว')}
        />
      </div>

      <LineNotifyCard
        value={settings.line_notify}
        onSave={(v) => save('line_notify', v, 'บันทึกการตั้งค่าแจ้งเตือนแล้ว')}
      />
    </>
  )
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
        <span style={{ color: 'var(--gold)' }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function ListCard({ icon, title, items, placeholder, onSave }: {
  icon: React.ReactNode; title: string; items: string[]; placeholder: string
  onSave: (items: string[]) => void
}) {
  const [list, setList] = useState<string[]>(items)
  const [input, setInput] = useState('')
  const dirty = JSON.stringify(list) !== JSON.stringify(items)

  const add = () => {
    const v = input.trim()
    if (!v || list.includes(v)) return
    setList([...list, v]); setInput('')
  }

  return (
    <Card icon={icon} title={title}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {list.map((it, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--txt)', background: 'var(--surface-2)', border: '1px solid var(--line-2)', padding: '5px 10px', borderRadius: 999 }}>
            {it}
            <button onClick={() => setList(list.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--txt-3)', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0 }}><X size={13} /></button>
          </span>
        ))}
        {list.length === 0 && <span style={{ fontSize: 12.5, color: 'var(--txt-3)' }}>ยังไม่มีรายการ</span>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder}
          onKeyDown={e => { if (e.key === 'Enter') add() }}
          style={{ flex: 1, height: 38, padding: '0 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--txt)', fontSize: 13.5, fontFamily: 'inherit', outline: 'none' }}
        />
        <button onClick={add} style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--gold)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Plus size={18} /></button>
      </div>
      {dirty && (
        <div style={{ marginTop: 12 }}>
          <Btn variant="gold" size="sm" full onClick={() => onSave(list)}><Save size={14} /> บันทึก</Btn>
        </div>
      )}
    </Card>
  )
}

function CategoryCard({ title, items, onSave }: {
  title: string; items: { key: string; label: string }[]
  onSave: (items: { key: string; label: string }[]) => void
}) {
  const [list, setList] = useState(items)
  const [input, setInput] = useState('')
  const dirty = JSON.stringify(list) !== JSON.stringify(items)

  const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^\w฀-๿]/g, '') || `cat_${Date.now()}`

  const add = () => {
    const label = input.trim()
    if (!label) return
    const key = slug(label)
    if (list.some(c => c.key === key)) return
    setList([...list, { key, label }]); setInput('')
  }

  return (
    <Card icon={<Tag size={17} />} title={title}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {list.map((c, i) => (
          <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--txt)', background: 'var(--surface-2)', border: '1px solid var(--line-2)', padding: '5px 10px', borderRadius: 999 }}>
            {c.label}
            <button onClick={() => setList(list.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--txt-3)', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0 }}><X size={13} /></button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)} placeholder="เพิ่มหมวดหมู่…"
          onKeyDown={e => { if (e.key === 'Enter') add() }}
          style={{ flex: 1, height: 38, padding: '0 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--txt)', fontSize: 13.5, fontFamily: 'inherit', outline: 'none' }}
        />
        <button onClick={add} style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--gold)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Plus size={18} /></button>
      </div>
      {dirty && (
        <div style={{ marginTop: 12 }}>
          <Btn variant="gold" size="sm" full onClick={() => onSave(list)}><Save size={14} /> บันทึก</Btn>
        </div>
      )}
    </Card>
  )
}

function LineNotifyCard({ value, onSave }: {
  value: { enabled: boolean; groupId: string }
  onSave: (v: { enabled: boolean; groupId: string }) => void
}) {
  const [enabled, setEnabled] = useState(value.enabled)
  const [groupId, setGroupId] = useState(value.groupId)
  const dirty = enabled !== value.enabled || groupId !== value.groupId

  return (
    <Card icon={<Bell size={17} />} title="การแจ้งเตือน LINE">
      <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 16 }}>
        <button
          onClick={() => setEnabled(v => !v)}
          style={{ width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative', background: enabled ? 'var(--gold)' : 'var(--surface-2)', transition: 'background .2s' }}
        >
          <span style={{ position: 'absolute', top: 3, left: enabled ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
        </button>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--txt)' }}>เปิดการแจ้งเตือนผ่าน LINE OA</div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>ส่งแจ้งเตือนผู้แจ้ง/ช่างเมื่อสถานะงานเปลี่ยน</div>
        </div>
      </label>

      <label style={{ display: 'block' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', display: 'block', marginBottom: 5 }}>LINE Group/Room ID (สำหรับแจ้งงานใหม่ให้ผู้จัดการ)</span>
        <input
          value={groupId} onChange={e => setGroupId(e.target.value)} placeholder="C_xxxxxxxxxxxxxxxx"
          style={{ width: '100%', height: 40, padding: '0 13px', borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--txt)', fontSize: 13.5, fontFamily: 'inherit', outline: 'none' }}
        />
      </label>

      {dirty && (
        <div style={{ marginTop: 14 }}>
          <Btn variant="gold" size="sm" onClick={() => onSave({ enabled, groupId })}><Save size={14} /> บันทึกการตั้งค่า</Btn>
        </div>
      )}
    </Card>
  )
}
