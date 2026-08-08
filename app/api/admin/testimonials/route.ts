import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getTestimonials } from '@/lib/data'
import { normalizeReviewFields } from '@/lib/reviews'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const testimonials = await getTestimonials({ includeInactive: true })
  return NextResponse.json({ testimonials })
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    // A screenshot review can have no quote, so text is only required without an image.
    if (!body.name || (!body.text && !body.image)) {
      return NextResponse.json(
        { error: 'Name plus either review text or a screenshot are required' },
        { status: 400 }
      )
    }
    const db = await getDb()
    const last = await db.collection('testimonials').find().sort({ sortOrder: -1 }).limit(1).toArray()
    const nextOrder = last.length > 0 ? (last[0].sortOrder || 0) + 1 : 1
    const doc = {
      name: String(body.name),
      text: String(body.text ?? ''),
      rating: Math.min(5, Math.max(1, Number(body.rating || 5))),
      active: body.active !== false,
      sortOrder: Number(body.sortOrder ?? nextOrder),
      ...normalizeReviewFields(body),
    }
    const result = await db.collection('testimonials').insertOne(doc)
    return NextResponse.json({ success: true, _id: result.insertedId.toString() })
  } catch (error) {
    console.error('[v0] create testimonial error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
