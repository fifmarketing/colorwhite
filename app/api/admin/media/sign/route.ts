import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  getCloudinaryConfig,
  missingCloudinaryVars,
  resolveFolder,
  signParams,
} from '@/lib/cloudinary'

/**
 * Returns short-lived signed parameters so the browser can upload straight to
 * Cloudinary. The API secret is only ever used here, on the server.
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = getCloudinaryConfig()
  if (!config) {
    return NextResponse.json(
      {
        error: 'Cloudinary is not configured',
        missing: missingCloudinaryVars(),
      },
      { status: 503 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const folder = resolveFolder(body.folder)
    const timestamp = Math.round(Date.now() / 1000)

    // Every param below (except file/api_key/resource_type) must be signed and
    // then sent verbatim by the client, or Cloudinary rejects the upload.
    const params = { folder, timestamp }
    const signature = signParams(params, config.apiSecret)

    return NextResponse.json({
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      folder,
      timestamp,
      signature,
      uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    })
  } catch (error) {
    console.error('[v0] cloudinary sign error:', error)
    return NextResponse.json({ error: 'Failed to create upload signature' }, { status: 500 })
  }
}
