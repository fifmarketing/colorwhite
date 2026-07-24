'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { CartConfirmationDialog } from './cart-confirmation-dialog'

interface ProductPurchaseProps {
  id: number
  name: string
  price: number
  image: string
  category?: string
}

export function ProductPurchase({ id, name, price, image, category = '' }: ProductPurchaseProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [showDialog, setShowDialog] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id, name, price, image, category })
    }
    setShowDialog(true)
    setIsAdded(true)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 self-start">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-lg font-light" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            aria-label="Increase quantity"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 cursor-pointer ${
            isAdded
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-primary text-primary-foreground shadow-lg hover:shadow-2xl hover:shadow-primary/40'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-5 w-5" />
              Added — Add More
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              Add to Cart — Rs. {(price * quantity).toLocaleString()}
            </>
          )}
        </button>
      </div>

      <CartConfirmationDialog
        isOpen={showDialog}
        productName={name}
        onClose={() => setShowDialog(false)}
      />
    </>
  )
}
