// POST /api/notify — LINE Messaging API push notification
// Called server-side only (uses LINE_CHANNEL_ACCESS_TOKEN secret)
import { liffJobLink } from '@/lib/liffId'

const LINE_API = 'https://api.line.me/v2/bot/message/push'
const TOKEN    = process.env.LINE_CHANNEL_ACCESS_TOKEN

const STATUS_TH: Record<string, string> = {
  pending:     'รออนุมัติ',
  approved:    'อนุมัติแล้ว',
  assigned:    'มอบหมายช่างแล้ว',
  in_progress: 'กำลังดำเนินการ',
  done:        'เสร็จสิ้น',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function pushMessages(to: string, messages: any[]) {
  if (!TOKEN || !to) return
  await fetch(LINE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ to, messages }),
  })
}

async function pushLine(to: string, text: string) {
  await pushMessages(to, [{ type: 'text', text }])
}

// ปุ่มลิงก์เปิดแอป (template message)
function linkButton(label: string, url: string, text: string) {
  return {
    type: 'template',
    altText: text,
    template: {
      type: 'buttons',
      text: text.slice(0, 160),
      actions: [{ type: 'uri', label, uri: url }],
    },
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      event: string
      jobId?: string
      jobCode?: string
      jobTitle?: string
      newStatus?: string
      requesterLineUid?: string
      assignees?: string[]
    }

    if (!TOKEN) {
      // No token configured — skip silently
      return Response.json({ ok: true, skipped: 'no token' })
    }

    // Respect admin settings (enabled toggle + group id)
    let notifyEnabled = true
    let settingsGroupId = ''
    try {
      const { getSettings } = await import('@/lib/db')
      const s = await getSettings()
      notifyEnabled = s.line_notify.enabled
      settingsGroupId = s.line_notify.groupId
    } catch {/* settings table may not exist yet — default enabled */}

    if (!notifyEnabled) {
      return Response.json({ ok: true, skipped: 'disabled' })
    }

    if (body.event === 'new_job') {
      const msg = `🆕 มีงานใหม่เข้าคิว · ${body.jobCode}\n${body.jobTitle}\nเปิดแอปเพื่อกดรับงาน`

      // แจ้งกลุ่มผู้จัดการ (ถ้าตั้งค่าไว้)
      const groupId = settingsGroupId || process.env.LINE_MANAGER_GROUP_ID
      if (groupId) {
        await pushLine(groupId, msg)
      }

      // แจ้งช่างทุกคนให้มากดรับงาน
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data: techs } = await supabase
        .from('employees')
        .select('line_uid')
        .eq('role', 'technician')
        .eq('suspended', false)
      for (const row of techs ?? []) {
        await pushLine(row.line_uid as string, msg)
      }
    }

    if (body.event === 'status_change' && body.newStatus) {
      const statusTh = STATUS_TH[body.newStatus] ?? body.newStatus
      const isDone = body.newStatus === 'done'
      const jobId = body.jobId ?? ''

      // ── แจ้งผู้แจ้ง ──
      if (body.requesterLineUid) {
        if (isDone && jobId) {
          // งานเสร็จ → ส่งปุ่มให้คะแนนช่าง (เปิดแอปไปหน้าให้คะแนนทันที)
          const text = `✅ งาน ${body.jobCode} เสร็จเรียบร้อยแล้ว\n${body.jobTitle}\nกรุณาให้คะแนนช่างผู้ดำเนินการ`
          await pushMessages(body.requesterLineUid, [
            linkButton('⭐ ให้คะแนนช่าง', liffJobLink(jobId, true), text),
          ])
        } else {
          const text = `🔔 อัปเดตสถานะงาน ${body.jobCode}\n${body.jobTitle}\nสถานะ: ${statusTh}`
          const messages: object[] = jobId
            ? [linkButton('🔍 ตรวจสอบสถานะ', liffJobLink(jobId), text)]
            : [{ type: 'text', text }]
          await pushMessages(body.requesterLineUid, messages)
        }
      }

      // ── แจ้งช่างที่รับผิดชอบ ──
      if (body.assignees?.length) {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data } = await supabase
          .from('employees')
          .select('line_uid')
          .in('id', body.assignees)
        const text = `🔔 อัปเดตสถานะงาน ${body.jobCode}\n${body.jobTitle}\nสถานะ: ${statusTh}`
        const messages: object[] = jobId
          ? [linkButton('🔍 เปิดงาน', liffJobLink(jobId), text)]
          : [{ type: 'text', text }]
        for (const row of data ?? []) {
          await pushMessages(row.line_uid as string, messages)
        }
      }
    }

    return Response.json({ ok: true })
  } catch (err) {
    // Notification failures must not break the main flow
    console.error('notify error', err)
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
