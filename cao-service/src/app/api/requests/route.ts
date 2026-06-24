import { getRepairRequests, createRepairRequest, rateRepairRequest, getEmployee } from '@/lib/db'

function getLineUid(req: Request): string | null {
  return req.headers.get('x-line-uid')
}

// GET /api/requests
export async function GET(req: Request) {
  try {
    const lineUid = getLineUid(req)
    if (!lineUid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const data = await getRepairRequests(lineUid)
    return Response.json(data)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// POST /api/requests
export async function POST(req: Request) {
  try {
    const lineUid = getLineUid(req)
    if (!lineUid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })

    const employee = await getEmployee(lineUid)
    if (!employee) return Response.json({ error: 'ยังไม่ได้ลงทะเบียน' }, { status: 401 })

    const supabase = await import('@/lib/supabase/server').then(m => m.createClient())
    const { data: emp } = await supabase.from('employees').select('id').eq('line_uid', lineUid).single()
    if (!emp) return Response.json({ error: 'ไม่พบข้อมูลพนักงาน' }, { status: 404 })

    const body = await req.json()
    const request = await createRepairRequest(lineUid, emp.id, body)
    return Response.json(request, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// PATCH /api/requests  (rating)
export async function PATCH(req: Request) {
  try {
    const lineUid = getLineUid(req)
    if (!lineUid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const { ticketNo, rating } = await req.json()
    await rateRepairRequest(lineUid, ticketNo, rating)
    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
