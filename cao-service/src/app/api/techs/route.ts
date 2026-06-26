import { getTechnicianList } from '@/lib/db'

// GET /api/techs
export async function GET(req: Request) {
  try {
    const uid = req.headers.get('x-line-uid')
    if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const techs = await getTechnicianList()
    return Response.json(techs)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
