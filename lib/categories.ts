import { slugify } from '@/lib/slug'
import { getProducts, type Product } from '@/lib/data'

export interface Category {
  slug: string
  name: string
  count: number
  image: string
}

/** Groups the active products by their `category` label, preserving product order. */
export function deriveCategories(products: Product[]): Category[] {
  const map = new Map<string, Category>()
  for (const product of products) {
    const name = (product.category || '').trim()
    if (!name) continue
    const slug = slugify(name)
    if (!slug) continue
    const existing = map.get(slug)
    if (existing) {
      existing.count += 1
      if (!existing.image || existing.image === '/placeholder.svg') existing.image = product.image
    } else {
      map.set(slug, { slug, name, count: 1, image: product.image })
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function getCategories(): Promise<Category[]> {
  return deriveCategories(await getProducts())
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find((c) => c.slug === slug) ?? null
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => slugify((p.category || '').trim()) === slug)
}
