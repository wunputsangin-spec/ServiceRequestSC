'use client'
import { useState } from 'react'
import { ArrowRight, User } from 'lucide-react'
import type { Employee } from '@/lib/types'
import { Field, SelectField, TextInput } from '@/components/ui/Field'
import { Btn } from '@/components/ui/Btn'
import { BUILDINGS, FLOORS } from '@/lib/constants'

interface RegisterScreenProps {
  prefill: Pick<Employee, 'displayName' | 'lineAvatar'>
  onRegister: (data: Pick<Employee, 'displayName' | 'employeeCode' | 'department' | 'building' | 'floor' | 'phone'>) => void
}

export function RegisterScreen({ prefill, onRegister }: RegisterScreenProps) {
  const [name, setName] = useState(prefill.displayName)
  const [code, setCode] = useState('')
  const [department, setDepartment] = useState('')
  const [building, setBuilding] = useState<string>(BUILDINGS[0])
  const [floor, setFloor] = useState('')
  const [phone, setPhone] = useState('')

  const valid = name.trim() && code.trim() && department.trim() && floor && phone.trim()

  return (
    <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '26px 20px 28px' }}>
      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          {prefill.lineAvatar
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={prefill.lineAvatar} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover' }} />
            : <span style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'linear-gradient(180deg,#E8C77A,#C2933E)', display: 'grid', placeItems: 'center',
                color: '#161310', boxShadow: '0 10px 24px -8px rgba(221,176,86,.5)',
              }}><User size={36} /></span>}
          <span style={{
            position: 'absolute', right: -3, bottom: 0, width: 24, height: 24, borderRadius: 8,
            background: '#06C755', color: '#fff', display: 'grid', placeItems: 'center',
            fontSize: 12, fontWeight: 800, border: '3px solid var(--bg)', fontFamily: 'system-ui',
          }}>L</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--txt-3)' }}>เชื่อมต่อจาก LINE · {prefill.displayName}</div>
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--txt)' }}>ลงทะเบียนพนักงาน</div>
        <div style={{ fontSize: 13, color: 'var(--txt-3)', marginTop: 5 }}>กรอกข้อมูลเพื่อเริ่มใช้งานระบบ</div>
      </div>

      {/* Form */}
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="ชื่อ-นามสกุล" required>
          <TextInput value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อ-นามสกุล" />
        </Field>
        <Field label="รหัสพนักงาน" required>
          <TextInput value={code} onChange={e => setCode(e.target.value)} placeholder="เช่น 10482" inputMode="numeric" />
        </Field>
        <Field label="แผนก" required>
          <TextInput value={department} onChange={e => setDepartment(e.target.value)} placeholder="เช่น ฝ่ายการตลาด" />
        </Field>
        <Field label="อาคารที่ประจำ" required>
          <SelectField value={building} onChange={setBuilding} options={BUILDINGS.map(b => ({ value: b, label: b }))} />
        </Field>
        <Field label="ชั้นที่ประจำ" required>
          <SelectField value={floor} onChange={setFloor} placeholder="เลือกชั้น" options={FLOORS.map(f => ({ value: f, label: `ชั้น ${f}` }))} />
        </Field>
        <Field label="หมายเลขโทรศัพท์" required>
          <TextInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="08X-XXX-XXXX" type="tel" />
        </Field>

        <Btn variant="gold" size="lg" full disabled={!valid} style={{ marginTop: 4 }}
          onClick={() => onRegister({ displayName: name.trim(), employeeCode: code.trim(), department: department.trim(), building, floor, phone: phone.trim() })}>
          ลงทะเบียน <ArrowRight size={18} />
        </Btn>
      </div>

      <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--txt-3)', marginTop: 16 }}>
        🔒 ข้อมูลของท่านจะถูกเก็บรักษาเป็นความลับ
      </div>
    </div>
  )
}
