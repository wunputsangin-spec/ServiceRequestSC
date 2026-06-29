// LINE UID ที่ได้รับอนุญาตให้สลับ role เองได้ (สำหรับทดสอบระบบ)
export const DEV_LINE_UID = 'Ud52eadf3a594aaff1aefc6e49a9270d6'

export function isDevUser(lineUid: string | null | undefined): boolean {
  return lineUid === DEV_LINE_UID
}
