import type { ProductFaq, ProductFeature } from '@/lib/default-content'

/**
 * Cleans the product-detail portion of an admin request body: trims strings,
 * drops empty list entries and discards anything with the wrong shape, so the
 * database never stores half-filled feature or FAQ objects.
 */
export function normalizeDetailFields(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {}

  for (const key of ['tagline', 'shortDescription', 'longDescription', 'ingredients', 'size', 'skinType'] as const) {
    if (body[key] !== undefined) out[key] = String(body[key] ?? '').trim()
  }

  for (const key of ['benefits', 'howToUse', 'gallery'] as const) {
    if (body[key] !== undefined) {
      out[key] = Array.isArray(body[key])
        ? (body[key] as unknown[]).map((v) => String(v ?? '').trim()).filter(Boolean)
        : []
    }
  }

  if (body.features !== undefined) {
    out.features = Array.isArray(body.features)
      ? (body.features as Partial<ProductFeature>[])
          .map((f) => ({ title: String(f?.title ?? '').trim(), desc: String(f?.desc ?? '').trim() }))
          .filter((f) => f.title || f.desc)
      : []
  }

  if (body.faqs !== undefined) {
    out.faqs = Array.isArray(body.faqs)
      ? (body.faqs as Partial<ProductFaq>[])
          .map((f) => ({
            question: String(f?.question ?? '').trim(),
            answer: String(f?.answer ?? '').trim(),
          }))
          .filter((f) => f.question || f.answer)
      : []
  }

  return out
}
