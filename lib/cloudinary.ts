import { createHash } from 'crypto'

/**
 * Server-only Cloudinary helpers.
 *
 * Uploads happen directly from the browser to Cloudinary using a short-lived
 * signature generated here, so large images never pass through the serverless
 * function body limit. The API secret never leaves the server.
 */

export const DEFAULT_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'colorwhite'

/** Folders the admin UI is allowed to upload into. */
export const ALLOWED_FOLDERS = ['products', 'content', 'testimonials', 'pages', 'general'] as const
export type AllowedFolder = (typeof ALLOWED_FOLDERS)[number]

export interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) return null
  return { cloudName, apiKey, apiSecret }
}

/** Which of the three required variables are missing, for admin diagnostics. */
export function missingCloudinaryVars(): string[] {
  return (
    ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const
  ).filter((key) => !process.env[key])
}

/** Normalize a requested subfolder to something safe and predictable. */
export function resolveFolder(requested?: string | null): string {
  const clean = String(requested || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
  const isAllowed = (ALLOWED_FOLDERS as readonly string[]).includes(clean)
  return isAllowed ? `${DEFAULT_UPLOAD_FOLDER}/${clean}` : `${DEFAULT_UPLOAD_FOLDER}/general`
}

/**
 * Cloudinary signs the alphabetically sorted, url-encoded param string with the
 * API secret appended. `file`, `api_key`, `resource_type` and `cloud_name` are
 * never part of the signature.
 */
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex')
}

function authHeader({ apiKey, apiSecret }: CloudinaryConfig): string {
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
}

export interface CloudinaryImage {
  publicId: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  createdAt: string
  folder: string
}

interface RawResource {
  public_id: string
  secure_url?: string
  url?: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
  folder?: string
  asset_folder?: string
}

function mapResource(resource: RawResource): CloudinaryImage {
  return {
    publicId: resource.public_id,
    url: resource.secure_url || resource.url || '',
    format: resource.format,
    width: resource.width,
    height: resource.height,
    bytes: resource.bytes,
    createdAt: resource.created_at,
    folder: resource.folder ?? resource.asset_folder ?? '',
  }
}

/**
 * List images in the project folder, newest first.
 *
 * Uses the Admin API `prefix` listing rather than the Search API on purpose:
 * on accounts using dynamic folders the asset's path lives in `asset_folder`
 * and the Search API's `folder:` term matches nothing, so a search-based
 * listing silently returns an empty media library. Prefix matching against
 * `public_id` is reliable across both folder modes.
 */
export async function listImages(
  config: CloudinaryConfig,
  options: { folder?: string; limit?: number } = {}
): Promise<CloudinaryImage[]> {
  const prefix = options.folder
    ? `${resolveFolder(options.folder)}/`
    : `${DEFAULT_UPLOAD_FOLDER}/`

  const query = new URLSearchParams({
    type: 'upload',
    prefix,
    max_results: String(Math.min(options.limit ?? 60, 100)),
    direction: 'desc',
  })

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/image/upload?${query.toString()}`,
    { headers: { Authorization: authHeader(config) }, cache: 'no-store' }
  )

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Cloudinary list failed (${res.status}): ${detail.slice(0, 200)}`)
  }

  const data = (await res.json()) as { resources?: RawResource[] }
  return (data.resources ?? []).map(mapResource)
}

/** Permanently delete an image by public id. */
export async function deleteImage(config: CloudinaryConfig, publicId: string): Promise<void> {
  const params = new URLSearchParams()
  params.append('public_ids[]', publicId)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/image/upload?${params.toString()}`,
    { method: 'DELETE', headers: { Authorization: authHeader(config) }, cache: 'no-store' }
  )
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Cloudinary delete failed (${res.status}): ${detail.slice(0, 200)}`)
  }
}

/** Storage/usage summary shown on the admin images page. */
export async function getUsage(config: CloudinaryConfig) {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/usage`, {
    headers: { Authorization: authHeader(config) },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = (await res.json()) as {
    plan?: string
    credits?: { usage?: number; limit?: number; used_percent?: number }
    storage?: { usage?: number }
    bandwidth?: { usage?: number }
    resources?: number
  }
  return {
    plan: data.plan ?? null,
    resources: data.resources ?? null,
    storageBytes: data.storage?.usage ?? null,
    bandwidthBytes: data.bandwidth?.usage ?? null,
    creditsUsedPercent: data.credits?.used_percent ?? null,
  }
}

/**
 * Rewrite a Cloudinary delivery URL with transformations.
 * Used to serve right-sized, auto-format images instead of the original upload.
 */
export function transformUrl(url: string, transform = 'f_auto,q_auto'): string {
  if (!url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/${transform}/`)
}
