import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm-mono',
})

export const metadata: Metadata = {
  title: 'CAO Service',
  description: 'ระบบแจ้งซ่อมอาคาร สำหรับพนักงาน',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={ibmPlexMono.variable}>
      <body className="min-h-screen" style={{ background: 'var(--surface)' }}>
        <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
