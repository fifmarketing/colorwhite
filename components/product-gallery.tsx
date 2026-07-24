'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface ProductGalleryProps {
  name: string
  images: string[]
  discount?: number
}

export function ProductGallery({ name, images, discount = 0 }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const gallery = images.length > 0 ? images : ['/placeholder.svg']

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-3xl ring-2 ring-primary/20">
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary/30 flex items-center gap-1">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            {discount}% OFF
          </div>
        )}
        <div className="aspect-square relative bg-gradient-to-br from-secondary to-primary/5">
          <Image
            src={gallery[active] || '/placeholder.svg'}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="flex flex-wrap gap-3" role="tablist" aria-label={`${name} images`}>
          {gallery.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`View image ${i + 1} of ${name}`}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
                active === i
                  ? 'ring-2 ring-primary'
                  : 'ring-1 ring-border hover:ring-primary/50 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={src || '/placeholder.svg'}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
