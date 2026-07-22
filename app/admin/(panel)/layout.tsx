import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { AdminShell } from '@/components/admin/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return <AdminShell>{children}</AdminShell>
}
