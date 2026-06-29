'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Home, ClipboardList, Bell, User } from 'lucide-react'
import { useLiff } from '@/lib/liff'
import { useEmployee, useEmpJobStore } from '@/lib/useJobStore'
import { apiUpsertEmployee } from '@/lib/api'
import type { Employee } from '@/lib/types'
import { PhoneShell, BottomNav, type NavTab } from '@/components/layout/PhoneShell'
import { Toast } from '@/components/ui/BottomSheet'
import { HomeTab } from './HomeTab'
import { JobsTab } from './JobsTab'
import { NotiTab } from './NotiTab'
import { ProfileTab } from './ProfileTab'
import { RequestForm } from './RequestForm'
import { JobDetail } from './JobDetail'
import { ChatOverlay } from './ChatOverlay'
import { RatingSheet } from './RatingSheet'
import { RegisterScreen } from './RegisterScreen'

type Screen = 'tabs' | 'form' | 'detail' | 'chat'

export function EmpApp() {
  const { ready, loggedIn, profile } = useLiff()
  const { employee, setEmployee, loading: empLoading } = useEmployee(profile?.lineUid ?? null)

  const store = useEmpJobStore(profile?.lineUid ?? null, employee?.id ?? null)

  const [tab, setTab]             = useState('home')
  const [screen, setScreen]       = useState<Screen>('tabs')
  const [openJobId, setOpenJobId] = useState<string | null>(null)
  const [rating, setRating]       = useState(false)
  const [toast, setToast]         = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  const goBackToTabs = () => { setScreen('tabs'); setOpenJobId(null) }
  const openJobDetail = (id: string) => {
    setOpenJobId(id)
    setScreen('detail')
    // Lazy-load chats when opening job detail
    store.loadChats(id).catch(() => {/* no-op */})
  }
  const openJob = openJobId ? store.jobs.find(j => j.id === openJobId) ?? null : null

  // ── Deep link จาก LINE: ?jobId=...&rate=1 → เปิดงาน + หน้าให้คะแนน ──
  const deepLinkDone = useRef(false)
  useEffect(() => {
    if (deepLinkDone.current || !employee || store.loading) return
    const params = new URLSearchParams(window.location.search)
    const jobId = params.get('jobId')
    if (!jobId) return
    const job = store.jobs.find(j => j.id === jobId)
    if (!job) return
    deepLinkDone.current = true
    setOpenJobId(jobId)
    setScreen('detail')
    store.loadChats(jobId).catch(() => {/* no-op */})
    // ถ้ามาจากปุ่มให้คะแนน และงานเสร็จแล้วยังไม่ได้ให้คะแนน → เปิดหน้าให้คะแนน
    if (params.get('rate') === '1' && job.status === 'done' && job.rating == null) {
      setRating(true)
    }
    // เคลียร์ query ออกจาก URL (กันเปิดซ้ำ)
    window.history.replaceState(null, '', window.location.pathname)
  }, [employee, store.loading, store.jobs, store])

  // ── Loading ──
  if (!ready || empLoading) {
    return (
      <PhoneShell liffTitle="CAO Service">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--gold)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 13, color: 'var(--txt-3)' }}>กำลังโหลด...</span>
        </div>
      </PhoneShell>
    )
  }

  // ── Register gate ──
  if (!loggedIn || !profile || !employee) {
    return (
      <PhoneShell liffTitle="ลงทะเบียน">
        <RegisterScreen
          prefill={{ displayName: profile?.displayName ?? '', lineAvatar: profile?.pictureUrl ?? null }}
          onRegister={async (data) => {
            try {
              const emp = await apiUpsertEmployee(profile?.lineUid ?? '', {
                ...data,
                displayName: profile?.displayName ?? data.displayName ?? '',
                lineAvatar: profile?.pictureUrl ?? null,
              })
              setEmployee(emp)
              setTab('home')
              showToast('ลงทะเบียนสำเร็จ')
            } catch (err) {
              showToast('เกิดข้อผิดพลาด: ' + String(err))
            }
          }}
        />
        {toast && <Toast message={toast} visible />}
      </PhoneShell>
    )
  }

  // ── Form ──
  if (screen === 'form') {
    return (
      <PhoneShell liffTitle="สร้างคำขอ">
        <RequestForm
          employee={employee}
          onBack={goBackToTabs}
          onSubmit={async (payload) => {
            try {
              const job = await store.submitJob(payload)
              setScreen('tabs')
              setTab('jobs')
              showToast(`ส่งคำขอแล้ว · ${job.code}`)
            } catch {
              showToast('ส่งคำขอไม่สำเร็จ กรุณาลองใหม่')
            }
          }}
        />
        {toast && <Toast message={toast} visible />}
      </PhoneShell>
    )
  }

  // ── Job detail ──
  if (screen === 'detail' && openJob) {
    return (
      <PhoneShell liffTitle="รายละเอียดงาน">
        <JobDetail
          job={openJob}
          techs={store.techs}
          onBack={goBackToTabs}
          onOpenChat={() => setScreen('chat')}
          onRate={() => setRating(true)}
        />
        <RatingSheet
          open={rating}
          techNames={openJob.assignees.map(id => store.techs.find(t => t.id === id)?.name).filter(Boolean).join(', ')}
          onClose={() => setRating(false)}
          onSubmit={async (r, fb) => {
            await store.rateJob(openJob.id, r, fb).catch(() => {/* no-op */})
            setRating(false)
            showToast('ขอบคุณสำหรับคะแนน')
          }}
        />
        {toast && <Toast message={toast} visible />}
      </PhoneShell>
    )
  }

  // ── Chat ──
  if (screen === 'chat' && openJob) {
    return (
      <PhoneShell liffTitle="แชท">
        <ChatOverlay
          job={openJob}
          onClose={() => setScreen('detail')}
          onSend={async (text) => {
            await store.sendChat(openJob.id, {
              from: 'employee', senderId: employee.id, senderName: employee.displayName.split(' ')[0], text,
            }).catch(() => {/* no-op */})
          }}
        />
      </PhoneShell>
    )
  }

  // ── Tabs ──
  const tabs: NavTab[] = [
    { key: 'home',    label: 'หน้าหลัก',  icon: <Home size={21} /> },
    { key: 'jobs',    label: 'งานของฉัน', icon: <ClipboardList size={21} /> },
    { key: 'noti',    label: 'แจ้งเตือน', icon: <Bell size={21} />, badge: store.unread },
    { key: 'profile', label: 'โปรไฟล์',  icon: <User size={21} /> },
  ]

  const doneCount = store.jobs.filter(j => j.status === 'done').length

  return (
    <PhoneShell
      liffTitle="CAO Service"
      footer={<BottomNav tabs={tabs} active={tab} onTab={setTab} />}
    >
      {tab === 'home' && (
        <HomeTab
          employee={employee}
          jobs={store.jobs}
          onNew={() => setScreen('form')}
          onOpenJob={openJobDetail}
          onSeeAll={() => setTab('jobs')}
        />
      )}
      {tab === 'jobs' && <JobsTab jobs={store.jobs} onOpenJob={openJobDetail} />}
      {tab === 'noti' && (
        <NotiTab
          notifications={store.notifications}
          onOpenJob={openJobDetail}
          onMarkAllRead={() => store.markAllRead()}
        />
      )}
      {tab === 'profile' && (
        <ProfileTab
          employee={employee}
          doneCount={doneCount}
          onLogout={() => { setEmployee(null) }}
        />
      )}
      {toast && <Toast message={toast} visible />}
    </PhoneShell>
  )
}
