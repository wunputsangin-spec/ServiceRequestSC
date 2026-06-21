import { redirect } from 'next/navigation'
import { mockEmployee } from '@/lib/mock-data'

export default function RootPage() {
  if (mockEmployee.isRegistered) {
    redirect('/home')
  }
  redirect('/register')
}
