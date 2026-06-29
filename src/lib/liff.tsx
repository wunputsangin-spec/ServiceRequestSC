'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { LIFF_ID } from './liffId'

interface LiffProfile {
  lineUid: string
  displayName: string
  pictureUrl: string | null
}

interface LiffContextValue {
  ready: boolean
  loggedIn: boolean
  profile: LiffProfile | null
  error: string | null
}

const LiffContext = createContext<LiffContextValue>({
  ready: false,
  loggedIn: false,
  profile: null,
  error: null,
})

export function useLiff() {
  return useContext(LiffContext)
}


export function LiffProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiffContextValue>({
    ready: false,
    loggedIn: false,
    profile: null,
    error: null,
  })

  useEffect(() => {
    async function init() {
      try {
        const liff = (await import('@line/liff')).default
        await liff.init({ liffId: LIFF_ID })

        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        const p = await liff.getProfile()
        setState({
          ready: true,
          loggedIn: true,
          profile: {
            lineUid: p.userId,
            displayName: p.displayName,
            pictureUrl: p.pictureUrl ?? null,
          },
          error: null,
        })
      } catch (err) {
        setState({ ready: true, loggedIn: false, profile: null, error: String(err) })
      }
    }
    init()
  }, [])

  return <LiffContext.Provider value={state}>{children}</LiffContext.Provider>
}
