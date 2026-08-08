/**
 * Shared shaping for the optional review fields (WhatsApp screenshot, city,
 * date label, verified badge, source and product tags) so the create and
 * update routes always write the same document shape.
 */

export interface NormalizedReviewFields {
  image: string
  city: string
  dateLabel: string
  verified: boolean
  source: 'whatsapp' | 'website'
  productSlugs: string[]
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeReviewFields(body: Record<string, unknown>): NormalizedReviewFields {
  const source = body.source === 'website' ? 'website' : 'whatsapp'

  const productSlugs = Array.isArray(body.productSlugs)
    ? Array.from(
        new Set(
          body.productSlugs
            .map((slug) => asString(slug))
            .filter((slug) => slug.length > 0)
        )
      )
    : []

  return {
    image: asString(body.image),
    city: asString(body.city),
    dateLabel: asString(body.dateLabel),
    verified: body.verified !== false,
    source,
    productSlugs,
  }
}

/**
 * Same shape, but only for the keys actually present in a PATCH/PUT body so a
 * partial update (like the visibility toggle) does not wipe stored values.
 */
export function pickReviewFieldUpdates(
  body: Record<string, unknown>
): Partial<NormalizedReviewFields> {
  const full = normalizeReviewFields(body)
  const updates: Partial<NormalizedReviewFields> = {}
  const keys: (keyof NormalizedReviewFields)[] = [
    'image',
    'city',
    'dateLabel',
    'verified',
    'source',
    'productSlugs',
  ]
  for (const key of keys) {
    if (key in body) {
      // Assigning through a union-safe cast; each key maps to its own type.
      ;(updates as Record<string, unknown>)[key] = full[key]
    }
  }
  return updates
}
