import type { Metadata } from 'next'
import { Anuphan } from 'next/font/google'
import { LiffProvider } from '@/lib/liff'
import './globals.css'

const anuphan = Anuphan({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-anuphan',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CAO Service',
  description: 'ระบบแจ้งซ่อมและขอรับบริการ — บุญรอดบริวเวอรี่',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={anuphan.variable}>
      <body className="min-h-screen" style={{ background: 'var(--bg)', fontFamily: 'var(--font-anuphan), var(--font)' }}>
        <LiffProvider>
          {children}
        </LiffProvider>
      </body>
    </html>
  )
}
