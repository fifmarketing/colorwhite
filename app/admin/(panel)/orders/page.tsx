'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Eye, Trash2, ShoppingBag } from 'lucide-react'

interface OrderItem {
  id: string | number
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  orderId: string
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: string
  createdAt: string
}

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminOrdersPage() {
  const { data, isLoading, mutate } = useSWR<{ orders: Order[] }>('/api/admin/orders', fetcher)
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const orders = data?.orders ?? []
  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    mutate()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setBusy(true)
    await fetch(`/api/admin/orders/${deleteId}`, { method: 'DELETE' })
    setBusy(false)
    setDeleteId(null)
    mutate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orders.length} order{orders.length === 1 ? '' : 's'} total
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground text-sm">{order.orderId}</p>
                      <Badge variant="outline" className={statusStyles[order.status] || ''}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.fullName} &middot; {order.phone} &middot; {order.city}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.createdAt).toLocaleString()} &middot;{' '}
                      {order.items?.length ?? 0} item{(order.items?.length ?? 0) === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm mr-2">
                      Rs. {order.total?.toLocaleString()}
                    </p>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateStatus(order._id, value)}
                    >
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="View order details"
                      onClick={() => setViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Delete order"
                      onClick={() => setDeleteId(order._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order details dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {viewOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-xs">Customer</p>
                  <p className="text-foreground">{viewOrder.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="text-foreground">{viewOrder.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-foreground break-all">{viewOrder.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Placed</p>
                  <p className="text-foreground">
                    {new Date(viewOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Shipping Address</p>
                  <p className="text-foreground">
                    {viewOrder.address}, {viewOrder.city} {viewOrder.postalCode}
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <p className="font-medium text-foreground mb-2">Items</p>
                <div className="flex flex-col gap-2">
                  {viewOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <p className="text-foreground">
                        {item.name}{' '}
                        <span className="text-muted-foreground">x{item.quantity}</span>
                      </p>
                      <p className="text-foreground">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-3 flex flex-col gap-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {viewOrder.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Rs. {viewOrder.shipping?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>Rs. {viewOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the order record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={busy}>
              {busy ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
