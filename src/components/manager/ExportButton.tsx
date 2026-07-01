'use client'
import { FileSpreadsheet } from 'lucide-react'
import { exportExcel } from '@/lib/export'

interface ExportButtonProps {
  filename: string
  sheetName: string
  rows: Record<string, unknown>[]
  label?: string
}

export function ExportButton({ filename, sheetName, rows, label = 'Export Excel' }: ExportButtonProps) {
  return (
    <button
      onClick={() => exportExcel(filename, sheetName, rows)}
      disabled={rows.length === 0}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        height: 38, padding: '0 15px', borderRadius: 11, cursor: rows.length ? 'pointer' : 'not-allowed',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
        background: rows.length ? 'linear-gradient(180deg,#2E7D5B,#276B4E)' : 'var(--surface-2)',
        color: rows.length ? '#fff' : 'var(--txt-3)',
        border: `1px solid ${rows.length ? 'transparent' : 'var(--line-2)'}`,
        opacity: rows.length ? 1 : 0.6,
      }}
    >
      <FileSpreadsheet size={16} /> {label}
    </button>
  )
}
