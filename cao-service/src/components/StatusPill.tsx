import { RepairStatus } from '@/lib/types'

const STATUS_CONFIG: Record<RepairStatus, { label: string; accent: string; bg: string; border: string; text: string }> = {
  pending: { label: 'รอดำเนินการ', accent: '#9CA3AF', bg: '#F3F4F6', border: '#E5E7EB', text: '#6B7280' },
  in_progress: { label: 'กำลังดำเนินการ', accent: '#1A56DB', bg: '#EFF4FE', border: '#D5E2FB', text: '#1A56DB' },
  done: { label: 'เสร็จสิ้น', accent: '#16A34A', bg: '#ECFDF3', border: '#C5EBD3', text: '#16A34A' },
  cancelled: { label: 'ยกเลิก', accent: '#DC2626', bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
}

export function StatusPill({ status }: { status: RepairStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '11.5px',
        fontWeight: 600,
        color: cfg.text,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.accent}`,
        padding: '4px 9px',
        borderRadius: '8px',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}
