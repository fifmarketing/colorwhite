import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getSettings } from '@/lib/data'
import { defaultSettings } from '@/lib/default-content'

const VALID_SECTIONS = Object.keys(defaultSettings)

/**
 * Accepts a top-level section ("footer") or one level of nesting
 * ("policies.shipping") so grouped settings can be saved independently.
 */
function isValidSection(section: unknown): section is string {
  if (typeof section !== 'string' || section.length === 0) return false
  const [root, child, ...rest] = section.split('.')
  if (rest.length > 0 || !VALID_SECTIONS.includes(root)) return false
  if (child === undefined) return true
  const rootValue = defaultSettings[root as keyof typeof defaultSettings]
  return (
    typeof rootValue === 'object' &&
    rootValue !== null &&
    Object.prototype.hasOwnProperty.call(rootValue, child)
  )
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const settings = await getSettings()
  return NextResponse.json({ settings })
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { section, data } = await request.json()
    if (!isValidSection(section) || typeof data !== 'object' || data === null) {
      return NextResponse.json({ error: 'Invalid section or data' }, { status: 400 })
    }
    const db = await getDb()
    await db
      .collection('settings')
      .updateOne({ key: 'site' }, { $set: { [section]: data } }, { upsert: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
