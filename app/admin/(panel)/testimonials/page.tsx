'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Plus, Pencil, Trash2, Star, ImageIcon } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/image-upload'

interface Testimonial {
  _id: string
  name: string
  text: string
  rating: number
  active: boolean
  sortOrder: number
  /** Blurred WhatsApp screenshot URL. */
  image?: string
  city?: string
  dateLabel?: string
  verified?: boolean
  source?: 'whatsapp' | 'website'
  /** Product slugs this review should also appear on. */
  productSlugs?: string[]
}

interface ProductOption {
  _id: string
  name: string
  slug: string
}

interface FormState {
  name: string
  text: string
  rating: string
  active: boolean
  image: string
  city: string
  dateLabel: string
  verified: boolean
  source: 'whatsapp' | 'website'
  productSlugs: string[]
}

const emptyForm: FormState = {
  name: '',
  text: '',
  rating: '5',
  active: true,
  image: '',
  city: '',
  dateLabel: '',
  verified: true,
  source: 'whatsapp',
  productSlugs: [],
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminTestimonialsPage() {
  const { data, isLoading, mutate } = useSWR<{ testimonials: Testimonial[] }>(
    '/api/admin/testimonials',
    fetcher
  )
  const { data: productData } = useSWR<{ products: ProductOption[] }>(
    '/api/admin/products',
    fetcher
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const testimonials = data?.testimonials ?? []
  const products = productData?.products ?? []

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setDialogOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({
      name: t.name,
      text: t.text,
      rating: String(t.rating),
      active: t.active,
      image: t.image ?? '',
      city: t.city ?? '',
      dateLabel: t.dateLabel ?? '',
      verified: t.verified ?? true,
      source: t.source ?? 'whatsapp',
      productSlugs: t.productSlugs ?? [],
    })
    setError('')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Customer name is required.')
      return
    }
    // A screenshot can stand on its own, but a text-only review needs the quote.
    if (!form.text.trim() && !form.image.trim()) {
      setError('Add the review text or upload a screenshot.')
      return
    }
    setBusy(true)
    setError('')
    const payload = {
      name: form.name.trim(),
      text: form.text.trim(),
      rating: Number(form.rating),
      active: form.active,
      image: form.image.trim(),
      city: form.city.trim(),
      dateLabel: form.dateLabel.trim(),
      verified: form.verified,
      source: form.source,
      productSlugs: form.productSlugs,
    }
    const res = editing
      ? await fetch(`/api/admin/testimonials/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
    setBusy(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error || 'Failed to save testimonial.')
      return
    }
    setDialogOpen(false)
    mutate()
  }

  const toggleActive = async (t: Testimonial) => {
    await fetch(`/api/admin/testimonials/${t._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !t.active }),
    })
    mutate()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setBusy(true)
    await fetch(`/api/admin/testimonials/${deleteId}`, { method: 'DELETE' })
    setBusy(false)
    setDeleteId(null)
    mutate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Testimonials</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer reviews shown on the homepage
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12">
            <Star className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No testimonials yet</p>
            <Button variant="outline" size="sm" onClick={openCreate}>
              Add your first testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {testimonials.map((t) => (
            <Card key={t._id} className={t.active ? '' : 'opacity-60'}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {t.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.image}
                      alt={`Screenshot from ${t.name}`}
                      className="h-20 w-20 shrink-0 rounded-md border border-border object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground text-sm">{t.name}</p>
                      <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < t.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/40'
                            }`}
                          />
                        ))}
                      </div>
                      {!t.active && <Badge variant="outline">Hidden</Badge>}
                      {t.image && (
                        <Badge variant="secondary" className="gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Screenshot
                        </Badge>
                      )}
                      {(t.productSlugs?.length ?? 0) > 0 && (
                        <Badge variant="outline">
                          {t.productSlugs!.length} product
                          {t.productSlugs!.length === 1 ? '' : 's'}
                        </Badge>
                      )}
                    </div>
                    {t.text && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.text}</p>
                    )}
                    {(t.city || t.dateLabel) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {[t.city, t.dateLabel].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={t.active}
                      onCheckedChange={() => toggleActive(t)}
                      aria-label={t.active ? 'Hide testimonial' : 'Show testimonial'}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Edit testimonial"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Delete testimonial"
                      onClick={() => setDeleteId(t._id)}
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

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Review' : 'Add Review'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <ImageUploadField
              label="WhatsApp Screenshot (optional)"
              hint="Blur the customer's phone number and profile photo before uploading. Only upload with their permission."
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              folder="testimonials"
              id="t-image"
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="t-name">Customer Name</Label>
              <Input
                id="t-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ayesha K."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="t-text">Review Text</Label>
              <Textarea
                id="t-text"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="What did the customer say? Optional if a screenshot is attached."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-city">City (optional)</Label>
                <Input
                  id="t-city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Lahore"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-date">Date Label (optional)</Label>
                <Input
                  id="t-date"
                  value={form.dateLabel}
                  onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
                  placeholder="e.g. March 2026"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Rating</Label>
                <Select
                  value={form.rating}
                  onValueChange={(value) => setForm({ ...form, rating: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} star{r === 1 ? '' : 's'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-active">Visible on site</Label>
                <div className="flex items-center h-9">
                  <Switch
                    id="t-active"
                    checked={form.active}
                    onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Source</Label>
                <Select
                  value={form.source}
                  onValueChange={(value) =>
                    setForm({ ...form, source: value as FormState['source'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="t-verified">Show verified badge</Label>
                <div className="flex items-center h-9">
                  <Switch
                    id="t-verified"
                    checked={form.verified}
                    onCheckedChange={(checked) => setForm({ ...form, verified: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Show on product pages (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Tag the products this review is about so it also appears on their pages.
              </p>
              {products.length === 0 ? (
                <p className="text-xs text-muted-foreground">No products available yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2 rounded-md border border-border p-3 max-h-40 overflow-y-auto">
                  {products.map((p) => {
                    const selected = form.productSlugs.includes(p.slug)
                    return (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            productSlugs: selected
                              ? form.productSlugs.filter((s) => s !== p.slug)
                              : [...form.productSlugs, p.slug],
                          })
                        }
                        aria-pressed={selected}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer ${
                          selected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {p.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={busy}>
                {busy ? 'Saving...' : editing ? 'Save Changes' : 'Add Testimonial'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the testimonial. This action cannot be undone.
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
