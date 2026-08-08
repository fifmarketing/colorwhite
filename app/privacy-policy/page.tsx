import type { Metadata } from 'next'
import { PolicyPage } from '@/components/policy-page'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `${settings.policies.privacy.title} | ${settings.seo.siteTitle}`,
    description: settings.policies.privacy.intro,
  }
}

export default async function PrivacyPolicyPage() {
  const settings = await getSettings()
  return <PolicyPage policy={settings.policies.privacy} footer={settings.footer} />
}
