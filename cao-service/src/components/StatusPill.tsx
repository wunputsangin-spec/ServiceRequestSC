/* Legacy StatusPill — used by existing pages (JobCard etc.) until Phase 2–5 rewrites */
import type { RepairStatus } from '@/lib/types'

const STATUS_CONFIG: Record<RepairStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: 'รออนุมัติ',       color: '#B9933B', bg: 'color-mix(in srgb,#B9933B 15%,transparent)' },
  in_progress: { label: 'กำลังดำเนินการ', color: '#E0902E', bg: 'color-mix(in srgb,#E0902E 15%,transparent)' },
  done:        { label: 'เสร็จสิ้น',       color: '#43B581', bg: 'color-mix(in srgb,#43B581 15%,transparent)' },
  cancelled:   { label: 'ยกเลิก',          color: '#E15B4C', bg: 'color-mix(in srgb,#E15B4C 15%,transparent)' },
}

export function StatusPill({ status }: { status: RepairStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11.5,
        fontWeight: 600,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid color-mix(in srgb, ${cfg.color} 30%, transparent)`,
        padding: '4px 9px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color }} />
      {cfg.label}
    </span>
  )
}
