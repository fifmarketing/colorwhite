'use client'

import Image from 'next/image'
import { Star, Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { CartConfirmationDialog } from './cart-confirmation-dialog'
import { useState } from 'react'

interface ProductCardProps {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  discount?: number
  category?: string
}

export function ProductCard({ 
  id, 
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
          
          <div className="aspect-square bg-gradient-to-br from-secondary to-primary/5 relative overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
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
            {name}
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

          {/* Quick Add Button */}
          <button 
            onClick={handleAddToCart}
            className={`w-full mt-auto py-3 px-4 rounded-xl font-semibold transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden ${
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
