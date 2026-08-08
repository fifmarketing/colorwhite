'use client'

import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import useSWR from 'swr'

interface FooterProps {
  email?: string
  instagramUrl?: string
  facebookUrl?: string
  copyrightText?: string
  aboutText?: string
  phone?: string
  whatsapp?: string
  address?: string
  hours?: string
  tiktokUrl?: string
  youtubeUrl?: string
  showPaymentBadges?: boolean
}

interface FooterCategory {
  slug: string
  name: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const defaults = {
  email: 'colorwhitecosmetics@gmail.com',
  instagramUrl: 'https://www.instagram.com/colorwhitecosmetics/',
  facebookUrl: 'https://web.facebook.com/ColorWhiteBeautyCream',
  copyrightText: 'Copyright © 2026 Color White Beauty',
  aboutText:
    'Color White Cosmetics is a proudly Pakistani skincare brand offering premium quality products for healthy, glowing skin — delivered across Pakistan with Cash on Delivery.',
  phone: '+92 300 7222669',
  whatsapp: '+923404476857',
  address: '10-H Afghani Road, Samanabad, Lahore, 54000, Punjab, Pakistan',
  hours: 'Mon – Sat | 10:00 AM – 7:00 PM',
  tiktokUrl: '',
  youtubeUrl: '',
  showPaymentBadges: true,
}

const supportLinks = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/shipping-policy', label: 'Shipping Policy' },
  { href: '/returns-policy', label: 'Return and Exchange Policy' },
]

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms and Conditions' },
]

const paymentBadges = ['Cash on Delivery', 'Bank Transfer', 'easypaisa', 'JazzCash']

export function Footer(props: FooterProps) {
  // When no props are passed (client-only pages), hydrate footer content
  // from the public settings endpoint so admin edits are always reflected.
  const hasProps = props.email !== undefined
  const { data } = useSWR(hasProps ? null : '/api/settings', fetcher, {
    revalidateOnFocus: false,
  })
  const { data: categoryData } = useSWR('/api/categories', fetcher, { revalidateOnFocus: false })
  const categories: FooterCategory[] = Array.isArray(categoryData?.categories)
    ? categoryData.categories.slice(0, 6)
    : []

  const value = <K extends keyof typeof defaults>(key: K): (typeof defaults)[K] =>
    (props[key] ?? data?.footer?.[key] ?? defaults[key]) as (typeof defaults)[K]

  const email = value('email')
  const phone = value('phone')
  const whatsapp = value('whatsapp')
  const whatsappHref = `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`

  return (
    <footer className="bg-secondary text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 — About */}
          <div className="flex flex-col gap-5">
            <h3 className="text-base font-medium tracking-wide text-foreground">About Us</h3>
            <p className="text-sm font-light leading-relaxed text-foreground/70">
              {value('aboutText')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={value('instagramUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground/70 hover:text-primary hover:scale-105 transition-all cursor-pointer"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a
                href={value('facebookUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground/70 hover:text-primary hover:scale-105 transition-all cursor-pointer"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {value('tiktokUrl') && (
                <a
                  href={value('tiktokUrl')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground/70 hover:text-primary hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="sr-only">TikTok</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}
              {value('youtubeUrl') && (
                <a
                  href={value('youtubeUrl')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground/70 hover:text-primary hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="sr-only">YouTube</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.121 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2 — Shop */}
          <nav className="flex flex-col gap-5" aria-label="Shop">
            <h3 className="text-base font-medium tracking-wide text-foreground">Shop</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/shop"
                  className="text-sm font-light text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                >
                  All Products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm font-light text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-sm font-light text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                >
                  All Categories
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 3 — Customer Support */}
          <nav className="flex flex-col gap-5" aria-label="Customer support">
            <h3 className="text-base font-medium tracking-wide text-foreground">
              Customer Support
            </h3>
            <ul className="flex flex-col gap-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/reviews"
                  className="text-sm font-light text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                >
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4 — Legal and Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="text-base font-medium tracking-wide text-foreground">Legal &amp; Contact</h3>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-3 pt-2">
              <li className="flex items-start gap-3 text-sm font-light text-foreground/70">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors cursor-pointer">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-light text-foreground/70">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.397.52-.595.174-.198.232-.34.347-.567.116-.226.058-.42-.03-.594-.086-.174-.66-1.59-.904-2.176-.239-.58-.482-.5-.66-.51-.174-.008-.372-.01-.57-.01a1.1 1.1 0 00-.795.372c-.273.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  WhatsApp: {whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-light text-foreground/70">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors cursor-pointer break-all">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-light text-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{value('address')}</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light text-foreground/70">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{value('hours')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-foreground/10 my-10"></div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="text-xs sm:text-sm font-light tracking-wide text-foreground/70">
            {value('copyrightText')} | Made with love by{' '}
            <a
              href="https://aamax.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary cursor-pointer"
            >
              AAMAX
            </a>
          </p>

          {value('showPaymentBadges') && (
            <ul className="flex flex-wrap items-center gap-2">
              {paymentBadges.map((badge) => (
                <li
                  key={badge}
                  className="px-3 py-1.5 rounded-md bg-background text-[11px] font-light tracking-wide text-foreground/70"
                >
                  {badge}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
