'use client'

import { useEffect, useRef, useState } from 'react'
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

  const firstCopyRef = useRef<HTMLUListElement>(null)
  const [copyWidth, setCopyWidth] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)

  const enabled = data?.topBar?.enabled !== false
  const items: TopBarItem[] = Array.isArray(data?.topBar?.items) ? data.topBar.items : []

  // Measure one copy so the animation can shift by exactly that distance, and
  // re-measure when the viewport or the admin-editable content changes.
  useEffect(() => {
    const measure = () => {
      setCopyWidth(firstCopyRef.current?.scrollWidth ?? 0)
      setViewportWidth(window.innerWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items])

  // Enough copies to cover the screen plus the one scrolling out of view.
  const copies =
    copyWidth > 0 ? Math.max(2, Math.ceil(viewportWidth / copyWidth) + 1) : 2

  if (!enabled || items.length === 0) return null

  return (
    <div className="bg-secondary border-b border-border overflow-hidden py-2">
      {/* The track scrolls left by exactly one copy's width, so the next copy
          lands where the first began and the loop is seamless. Pausing on
          hover/focus lets people read the WhatsApp number. */}
      <div
        className="flex w-max animate-marquee-rtl hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        style={
          {
            '--marquee-shift': copyWidth ? `${copyWidth}px` : undefined,
            // Constant speed regardless of how much text the admin adds.
            '--marquee-duration': copyWidth ? `${copyWidth / 60}s` : undefined,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: copies }, (_, copy) => (
          <ul
            key={copy}
            ref={copy === 0 ? firstCopyRef : undefined}
            className="flex items-center"
            aria-hidden={copy > 0}
          >
            {items.map((item, index) => {
              const Icon = icons[item.icon] ?? Clock
              return (
                <li
                  key={`${item.text}-${index}`}
                  className="flex items-center gap-2 flex-shrink-0 pr-10 text-xs font-light tracking-wide text-foreground/80"
                >
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{item.text}</span>
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}
