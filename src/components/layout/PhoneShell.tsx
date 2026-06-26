import type { ReactNode } from 'react'

/* ── Status bar (clock + battery icons) ─────────────────────────────── */
function StatusBar() {
  return (
    <div style={{
      height: 44, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 26px 0 30px',
      position: 'relative', zIndex: 5,
    }}>
      <span className="num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)', letterSpacing: '0.02em' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--txt)' }}>
        {/* Signal bars */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1"/>
          <rect x="5" y="5" width="3" height="7" rx="1"/>
          <rect x="10" y="2.5" width="3" height="9.5" rx="1"/>
          <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.4"/>
        </svg>
        {/* WiFi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.5c2.7 0 5.2 1 7 2.7l-1.4 1.5A8 8 0 0 0 8.5 4.5 8 8 0 0 0 2.9 6.7L1.5 5.2A10 10 0 0 1 8.5 2.5Z"/>
          <path d="M8.5 6.2c1.6 0 3.1.6 4.2 1.7l-1.5 1.5a3.8 3.8 0 0 0-5.4 0L4.3 7.9A6 6 0 0 1 8.5 6.2Z"/>
          <circle cx="8.5" cy="10.6" r="1.4"/>
        </svg>
        {/* Battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3" stroke="currentColor" opacity="0.5"/>
          <rect x="2.5" y="2.5" width="16" height="8" rx="1.5" fill="currentColor"/>
          <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}

/* ── LINE LIFF top header ────────────────────────────────────────────── */
interface LiffHeaderProps {
  title?: string
  onClose?: () => void
}

function LiffHeader({ title = 'CAO Service', onClose }: LiffHeaderProps) {
  return (
    <div style={{
      height: 46, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 8px 0 14px',
      borderBottom: '1px solid var(--line)',
      background: 'var(--surface)',
      position: 'relative', zIndex: 4,
    }}>
      <button
        onClick={onClose}
        style={{
          background: 'transparent', border: 'none',
          color: 'var(--txt-2)', display: 'grid', placeItems: 'center',
          width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
        <span style={{
          width: 18, height: 18, borderRadius: 5,
          background: '#06C755', color: '#fff',
          display: 'grid', placeItems: 'center',
          fontSize: 11, fontWeight: 800, fontFamily: 'system-ui',
        }}>L</span>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--txt)' }}>{title}</span>
        <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>▾</span>
      </div>
      <button style={{
        background: 'transparent', border: 'none',
        color: 'var(--txt-2)', display: 'grid', placeItems: 'center',
        width: 30, height: 30, cursor: 'pointer',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/><circle cx="5" cy="12" r="1.4"/>
        </svg>
      </button>
    </div>
  )
}

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

export function PhoneShell({ liffTitle, onClose, children, footer }: PhoneShellProps) {
  return (
    <div style={{
      width: '100%', maxWidth: 390,
      minHeight: '100dvh',
      margin: '0 auto',
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <StatusBar />
      <LiffHeader title={liffTitle} onClose={onClose} />
      <div className="scrollbar-hide" style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {footer}
    </div>
  )
}
