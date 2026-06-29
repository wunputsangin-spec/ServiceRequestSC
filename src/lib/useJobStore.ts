'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Job, Employee, Technician, Notification, ChatMessage } from './types'
import {
  apiGetMyJobs, apiGetAllJobs, apiGetTechJobs, apiGetEmployee,
  apiCreateJob, apiPatchJob, apiSendChat, apiGetChats,
} from './api'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeNotification(job: Job, type: Notification['type'], text: string): Notification {
  return {
    id: `${job.id}-${type}-${Date.now()}`,
    type, jobId: job.id, jobTitle: job.title, text,
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
    read: false,
  }
}

// ─── Employee hook ─────────────────────────────────────────────────────────────

export function useEmployee(lineUid: string | null) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lineUid) { setLoading(false); return }
    apiGetEmployee(lineUid)
      .then(emp => { setEmployee(emp); setLoading(false) })
      .catch(() => setLoading(false))
  }, [lineUid])

  return { employee, setEmployee, loading }
}

// ─── Employee job store ────────────────────────────────────────────────────────

export function useEmpJobStore(lineUid: string | null, employeeId: string | null) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [techs] = useState<Technician[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(() => {
    if (!lineUid) return
    setLoading(true)
    apiGetMyJobs(lineUid)
      .then(j => { setJobs(j); setLoading(false) })
      .catch(() => setLoading(false))
  }, [lineUid])

  useEffect(() => { reload() }, [reload])

  const submitJob = useCallback(async (payload: {
    type: string; category: string; title: string; building: string; floor: string
    location: string; urgency: string; description: string; slotDate: string; slotTime: string
    photos?: string[]
  }): Promise<Job> => {
    const job = await apiCreateJob(lineUid!, payload)
    setJobs(prev => [job, ...prev])
    setNotifications(prev => [makeNotification(job, 'status_change', 'ส่งคำขอแล้ว'), ...prev])
    return job
  }, [lineUid])

  const rateJob = useCallback(async (id: string, rating: number, feedback: string): Promise<void> => {
    const job = await apiPatchJob(lineUid!, id, { rating, feedback, status: 'done' })
    setJobs(prev => prev.map(j => j.id === id ? job : j))
  }, [lineUid])

  const sendChat = useCallback(async (jobId: string, msg: {
    from: 'employee' | 'tech' | 'system'; senderId: string; senderName: string; text: string
  }): Promise<ChatMessage> => {
    const chat = await apiSendChat(lineUid!, jobId, msg)
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, chat: [...j.chat, chat] } : j))
    return chat
  }, [lineUid])

  const loadChats = useCallback(async (jobId: string): Promise<void> => {
    const chats = await apiGetChats(lineUid!, jobId)
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, chat: chats } : j))
  }, [lineUid])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const unread = notifications.filter(n => !n.read).length

  return { jobs, techs, notifications, unread, loading, submitJob, rateJob, sendChat, loadChats, markAllRead, reload }
}

// ─── Tech job store ────────────────────────────────────────────────────────────

export function useTechJobStore(lineUid: string | null, techId: string | null) {
  const [myJobs, setMyJobs]     = useState<Job[]>([])
  const [allJobs, setAllJobs]   = useState<Job[]>([])
  const [allTechs, setAllTechs] = useState<Technician[]>([])
  const [loading, setLoading]   = useState(true)

  const reload = useCallback(() => {
    if (!lineUid || !techId) return
    setLoading(true)
    Promise.all([
      apiGetTechJobs(lineUid, techId),
      apiGetAllJobs(lineUid),
    ]).then(([mine, all]) => {
      setMyJobs(mine)
      setAllJobs(all)
      setLoading(false)
    }).catch(() => setLoading(false))

    // Also load technician list from employees API
    fetch('/api/techs', { headers: { 'x-line-uid': lineUid } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllTechs(data))
      .catch(() => {/* no-op */})
  }, [lineUid, techId])

  useEffect(() => { reload() }, [reload])

  const queueJobs = useMemo(
    () => allJobs.filter(j => j.status === 'approved' && j.assignees.length === 0),
    [allJobs]
  )
  const doneJobs = useMemo(() => myJobs.filter(j => j.status === 'done'), [myJobs])

  const updateJobLocal = (id: string, patch: Partial<Job>) => {
    setMyJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j))
    setAllJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j))
  }

  const startJob = useCallback(async (id: string) => {
    const job = await apiPatchJob(lineUid!, id, { status: 'in_progress' })
    updateJobLocal(id, job)
  }, [lineUid]) // eslint-disable-line react-hooks/exhaustive-deps

  const closeJob = useCallback(async (id: string, closeNote: string, beforePhotos: string[], afterPhotos: string[]) => {
    const job = await apiPatchJob(lineUid!, id, { status: 'done', closeNote, beforePhotos, afterPhotos })
    updateJobLocal(id, job)
  }, [lineUid]) // eslint-disable-line react-hooks/exhaustive-deps

  const claimJob = useCallback(async (id: string, techId: string) => {
    const cur = allJobs.find(j => j.id === id)
    const assignees = [...(cur?.assignees ?? []), techId]
    const job = await apiPatchJob(lineUid!, id, { status: 'assigned', assignees })
    updateJobLocal(id, job)
    setMyJobs(prev => [...prev, job])
  }, [lineUid, allJobs]) // eslint-disable-line react-hooks/exhaustive-deps

  const forwardJob = useCallback(async (id: string, fromTechId: string, toTechId: string, reason?: string, fromName?: string) => {
    const cur = allJobs.find(j => j.id === id)
    const assignees = [...(cur?.assignees ?? []).filter(a => a !== fromTechId), toTechId]
    // reset เป็น 'assigned' ให้ช่างใหม่กดเริ่มเอง + trigger แจ้งเตือนช่างใหม่
    const job = await apiPatchJob(lineUid!, id, { assignees, status: 'assigned' })
    updateJobLocal(id, job)
    setMyJobs(prev => prev.filter(j => j.id !== id))
    // บันทึกเหตุผลการส่งต่อเป็นข้อความระบบในแชท
    if (reason) {
      await apiSendChat(lineUid!, id, {
        from: 'system', senderId: fromTechId, senderName: 'ระบบ',
        text: `🔄 ${fromName ?? 'ช่าง'} ส่งต่องานนี้ — เหตุผล: ${reason}`,
      }).catch(() => {/* no-op */})
    }
  }, [lineUid, allJobs]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendChat = useCallback(async (jobId: string, msg: {
    from: 'employee' | 'tech' | 'system'; senderId: string; senderName: string; text: string
  }): Promise<ChatMessage> => {
    const chat = await apiSendChat(lineUid!, jobId, msg)
    updateJobLocal(jobId, {
      chat: [...(allJobs.find(j => j.id === jobId)?.chat ?? []), chat],
    })
    return chat
  }, [lineUid, allJobs]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadChats = useCallback(async (jobId: string) => {
    const chats = await apiGetChats(lineUid!, jobId)
    updateJobLocal(jobId, { chat: chats })
  }, [lineUid]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    myJobs, allTechs, queueJobs, doneJobs, loading,
    startJob, closeJob, claimJob, forwardJob, sendChat, loadChats, reload,
  }
}

// ─── Manager job store ─────────────────────────────────────────────────────────

export function useManagerJobStore(lineUid: string | null) {
  const [jobs, setJobs]   = useState<Job[]>([])
  const [techs, setTechs] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(() => {
    if (!lineUid) return
    setLoading(true)
    Promise.all([
      apiGetAllJobs(lineUid),
      fetch('/api/techs', { headers: { 'x-line-uid': lineUid } }).then(r => r.ok ? r.json() : []),
    ]).then(([allJobs, allTechs]) => {
      setJobs(allJobs)
      setTechs(allTechs)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [lineUid])

  useEffect(() => { reload() }, [reload])

  const approveJob = useCallback(async (id: string) => {
    const job = await apiPatchJob(lineUid!, id, { status: 'approved' })
    setJobs(prev => prev.map(j => j.id === id ? job : j))
  }, [lineUid])

  const setAssignees = useCallback(async (id: string, techIds: string[]) => {
    const cur = jobs.find(j => j.id === id)
    const status = cur?.status === 'approved' && techIds.length > 0 ? 'assigned' : cur?.status
    const job = await apiPatchJob(lineUid!, id, { assignees: techIds, status })
    setJobs(prev => prev.map(j => j.id === id ? job : j))
    // Recompute tech load after assignment
    fetch('/api/techs', { headers: { 'x-line-uid': lineUid! } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setTechs(data))
      .catch(() => {/* no-op */})
  }, [lineUid, jobs])

  const stats = useMemo(() => ({
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    approved: jobs.filter(j => j.status === 'approved').length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    inProgress: jobs.filter(j => j.status === 'in_progress').length,
    done: jobs.filter(j => j.status === 'done').length,
  }), [jobs])

  const pending    = useMemo(() => jobs.filter(j => j.status === 'pending'), [jobs])
  const toAssign   = useMemo(() => jobs.filter(j => j.status === 'approved'), [jobs])
  const active     = useMemo(() => jobs.filter(j => j.status === 'in_progress' || j.status === 'assigned'), [jobs])

  return { jobs, techs, stats, pending, toAssign, active, loading, approveJob, setAssignees, reload }
}
