import { getAllRequests, isTechnician, getTechnicianList, acceptRequest, updateRequestStatus, reassignRequest } from '@/lib/db'

function getLineUid(req: Request): string | null {
  return req.headers.get('x-line-uid')
}

async function guardTech(req: Request) {
  const lineUid = getLineUid(req)
  if (!lineUid) throw new Response(JSON.stringify({ error: 'ไม่ได้ login' }), { status: 401 })
  const ok = await isTechnician(lineUid)
  if (!ok) throw new Response(JSON.stringify({ error: 'ไม่ใช่ช่าง' }), { status: 403 })
  return lineUid
}

// GET /api/tech?filter=pending|in_progress|done|all
export async function GET(req: Request) {
  try {
    const lineUid = await guardTech(req)
    void lineUid
    const url = new URL(req.url)
    const filter = (url.searchParams.get('filter') ?? 'all') as 'pending' | 'in_progress' | 'done' | 'all'
    const [requests, technicians] = await Promise.all([getAllRequests(filter), getTechnicianList()])
    return Response.json({ requests, technicians })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

// POST /api/tech  { action, ticketNo, ...payload }
export async function POST(req: Request) {
  try {
    const lineUid = await guardTech(req)
    const body = await req.json()
    const { action, ticketNo } = body

    if (action === 'accept') {
      await acceptRequest(ticketNo, lineUid)
    } else if (action === 'status') {
      await updateRequestStatus(ticketNo, body.status, {
        beforePhotos: body.beforePhotos,
        afterPhotos: body.afterPhotos,
        adminMessage: body.adminMessage,
        techName: body.techName,
      })
    } else if (action === 'reassign') {
      await reassignRequest(ticketNo, body.newTechLineUid)
    } else {
      return Response.json({ error: 'unknown action' }, { status: 400 })
    }

    return Response.json({ ok: true })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
