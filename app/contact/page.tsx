import { getSettings } from '@/lib/data'
import { ContactClient } from './contact-client'

export const dynamic = 'force-dynamic'

export default async function Contact() {
  const settings = await getSettings()
  return <ContactClient contactPage={settings.contactPage} footer={settings.footer} />
}
