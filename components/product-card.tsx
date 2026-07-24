'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Sparkles, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { CartConfirmationDialog } from './cart-confirmation-dialog'
import { useState } from 'react'

interface ProductCardProps {
  id: number
  /** URL segment for the product detail page. Omit to render a non-linked card. */
  slug?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  discount?: number
  category?: string
}

/** Renders the square image well, wrapped in a link to the detail page when available. */
function ImageFrame({
  href,
  name,
  children,
}: {
  href: string | null
  name: string
  children: React.ReactNode
}) {
  const className =
    'aspect-square bg-gradient-to-br from-secondary to-primary/5 relative overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300'

  if (!href) return <div className={className}>{children}</div>

  return (
    <Link href={href} aria-label={`View details for ${name}`} className={`${className} block`}>
      {children}
    </Link>
  )
}

export function ProductCard({ 
  id, 
  slug,
  name, 
  price, 
  originalPrice,
  image, 
  rating = 4.9,
  reviews = 0,
  discount = 0,
  category = ''
}: ProductCardProps) {
  const { addToCart } = useCart()
  const [showDialog, setShowDialog] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const href = slug ? `/product/${slug}` : null

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      category,
    })
    setShowDialog(true)
    setIsAdded(true)
  }

  return (
    <>
      <div className="group flex flex-col h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-3xl mb-6 flex-shrink-0">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary/30 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {discount}% OFF
            </div>
          )}
          
          <ImageFrame href={href} name={name}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </ImageFrame>
        </div>

        {/* Content Container */}
        <div className="flex-grow flex flex-col space-y-3">
          {/* Category */}
          {category && (
            <p className="text-xs font-light tracking-widest uppercase text-primary/70">
              {category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-light tracking-wide text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {href ? (
              <Link href={href} className="hover:underline">
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className="w-4 h-4 fill-primary text-primary" 
                />
              ))}
            </div>
            <span className="text-sm font-light text-foreground">
              {rating}
            </span>
            {reviews > 0 && (
              <span className="text-xs font-light text-foreground/60">
                ({reviews.toLocaleString()})
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 pt-2">
            <p className="text-2xl font-light text-primary">
              Rs. {price.toLocaleString()}
            </p>
            {originalPrice && (
              <p className="text-lg font-light text-foreground/60 line-through">
                Rs. {originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* View Details */}
          {href && (
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 text-sm font-light text-primary transition-colors hover:text-foreground w-fit"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          )}

          {/* Quick Add Button */}
          <button 
            onClick={handleAddToCart}
            className={`w-full mt-auto py-3 px-4 rounded-xl font-semibold transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden cursor-pointer ${
              isAdded 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/40' 
                : 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-2xl hover:shadow-primary/40'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 ${!isAdded && 'group-hover:translate-x-full'} transition-transform duration-500`}></div>
            {isAdded ? (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <span>Add to Cart</span>
            )}
          </button>
        </div>
      </div>

      <CartConfirmationDialog 
        isOpen={showDialog}
        productName={name}
        onClose={() => setShowDialog(false)}
      />
    </>
  )
}
