import { getDb, isDbConfigured } from '@/lib/mongodb'
import { slugify } from '@/lib/slug'
import {
  defaultProducts,
  defaultTestimonials,
  defaultSettings,
  productDetailDefaults,
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
  return withHeroSlideFallback(merged as unknown as SiteSettings)
}

/**
 * The homepage now renders a slider. Databases that only have the legacy single
 * `hero` object get it promoted to slide 1 so nothing looks different until the
 * client adds more slides in the admin panel.
 */
function withHeroSlideFallback(settings: SiteSettings): SiteSettings {
  const slides = settings.heroSlides?.slides
  if (Array.isArray(slides) && slides.length > 0) return settings
  return {
    ...settings,
    heroSlides: {
      autoplaySeconds: settings.heroSlides?.autoplaySeconds ?? 6,
      slides: [{ ...settings.hero }],
    },
  }
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isDbConfigured) return withHeroSlideFallback(defaultSettings)
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
      return withHeroSlideFallback(defaultSettings)
    }
    const { _id, key, ...rest } = doc as Record<string, unknown>
    return mergeSettings(rest as Partial<SiteSettings>)
  } catch (error) {
    console.error('[v0] getSettings failed, using defaults:', error)
    return withHeroSlideFallback(defaultSettings)
  }
}

/**
 * Guarantees every product object has all detail fields present, so pages and
 * the admin form never have to deal with `undefined`. Documents created before
 * the detail page existed simply get empty values (or a generated slug).
 */
export function normalizeProduct(raw: Record<string, unknown>, id: string): Product {
  const doc = raw as unknown as Partial<ProductDoc>
  return {
    _id: id,
    productId: Number(doc.productId ?? 0),
    slug: (doc.slug as string) || slugify(String(doc.name ?? '')) || `product-${doc.productId ?? id}`,
    name: String(doc.name ?? ''),
    category: String(doc.category ?? ''),
    price: Number(doc.price ?? 0),
    originalPrice: Number(doc.originalPrice ?? doc.price ?? 0),
    image: String(doc.image || '/placeholder.svg'),
    rating: Number(doc.rating ?? 5),
    reviews: Number(doc.reviews ?? 0),
    discount: Number(doc.discount ?? 0),
    featured: doc.featured !== false,
    active: doc.active !== false,
    sortOrder: Number(doc.sortOrder ?? 0),
    tagline: doc.tagline ?? productDetailDefaults.tagline,
    shortDescription: doc.shortDescription ?? productDetailDefaults.shortDescription,
    longDescription: doc.longDescription ?? productDetailDefaults.longDescription,
    benefits: Array.isArray(doc.benefits) ? doc.benefits : [],
    features: Array.isArray(doc.features) ? doc.features : [],
    howToUse: Array.isArray(doc.howToUse) ? doc.howToUse : [],
    ingredients: doc.ingredients ?? productDetailDefaults.ingredients,
    gallery: Array.isArray(doc.gallery) ? doc.gallery : [],
    faqs: Array.isArray(doc.faqs) ? doc.faqs : [],
    size: doc.size ?? productDetailDefaults.size,
    skinType: doc.skinType ?? productDetailDefaults.skinType,
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
  await ensureProductDetails()
}

/**
 * One-time migration for databases seeded before the product detail page
 * existed: copies the written detail content onto matching products and
 * generates a slug for anything still missing one.
 */
async function ensureProductDetails() {
  const db = await getDb()
  const done = await db.collection('meta').findOne({ key: 'product_details_v1' })
  if (done) return

  const existing = await db.collection('products').find({}).toArray()
  const takenSlugs = new Set<string>()

  for (const doc of existing) {
    const preset = defaultProducts.find((p) => p.productId === doc.productId)
    const update: Record<string, unknown> = {}

    // Fill in detail fields from the written content where we recognise the product.
    if (preset) {
      const detailKeys = [
        'tagline',
        'shortDescription',
        'longDescription',
        'benefits',
        'features',
        'howToUse',
        'ingredients',
        'gallery',
        'faqs',
        'size',
        'skinType',
      ] as const
      for (const key of detailKeys) {
        const current = doc[key]
        const isEmpty =
          current === undefined ||
          current === null ||
          current === '' ||
          (Array.isArray(current) && current.length === 0)
        if (isEmpty) update[key] = preset[key]
      }
    }

    // Every product needs a unique slug for its detail page URL.
    let slug: string = typeof doc.slug === 'string' && doc.slug ? doc.slug : ''
    if (!slug) slug = preset?.slug || slugify(String(doc.name ?? '')) || `product-${doc.productId}`
    let candidate = slug
    let n = 2
    while (takenSlugs.has(candidate)) candidate = `${slug}-${n++}`
    takenSlugs.add(candidate)
    if (candidate !== doc.slug) update.slug = candidate

    if (Object.keys(update).length > 0) {
      await db.collection('products').updateOne({ _id: doc._id }, { $set: update })
    }
  }

  await db
    .collection('meta')
    .updateOne(
      { key: 'product_details_v1' },
      { $setOnInsert: { key: 'product_details_v1', at: new Date() } },
      { upsert: true }
    )
}

function fallbackProducts(): Product[] {
  return defaultProducts.map((p, i) => ({ ...p, _id: `default-${i}` }))
}

export async function getProducts(options?: { includeInactive?: boolean }): Promise<Product[]> {
  if (!isDbConfigured) return fallbackProducts()
  try {
    await ensureProductsSeeded()
    const db = await getDb()
    const filter = options?.includeInactive ? {} : { active: { $ne: false } }
    const docs = await db.collection('products').find(filter).sort({ sortOrder: 1 }).toArray()
    return docs.map((d) => normalizeProduct(d as Record<string, unknown>, d._id.toString()))
  } catch (error) {
    console.error('[v0] getProducts failed, using defaults:', error)
    return fallbackProducts()
  }
}

/** Fetches a single active product by its slug. Returns null when not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDbConfigured) return fallbackProducts().find((p) => p.slug === slug) ?? null
  try {
    await ensureProductsSeeded()
    const db = await getDb()
    const doc = await db.collection('products').findOne({ slug, active: { $ne: false } })
    if (!doc) return null
    return normalizeProduct(doc as Record<string, unknown>, doc._id.toString())
  } catch (error) {
    console.error('[v0] getProductBySlug failed, using defaults:', error)
    const index = defaultProducts.findIndex((p) => p.slug === slug)
    if (index === -1) return null
    return { ...defaultProducts[index], _id: `default-${index}` }
  }
}

/** Other products to show in the "You may also like" row. */
export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const all = await getProducts()
  const others = all.filter((p) => p.slug !== product.slug)
  const sameCategory = others.filter((p) => p.category === product.category)
  const rest = others.filter((p) => p.category !== product.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

/**
 * Guarantees the optional review fields (screenshot, product link, city…) are
 * always present so components never branch on `undefined`.
 */
export function normalizeTestimonial(raw: Record<string, unknown>, id: string): Testimonial {
  const doc = raw as unknown as Partial<TestimonialDoc>
  return {
    _id: id,
    name: String(doc.name ?? ''),
    text: String(doc.text ?? ''),
    rating: Number(doc.rating ?? 5),
    active: doc.active !== false,
    sortOrder: Number(doc.sortOrder ?? 0),
    image: typeof doc.image === 'string' ? doc.image : '',
    productSlug: typeof doc.productSlug === 'string' ? doc.productSlug : '',
    city: typeof doc.city === 'string' ? doc.city : '',
    source: doc.source === 'whatsapp' ? 'whatsapp' : 'website',
    verified: doc.verified === true,
    dateLabel: typeof doc.dateLabel === 'string' ? doc.dateLabel : '',
  }
}

function fallbackTestimonials(): Testimonial[] {
  return defaultTestimonials.map((t, i) =>
    normalizeTestimonial(t as unknown as Record<string, unknown>, `default-${i}`)
  )
}

export async function getTestimonials(options?: {
  includeInactive?: boolean
}): Promise<Testimonial[]> {
  if (!isDbConfigured) return fallbackTestimonials()
  try {
    await ensureTestimonialsSeeded()
    const db = await getDb()
    const filter = options?.includeInactive ? {} : { active: { $ne: false } }
    const docs = await db.collection('testimonials').find(filter).sort({ sortOrder: 1 }).toArray()
    return docs.map((d) => normalizeTestimonial(d as Record<string, unknown>, d._id.toString()))
  } catch (error) {
    console.error('[v0] getTestimonials failed, using defaults:', error)
    return fallbackTestimonials()
  }
}

/** Active reviews attached to a specific product detail page. */
export async function getTestimonialsForProduct(slug: string): Promise<Testimonial[]> {
  if (!slug) return []
  const all = await getTestimonials()
  return all.filter((t) => t.productSlug === slug)
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
