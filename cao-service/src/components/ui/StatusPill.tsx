import type { JobStatus } from '@/lib/types'
import { STATUS_META } from '@/lib/constants'

interface StatusPillProps {
  status: JobStatus
  size?: 'sm' | 'md'
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const meta = STATUS_META[status]
  const fontSize = size === 'sm' ? 10.5 : 11.5
  const px = size === 'sm' ? 7 : 9
  const py = size === 'sm' ? 3 : 4

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize,
        fontWeight: 600,
        color: meta.color,
        background: meta.bgAlpha,
        border: `1px solid color-mix(in srgb, ${meta.color} 30%, transparent)`,
        padding: `${py}px ${px}px`,
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: meta.color,
          flexShrink: 0,
        }}
      />
      {meta.label}
    </span>
  )
}
