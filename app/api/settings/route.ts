import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

// Public, read-only endpoint exposing only client-safe settings sections
// used by client components (footer, checkout totals).
export async function GET() {
  const settings = await getSettings()
  return NextResponse.json({
    footer: settings.footer,
    whatsapp: settings.whatsapp,
    checkout: settings.checkout,
  })
}
