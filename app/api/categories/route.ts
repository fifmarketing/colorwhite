import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/categories'

export const dynamic = 'force-dynamic'

// Public, read-only list of categories derived from the active products.
export async function GET() {
  const categories = await getCategories()
  return NextResponse.json({ categories })
}
