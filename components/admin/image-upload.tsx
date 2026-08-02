'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ImagePlus, Loader2, Trash2, Upload, X, ChevronUp, ChevronDown } from 'lucide-react'

const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']

export type UploadFolder = 'products' | 'content' | 'testimonials' | 'pages' | 'general'

interface SignResponse {
  cloudName: string
  apiKey: string
  folder: string
  timestamp: number
  signature: string
  uploadUrl: string
  error?: string
  missing?: string[]
}

/**
 * Uploads a single file straight from the browser to Cloudinary using a
 * signature minted by our server. Returns the delivery URL.
 */
async function uploadToCloudinary(
  file: File,
  folder: UploadFolder,
  onProgress: (percent: number) => void
): Promise<string> {
  const signRes = await fetch('/api/admin/media/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  })
  const signed = (await signRes.json()) as SignResponse
  if (!signRes.ok) {
    throw new Error(
      signed.missing?.length
        ? `Cloudinary is not configured. Missing: ${signed.missing.join(', ')}`
        : signed.error || 'Could not start the upload'
    )
  }

  const form = new FormData()
  form.append('file', file)
  form.append('api_key', signed.apiKey)
  form.append('timestamp', String(signed.timestamp))
  form.append('folder', signed.folder)
  form.append('signature', signed.signature)

  // XHR rather than fetch so we can report real upload progress.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', signed.uploadUrl)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
          // f_auto,q_auto lets Cloudinary serve webp/avif at a sensible quality.
          resolve(String(body.secure_url).replace('/upload/', '/upload/f_auto,q_auto/'))
        } else {
          reject(new Error(body?.error?.message || 'Cloudinary rejected the upload'))
        }
      } catch {
        reject(new Error('Unexpected response from Cloudinary'))
      }
    }
    xhr.onerror = () => reject(new Error('Network error while uploading'))
    xhr.send(form)
  })
}

function validate(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return `${file.name} is not a supported image type`
  if (file.size > MAX_BYTES) return `${file.name} is larger than 10MB`
  return null
}

/** Shared hook so pages and the media library all upload the same way. */
export function useImageUpload(folder: UploadFolder) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (files: File[]): Promise<string[]> => {
      const valid: File[] = []
      for (const file of files) {
        const problem = validate(file)
        if (problem) {
          setError(problem)
          return []
        }
        valid.push(file)
      }
      if (valid.length === 0) return []

      setError(null)
      setUploading(true)
      setProgress(0)
      const urls: string[] = []
      try {
        for (let i = 0; i < valid.length; i++) {
          const url = await uploadToCloudinary(valid[i], folder, (percent) => {
            // Spread per-file progress across the whole batch.
            setProgress(Math.round(((i + percent / 100) / valid.length) * 100))
          })
          urls.push(url)
        }
        setProgress(100)
        return urls
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
        return []
      } finally {
        setUploading(false)
      }
    },
    [folder]
  )

  return { upload, uploading, progress, error, setError }
}

interface DropZoneProps {
  onFiles: (files: File[]) => void
  multiple?: boolean
  disabled?: boolean
  compact?: boolean
  label?: string
}

export function ImageDropZone({
  onFiles,
  multiple = false,
  disabled = false,
  compact = false,
  label,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragging(false)
    if (disabled) return
    const files = Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files.length) onFiles(multiple ? files : files.slice(0, 1))
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center transition-colors',
        compact ? 'p-4' : 'p-6',
        dragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30',
        disabled && 'opacity-60'
      )}
    >
      <ImagePlus className="h-5 w-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground text-pretty">
        {label ?? (multiple ? 'Drop images here' : 'Drop an image here')}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Choose {multiple ? 'images' : 'image'}
      </Button>
      <p className="text-xs text-muted-foreground">JPG, PNG, WebP or AVIF up to 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          if (files.length) onFiles(files)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/** Single image field: upload, preview, or paste an existing path/URL. */
export function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  folder,
  placeholder = '/placeholder.svg or https://...',
  id,
}: {
  label: string
  hint?: string
  value: string
  onChange: (url: string) => void
  folder: UploadFolder
  placeholder?: string
  id?: string
}) {
  const { upload, uploading, progress, error } = useImageUpload(folder)

  const handleFiles = async (files: File[]) => {
    const [url] = await upload(files.slice(0, 1))
    if (url) onChange(url)
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label htmlFor={id}>{label}</Label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            <>
              <Image src={value || '/placeholder.svg'} alt="" fill className="object-cover" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => onChange('')}
                aria-label={`Remove ${label}`}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="h-5 w-5 animate-spin text-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <ImageDropZone compact onFiles={handleFiles} disabled={uploading} />
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={`${label} URL`}
          />
        </div>
      </div>

      {uploading && <Progress value={progress} className="h-1.5" />}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

/** Ordered list of images (product gallery) with upload, reorder and remove. */
export function ImageListUploadField({
  label,
  hint,
  values,
  onChange,
  folder,
}: {
  label: string
  hint?: string
  values: string[]
  onChange: (next: string[]) => void
  folder: UploadFolder
}) {
  const { upload, uploading, progress, error } = useImageUpload(folder)

  const handleFiles = async (files: File[]) => {
    const urls = await upload(files)
    if (urls.length) onChange([...values, ...urls])
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= values.length) return
    const next = [...values]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>{label}</Label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>

      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex flex-col gap-2 rounded-lg border border-border p-2"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                <Image
                  src={url || '/placeholder.svg'}
                  alt={`${label} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{index + 1}</span>
                <div className="flex gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    aria-label={`Move image ${index + 1} earlier`}
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === values.length - 1}
                    onClick={() => move(index, index + 1)}
                    aria-label={`Move image ${index + 1} later`}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onChange(values.filter((_, i) => i !== index))}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageDropZone
        multiple
        compact
        onFiles={handleFiles}
        disabled={uploading}
        label="Drop images here to add them to the gallery"
      />
      {uploading && <Progress value={progress} className="h-1.5" />}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
