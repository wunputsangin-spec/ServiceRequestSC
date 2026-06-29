import { getSettings } from '@/lib/db'

// GET /api/settings — read-only, used by forms (buildings/floors/categories)
export async function GET(req: Request) {
  try {
    const uid = req.headers.get('x-line-uid')
    if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const settings = await getSettings()
    return Response.json(settings)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
