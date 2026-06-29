import { getJob, updateJob, getTechnicianList } from '@/lib/db'

function lineUid(req: Request) { return req.headers.get('x-line-uid') }

// GET /api/jobs/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const job = await getJob(id)
    if (!job) return Response.json({ error: 'ไม่พบงาน' }, { status: 404 })
    return Response.json(job)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// PATCH /api/jobs/[id]
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const uid = lineUid(req)
    if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })
    const { id } = await params
    const body = await req.json()
    const patch: Parameters<typeof updateJob>[1] = {}
    if (body.status       !== undefined) patch.status       = body.status
    if (body.assignees    !== undefined) patch.assignees    = body.assignees
    if (body.closeNote    !== undefined) patch.closeNote    = body.closeNote
    if (body.rating       !== undefined) patch.rating       = body.rating
    if (body.feedback     !== undefined) patch.feedback     = body.feedback
    if (body.beforePhotos !== undefined) patch.beforePhotos = body.beforePhotos
    if (body.afterPhotos  !== undefined) patch.afterPhotos  = body.afterPhotos

    // When assigning techs, compute proper status
    if (patch.assignees !== undefined && !patch.status) {
      const current = await getJob(id)
      if (current?.status === 'approved' && patch.assignees.length > 0) {
        patch.status = 'assigned'
      }
    }

    const job = await updateJob(id, patch)

    // Fire-and-forget: push LINE notification on status change
    if (body.status) {
      const notifyUrl = new URL('/api/notify', req.url).toString()
      fetch(notifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-line-uid': uid },
        body: JSON.stringify({
          event: 'status_change',
          jobId: job.id,
          jobCode: job.code,
          jobTitle: job.title,
          newStatus: body.status,
          requesterLineUid: job.requesterLineUid || (body as Record<string, unknown>).requesterLineUid || '',
          assignees: job.assignees,
        }),
      }).catch(() => {/* non-critical */})

      // Update tech stats when assigning
      if (body.status === 'assigned' || body.assignees !== undefined) {
        await getTechnicianList() // re-compute cached stats if needed
      }
    }

    return Response.json(job)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
