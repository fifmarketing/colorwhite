import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'

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
    const db = await getDb()
    await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: update })
    return NextResponse.json({ success: true })
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
