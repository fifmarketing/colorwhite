/**
 * Turns a product name into a URL-safe slug used by /product/[slug].
 * "Bright Complexion Serum" -> "bright-complexion-serum"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Returns a slug that is not already used by another product.
 * Appends -2, -3, ... until the slug is free.
 */
export function uniqueSlug(base: string, taken: string[]): string {
  const root = slugify(base) || 'product'
  if (!taken.includes(root)) return root
  let n = 2
  while (taken.includes(`${root}-${n}`)) n++
  return `${root}-${n}`
}
