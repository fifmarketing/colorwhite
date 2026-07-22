import { getSettings } from '@/lib/data'
import { CheckoutClient } from './checkout-client'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const settings = await getSettings()
  return <CheckoutClient shippingCost={settings.checkout.shippingCost} />
}
