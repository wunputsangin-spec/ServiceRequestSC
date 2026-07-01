'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search, Pencil, Trash2, Ban, CircleCheck, Shield, Wrench, User as UserIcon, X } from 'lucide-react'
import type { Employee } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'
import { Btn } from '@/components/ui/Btn'
import { apiListUsers, apiUpdateUser, apiDeleteUser, type AppSettings } from '@/lib/api'
import { ExportButton } from './ExportButton'

const ROLE_META: Record<string, { label: string; color: string; Icon: typeof Shield }> = {
  manager:    { label: 'ผู้จัดการ', color: '#DDB056', Icon: Shield },
  technician: { label: 'ช่าง',       color: '#46BFA6', Icon: Wrench },
  employee:   { label: 'พนักงาน',   color: '#8A8F99', Icon: UserIcon },
}

const ROLE_FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'employee', label: 'พนักงาน' },
  { key: 'technician', label: 'ช่าง' },
  { key: 'manager', label: 'ผู้จัดการ' },
]

interface AdminUsersPageProps {
  lineUid: string
  settings: AppSettings | null
  onToast: (msg: string) => void
}

export function AdminUsersPage({ lineUid, settings, onToast }: AdminUsersPageProps) {
  const [users, setUsers] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('all')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<Employee | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    apiListUsers(lineUid)
      .then(u => { setUsers(u); setLoading(false) })
      .catch(() => setLoading(false))
  }, [lineUid])

  useEffect(() => { reload() }, [reload])

  const rows = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (q && !(`${u.displayName} ${u.employeeCode} ${u.department} ${u.phone}`.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  const saveUser = async (id: string, patch: Partial<Employee>) => {
    try {
      const updated = await apiUpdateUser(lineUid, id, patch as never)
      setUsers(prev => prev.map(u => u.id === id ? updated : u))
      setEditing(null)
      onToast('บันทึกข้อมูลผู้ใช้แล้ว')
    } catch {
      onToast('บันทึกไม่สำเร็จ')
    }
  }

  const toggleSuspend = async (u: Employee) => {
    try {
      const updated = await apiUpdateUser(lineUid, u.id, { suspended: !u.suspended })
      setUsers(prev => prev.map(x => x.id === u.id ? updated : x))
      onToast(updated.suspended ? 'ระงับผู้ใช้แล้ว' : 'เปิดใช้งานผู้ใช้แล้ว')
    } catch {
      onToast('ดำเนินการไม่สำเร็จ')
    }
  }

  const removeUser = async (u: Employee) => {
    if (!confirm(`ลบผู้ใช้ "${u.displayName}" ถาวร? การกระทำนี้ย้อนกลับไม่ได้`)) return
    try {
      await apiDeleteUser(lineUid, u.id)
      setUsers(prev => prev.filter(x => x.id !== u.id))
      onToast('ลบผู้ใช้แล้ว')
    } catch {
      onToast('ลบไม่สำเร็จ')
    }
  }

  const exportRows = rows.map(u => ({
    'ชื่อ-นามสกุล': u.displayName,
    'รหัสพนักงาน': u.employeeCode,
    'แผนก/ตำแหน่ง': u.department,
    'อาคาร': u.building,
    'ชั้น': u.floor,
    'เบอร์โทร': u.phone,
    'บทบาท': (ROLE_META[u.role] ?? ROLE_META.employee).label,
    'สถานะ': u.suspended ? 'ระงับ' : 'ใช้งาน',
  }))

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>จัดการผู้ใช้งาน</h1>
          <p style={{ fontSize: 13.5, color: 'var(--txt-3)', marginTop: 4 }}>ผู้ใช้ทั้งหมด {users.length} คน · แสดง {rows.length} รายการ</p>
        </div>
        <ExportButton filename="รายชื่อผู้ใช้งาน" sheetName="Users" rows={exportRows} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)' }} />
          <input
            value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาชื่อ / รหัส / แผนก / เบอร์…"
            style={{ width: '100%', height: 40, padding: '0 14px 0 38px', borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--txt)', fontSize: 13.5, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {ROLE_FILTERS.map(f => (
            <button key={f.key} onClick={() => setRoleFilter(f.key)} style={chip(roleFilter === f.key)}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['ผู้ใช้', 'รหัส', 'แผนก', 'อาคาร / ชั้น', 'บทบาท', 'สถานะ', ''].map((h, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt-3)' }}>กำลังโหลด…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt-3)' }}>ไม่พบผู้ใช้</td></tr>}
            {rows.map(u => {
              const rm = ROLE_META[u.role] ?? ROLE_META.employee
              return (
                <tr key={u.id} style={{ borderTop: '1px solid var(--line)', opacity: u.suspended ? 0.55 : 1 }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={u.displayName} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--txt)' }}>{u.displayName}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--txt-3)' }}>{u.phone || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--txt-2)' }} className="num">{u.employeeCode || '—'}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--txt-2)' }}>{u.department || '—'}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--txt-2)', whiteSpace: 'nowrap' }}>{u.building ? `${u.building} · ชั้น ${u.floor}` : '—'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: rm.color, background: `color-mix(in srgb,${rm.color} 13%,transparent)`, padding: '4px 10px', borderRadius: 999 }}>
                      <rm.Icon size={12} /> {rm.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {u.suspended
                      ? <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--st-urgent)' }}>● ระงับ</span>
                      : <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--st-done)' }}>● ใช้งาน</span>}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <IconBtn title="แก้ไข" onClick={() => setEditing(u)}><Pencil size={15} /></IconBtn>
                      <IconBtn title={u.suspended ? 'เปิดใช้งาน' : 'ระงับ'} onClick={() => toggleSuspend(u)}>
                        {u.suspended ? <CircleCheck size={15} color="var(--st-done)" /> : <Ban size={15} color="var(--st-urgent)" />}
                      </IconBtn>
                      <IconBtn title="ลบ" onClick={() => removeUser(u)}><Trash2 size={15} color="var(--st-urgent)" /></IconBtn>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditUserDialog
          user={editing}
          settings={settings}
          onClose={() => setEditing(null)}
          onSave={(patch) => saveUser(editing.id, patch)}
        />
      )}
    </>
  )
}

function EditUserDialog({ user, settings, onClose, onSave }: {
  user: Employee
  settings: AppSettings | null
  onClose: () => void
  onSave: (patch: Partial<Employee>) => void
}) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [employeeCode, setEmployeeCode] = useState(user.employeeCode)
  const [department, setDepartment] = useState(user.department)
  const [building, setBuilding] = useState(user.building)
  const [floor, setFloor] = useState(user.floor)
  const [phone, setPhone] = useState(user.phone)
  const [role, setRole] = useState(user.role)

  const buildings = settings?.buildings ?? []
  const floors = settings?.floors ?? []

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(8,8,10,.6)', backdropFilter: 'blur(3px)', display: 'grid', placeItems: 'center', padding: 20 }} className="animate-fadein">
      <div onClick={e => e.stopPropagation()} style={{ width: 460, maxWidth: '94vw', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 18 }} className="scrollbar-hide animate-popin">
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', padding: '18px 22px 14px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--txt)' }}>แก้ไขข้อมูลผู้ใช้</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--txt-3)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <DInput label="ชื่อ-นามสกุล" value={displayName} onChange={setDisplayName} />
          <DInput label="รหัสพนักงาน" value={employeeCode} onChange={setEmployeeCode} />
          <DInput label="แผนก / ตำแหน่ง" value={department} onChange={setDepartment} />
          <div style={{ display: 'flex', gap: 12 }}>
            <DSelect label="อาคาร" value={building} onChange={setBuilding} options={building && !buildings.includes(building) ? [building, ...buildings] : buildings} />
            <DSelect label="ชั้น" value={floor} onChange={setFloor} options={floor && !floors.includes(floor) ? [floor, ...floors] : floors} />
          </div>
          <DInput label="เบอร์โทร" value={phone} onChange={setPhone} />
          <DSelect label="บทบาท" value={role} onChange={(v) => setRole(v as Employee['role'])} options={['employee', 'technician', 'manager']} labels={{ employee: 'พนักงาน', technician: 'ช่าง', manager: 'ผู้จัดการ' }} />
        </div>
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '14px 22px', display: 'flex', gap: 10 }}>
          <Btn variant="dark" size="md" full onClick={onClose}>ยกเลิก</Btn>
          <Btn variant="gold" size="md" full onClick={() => onSave({ displayName, employeeCode, department, building, floor, phone, role })}>บันทึก</Btn>
        </div>
      </div>
    </div>
  )
}

function DInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', display: 'block', marginBottom: 5 }}>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', height: 42, padding: '0 13px', borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--txt)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
    </label>
  )
}

function DSelect({ label, value, onChange, options, labels }: { label: string; value: string; onChange: (v: string) => void; options: string[]; labels?: Record<string, string> }) {
  return (
    <label style={{ display: 'block', flex: 1 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', display: 'block', marginBottom: 5 }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', height: 42, padding: '0 13px', borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--txt)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}>
        {options.map(o => <option key={o} value={o}>{labels?.[o] ?? o}</option>)}
      </select>
    </label>
  )
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--surface-2)', border: '1px solid var(--line-2)', color: 'var(--txt-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
      {children}
    </button>
  )
}

function chip(active: boolean): React.CSSProperties {
  return {
    height: 34, padding: '0 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap',
    background: active ? 'linear-gradient(180deg,#E8C77A,#DDB056)' : 'var(--surface-2)',
    color: active ? '#161310' : 'var(--txt-2)',
    border: `1px solid ${active ? 'transparent' : 'var(--line-2)'}`,
  }
}
