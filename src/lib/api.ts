'use client'

import type { Job, Employee, ChatMessage } from './types'

// fetch wrapper ที่แนบ x-line-uid header อัตโนมัติ
export function apiFetch(lineUid: string, input: string, init?: RequestInit) {
  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-line-uid': lineUid,
      ...init?.headers,
    },
  })
}

// ─── Employee ──────────────────────────────────────────────────────────────────

export async function apiGetEmployee(lineUid: string): Promise<Employee | null> {
  const res = await apiFetch(lineUid, '/api/employees')
  if (res.status === 404) return null
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiUpsertEmployee(lineUid: string, payload: Partial<Employee> & { employeeCode: string }): Promise<Employee> {
  const res = await apiFetch(lineUid, '/api/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// ─── Jobs ──────────────────────────────────────────────────────────────────────

export async function apiGetMyJobs(lineUid: string): Promise<Job[]> {
  const res = await apiFetch(lineUid, '/api/jobs?scope=mine')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiGetAllJobs(lineUid: string): Promise<Job[]> {
  const res = await apiFetch(lineUid, '/api/jobs')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiGetTechJobs(lineUid: string, techId: string): Promise<Job[]> {
  const res = await apiFetch(lineUid, `/api/jobs?techId=${techId}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiCreateJob(lineUid: string, payload: {
  type: string; category: string; title: string; building: string; floor: string
  location: string; urgency: string; description: string; slotDate: string; slotTime: string
  photos?: string[]
}): Promise<Job> {
  const res = await apiFetch(lineUid, '/api/jobs', { method: 'POST', body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPatchJob(lineUid: string, id: string, patch: Partial<{
  status: string; assignees: string[]; closeNote: string; rating: number; feedback: string
  beforePhotos: string[]; afterPhotos: string[]; requesterLineUid: string
}>): Promise<Job> {
  const res = await apiFetch(lineUid, `/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// ─── Chat ──────────────────────────────────────────────────────────────────────

export async function apiGetChats(lineUid: string, jobId: string): Promise<ChatMessage[]> {
  const res = await apiFetch(lineUid, `/api/jobs/${jobId}/chat`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiSendChat(lineUid: string, jobId: string, msg: {
  from: 'employee' | 'tech' | 'system'; senderId: string; senderName: string; text: string
}): Promise<ChatMessage> {
  const res = await apiFetch(lineUid, `/api/jobs/${jobId}/chat`, { method: 'POST', body: JSON.stringify(msg) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// ─── Upload ────────────────────────────────────────────────────────────────────

export async function apiUploadPhoto(lineUid: string, file: File, bucket = 'photos'): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('bucket', bucket)
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'x-line-uid': lineUid },
    body: form,
  })
  if (!res.ok) throw new Error(await res.text())
  const json = await res.json()
  return json.url as string
}
