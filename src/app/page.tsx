'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff'
import { apiGetEmployee } from '@/lib/api'

export default function RootPage() {
  const router = useRouter()
  const { ready, loggedIn, profile } = useLiff()

  useEffect(() => {
    if (!ready || !loggedIn || !profile) return

    // ส่งต่อ query (เช่น ?jobId=...&rate=1 จาก deep link ใน LINE) ไปยังหน้าปลายทาง
    const qs = typeof window !== 'undefined' ? window.location.search : ''

    apiGetEmployee(profile.lineUid)
      .then(emp => {
        if (!emp) {
          router.replace(`/emp${qs}`)   // EmpApp handles register gate
          return
        }
        if (emp.role === 'manager')    router.replace(`/manager${qs}`)
        else if (emp.role === 'technician') router.replace(`/technician${qs}`)
        else                           router.replace(`/emp${qs}`)
      })
      .catch(() => router.replace(`/emp${qs}`))
  }, [ready, loggedIn, profile, router])

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--gold)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 14, color: 'var(--txt-3)', fontWeight: 600 }}>กำลังโหลด...</span>
    </div>
  )
}
