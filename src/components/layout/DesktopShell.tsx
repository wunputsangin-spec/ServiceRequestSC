import type { ReactNode } from 'react'

interface SidebarItem {
  key: string
  label: string
  icon: ReactNode
  badge?: number
}

interface DesktopShellProps {
  nav: SidebarItem[]
  active: string
  onNav: (key: string) => void
  managerName: string
  managerTitle: string
  children: ReactNode
}

export function DesktopShell({ nav, active, onNav, managerName, managerTitle, children }: DesktopShellProps) {
  const initial = (managerName || '?')[0].toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 228, flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column',
        padding: '18px 14px',
        position: 'sticky', top: 0, height: '100dvh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 18px' }}>
          <span style={{
            width: 36, height: 36, borderRadius: 11,
            background: 'linear-gradient(160deg, #E8C77A, #C2933E)',
            display: 'grid', placeItems: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#161310" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18l3 3 6.5-6.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.6-.6-.6-2.6 2.4-2.4Z"/>
            </svg>
          </span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--txt)', lineHeight: 1 }}>CAO Service</div>
            <div style={{ fontSize: 10.5, color: 'var(--txt-3)', marginTop: 3 }}>ระบบแจ้งซ่อมองค์กร</div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {nav.map(item => {
            const isActive = item.key === active
            return (
              <button
                key={item.key}
                onClick={() => onNav(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 12px', borderRadius: 11,
                  background: isActive ? 'var(--tint-gold)' : 'transparent',
                  border: isActive ? '1px solid color-mix(in srgb,var(--gold) 30%,transparent)' : '1px solid transparent',
                  color: isActive ? 'var(--gold)' : 'var(--txt-2)',
                  fontSize: 14, fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  width: '100%', textAlign: 'left',
                }}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: '#fff',
                    background: 'var(--st-urgent)',
                    padding: '1px 7px', borderRadius: 999,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Manager profile card at bottom */}
        <div style={{
          marginTop: 'auto',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: 10, borderRadius: 12,
          background: 'var(--card-hi)',
          border: '1px solid var(--line-2)',
        }}>
          <span style={{
            width: 36, height: 36, flexShrink: 0, borderRadius: '50%',
            background: 'linear-gradient(180deg, #E8C77A, #C2933E)',
            display: 'grid', placeItems: 'center',
            fontSize: 14, fontWeight: 700, color: '#161310',
          }}>
            {initial}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {managerName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{managerTitle}</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1, minWidth: 0,
        overflowY: 'auto',
        padding: '24px 28px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {children}
      </main>
    </div>
  )
}
