import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    // Simple connectivity test — list tables via system catalog
    const { error } = await supabase.from('repair_requests').select('count').limit(0)

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table not found, which is OK at this stage
      return Response.json({ ok: false, error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true, url: process.env.NEXT_PUBLIC_SUPABASE_URL })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
