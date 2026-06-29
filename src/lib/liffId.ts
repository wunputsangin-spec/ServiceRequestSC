// LIFF ID — ใช้ได้ทั้งฝั่ง client และ server (สำหรับสร้าง deep link ใน LINE notify)
export const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || '2010494943-XKGWxR8Y'

// สร้าง LIFF deep link เปิดแอปไปที่งานที่ระบุ (+ เปิดหน้าให้คะแนนถ้า rate=true)
export function liffJobLink(jobId: string, rate = false): string {
  const params = new URLSearchParams({ jobId })
  if (rate) params.set('rate', '1')
  return `https://liff.line.me/${LIFF_ID}?${params.toString()}`
}
