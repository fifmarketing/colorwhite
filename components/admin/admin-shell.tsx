'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Star,
  Home,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/content', label: 'Homepage Content', icon: Home },
  { href: '/admin/pages', label: 'Page Content', icon: FileText },
  { href: '/admin/images', label: 'Images', icon: ImageIcon },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const sidebarFooter = (
    <div className="flex flex-col gap-1 border-t border-border pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <ExternalLink className="h-4 w-4" />
        View Website
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col justify-between border-r border-border bg-background p-4">
        <div className="flex flex-col gap-6">
          <div className="px-3 pt-2">
            <p className="text-lg font-semibold text-foreground">Color White</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
          <NavLinks />
        </div>
        {sidebarFooter}
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div>
          <p className="text-base font-semibold text-foreground">Color White Admin</p>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <SheetTitle className="px-3 pt-2 text-left text-lg font-semibold">
                Color White Admin
              </SheetTitle>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            {sidebarFooter}
          </SheetContent>
        </Sheet>
      </header>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 md:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  )
}
