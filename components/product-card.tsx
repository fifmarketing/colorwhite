import Image from 'next/image'
import { Star } from 'lucide-react'

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
  return (
    <div className="group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl mb-6 flex-shrink-0">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
            {discount}% OFF
          </div>
        )}
        
        <div className="aspect-square bg-secondary relative overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-grow flex flex-col space-y-3">
        {/* Category */}
        {category && (
          <p className="text-xs font-light tracking-widest uppercase text-muted-foreground">
            {category}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-light tracking-wide text-foreground line-clamp-2">
          {name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className="w-4 h-4 fill-primary text-primary" 
              />
            ))}
          </div>
          <span className="text-sm font-light text-foreground">
            {rating} {reviews > 0 && `(${reviews.toLocaleString()} Reviews)`}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-3 pt-2">
          <p className="text-2xl font-light text-foreground">
            Rs. {price.toLocaleString()}
          </p>
          {originalPrice && (
            <p className="text-lg font-light text-muted-foreground line-through">
              Rs. {originalPrice.toLocaleString()}
            </p>
          )}
        </div>

        {/* Quick Add Button */}
        <button className="w-full mt-auto bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95">
          Quick Add
        </button>
      </div>
    </div>
  )
}
