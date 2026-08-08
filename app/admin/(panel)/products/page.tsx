'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react'
import { StringListField, PairListField } from '@/components/admin/list-fields'
import { ImageUploadField, ImageListUploadField } from '@/components/admin/image-upload'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

/** Sentinel value for the "add new category" option in the category select. */
const NEW_CATEGORY = '__new__'

interface Feature {
  title: string
  desc: string
}

interface Faq {
  question: string
  answer: string
}

interface Product {
  _id: string
  productId: number
  slug: string
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
  tagline: string
  shortDescription: string
  longDescription: string
  benefits: string[]
  features: Feature[]
  howToUse: string[]
  ingredients: string
  gallery: string[]
  faqs: Faq[]
  size: string
  skinType: string
}

const emptyForm = {
  name: '',
  slug: '',
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
  tagline: '',
  shortDescription: '',
  longDescription: '',
  ingredients: '',
  size: '',
  skinType: 'All skin types',
  benefits: [] as string[],
  howToUse: [] as string[],
  gallery: [] as string[],
  features: [] as Record<string, string>[],
  faqs: [] as Record<string, string>[],
}

type FormState = typeof emptyForm

export default function AdminProductsPage() {
  const { data, mutate, isLoading } = useSWR('/api/admin/products', fetcher)
  const products: Product[] = data?.products ?? []

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [tab, setTab] = useState('basics')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [newCategory, setNewCategory] = useState(false)

  // Existing category labels, so the client reuses them instead of typing variants.
  const categoryOptions = [
    ...new Set(products.map((p) => (p.category || '').trim()).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setNewCategory(true)
    setTab('basics')
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setNewCategory(false)
    setForm({
      name: product.name,
      slug: product.slug ?? '',
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
      tagline: product.tagline ?? '',
      shortDescription: product.shortDescription ?? '',
      longDescription: product.longDescription ?? '',
      ingredients: product.ingredients ?? '',
      size: product.size ?? '',
      skinType: product.skinType ?? '',
      benefits: product.benefits ?? [],
      howToUse: product.howToUse ?? [],
      gallery: product.gallery ?? [],
      features: (product.features ?? []).map((f) => ({ title: f.title, desc: f.desc })),
      faqs: (product.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    })
    setTab('basics')
    setDialogOpen(true)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required')
      setTab('basics')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
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
      tagline: form.tagline,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      ingredients: form.ingredients,
      size: form.size,
      skinType: form.skinType,
      benefits: form.benefits,
      howToUse: form.howToUse,
      gallery: form.gallery,
      features: form.features,
      faqs: form.faqs,
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
            Manage products and everything shown on their detail pages.
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
                <TableHead className="w-32 text-right">Actions</TableHead>
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
                    <TableCell className="max-w-48">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="truncate text-xs text-muted-foreground">/{product.slug}</p>
                    </TableCell>
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
                        {!product.shortDescription && (
                          <Badge variant="secondary">No description</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            aria-label={`Open detail page for ${product.name}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              Everything here appears on the product detail page at /product/
              {form.slug || 'your-product-slug'}.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="content">Benefits &amp; Use</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            {/* ---------- Basics ---------- */}
            <TabsContent value="basics" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <Label htmlFor="p-name">Name</Label>
                  <Input
                    id="p-name"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <Label htmlFor="p-slug">Detail page URL</Label>
                  <Input
                    id="p-slug"
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    placeholder="auto-generated from the name"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to generate it from the product name.
                  </p>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <Label htmlFor="p-category">Category</Label>
                  <Select
                    value={newCategory || !form.category ? NEW_CATEGORY : form.category}
                    onValueChange={(value) => {
                      if (value === NEW_CATEGORY) {
                        setNewCategory(true)
                        setField('category', '')
                      } else {
                        setNewCategory(false)
                        setField('category', value)
                      }
                    }}
                  >
                    <SelectTrigger id="p-category">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      <SelectItem value={NEW_CATEGORY}>+ Add new category</SelectItem>
                    </SelectContent>
                  </Select>
                  {(newCategory || !form.category) && (
                    <Input
                      value={form.category}
                      onChange={(e) => setField('category', e.target.value)}
                      placeholder="e.g. Face Creams"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Categories power the Categories menu and the /categories pages. Pick an existing
                    one to keep the list tidy.
                  </p>
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
                <div className="sm:col-span-2">
                  <ImageUploadField
                    id="p-image"
                    label="Main image"
                    hint="Shown on the shop grid and at the top of the detail page. Upload a file or paste an existing path."
                    folder="products"
                    value={form.image}
                    onChange={(url) => setField('image', url)}
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
            </TabsContent>

            {/* ---------- Description ---------- */}
            <TabsContent value="description" className="mt-4">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="p-tagline">Tagline</Label>
                  <Input
                    id="p-tagline"
                    value={form.tagline}
                    onChange={(e) => setField('tagline', e.target.value)}
                    placeholder="One line shown under the product title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="p-short">Short description</Label>
                  <Textarea
                    id="p-short"
                    rows={3}
                    value={form.shortDescription}
                    onChange={(e) => setField('shortDescription', e.target.value)}
                    placeholder="One or two sentences. Also used for search engine previews."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="p-long">Full description</Label>
                  <Textarea
                    id="p-long"
                    rows={8}
                    value={form.longDescription}
                    onChange={(e) => setField('longDescription', e.target.value)}
                    placeholder="Leave a blank line between paragraphs."
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave a blank line between paragraphs — each becomes its own paragraph on the
                    page.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="p-size">Size / volume</Label>
                    <Input
                      id="p-size"
                      value={form.size}
                      onChange={(e) => setField('size', e.target.value)}
                      placeholder="e.g. 30ml bottle"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="p-skin">Skin type</Label>
                    <Input
                      id="p-skin"
                      value={form.skinType}
                      onChange={(e) => setField('skinType', e.target.value)}
                      placeholder="e.g. All skin types"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="p-ingredients">Full ingredients</Label>
                  <Textarea
                    id="p-ingredients"
                    rows={4}
                    value={form.ingredients}
                    onChange={(e) => setField('ingredients', e.target.value)}
                    placeholder="Comma separated ingredient list"
                  />
                </div>
                <ImageListUploadField
                  label="Gallery images"
                  hint="Extra images shown as thumbnails. The main image is added automatically."
                  folder="products"
                  values={form.gallery}
                  onChange={(v) => setField('gallery', v)}
                />
              </div>
            </TabsContent>

            {/* ---------- Benefits, features, how to use ---------- */}
            <TabsContent value="content" className="mt-4">
              <div className="flex flex-col gap-8">
                <StringListField
                  label="Benefits"
                  hint="Results the customer can expect. The first four also appear next to the price."
                  itemLabel="Benefit"
                  placeholder="Fades dark spots with continued use"
                  values={form.benefits}
                  onChange={(v) => setField('benefits', v)}
                  multiline
                />
                <PairListField
                  label="Features & key ingredients"
                  hint="Shown as cards under 'Key Features & Ingredients'."
                  itemLabel="Feature"
                  keys={['title', 'desc']}
                  labels={['Title', 'Description']}
                  placeholders={['Vitamin C', 'What it does and why it matters']}
                  values={form.features}
                  onChange={(v) => setField('features', v)}
                />
                <StringListField
                  label="How to use"
                  hint="Numbered steps shown in order."
                  itemLabel="Step"
                  placeholder="Apply to clean, dry skin"
                  values={form.howToUse}
                  onChange={(v) => setField('howToUse', v)}
                  multiline
                />
              </div>
            </TabsContent>

            {/* ---------- FAQs ---------- */}
            <TabsContent value="faqs" className="mt-4">
              <PairListField
                label="Frequently asked questions"
                hint="Displayed as an expandable list at the bottom of the detail page."
                itemLabel="Question"
                keys={['question', 'answer']}
                labels={['Question', 'Answer']}
                placeholders={['How long until I see results?', 'Most customers notice...']}
                values={form.faqs}
                onChange={(v) => setField('faqs', v)}
              />
            </TabsContent>
          </Tabs>

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
