'use client'

import useSWR from 'swr'
import { Truck, Clock, MessageCircle, ShieldCheck, BadgeDollarSign } from 'lucide-react'

type TopBarIcon = 'cod' | 'truck' | 'whatsapp' | 'shield'

interface TopBarItem {
  icon: TopBarIcon
  text: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const icons = {
  cod: BadgeDollarSign,
  truck: Truck,
  whatsapp: MessageCircle,
  shield: ShieldCheck,
} as const

/**
 * Thin trust strip above the header (COD / delivery time / WhatsApp help).
 * Content comes from the admin-editable `topBar` settings section.
 */
export function TopBar() {
  const { data } = useSWR('/api/settings', fetcher, { revalidateOnFocus: false })

  const enabled = data?.topBar?.enabled !== false
  const items: TopBarItem[] = Array.isArray(data?.topBar?.items) ? data.topBar.items : []
  if (!enabled || items.length === 0) return null

  return (
    <div className="bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-6 overflow-x-auto py-2 md:justify-between md:gap-4 md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => {
            const Icon = icons[item.icon] ?? Clock
            return (
              <li
                key={`${item.text}-${index}`}
                className="flex items-center gap-2 flex-shrink-0 text-xs font-light tracking-wide text-foreground/80"
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{item.text}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
