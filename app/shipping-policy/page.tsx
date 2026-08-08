import type { Metadata } from 'next'
import { PolicyPage } from '@/components/policy-page'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `${settings.policies.shipping.title} | ${settings.seo.siteTitle}`,
    description: settings.policies.shipping.intro,
  }
}

export default async function ShippingPolicyPage() {
  const settings = await getSettings()
  return <PolicyPage policy={settings.policies.shipping} footer={settings.footer} />
}
