'use client'

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
