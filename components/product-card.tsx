import Image from 'next/image'
import { Star, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  rating?: number
}

export function ProductCard({ id, name, price, image, rating = 4.8 }: ProductCardProps) {
  return (
    <div className="group hover-lift">
      <div className="relative overflow-hidden rounded-3xl shadow-luxury mb-4">
        <div className="aspect-square bg-secondary relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-500 ease-out"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-end justify-center pb-4">
          <button className="bg-primary text-primary-foreground px-8 py-2 rounded-full font-light tracking-wide hover:shadow-2xl transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0">
            <ShoppingCart className="w-5 h-5 inline mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-light tracking-wide text-foreground line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-light text-primary">Rs. {price.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-light text-muted-foreground">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
