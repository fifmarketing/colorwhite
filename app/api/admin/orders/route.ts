import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = await getDb()
  const docs = await db.collection('orders').find().sort({ createdAt: -1 }).limit(200).toArray()
  const orders = docs.map((d) => ({ ...d, _id: d._id.toString() }))
  return NextResponse.json({ orders })
}
