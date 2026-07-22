import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/CartContext'
import WhatsAppButton from '../components/whatsapp-button'
import { getSettings } from '@/lib/data'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings.seo.siteTitle,
    description: settings.seo.siteDescription,
    generator: 'v0.app',
    icons: {
      icon: '/favicon.ico',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSettings()

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <WhatsAppButton phoneNumber={settings.whatsapp.phoneNumber} />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
