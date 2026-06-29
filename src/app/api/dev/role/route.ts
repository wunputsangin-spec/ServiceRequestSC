import { adminUpdateEmployee, getEmployee } from '@/lib/db'
import { DEV_LINE_UID } from '@/lib/dev'

// POST /api/dev/role  { role }
// อนุญาตเฉพาะ DEV_LINE_UID เปลี่ยน role ของตัวเองได้ (สำหรับทดสอบ)
export async function POST(req: Request) {
  try {
    const uid = req.headers.get('x-line-uid')
    if (uid !== DEV_LINE_UID) {
      return Response.json({ error: 'ไม่มีสิทธิ์' }, { status: 403 })
    }
    const { role } = await req.json()
    if (!['employee', 'technician', 'manager'].includes(role)) {
      return Response.json({ error: 'role ไม่ถูกต้อง' }, { status: 400 })
    }
    const emp = await getEmployee(uid)
    if (!emp) return Response.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 })
    const updated = await adminUpdateEmployee(emp.id, { role })
    return Response.json(updated)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
