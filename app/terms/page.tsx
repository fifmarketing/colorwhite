import type { Metadata } from 'next'
import { PolicyPage } from '@/components/policy-page'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `${settings.policies.terms.title} | ${settings.seo.siteTitle}`,
    description: settings.policies.terms.intro,
  }
}

export default async function TermsPage() {
  const settings = await getSettings()
  return <PolicyPage policy={settings.policies.terms} footer={settings.footer} />
}
