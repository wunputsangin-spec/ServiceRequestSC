import { getSettings, updateSetting, getEmployee } from '@/lib/db'

function lineUid(req: Request) { return req.headers.get('x-line-uid') }

async function guardAdmin(req: Request): Promise<Response | null> {
  const uid = lineUid(req)
  if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
  const emp = await getEmployee(uid)
  if (emp?.role !== 'manager') return Response.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 })
  return null
}

// GET /api/admin/settings
export async function GET(req: Request) {
  try {
    const denied = await guardAdmin(req)
    if (denied) return denied
    const settings = await getSettings()
    return Response.json(settings)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// PUT /api/admin/settings  { key, value }
export async function PUT(req: Request) {
  try {
    const denied = await guardAdmin(req)
    if (denied) return denied
    const { key, value } = await req.json()
    const allowed = ['buildings', 'floors', 'repair_categories', 'service_categories', 'line_notify']
    if (!allowed.includes(key)) return Response.json({ error: 'key ไม่ถูกต้อง' }, { status: 400 })
    await updateSetting(key, value)
    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
