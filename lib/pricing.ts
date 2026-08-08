import { getProducts, getSettings } from '@/lib/data'

/**
 * Server-side order pricing.
 *
 * The browser sends only product ids and quantities. Every price, the shipping
 * charge and the order total are recomputed here from the database so a tampered
 * request cannot change what the customer is charged.
 */

/** Hard cap per line so a single request cannot claim an absurd quantity. */
const MAX_QUANTITY_PER_ITEM = 20
/** Hard cap across the whole order. */
const MAX_TOTAL_QUANTITY = 50

export interface CartLineInput {
  id: string | number
  quantity: number
}

export interface PricedLine {
  id: string
  name: string
  /** Unit price taken from the database, never from the request. */
  price: number
  quantity: number
  lineTotal: number
  image: string
}

export interface PricedOrder {
  items: PricedLine[]
  subtotal: number
  shipping: number
  total: number
  freeShippingApplied: boolean
}

export class PricingError extends Error {}

function parseQuantity(raw: unknown): number {
  const quantity = Number(raw)
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new PricingError('Item quantities must be whole numbers of at least 1.')
  }
  if (quantity > MAX_QUANTITY_PER_ITEM) {
    throw new PricingError(
      `You can order at most ${MAX_QUANTITY_PER_ITEM} units of a single product. Please contact us for bulk orders.`
    )
  }
  return quantity
}

/**
 * Recomputes an order from trusted data. Throws PricingError with a
 * customer-safe message when the cart cannot be priced.
 */
export async function priceOrder(rawItems: unknown): Promise<PricedOrder> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new PricingError('Your cart is empty.')
  }

  const [products, settings] = await Promise.all([getProducts(), getSettings()])

  // Merge duplicate lines first so per-item caps cannot be bypassed by
  // splitting one product across several entries.
  const quantityById = new Map<string, number>()
  for (const raw of rawItems as CartLineInput[]) {
    const id = String(raw?.id ?? '').trim()
    if (!id) throw new PricingError('One of the cart items is missing a product reference.')
    const quantity = parseQuantity(raw?.quantity)
    quantityById.set(id, (quantityById.get(id) ?? 0) + quantity)
  }

  const items: PricedLine[] = []
  for (const [id, mergedQuantity] of quantityById) {
    // The cart stores productId, but fall back to the Mongo _id and slug.
    const product = products.find(
      (p) => p.productId === id || p._id === id || p.slug === id
    )
    if (!product) {
      throw new PricingError('One of the products in your cart is no longer available.')
    }
    const quantity = parseQuantity(mergedQuantity)
    const price = Number(product.price)
    if (!Number.isFinite(price) || price <= 0) {
      throw new PricingError(`${product.name} is not available for purchase right now.`)
    }
    items.push({
      id: product.productId,
      name: product.name,
      price,
      quantity,
      lineTotal: price * quantity,
      image: product.image,
    })
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  if (totalQuantity > MAX_TOTAL_QUANTITY) {
    throw new PricingError(
      `Orders are limited to ${MAX_TOTAL_QUANTITY} items. Please contact us on WhatsApp for larger orders.`
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const { shippingCost, freeShippingThreshold } = settings.checkout
  const freeShippingApplied = freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
  const shipping = freeShippingApplied ? 0 : Number(shippingCost) || 0

  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShippingApplied,
  }
}
