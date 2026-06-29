import type { ReactNode } from 'react'

/* ── Bottom nav tab item ─────────────────────────────────────────────── */
export interface NavTab {
  key: string
  label: string
  icon: ReactNode
  badge?: number
}

interface BottomNavProps {
  tabs: NavTab[]
  active: string
  onTab: (key: string) => void
}

export function BottomNav({ tabs, active, onTab }: BottomNavProps) {
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex',
      borderTop: '1px solid var(--line)',
      background: 'var(--surface)',
      padding: '9px 8px 12px',
    }}>
      {tabs.map(tab => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => onTab(tab.key)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: isActive ? 'var(--gold)' : 'var(--txt-3)',
              position: 'relative',
              minHeight: 44,
              padding: '4px 0 0',
            }}
          >
            <span style={{ position: 'relative' }}>
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -6,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--st-urgent)',
                  border: '2px solid var(--surface)',
                  fontSize: 9, fontWeight: 800, color: '#fff',
                  display: 'grid', placeItems: 'center',
                }}>
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </span>
            <span style={{ fontSize: 10.5, fontWeight: isActive ? 700 : 600 }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ── Phone shell wrapper ─────────────────────────────────────────────── */
interface PhoneShellProps {
  liffTitle?: string
  onClose?: () => void
  children: ReactNode
  footer?: ReactNode
}

export function PhoneShell({ children, footer }: PhoneShellProps) {
  return (
    <div style={{
      width: '100%', maxWidth: 390,
      minHeight: '100dvh',
      margin: '0 auto',
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <div className="scrollbar-hide" style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {footer}
    </div>
  )
}
