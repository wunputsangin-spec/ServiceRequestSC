import { getJobChats, addJobChat } from '@/lib/db'

function lineUid(req: Request) { return req.headers.get('x-line-uid') }

// GET /api/jobs/[id]/chat
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const msgs = await getJobChats(id)
    return Response.json(msgs)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// POST /api/jobs/[id]/chat
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const uid = lineUid(req)
    if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const { id } = await params
    const body = await req.json()
    const msg = await addJobChat(id, {
      from: body.from,
      senderId: body.senderId,
      senderName: body.senderName,
      text: body.text,
    })
    return Response.json(msg, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
