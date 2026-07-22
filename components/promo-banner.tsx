'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface PromoBannerProps {
  enabled?: boolean
  title?: string
  message?: string
  offerText?: string
  image?: string
  buttonText?: string
  buttonLink?: string
  durationSeconds?: number
}

export function PromoBanner({
  enabled = true,
  title = 'Welcome to Color White Beauty!',
  message = 'Free Shipping on orders above Rs. 2000.',
  offerText = 'Special Offer Inside!',
  image = '/hero-img.jpg',
  buttonText = 'Shop Now',
  buttonLink = '/shop',
  durationSeconds = 5,
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIsExpired(true)
      return
    }

    // Check if promo has already been shown
    const promoShown = localStorage.getItem('promoShown')

    if (!promoShown) {
      // Show banner on first visit
      setIsVisible(true)

      const hideTimer = setTimeout(() => {
        setIsVisible(false)
        // Mark as shown so it won't appear again
        localStorage.setItem('promoShown', 'true')
        setIsExpired(true)
      }, durationSeconds * 1000)

      return () => clearTimeout(hideTimer)
    } else {
      setIsExpired(true)
    }
  }, [enabled, durationSeconds])

  if (!enabled || isExpired || !isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false)
            localStorage.setItem('promoShown', 'true')
            setIsExpired(true)
          }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Logo/Image */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-32 h-32">
            <Image
              src={image || '/hero-img.jpg'}
              alt="Color White Beauty Promo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-foreground/70 font-light">
            {message}
          </p>

          {/* Promo Message */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-primary font-semibold">
              🎉 {offerText}
            </p>
          </div>

          {/* CTA Button */}
          <a
            href={buttonLink}
            className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  )
}
