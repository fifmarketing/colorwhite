import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getProducts } from '@/lib/data'
import { slugify, uniqueSlug } from '@/lib/slug'
import { normalizeDetailFields } from '@/lib/product-payload'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const products = await getProducts({ includeInactive: true })
  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    if (!body.name || typeof body.price !== 'number') {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }
    const db = await getDb()
    const last = await db.collection('products').find().sort({ productId: -1 }).limit(1).toArray()
    const nextId = last.length > 0 ? (last[0].productId || 0) + 1 : 1
    const lastOrder = await db.collection('products').find().sort({ sortOrder: -1 }).limit(1).toArray()
    const nextOrder = lastOrder.length > 0 ? (lastOrder[0].sortOrder || 0) + 1 : 1

    // Slugs drive the /product/[slug] URL, so they have to stay unique.
    const takenSlugs = (
      await db.collection('products').find({}, { projection: { slug: 1 } }).toArray()
    )
      .map((d) => d.slug)
      .filter((s): s is string => typeof s === 'string')
    const slug = uniqueSlug(slugify(String(body.slug || '')) || String(body.name), takenSlugs)

    const doc = {
      productId: nextId,
      slug,
      name: String(body.name),
      category: String(body.category || ''),
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      image: String(body.image || '/placeholder.svg'),
      rating: Number(body.rating || 5),
      reviews: Number(body.reviews || 0),
      discount: Number(body.discount || 0),
      featured: body.featured !== false,
      active: body.active !== false,
      sortOrder: Number(body.sortOrder ?? nextOrder),
      ...normalizeDetailFields(body),
    }
    const result = await db.collection('products').insertOne(doc)
    return NextResponse.json({ success: true, _id: result.insertedId.toString(), slug })
  } catch (error) {
    console.error('[v0] create product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
