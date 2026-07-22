import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getSettings } from '@/lib/data'
import { defaultSettings } from '@/lib/default-content'

const VALID_SECTIONS = Object.keys(defaultSettings)

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
    if (!section || !VALID_SECTIONS.includes(section) || typeof data !== 'object') {
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
