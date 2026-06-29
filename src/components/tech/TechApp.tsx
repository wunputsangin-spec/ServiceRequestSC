'use client'
import { useState, useCallback } from 'react'
import { Wrench, Inbox, History } from 'lucide-react'
import { useLiff } from '@/lib/liff'
import { useEmployee, useTechJobStore } from '@/lib/useJobStore'
import { PhoneShell, BottomNav, type NavTab } from '@/components/layout/PhoneShell'
import { Toast } from '@/components/ui/BottomSheet'
import { ChatOverlay } from '@/components/emp/ChatOverlay'
import { MyJobsTab } from './MyJobsTab'
import { QueueTab } from './QueueTab'
import { HistoryTab } from './HistoryTab'
import { TechJobDetail } from './TechJobDetail'

type Screen = 'tabs' | 'detail' | 'chat'

export function TechApp() {
  const { ready, loggedIn, profile } = useLiff()
  const { employee: tech, loading: techLoading } = useEmployee(profile?.lineUid ?? null)
  const store = useTechJobStore(profile?.lineUid ?? null, tech?.id ?? null)

  const [tab, setTab]             = useState('jobs')
  const [screen, setScreen]       = useState<Screen>('tabs')
  const [openJobId, setOpenJobId] = useState<string | null>(null)
  const [toast, setToast]         = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  const openJobDetail = (id: string) => {
    setOpenJobId(id)
    setScreen('detail')
    store.loadChats(id).catch(() => {/* no-op */})
  }
  const goBack = () => { setScreen('tabs'); setOpenJobId(null) }
  const openJob = openJobId ? [...store.myJobs, ...store.queueJobs].find(j => j.id === openJobId) ?? null : null

  // ── Loading ──
  if (!ready || techLoading || store.loading) {
    return (
      <PhoneShell liffTitle="CAO Service · ช่าง">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--gold)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </PhoneShell>
    )
  }

  // ── Tech identity for display — fallback to LIFF profile ──
  const techMeta = {
    id: tech?.id ?? '',
    name: tech?.displayName ?? profile?.displayName ?? 'ช่าง',
    skill: tech?.department ?? 'ช่างซ่อมบำรุง',
    avgRating: 0,
    totalDone: store.doneJobs.length,
    activeJobs: store.myJobs.filter(j => j.status !== 'done').length,
    initial: (tech?.displayName ?? 'ช่').charAt(0),
    load: 0, busy: false,
  }

  // ── Job detail ──
  if (screen === 'detail' && openJob) {
    return (
      <PhoneShell liffTitle="รายละเอียดงาน">
        <TechJobDetail
          job={openJob}
          tech={techMeta}
          allTechs={store.allTechs}
          lineUid={profile?.lineUid ?? ''}
          onBack={goBack}
          onStart={async () => {
            await store.startJob(openJob.id).catch(() => {/* no-op */})
            showToast('เริ่มงานแล้ว')
          }}
          onClose={async (note, before, after) => {
            await store.closeJob(openJob.id, note, before, after).catch(() => {/* no-op */})
            goBack()
            showToast('ปิดงานเรียบร้อย')
          }}
          onForward={async (toTechId) => {
            await store.forwardJob(openJob.id, techMeta.id, toTechId).catch(() => {/* no-op */})
            goBack()
            const toTech = store.allTechs.find(t => t.id === toTechId)
            showToast(`ส่งต่องานให้ ${toTech?.name ?? 'ช่าง'} แล้ว`)
          }}
          onOpenChat={() => setScreen('chat')}
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
              from: 'tech', senderId: techMeta.id,
              senderName: techMeta.name.split(' ')[0], text,
            }).catch(() => {/* no-op */})
          }}
        />
      </PhoneShell>
    )
  }

  // ── Tabs ──
  const tabs: NavTab[] = [
    { key: 'jobs',    label: 'งานของฉัน', icon: <Wrench size={21} /> },
    { key: 'queue',   label: 'คิวงาน',    icon: <Inbox size={21} />,   badge: store.queueJobs.length },
    { key: 'history', label: 'ประวัติ',   icon: <History size={21} /> },
  ]

  return (
    <PhoneShell
      liffTitle="CAO Service · ช่าง"
      footer={<BottomNav tabs={tabs} active={tab} onTab={setTab} />}
    >
      {tab === 'jobs' && (
        <MyJobsTab
          tech={techMeta}
          jobs={store.myJobs.filter(j => j.status !== 'done')}
          onOpenJob={openJobDetail}
        />
      )}
      {tab === 'queue' && (
        <QueueTab
          jobs={store.queueJobs}
          onOpenJob={openJobDetail}
          onClaim={async (jobId) => {
            await store.claimJob(jobId, techMeta.id).catch(() => {/* no-op */})
            showToast('รับงานแล้ว — ดูที่แท็บ "งานของฉัน"')
          }}
        />
      )}
      {tab === 'history' && (
        <HistoryTab
          doneJobs={store.doneJobs}
          avgRating={techMeta.avgRating}
          totalDone={techMeta.totalDone}
          onOpenJob={openJobDetail}
        />
      )}
      {toast && <Toast message={toast} visible />}
    </PhoneShell>
  )
}
