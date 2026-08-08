import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { pickReviewFieldUpdates } from '@/lib/reviews'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await request.json()
    const update: Record<string, unknown> = {}
    for (const key of ['name', 'text', 'rating', 'active', 'sortOrder']) {
      if (body[key] !== undefined) update[key] = body[key]
    }
    // Only merge the optional review fields the request actually sent, so the
    // visibility toggle cannot clear a stored screenshot or product tags.
    Object.assign(update, pickReviewFieldUpdates(body))
    const db = await getDb()
    await db.collection('testimonials').updateOne({ _id: new ObjectId(id) }, { $set: update })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] update testimonial error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const db = await getDb()
    await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] delete testimonial error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
