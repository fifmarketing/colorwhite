import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { slugify, uniqueSlug } from '@/lib/slug'
import { normalizeDetailFields } from '@/lib/product-payload'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await request.json()
    const update: Record<string, unknown> = {}
    const allowed = [
      'name',
      'category',
      'price',
      'originalPrice',
      'image',
      'rating',
      'reviews',
      'discount',
      'featured',
      'active',
      'sortOrder',
    ]
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key]
    }
    Object.assign(update, normalizeDetailFields(body))

    const db = await getDb()

    // Keep the detail page URL unique across every other product.
    if (body.slug !== undefined || body.name !== undefined) {
      const base = slugify(String(body.slug || '')) || slugify(String(body.name || ''))
      if (base) {
        const others = await db
          .collection('products')
          .find({ _id: { $ne: new ObjectId(id) } }, { projection: { slug: 1 } })
          .toArray()
        const taken = others.map((d) => d.slug).filter((s): s is string => typeof s === 'string')
        update.slug = uniqueSlug(base, taken)
      }
    }

    await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: update })
    return NextResponse.json({ success: true, slug: update.slug })
  } catch (error) {
    console.error('[v0] update product error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
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
    await db.collection('products').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] delete product error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
