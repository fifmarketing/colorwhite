import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { status } = await request.json()
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const db = await getDb()
    await db
      .collection('orders')
      .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] update order error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
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
    await db.collection('orders').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] delete order error:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
