import { redirect } from 'next/navigation'

// Legacy route — แอปใหม่เข้าผ่าน root (/) ที่ route ตาม role
export default function LegacyRedirect() {
  redirect('/')
}
