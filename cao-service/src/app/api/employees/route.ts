import { getEmployee, upsertEmployee, DEV_LINE_UID } from '@/lib/db'

function getLineUid(_req: Request): string {
  return DEV_LINE_UID
}

// GET /api/employees/me
export async function GET(req: Request) {
  try {
    const lineUid = getLineUid(req)
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
    const body = await req.json()
    const employee = await upsertEmployee(lineUid, body)
    return Response.json(employee, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
