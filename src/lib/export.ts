'use client'
import * as XLSX from 'xlsx'

interface ExportOptions {
  title?: string        // หัวรายงาน (แถวบนสุด)
  filterInfo?: string   // สรุปฟิลเตอร์ที่ใช้
}

// สร้างและดาวน์โหลดไฟล์ Excel (.xlsx) จาก array ของ object
export function exportExcel(
  filename: string,
  sheetName: string,
  rows: Record<string, unknown>[],
  opts: ExportOptions = {},
) {
  const data = rows.length ? rows : [{ 'ไม่มีข้อมูล': '' }]
  const headers = Object.keys(data[0])

  const ws = XLSX.utils.aoa_to_sheet([[]])
  let startRow = 0
  const preRows: unknown[][] = []

  if (opts.title) {
    preRows.push([opts.title])
    preRows.push([`ออกรายงานเมื่อ: ${new Date().toLocaleString('th-TH')}`])
  }
  if (opts.filterInfo) {
    preRows.push([`ตัวกรอง: ${opts.filterInfo}`])
  }
  if (preRows.length) preRows.push([]) // เว้นบรรทัด

  if (preRows.length) {
    XLSX.utils.sheet_add_aoa(ws, preRows, { origin: 'A1' })
    startRow = preRows.length
  }

  // เขียนตารางข้อมูลใต้ส่วนหัว
  XLSX.utils.sheet_add_json(ws, data, { origin: { r: startRow, c: 0 }, header: headers })

  // auto column width
  ws['!cols'] = headers.map(key => {
    const maxLen = Math.max(
      key.length,
      opts.title ? opts.title.length : 0,
      ...data.map(r => String(r[key] ?? '').length),
    )
    return { wch: Math.min(Math.max(maxLen + 2, 10), 60) }
  })

  // merge เซลล์หัวเรื่องให้ยาวคลุมหลายคอลัมน์
  if (opts.title && headers.length > 1) {
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    ]
  }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  const stamp = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `${filename}_${stamp}.xlsx`)
}
