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
import { Plus, Pencil, Trash2, Star } from 'lucide-react'

interface Testimonial {
  _id: string
  name: string
  text: string
  rating: number
  active: boolean
  sortOrder: number
}

interface FormState {
  name: string
  text: string
  rating: string
  active: boolean
}

const emptyForm: FormState = { name: '', text: '', rating: '5', active: true }

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminTestimonialsPage() {
  const { data, isLoading, mutate } = useSWR<{ testimonials: Testimonial[] }>(
    '/api/admin/testimonials',
    fetcher
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const testimonials = data?.testimonials ?? []

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setDialogOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({ name: t.name, text: t.text, rating: String(t.rating), active: t.active })
    setError('')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.text.trim()) {
      setError('Name and testimonial text are required.')
      return
    }
    setBusy(true)
    setError('')
    const payload = {
      name: form.name.trim(),
      text: form.text.trim(),
      rating: Number(form.rating),
      active: form.active,
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
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.text}</p>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
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
              <Label htmlFor="t-text">Testimonial</Label>
              <Textarea
                id="t-text"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="What did the customer say?"
                rows={4}
              />
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
