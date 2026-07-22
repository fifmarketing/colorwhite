'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Product {
  _id: string
  productId: number
  name: string
  category: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  discount: number
  featured: boolean
  active: boolean
  sortOrder: number
}

const emptyForm = {
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  image: '',
  rating: '5',
  reviews: '0',
  discount: '0',
  featured: true,
  active: true,
  sortOrder: '',
}

type FormState = typeof emptyForm

export default function AdminProductsPage() {
  const { data, mutate, isLoading } = useSWR('/api/admin/products', fetcher)
  const products: Product[] = data?.products ?? []

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      image: product.image,
      rating: String(product.rating),
      reviews: String(product.reviews),
      discount: String(product.discount),
      featured: product.featured !== false,
      active: product.active !== false,
      sortOrder: String(product.sortOrder ?? ''),
    })
    setDialogOpen(true)
  }

  const setField = (key: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      image: form.image.trim() || '/placeholder.svg',
      rating: Number(form.rating || 5),
      reviews: Number(form.reviews || 0),
      discount: Number(form.discount || 0),
      featured: form.featured,
      active: form.active,
      ...(form.sortOrder !== '' ? { sortOrder: Number(form.sortOrder) } : {}),
    }
    try {
      const res = await fetch(
        editing ? `/api/admin/products/${editing._id}` : '/api/admin/products',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Product updated' : 'Product created')
      setDialogOpen(false)
      mutate()
    } catch {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Product deleted')
      mutate()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage the products shown on your homepage and shop page.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-background overflow-x-auto">
        {isLoading ? (
          <div className="p-4 flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No products yet. Add your first product.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-48 truncate">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                      {product.category}
                    </TableCell>
                    <TableCell>
                      Rs. {product.price.toLocaleString()}
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through ml-1">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant={product.active !== false ? 'default' : 'secondary'}>
                          {product.active !== false ? 'Active' : 'Hidden'}
                        </Badge>
                        {product.featured !== false && <Badge variant="outline">Featured</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(product)}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(product)}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label htmlFor="p-category">Category label</Label>
              <Input
                id="p-category"
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                placeholder="e.g. HAND & FOOT CARE"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-price">Price (Rs.)</Label>
              <Input
                id="p-price"
                type="number"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-original">Original price (Rs.)</Label>
              <Input
                id="p-original"
                type="number"
                value={form.originalPrice}
                onChange={(e) => setField('originalPrice', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label htmlFor="p-image">Image path or URL</Label>
              <Input
                id="p-image"
                value={form.image}
                onChange={(e) => setField('image', e.target.value)}
                placeholder="/clour.jpg or https://..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-discount">Discount badge (%)</Label>
              <Input
                id="p-discount"
                type="number"
                value={form.discount}
                onChange={(e) => setField('discount', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-sort">Sort order</Label>
              <Input
                id="p-sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setField('sortOrder', e.target.value)}
                placeholder="auto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-rating">Rating (1-5)</Label>
              <Input
                id="p-rating"
                type="number"
                step="0.01"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) => setField('rating', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-reviews">Review count</Label>
              <Input
                id="p-reviews"
                type="number"
                value={form.reviews}
                onChange={(e) => setField('reviews', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
              <Label htmlFor="p-featured" className="cursor-pointer">
                Featured on homepage
              </Label>
              <Switch
                id="p-featured"
                checked={form.featured}
                onCheckedChange={(v) => setField('featured', v)}
              />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
              <Label htmlFor="p-active" className="cursor-pointer">
                Visible on website
              </Label>
              <Switch
                id="p-active"
                checked={form.active}
                onCheckedChange={(v) => setField('active', v)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? 'Save Changes' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              {'This will permanently remove "'}
              {deleteTarget?.name}
              {'" from the website. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
