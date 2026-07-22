import { getDb } from '@/lib/mongodb'
import {
  defaultProducts,
  defaultTestimonials,
  defaultSettings,
  type SiteSettings,
  type ProductDoc,
  type TestimonialDoc,
} from '@/lib/default-content'

export interface Product extends ProductDoc {
  _id: string
}

export interface Testimonial extends TestimonialDoc {
  _id: string
}

// Deep-merge stored settings over the defaults so newly added
// fields always have a value even for older documents.
function mergeSettings(stored: Partial<SiteSettings> | null): SiteSettings {
  if (!stored) return defaultSettings
  const merged: Record<string, unknown> = { ...defaultSettings }
  for (const key of Object.keys(defaultSettings) as (keyof SiteSettings)[]) {
    const defaultSection = defaultSettings[key]
    const storedSection = stored[key]
    if (storedSection && typeof storedSection === 'object' && !Array.isArray(storedSection)) {
      merged[key] = { ...defaultSection, ...storedSection }
    } else if (storedSection !== undefined) {
      merged[key] = storedSection
    }
  }
  return merged as unknown as SiteSettings
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb()
    const doc = await db.collection('settings').findOne({ key: 'site' })
    if (!doc) {
      await db
        .collection('settings')
        .updateOne(
          { key: 'site' },
          { $setOnInsert: { key: 'site', ...defaultSettings } },
          { upsert: true }
        )
      return defaultSettings
    }
    const { _id, key, ...rest } = doc as Record<string, unknown>
    return mergeSettings(rest as Partial<SiteSettings>)
  } catch (error) {
    console.error('[v0] getSettings failed, using defaults:', error)
    return defaultSettings
  }
}

async function ensureProductsSeeded() {
  const db = await getDb()
  const meta = await db.collection('meta').findOne({ key: 'products_seeded' })
  if (!meta) {
    const count = await db.collection('products').countDocuments()
    if (count === 0) {
      await db.collection('products').insertMany(defaultProducts.map((p) => ({ ...p })))
    }
    await db
      .collection('meta')
      .updateOne(
        { key: 'products_seeded' },
        { $setOnInsert: { key: 'products_seeded', at: new Date() } },
        { upsert: true }
      )
  }
}

async function ensureTestimonialsSeeded() {
  const db = await getDb()
  const meta = await db.collection('meta').findOne({ key: 'testimonials_seeded' })
  if (!meta) {
    const count = await db.collection('testimonials').countDocuments()
    if (count === 0) {
      await db.collection('testimonials').insertMany(defaultTestimonials.map((t) => ({ ...t })))
    }
    await db
      .collection('meta')
      .updateOne(
        { key: 'testimonials_seeded' },
        { $setOnInsert: { key: 'testimonials_seeded', at: new Date() } },
        { upsert: true }
      )
  }
}

export async function getProducts(options?: { includeInactive?: boolean }): Promise<Product[]> {
  try {
    await ensureProductsSeeded()
    const db = await getDb()
    const filter = options?.includeInactive ? {} : { active: { $ne: false } }
    const docs = await db.collection('products').find(filter).sort({ sortOrder: 1 }).toArray()
    return docs.map((d) => ({ ...(d as unknown as ProductDoc), _id: d._id.toString() }))
  } catch (error) {
    console.error('[v0] getProducts failed, using defaults:', error)
    return defaultProducts.map((p, i) => ({ ...p, _id: `default-${i}` }))
  }
}

export async function getTestimonials(options?: {
  includeInactive?: boolean
}): Promise<Testimonial[]> {
  try {
    await ensureTestimonialsSeeded()
    const db = await getDb()
    const filter = options?.includeInactive ? {} : { active: { $ne: false } }
    const docs = await db.collection('testimonials').find(filter).sort({ sortOrder: 1 }).toArray()
    return docs.map((d) => ({ ...(d as unknown as TestimonialDoc), _id: d._id.toString() }))
  } catch (error) {
    console.error('[v0] getTestimonials failed, using defaults:', error)
    return defaultTestimonials.map((t, i) => ({ ...t, _id: `default-${i}` }))
  }
}
