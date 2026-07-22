import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { read } = await request.json()
    const db = await getDb()
    await db
      .collection('messages')
      .updateOne({ _id: new ObjectId(id) }, { $set: { read: Boolean(read) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] update message error:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
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
    await db.collection('messages').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] delete message error:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
