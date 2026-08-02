import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  ALLOWED_FOLDERS,
  DEFAULT_UPLOAD_FOLDER,
  deleteImage,
  getCloudinaryConfig,
  getUsage,
  listImages,
  missingCloudinaryVars,
} from '@/lib/cloudinary'

/** Connection status + the media library listing for the admin images page. */
export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = getCloudinaryConfig()
  if (!config) {
    return NextResponse.json({
      configured: false,
      missing: missingCloudinaryVars(),
      baseFolder: DEFAULT_UPLOAD_FOLDER,
      folders: ALLOWED_FOLDERS,
      images: [],
    })
  }

  const folder = request.nextUrl.searchParams.get('folder') || undefined

  try {
    const [images, usage] = await Promise.all([
      listImages(config, { folder }),
      getUsage(config).catch(() => null),
    ])
    return NextResponse.json({
      configured: true,
      missing: [],
      cloudName: config.cloudName,
      baseFolder: DEFAULT_UPLOAD_FOLDER,
      folders: ALLOWED_FOLDERS,
      usage,
      images,
    })
  } catch (error) {
    console.error('[v0] cloudinary list error:', error)
    return NextResponse.json(
      {
        configured: true,
        missing: [],
        cloudName: config.cloudName,
        baseFolder: DEFAULT_UPLOAD_FOLDER,
        folders: ALLOWED_FOLDERS,
        images: [],
        error: 'Could not reach Cloudinary. Check that your API key and secret are correct.',
      },
      { status: 502 }
    )
  }
}

/** Permanently remove an image from Cloudinary. */
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = getCloudinaryConfig()
  if (!config) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 503 })
  }

  const publicId = request.nextUrl.searchParams.get('publicId')
  if (!publicId) {
    return NextResponse.json({ error: 'publicId is required' }, { status: 400 })
  }

  // Only allow deleting assets this app uploaded.
  if (!publicId.startsWith(`${DEFAULT_UPLOAD_FOLDER}/`)) {
    return NextResponse.json({ error: 'That image is outside the app folder' }, { status: 403 })
  }

  try {
    await deleteImage(config, publicId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] cloudinary delete error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
