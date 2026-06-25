'use client'
import { useState, useMemo, useCallback } from 'react'
import { Wrench, Inbox, History } from 'lucide-react'
import { getStore } from '@/lib/store'
import { PhoneShell, BottomNav, type NavTab } from '@/components/layout/PhoneShell'
import { Toast } from '@/components/ui/BottomSheet'
import { ChatOverlay } from '@/components/emp/ChatOverlay'
import { MyJobsTab } from './MyJobsTab'
import { QueueTab } from './QueueTab'
import { HistoryTab } from './HistoryTab'
import { TechJobDetail } from './TechJobDetail'

type Screen = 'tabs' | 'detail' | 'chat'

export function TechApp() {
  const store = getStore()
  const [, force] = useState(0)
  const bump = useCallback(() => force(v => v + 1), [])

  const tech = store.getCurrentTech()   // วิชัย มั่นคง (t1)
  const [tab, setTab] = useState('jobs')
  const [screen, setScreen] = useState<Screen>('tabs')
  const [openJobId, setOpenJobId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  const myJobs = useMemo(() => store.getJobsByTech(tech.id), [tech.id, store, force]) // eslint-disable-line react-hooks/exhaustive-deps
  const queueJobs = useMemo(() => store.getApprovedJobs(), [store, force]) // eslint-disable-line react-hooks/exhaustive-deps
  const doneJobs = myJobs.filter(j => j.status === 'done')
  const allTechs = store.getTechs()
  const openJob = openJobId ? store.getJob(openJobId) : null

  const openJobDetail = (id: string) => { setOpenJobId(id); setScreen('detail') }
  const goBack = () => { setScreen('tabs'); setOpenJobId(null) }

  // ── Job detail ──
  if (screen === 'detail' && openJob) {
    return (
      <PhoneShell liffTitle="รายละเอียดงาน">
        <TechJobDetail
          job={openJob}
          tech={tech}
          allTechs={allTechs}
          onBack={goBack}
          onStart={() => {
            store.startJob(openJob.id)
            bump()
            showToast('เริ่มงานแล้ว')
          }}
          onClose={(note, before, after) => {
            store.closeJob(openJob.id, note, before, after)
            bump()
            goBack()
            showToast('ปิดงานเรียบร้อย')
          }}
          onForward={(toTechId) => {
            store.forwardJob(openJob.id, tech.id, toTechId)
            bump()
            goBack()
            const toTech = allTechs.find(t => t.id === toTechId)
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
          onSend={(text) => {
            store.sendChat(openJob.id, {
              from: 'tech', senderId: tech.id, senderName: tech.name.split(' ')[0],
              text, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
            })
            bump()
          }}
        />
      </PhoneShell>
    )
  }

  // ── Tabs ──
  const tabs: NavTab[] = [
    { key: 'jobs',    label: 'งานของฉัน', icon: <Wrench size={21} /> },
    { key: 'queue',   label: 'คิวงาน',     icon: <Inbox size={21} />,   badge: queueJobs.length },
    { key: 'history', label: 'ประวัติ',    icon: <History size={21} /> },
  ]

  return (
    <PhoneShell
      liffTitle="CAO Service · ช่าง"
      footer={<BottomNav tabs={tabs} active={tab} onTab={setTab} />}
    >
      {tab === 'jobs' && (
        <MyJobsTab tech={tech} jobs={myJobs.filter(j => j.status !== 'done')} onOpenJob={openJobDetail} />
      )}
      {tab === 'queue' && (
        <QueueTab
          jobs={queueJobs}
          onOpenJob={openJobDetail}
          onClaim={(jobId) => {
            store.claimJob(jobId, tech.id)
            bump()
            showToast('รับงานแล้ว — ดูที่แท็บ "งานของฉัน"')
          }}
        />
      )}
      {tab === 'history' && (
        <HistoryTab
          doneJobs={doneJobs}
          avgRating={tech.avgRating}
          totalDone={tech.totalDone}
          onOpenJob={openJobDetail}
        />
      )}
      {toast && <Toast message={toast} visible />}
    </PhoneShell>
  )
}
