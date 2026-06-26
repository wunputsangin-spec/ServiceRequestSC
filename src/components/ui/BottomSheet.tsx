'use client'
import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  maxWidth?: number
}

export function BottomSheet({ open, onClose, title, subtitle, children, maxWidth = 460 }: BottomSheetProps) {
  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(8,8,10,.66)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      className="animate-fadein"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth,
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'var(--surface)',
          border: '1px solid var(--line-2)',
          borderBottom: 'none',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 24,
        }}
        className="animate-slideup scrollbar-hide"
      >
        {/* Drag handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: 'var(--line-2)',
          margin: '10px auto 8px',
        }} />

        {(title || subtitle) && (
          <div style={{
            padding: '8px 22px 14px',
            borderBottom: '1px solid var(--line)',
          }}>
            {title && (
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--txt)' }}>{title}</div>
            )}
            {subtitle && (
              <div style={{ fontSize: 12.5, color: 'var(--txt-3)', marginTop: 3 }}>{subtitle}</div>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}

/* Toast notification */
interface ToastProps {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: ToastProps) {
  if (!visible) return null
  return (
    <div
      style={{
        position: 'fixed', bottom: 90, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'var(--card-hi)',
        border: '1px solid var(--line-2)',
        borderRadius: 14,
        padding: '11px 20px',
        fontSize: 14, fontWeight: 600, color: 'var(--txt)',
        whiteSpace: 'nowrap',
        boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      }}
      className="animate-popin"
    >
      {message}
    </div>
  )
}
