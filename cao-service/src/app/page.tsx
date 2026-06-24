'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLiff } from '@/lib/liff'
import { apiFetch } from '@/lib/api'

export default function RootPage() {
  const router = useRouter()
  const { ready, loggedIn, profile } = useLiff()

  useEffect(() => {
    if (!ready || !loggedIn || !profile) return

    apiFetch(profile.lineUid, '/api/employees')
      .then(res => {
        if (res.status === 404) {
          router.replace('/register')
        } else {
          router.replace('/home')
        }
      })
      .catch(() => router.replace('/home'))
  }, [ready, loggedIn, profile, router])

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 600 }}>กำลังโหลด...</span>
    </div>
  )
}
