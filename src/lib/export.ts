'use client'
import * as XLSX from 'xlsx'

// สร้างและดาวน์โหลดไฟล์ Excel (.xlsx) จาก array ของ object
export function exportExcel(
  filename: string,
  sheetName: string,
  rows: Record<string, unknown>[],
) {
  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ 'ไม่มีข้อมูล': '' }])
  // auto column width จากความยาวข้อความ
  const cols = Object.keys(rows[0] ?? { '': '' }).map(key => {
    const maxLen = Math.max(
      key.length,
      ...rows.map(r => String(r[key] ?? '').length),
    )
    return { wch: Math.min(Math.max(maxLen + 2, 10), 50) }
  })
  ws['!cols'] = cols

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  const stamp = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `${filename}_${stamp}.xlsx`)
}
