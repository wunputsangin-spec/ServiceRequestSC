import { createClient } from '@/lib/supabase/server'

// POST /api/upload
// multipart/form-data: file (File), bucket (string, default 'photos')
export async function POST(req: Request) {
  try {
    const uid = req.headers.get('x-line-uid')
    if (!uid) return Response.json({ error: 'ไม่ได้ login' }, { status: 401 })

    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return Response.json({ error: 'ไม่พบไฟล์' }, { status: 400 })

    const bucket = (form.get('bucket') as string) || 'photos'
    const ext    = file.name.split('.').pop() ?? 'jpg'
    const path   = `${uid}/${Date.now()}.${ext}`

    const supabase = await createClient()
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false })
    if (error) throw new Error(error.message)

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path)
    return Response.json({ url: pub.publicUrl })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
