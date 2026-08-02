'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
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
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { CheckCircle2, AlertCircle, Copy, Trash2, RefreshCw } from 'lucide-react'
import { ImageDropZone, useImageUpload, type UploadFolder } from '@/components/admin/image-upload'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface CloudinaryImage {
  publicId: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  createdAt: string
}

interface MediaResponse {
  configured: boolean
  missing: string[]
  cloudName?: string
  baseFolder: string
  folders: UploadFolder[]
  usage?: {
    plan: string | null
    resources: number | null
    storageBytes: number | null
    bandwidthBytes: number | null
    creditsUsedPercent: number | null
  } | null
  images: CloudinaryImage[]
  error?: string
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`
}

export default function AdminImagesPage() {
  const [folder, setFolder] = useState<UploadFolder>('products')
  const { data, isLoading, mutate } = useSWR<MediaResponse>(
    `/api/admin/media?folder=${folder}`,
    fetcher
  )
  const { upload, uploading, progress, error } = useImageUpload(folder)
  const [deleteTarget, setDeleteTarget] = useState<CloudinaryImage | null>(null)

  const configured = data?.configured
  const images = data?.images ?? []

  const handleFiles = async (files: File[]) => {
    const urls = await upload(files)
    if (urls.length) {
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`)
      mutate()
    }
  }

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Image URL copied')
    } catch {
      toast.error('Could not copy the URL')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(
        `/api/admin/media?publicId=${encodeURIComponent(deleteTarget.publicId)}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error()
      toast.success('Image deleted')
      mutate()
    } catch {
      toast.error('Failed to delete the image')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Images</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Upload product and page images to Cloudinary, then copy a URL to use anywhere in the
          admin panel.
        </p>
      </div>

      {/* Connection status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cloudinary Connection</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading ? (
            <Skeleton className="h-6 w-48" />
          ) : configured ? (
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Connected
              </Badge>
              <span className="text-sm text-muted-foreground">
                Cloud <span className="font-medium text-foreground">{data?.cloudName}</span> · base
                folder <span className="font-medium text-foreground">{data?.baseFolder}</span>
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Badge variant="destructive" className="w-fit gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Not configured
              </Badge>
              <p className="text-sm text-muted-foreground">
                Add these environment variables, then redeploy or restart the server:
              </p>
              <ul className="flex flex-col gap-1">
                {(data?.missing ?? []).map((key) => (
                  <li key={key} className="font-mono text-xs text-destructive">
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data?.error && <p className="text-sm text-destructive">{data.error}</p>}

          {configured && data?.usage && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Plan</p>
                <p className="text-sm font-medium capitalize">{data.usage.plan ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stored assets</p>
                <p className="text-sm font-medium">{data.usage.resources ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Storage used</p>
                <p className="text-sm font-medium">{formatBytes(data.usage.storageBytes)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bandwidth used</p>
                <p className="text-sm font-medium">{formatBytes(data.usage.bandwidthBytes)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Images</CardTitle>
          <p className="text-sm text-muted-foreground">
            Images are optimised automatically and delivered from Cloudinary&apos;s CDN.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 max-w-xs">
            <Label htmlFor="folder-select">Folder</Label>
            <Select value={folder} onValueChange={(v) => setFolder(v as UploadFolder)}>
              <SelectTrigger id="folder-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(data?.folders ?? ['products', 'content', 'testimonials', 'pages', 'general']).map(
                  (name) => (
                    <SelectItem key={name} value={name} className="capitalize">
                      {name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <ImageDropZone
            multiple
            onFiles={handleFiles}
            disabled={uploading || !configured}
            label={
              configured
                ? `Drop images here to upload into ${folder}`
                : 'Add your Cloudinary credentials to enable uploads'
            }
          />
          {uploading && <Progress value={progress} className="h-1.5" />}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {/* Library */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Media Library</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">{folder} folder</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => mutate()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No images in this folder yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.publicId}
                  className="flex flex-col gap-2 rounded-lg border border-border p-2"
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                    <Image
                      src={img.url || '/placeholder.svg'}
                      alt={img.publicId}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="truncate text-xs text-muted-foreground" title={img.publicId}>
                    {img.publicId.split('/').pop()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {img.width}×{img.height} · {formatBytes(img.bytes)}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCopy(img.url)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(img)}
                      aria-label={`Delete ${img.publicId}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be permanently removed from Cloudinary. Any product or page still using this
              URL will show a broken image.
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
