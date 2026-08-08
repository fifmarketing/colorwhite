'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroSlide {
  title: string
  description: string
  image: string
  buttonText: string
  buttonLink: string
}

interface HeroSliderProps {
  slides: HeroSlide[]
  autoplaySeconds?: number
}

/**
 * Homepage hero as an admin-managed slider. A single slide renders exactly like
 * the previous static hero (no arrows, no dots, no autoplay).
 */
export function HeroSlider({ slides, autoplaySeconds = 6 }: HeroSliderProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const count = slides.length

  const go = useCallback(
    (next: number) => {
      if (count === 0) return
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  useEffect(() => {
    if (count < 2 || paused || autoplaySeconds <= 0) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, autoplaySeconds * 1000)
    return () => window.clearInterval(timer)
  }, [count, paused, autoplaySeconds])

  if (count === 0) return null

  return (
    <section
      className="relative py-16 md:py-32 overflow-hidden"
      aria-roledescription={count > 1 ? 'carousel' : undefined}
      aria-label={count > 1 ? 'Featured highlights' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(delta) > 50) go(delta < 0 ? index + 1 : index - 1)
        touchStartX.current = null
      }}
    >
      {/* Subtle background gradient with yellow tones */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {slides.map((slide, i) => (
          <div
            key={`${slide.title}-${i}`}
            className={
              i === index
                ? 'grid md:grid-cols-2 gap-12 items-center animate-in fade-in duration-500'
                : 'hidden'
            }
            role={count > 1 ? 'group' : undefined}
            aria-roledescription={count > 1 ? 'slide' : undefined}
            aria-label={count > 1 ? `Slide ${i + 1} of ${count}` : undefined}
          >
            {/* Left: Text Content */}
            <div className="space-y-8 order-1">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                  {slide.title}
                </h1>
                <p className="text-lg font-light text-foreground/80 leading-relaxed max-w-md">
                  {slide.description}
                </p>
              </div>

              {slide.buttonText ? (
                <a
                  href={slide.buttonLink || '/shop'}
                  className="inline-block bg-primary text-white px-10 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {slide.buttonText}
                </a>
              ) : null}
            </div>

            {/* Right: Product Image */}
            <div className="order-2 flex justify-center">
              <div className="relative w-full max-w-md h-96">
                <Image
                  src={slide.image || '/hero-img.jpg'}
                  alt={slide.title || 'Color White Beauty products'}
                  fill
                  className="object-contain"
                  priority={i === 0}
                />
              </div>
            </div>
          </div>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur border border-border shadow-luxury-sm hover:bg-secondary transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur border border-border shadow-luxury-sm hover:bg-secondary transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex justify-center gap-3 mt-10">
              {slides.map((slide, i) => (
                <button
                  key={`dot-${slide.title}-${i}`}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={
                    i === index
                      ? 'h-2 w-8 rounded-full bg-primary transition-all cursor-pointer'
                      : 'h-2 w-2 rounded-full bg-foreground/25 hover:bg-foreground/40 transition-all cursor-pointer'
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
