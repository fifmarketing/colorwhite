import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FaqAccordion } from '@/components/faq-accordion'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `${settings.faqs.title} | ${settings.seo.siteTitle}`,
    description: settings.faqs.subtitle,
  }
}

export default async function FaqsPage() {
  const settings = await getSettings()
  const { faqs, footer, whatsapp } = settings

  // Group questions by their category label, preserving admin ordering.
  const groups: { category: string; items: { question: string; answer: string }[] }[] = []
  for (const item of faqs.items) {
    const category = item.category?.trim() || 'General'
    const existing = groups.find((g) => g.category === category)
    if (existing) existing.items.push(item)
    else groups.push({ category, items: [item] })
  }

  const whatsappHref = `https://wa.me/${(whatsapp.phoneNumber ?? '').replace(/[^\d]/g, '')}`

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground text-balance">
            {faqs.title}
          </h1>
          <p className="text-lg font-light leading-relaxed text-foreground/70 text-pretty">
            {faqs.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {groups.map((group) => (
            <div key={group.category} className="flex flex-col gap-4">
              <h2 className="text-sm font-light tracking-widest uppercase text-primary">
                {group.category}
              </h2>
              <FaqAccordion items={group.items} idPrefix={group.category} />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-secondary p-6">
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-base font-medium text-foreground">Still have a question?</p>
              <p className="text-sm font-light text-foreground/70">
                Our team replies on WhatsApp Monday to Saturday, 10:00 AM to 7:00 PM.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-light hover:opacity-90 transition-opacity cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-background text-foreground text-sm font-light hover:text-primary transition-colors cursor-pointer"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer {...footer} />
    </main>
  )
}
