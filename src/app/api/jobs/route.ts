import { getJobs, createJob, getEmployee } from '@/lib/db'

function lineUid(req: Request) { return req.headers.get('x-line-uid') }

// GET /api/jobs
export async function GET(req: Request) {
  try {
    const uid = lineUid(req)
    if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const url = new URL(req.url)
    const scope = url.searchParams.get('scope') // 'mine' | 'all'
    const techId = url.searchParams.get('techId') ?? undefined
    const opts = scope === 'mine' ? { lineUid: uid } : techId ? { techId } : undefined
    const jobs = await getJobs(opts)
    return Response.json(jobs)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// POST /api/jobs
export async function POST(req: Request) {
  try {
    const uid = lineUid(req)
    if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const emp = await getEmployee(uid)
    if (!emp) return Response.json({ error: 'ยังไม่ได้ลงทะเบียน' }, { status: 401 })
    const body = await req.json()
    const job = await createJob(uid, {
      type: body.type,
      category: body.category,
      title: body.title,
      building: body.building,
      floor: body.floor,
      location: body.location,
      urgency: body.urgency,
      description: body.description,
      slotDate: body.slotDate,
      slotTime: body.slotTime,
      requesterId: emp.id,
      requesterName: emp.displayName,
      photos: body.photos ?? [],
    })

    // Fire-and-forget: notify manager via LINE OA
    const notifyUrl = new URL('/api/notify', req.url).toString()
    fetch(notifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-line-uid': uid },
      body: JSON.stringify({ event: 'new_job', jobCode: job.code, jobTitle: job.title }),
    }).catch(() => {/* non-critical */})

    return Response.json(job, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
