import { NextRequest, NextResponse } from 'next/server'
import { verifyLoginCode, setSessionCookie } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) {
      return NextResponse.json({ error: 'Please enter the 6-digit code' }, { status: 400 })
    }

    const result = await verifyLoginCode(code)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    await setSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] verify code error:', error)
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}
