// Legacy route — superseded by /api/jobs. Kept for backward compat.
import { getAllRequests, isTechnician, getTechnicianList } from '@/lib/db'

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

export async function GET(req: Request) {
  try {
    await guardTech(req)
    const [requests, technicians] = await Promise.all([getAllRequests(), getTechnicianList()])
    return Response.json({ requests, technicians })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await guardTech(req)
    return Response.json({ ok: true, message: 'ใช้ /api/jobs แทน' })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
