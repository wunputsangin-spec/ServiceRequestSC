import { withSupabase } from '@supabase/server'

// GET /api/requests — ดึงรายการคำร้องของพนักงานที่ login อยู่ (RLS-scoped)
export const GET = withSupabase({ auth: 'user' }, async (_req, ctx) => {
  const { data, error } = await ctx.supabase
    .from('repair_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
})

// POST /api/requests — สร้างคำร้องใหม่
export const POST = withSupabase({ auth: 'user' }, async (req, ctx) => {
  const body = await req.json()

  const { data, error } = await ctx.supabase
    .from('repair_requests')
    .insert(body)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
})
