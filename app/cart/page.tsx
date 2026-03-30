'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center justify-center">
          <div className="text-center space-y-8 max-w-2xl">
            <div className="inline-block p-6 rounded-3xl bg-primary/10">
              <ShoppingBag className="w-16 h-16 text-primary mx-auto" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-light text-foreground text-balance">
                Your Cart is Empty
              </h1>
              <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                Discover our luxurious skincare collection and add your favorite premium beauty products to your cart.
              </p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-8 py-4 rounded-full font-light tracking-wide hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 ease-out transform hover:scale-105 group cursor-pointer">
              Continue Shopping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

      {/* Cart Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <p className="text-sm font-light text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Shopping Cart
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-foreground text-balance mb-4">
            Your Luxury Items
          </h1>
          <p className="text-lg font-light text-foreground/60">
            {items.length} {items.length === 1 ? 'product' : 'products'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="group flex gap-6 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Product Image */}
                <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-primary/5 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    {item.category && (
                      <p className="text-xs font-light tracking-widest uppercase text-primary/70 mb-2">
                        {item.category}
                      </p>
                    )}
                    <h3 className="text-lg font-light text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-light text-primary">
                        Rs. {(item.price ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs font-light text-foreground/60 px-3 py-1 rounded-full bg-primary/5">
                        Premium Quality
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-2 border border-primary/20">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                      >
                        <Minus className="w-4 h-4 text-primary" />
                      </button>
                      <span className="w-8 text-center font-light text-foreground font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300 transform hover:scale-110 cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex-shrink-0 text-right flex flex-col justify-between items-end">
                  <span className="text-xs font-light text-foreground/60 uppercase tracking-wide">
                    Subtotal
                  </span>
                  <p className="text-3xl font-light text-primary mt-4">
                    Rs. {((item.price ?? 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Main Summary Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-primary/5 to-primary/2 border border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-sm">
                <h2 className="text-2xl font-light text-foreground mb-8 text-balance">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-light text-foreground/70">Subtotal</span>
                    <span className="font-light text-foreground">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-light text-foreground/70">Shipping</span>
                    <span className="font-light text-foreground">
                      Rs. {shipping.toLocaleString()}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t border-primary/10">
                      <span className="font-light text-foreground/70">Savings</span>
                      <span className="font-light text-green-600">
                        -Rs. {savings.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-8 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30">
                  <span className="text-lg font-light text-foreground">Total</span>
                  <span className="text-3xl font-light text-primary">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-4 rounded-xl font-light text-center tracking-wide hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500"></div>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

               
              </div>

              {/* Trust Badge */}
              <div className="p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-primary/10 text-center">
                <p className="text-xs font-light text-foreground/70 leading-relaxed">
                  ✓ Secure Payment  •  ✓ Fast Delivery  •  ✓ Easy Returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
