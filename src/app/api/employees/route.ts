import { getEmployee, upsertEmployee } from '@/lib/db'

function getLineUid(req: Request): string | null {
  return req.headers.get('x-line-uid')
}

// GET /api/employees
export async function GET(req: Request) {
  try {
    const lineUid = getLineUid(req)
    if (!lineUid) return Response.json(null, { status: 401 })
    const employee = await getEmployee(lineUid)
    if (!employee) return Response.json(null, { status: 404 })
    return Response.json(employee)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// POST /api/employees  (ลงทะเบียน)
export async function POST(req: Request) {
  try {
    const lineUid = getLineUid(req)
    if (!lineUid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const body = await req.json()
    const employee = await upsertEmployee(lineUid, body)
    return Response.json(employee, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
