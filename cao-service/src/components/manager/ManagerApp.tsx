'use client'
import { useState, useCallback } from 'react'
import { LayoutDashboard, Table2, Users } from 'lucide-react'
import { useLiff } from '@/lib/liff'
import { useEmployee, useManagerJobStore } from '@/lib/useJobStore'
import type { Job } from '@/lib/types'
import { DesktopShell } from '@/components/layout/DesktopShell'
import { Toast } from '@/components/ui/BottomSheet'
import { OverviewPage } from './OverviewPage'
import { JobTablePage } from './JobTablePage'
import { TeamPage } from './TeamPage'
import { AssignDialog } from './AssignDialog'
import { JobDrawer } from './JobDrawer'

export function ManagerApp() {
  const { profile } = useLiff()
  const { employee: manager } = useEmployee(profile?.lineUid ?? null)
  const store = useManagerJobStore(profile?.lineUid ?? null)

  const [nav, setNav]           = useState('overview')
  const [assignJob, setAssignJob] = useState<Job | null>(null)
  const [drawerId, setDrawerId]   = useState<string | null>(null)
  const [toast, setToast]         = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  const drawerJob = drawerId ? store.jobs.find(j => j.id === drawerId) ?? null : null

  const navItems = [
    { key: 'overview', label: 'ภาพรวม', icon: <LayoutDashboard size={18} />, badge: store.pending.length },
    { key: 'jobs',     label: 'รายการแจ้งซ่อม', icon: <Table2 size={18} /> },
    { key: 'team',     label: 'ทีมช่าง', icon: <Users size={18} /> },
  ]

  const approve = async (id: string) => {
    await store.approveJob(id).catch(() => {/* no-op */})
    showToast('อนุมัติคำขอแล้ว')
  }

  const confirmAssign = async (techIds: string[]) => {
    if (!assignJob) return
    const editing = assignJob.assignees.length > 0
    await store.setAssignees(assignJob.id, techIds).catch(() => {/* no-op */})
    setAssignJob(null)
    showToast(editing ? 'อัปเดตช่างผู้รับผิดชอบแล้ว' : `มอบหมายช่าง ${techIds.length} คนแล้ว`)
  }

  const managerName  = manager?.displayName  ?? profile?.displayName ?? 'ผู้จัดการ'
  const managerTitle = manager?.department   ?? 'ฝ่ายอาคารและสิ่งแวดล้อม'

  return (
    <DesktopShell
      nav={navItems}
      active={nav}
      onNav={setNav}
      managerName={managerName}
      managerTitle={managerTitle}
    >
      {nav === 'overview' && (
        <OverviewPage
          stats={store.stats}
          pending={store.pending}
          toAssign={store.toAssign}
          active={store.active}
          techs={store.techs}
          onApprove={approve}
          onAssign={setAssignJob}
          onEdit={setAssignJob}
        />
      )}
      {nav === 'jobs' && (
        <JobTablePage jobs={store.jobs} techs={store.techs} onOpen={(j) => setDrawerId(j.id)} />
      )}
      {nav === 'team' && <TeamPage techs={store.techs} />}

      {assignJob && (
        <AssignDialog
          job={assignJob}
          techs={store.techs}
          onClose={() => setAssignJob(null)}
          onConfirm={confirmAssign}
        />
      )}

      {drawerJob && (
        <JobDrawer
          job={drawerJob}
          techs={store.techs}
          onClose={() => setDrawerId(null)}
          onApprove={(id) => { approve(id) }}
          onAssign={(j) => { setDrawerId(null); setAssignJob(j) }}
          onEdit={(j) => { setDrawerId(null); setAssignJob(j) }}
        />
      )}

      {toast && <Toast message={toast} visible />}
    </DesktopShell>
  )
}
