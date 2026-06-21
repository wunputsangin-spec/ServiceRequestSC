'use client'

import { WorkType } from '@/lib/types'
import { WORK_TYPE_CONFIG } from '@/lib/mock-data'

interface TypeChipProps {
  type: WorkType
  selected: boolean
  onToggle: (type: WorkType) => void
}

export function TypeChip({ type, selected, onToggle }: TypeChipProps) {
  const cfg = WORK_TYPE_CONFIG[type]
  return (
    <button
      type="button"
      onClick={() => onToggle(type)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '9px 14px',
        borderRadius: '999px',
        fontSize: '14px',
        fontWeight: selected ? 700 : 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        border: selected ? '1px solid #1A56DB' : '1px solid #E5E7EB',
        background: selected ? '#1A56DB' : '#FFFFFF',
        color: selected ? '#FFFFFF' : '#6B7280',
        boxShadow: selected ? '0 6px 14px -6px rgba(26,86,219,.5)' : 'none',
        fontFamily: 'inherit',
      }}
    >
      {cfg.emoji} {cfg.label}
    </button>
  )
}
