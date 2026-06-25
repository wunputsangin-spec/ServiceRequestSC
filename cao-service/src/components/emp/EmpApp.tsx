'use client'
import { useState, useMemo, useCallback } from 'react'
import { Home, ClipboardList, Bell, User } from 'lucide-react'
import { getStore } from '@/lib/store'
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
  const store = getStore()
  const [, force] = useState(0)
  const bump = useCallback(() => force(v => v + 1), [])

  // Registration: start from seeded employee; "logout" clears it to show register.
  const [employee, setEmployee] = useState<Employee | null>(() => store.getCurrentEmployee())
  const [tab, setTab] = useState('home')
  const [screen, setScreen] = useState<Screen>('tabs')
  const [openJobId, setOpenJobId] = useState<string | null>(null)
  const [rating, setRating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  const jobs = useMemo(
    () => (employee ? store.getJobsByEmployee(employee.id) : []),
    [employee, store, force], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const techs = store.getTechs()
  const notifications = employee ? store.getNotifications(employee.id) : []
  const unread = store.getUnreadCount()
  const openJob = openJobId ? store.getJob(openJobId) : null

  // ── Register gate ──
  if (!employee) {
    return (
      <PhoneShell liffTitle="ลงทะเบียน">
        <RegisterScreen
          prefill={{ displayName: 'สมชาย ใจดี', lineAvatar: null }}
          onRegister={(data) => {
            const emp = store.getCurrentEmployee()
            Object.assign(emp, data, { isRegistered: true })
            setEmployee({ ...emp })
            setTab('home')
            showToast('ลงทะเบียนสำเร็จ')
          }}
        />
      </PhoneShell>
    )
  }

  const goBackToTabs = () => { setScreen('tabs'); setOpenJobId(null) }
  const openJobDetail = (id: string) => { setOpenJobId(id); setScreen('detail') }

  // ── Overlay screens ──
  if (screen === 'form') {
    return (
      <PhoneShell liffTitle="สร้างคำขอ">
        <RequestForm
          employee={employee}
          onBack={goBackToTabs}
          onSubmit={(payload) => {
            const job = store.submitJob(payload)
            bump()
            setScreen('tabs')
            setTab('jobs')
            showToast(`ส่งคำขอแล้ว · ${job.code}`)
          }}
        />
        {toast && <Toast message={toast} visible />}
      </PhoneShell>
    )
  }

  if (screen === 'detail' && openJob) {
    return (
      <PhoneShell liffTitle="รายละเอียดงาน">
        <JobDetail
          job={openJob}
          techs={techs}
          onBack={goBackToTabs}
          onOpenChat={() => setScreen('chat')}
          onRate={() => setRating(true)}
        />
        <RatingSheet
          open={rating}
          techNames={openJob.assignees.map(id => techs.find(t => t.id === id)?.name).filter(Boolean).join(', ')}
          onClose={() => setRating(false)}
          onSubmit={(r, fb) => {
            store.rateJob(openJob.id, r, fb)
            bump()
            setRating(false)
            showToast('ขอบคุณสำหรับคะแนน')
          }}
        />
        {toast && <Toast message={toast} visible />}
      </PhoneShell>
    )
  }

  if (screen === 'chat' && openJob) {
    return (
      <PhoneShell liffTitle="แชท">
        <ChatOverlay
          job={openJob}
          onClose={() => setScreen('detail')}
          onSend={(text) => {
            store.sendChat(openJob.id, {
              from: 'employee', senderId: employee.id, senderName: employee.displayName.split(' ')[0],
              text, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
            })
            bump()
          }}
        />
      </PhoneShell>
    )
  }

  // ── Tab screens ──
  const tabs: NavTab[] = [
    { key: 'home', label: 'หน้าหลัก', icon: <Home size={21} /> },
    { key: 'jobs', label: 'งานของฉัน', icon: <ClipboardList size={21} /> },
    { key: 'noti', label: 'แจ้งเตือน', icon: <Bell size={21} />, badge: unread },
    { key: 'profile', label: 'โปรไฟล์', icon: <User size={21} /> },
  ]

  const doneCount = jobs.filter(j => j.status === 'done').length

  return (
    <PhoneShell
      liffTitle="CAO Service"
      footer={<BottomNav tabs={tabs} active={tab} onTab={setTab} />}
    >
      {tab === 'home' && (
        <HomeTab
          employee={employee}
          jobs={jobs}
          onNew={() => setScreen('form')}
          onOpenJob={openJobDetail}
          onSeeAll={() => setTab('jobs')}
        />
      )}
      {tab === 'jobs' && <JobsTab jobs={jobs} onOpenJob={openJobDetail} />}
      {tab === 'noti' && (
        <NotiTab
          notifications={notifications}
          onOpenJob={openJobDetail}
          onMarkAllRead={() => { store.markAllRead(employee.id); bump() }}
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
