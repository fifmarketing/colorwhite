'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart()

  const subtotal = getCartTotal()
  const shipping = items.length > 0 ? 150 : 0
  const total = subtotal + shipping
  const savings = items.length > 0 ? Math.floor(subtotal * 0.05) : 0

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-secondary via-background to-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 flex items-center justify-center">
          <div className="text-center space-y-6 sm:space-y-8 max-w-2xl">
            <div className="inline-block p-5 sm:p-6 rounded-3xl bg-primary/10">
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-foreground">
                Your Cart is Empty
              </h1>
              <p className="text-sm sm:text-lg font-light text-foreground/70 leading-relaxed">
                Discover our luxurious skincare collection and add your favorite products to your cart.
              </p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 sm:gap-3 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base hover:shadow-xl transition">
              Continue Shopping
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary via-background to-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-primary/10 rounded-full mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-primary flex items-center gap-2">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              Shopping Cart
            </p>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-foreground mb-2 sm:mb-4">
            Your Luxury Items
          </h1>
          <p className="text-sm sm:text-lg text-foreground/60">
            {items.length} {items.length === 1 ? 'product' : 'products'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white/50 border border-primary/10 shadow-lg"
              >
                {/* Image */}
                <div className="relative w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg text-foreground">
                      {item.name}
                    </h3>
                    <p className="text-primary text-lg sm:text-xl">
                      Rs. {(item.price ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-xs text-foreground/60">Subtotal</p>
                  <p className="text-lg sm:text-2xl text-primary">
                    Rs. {((item.price ?? 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 p-4 sm:p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <h2 className="text-lg sm:text-xl mb-4">Order Summary</h2>

              <div className="space-y-2 sm:space-y-3 mb-4 border-b pb-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>Rs. {shipping.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Savings</span>
                    <span>-Rs. {savings.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-4 text-base sm:text-lg">
                <span>Total</span>
                <span className="text-primary font-semibold">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}