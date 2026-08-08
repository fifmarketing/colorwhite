import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/data'
import { getCloudinaryConfig, missingCloudinaryVars, signParams } from '@/lib/cloudinary'

/**
 * Public upload signature for customer bank-transfer screenshots.
 *
 * Unlike the admin signer this route is unauthenticated, so it is deliberately
 * narrow: the folder is hard-coded, the signature only lives for a moment, and
 * each IP is rate limited. It refuses to issue anything while bank transfer is
 * switched off in the admin settings.
 */

const PROOF_FOLDER = 'payment-proofs'

/** Max signatures a single IP may request per window. */
const RATE_LIMIT = 12
const WINDOW_MS = 10 * 60 * 1000

// In-memory limiter. Good enough to blunt casual abuse of a single instance.
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    // Opportunistically drop expired entries so the map cannot grow forever.
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key)
    }
    return false
  }

  entry.count += 1
  return entry.count > RATE_LIMIT
}

export async function POST(request: NextRequest) {
  const settings = await getSettings()
  if (!settings.payment.bankEnabled) {
    return NextResponse.json({ error: 'Bank transfer is not available' }, { status: 403 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many upload attempts. Please try again in a few minutes.' },
      { status: 429 }
    )
  }

  const config = getCloudinaryConfig()
  if (!config) {
    return NextResponse.json(
      { error: 'Uploads are not configured', missing: missingCloudinaryVars() },
      { status: 503 }
    )
  }

  try {
    const timestamp = Math.round(Date.now() / 1000)
    // The folder is fixed server-side so this signature can never be reused to
    // overwrite product or content media.
    const params = { folder: PROOF_FOLDER, timestamp }

    return NextResponse.json({
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      folder: PROOF_FOLDER,
      timestamp,
      signature: signParams(params, config.apiSecret),
      uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    })
  } catch (error) {
    console.error('[v0] payment proof sign error:', error)
    return NextResponse.json({ error: 'Failed to create upload signature' }, { status: 500 })
  }
}
