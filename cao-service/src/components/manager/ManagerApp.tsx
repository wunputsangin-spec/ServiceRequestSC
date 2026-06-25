'use client'
import { useState, useCallback } from 'react'
import { LayoutDashboard, Table2, Users } from 'lucide-react'
import { getStore } from '@/lib/store'
import type { Job } from '@/lib/types'
import { DesktopShell } from '@/components/layout/DesktopShell'
import { Toast } from '@/components/ui/BottomSheet'
import { OverviewPage } from './OverviewPage'
import { JobTablePage } from './JobTablePage'
import { TeamPage } from './TeamPage'
import { AssignDialog } from './AssignDialog'
import { JobDrawer } from './JobDrawer'

export function ManagerApp() {
  const store = getStore()
  const [, force] = useState(0)
  const bump = useCallback(() => force(v => v + 1), [])

  const manager = store.getCurrentManager()
  const [nav, setNav] = useState('overview')
  const [assignJob, setAssignJob] = useState<Job | null>(null)
  const [drawerId, setDrawerId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1900)
  }, [])

  const stats = store.getStats()
  const jobs = store.getJobs()
  const techs = store.getTechs()
  const pending = store.getPendingJobs()
  const toAssign = store.getApprovedJobs()
  const active = store.getActiveJobs()
  const drawerJob = drawerId ? store.getJob(drawerId) : null

  const navItems = [
    { key: 'overview', label: 'ภาพรวม', icon: <LayoutDashboard size={18} />, badge: pending.length },
    { key: 'jobs', label: 'รายการแจ้งซ่อม', icon: <Table2 size={18} /> },
    { key: 'team', label: 'ทีมช่าง', icon: <Users size={18} /> },
  ]

  const approve = (id: string) => { store.approveJob(id); bump(); showToast('อนุมัติคำขอแล้ว') }
  const confirmAssign = (techIds: string[]) => {
    if (!assignJob) return
    const editing = assignJob.assignees.length > 0
    store.setAssignees(assignJob.id, techIds)
    bump()
    setAssignJob(null)
    showToast(editing ? 'อัปเดตช่างผู้รับผิดชอบแล้ว' : `มอบหมายช่าง ${techIds.length} คนแล้ว`)
  }

  return (
    <DesktopShell
      nav={navItems}
      active={nav}
      onNav={setNav}
      managerName={manager.displayName}
      managerTitle={manager.department}
    >
      {nav === 'overview' && (
        <OverviewPage
          stats={stats}
          pending={pending}
          toAssign={toAssign}
          active={active}
          techs={techs}
          onApprove={approve}
          onAssign={setAssignJob}
          onEdit={setAssignJob}
        />
      )}
      {nav === 'jobs' && (
        <JobTablePage jobs={jobs} techs={techs} onOpen={(j) => setDrawerId(j.id)} />
      )}
      {nav === 'team' && <TeamPage techs={techs} />}

      {assignJob && (
        <AssignDialog
          job={assignJob}
          techs={techs}
          onClose={() => setAssignJob(null)}
          onConfirm={confirmAssign}
        />
      )}

      {drawerJob && (
        <JobDrawer
          job={drawerJob}
          techs={techs}
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
