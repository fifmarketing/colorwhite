'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, ShoppingBag, MessageSquare, Star, ArrowRight } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminDashboardPage() {
  const { data: productsData } = useSWR('/api/admin/products', fetcher)
  const { data: ordersData } = useSWR('/api/admin/orders', fetcher)
  const { data: messagesData } = useSWR('/api/admin/messages', fetcher)
  const { data: testimonialsData } = useSWR('/api/admin/testimonials', fetcher)

  const products = productsData?.products
  const orders = ordersData?.orders
  const messages = messagesData?.messages
  const testimonials = testimonialsData?.testimonials

  const unreadMessages = messages?.filter((m: { read?: boolean }) => !m.read).length
  const pendingOrders = orders?.filter((o: { status?: string }) => o.status === 'pending').length

  const stats = [
    {
      label: 'Products',
      value: products?.length,
      sub: products ? `${products.filter((p: { active?: boolean }) => p.active !== false).length} active` : undefined,
      icon: Package,
      href: '/admin/products',
    },
    {
      label: 'Orders',
      value: orders?.length,
      sub: orders ? `${pendingOrders} pending` : undefined,
      icon: ShoppingBag,
      href: '/admin/orders',
    },
    {
      label: 'Messages',
      value: messages?.length,
      sub: messages ? `${unreadMessages} unread` : undefined,
      icon: MessageSquare,
      href: '/admin/messages',
    },
    {
      label: 'Testimonials',
      value: testimonials?.length,
      sub: testimonials
        ? `${testimonials.filter((t: { active?: boolean }) => t.active !== false).length} visible`
        : undefined,
      icon: Star,
      href: '/admin/testimonials',
    },
  ]

  const recentOrders = orders?.slice(0, 5) ?? null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store and website content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {stat.value === undefined ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  )}
                  {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Link
            href="/admin/orders"
            className="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {!recentOrders ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No orders yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {recentOrders.map(
                (order: {
                  _id: string
                  customer?: { fullName?: string; name?: string }
                  fullName?: string
                  total?: number
                  status?: string
                  createdAt?: string
                }) => (
                  <div key={order._id} className="flex items-center justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {order.customer?.fullName || order.customer?.name || order.fullName || 'Customer'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {typeof order.total === 'number' && (
                        <p className="text-sm font-medium text-foreground">
                          Rs. {order.total.toLocaleString()}
                        </p>
                      )}
                      <Badge className={statusColors[order.status || 'pending'] || ''} variant="secondary">
                        {order.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
