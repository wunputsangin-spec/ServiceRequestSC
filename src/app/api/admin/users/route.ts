import { listEmployees, adminUpdateEmployee, adminDeleteEmployee, getEmployee } from '@/lib/db'

function lineUid(req: Request) { return req.headers.get('x-line-uid') }

// Guard: only manager (admin) can manage users
async function guardAdmin(req: Request): Promise<Response | null> {
  const uid = lineUid(req)
  if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
  const emp = await getEmployee(uid)
  if (emp?.role !== 'manager') return Response.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
  return null
}

// GET /api/admin/users
export async function GET(req: Request) {
  try {
    const denied = await guardAdmin(req)
    if (denied) return denied
    const users = await listEmployees()
    return Response.json(users)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// PATCH /api/admin/users  { id, ...patch }
export async function PATCH(req: Request) {
  try {
    const denied = await guardAdmin(req)
    if (denied) return denied
    const body = await req.json()
    const { id, ...patch } = body
    if (!id) return Response.json({ error: 'ต้องระบุ id' }, { status: 400 })
    const updated = await adminUpdateEmployee(id, patch)
    return Response.json(updated)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// DELETE /api/admin/users  { id }
export async function DELETE(req: Request) {
  try {
    const denied = await guardAdmin(req)
    if (denied) return denied
    const { id } = await req.json()
    if (!id) return Response.json({ error: 'ต้องระบุ id' }, { status: 400 })
    await adminDeleteEmployee(id)
    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
