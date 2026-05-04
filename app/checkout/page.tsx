'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/context/CartContext'
import { ArrowRight, Check, Lock, Truck } from 'lucide-react'

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = getCartTotal()
  const shipping = items.length > 0 ? 150 : 0
  const total = subtotal + shipping

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Shipping address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          shipping,
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      clearCart()
      router.push('/order-success')
    } catch (error) {
      console.error('Order submission error:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-secondary to-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-light text-foreground text-balance">Your cart is empty</h1>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary hover:shadow-2xl hover:shadow-primary/40 text-primary-foreground px-8 py-3 rounded-full font-light transition-all duration-300 ease-out transform hover:scale-105 cursor-pointer"
            >
              Return to Shop
              <ArrowRight className="w-4 h-4" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <p className="text-sm font-light text-primary flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Secure Checkout
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-foreground text-balance mb-4">
            Complete Your Order
          </h1>
          <p className="text-lg font-light text-foreground/60 max-w-2xl">
            Fill in your shipping details to proceed with your luxury skincare purchase.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information Card */}
              <div className="p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-primary/10 shadow-luxury transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-light text-foreground">
                    Shipping Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2 tracking-wide">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-2 transition-all duration-300 ${
                        errors.fullName 
                          ? 'border-destructive focus:border-destructive' 
                          : 'border-primary/20 focus:border-primary/60'
                      } text-foreground font-light focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-2 font-light">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2 tracking-wide">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-2 transition-all duration-300 ${
                        errors.email 
                          ? 'border-destructive focus:border-destructive' 
                          : 'border-primary/20 focus:border-primary/60'
                      } text-foreground font-light focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-2 font-light">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2 tracking-wide">
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-2 transition-all duration-300 ${
                        errors.phone 
                          ? 'border-destructive focus:border-destructive' 
                          : 'border-primary/20 focus:border-primary/60'
                      } text-foreground font-light focus:outline-none focus:ring-2 focus:ring-primary/20`}
                      placeholder="+92 XXX XXXXXXX"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-2 font-light">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-light text-foreground mb-2 tracking-wide">
                      Shipping Address <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-2 transition-all duration-300 ${
                        errors.address 
                          ? 'border-destructive focus:border-destructive' 
                          : 'border-primary/20 focus:border-primary/60'
                      } text-foreground font-light focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none`}
                      placeholder="Enter your full shipping address"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-2 font-light">{errors.address}</p>
                    )}
                  </div>

                  {/* City, Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light text-foreground mb-2 tracking-wide">
                        City <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-2 transition-all duration-300 ${
                          errors.city 
                            ? 'border-destructive focus:border-destructive' 
                            : 'border-primary/20 focus:border-primary/60'
                        } text-foreground font-light focus:outline-none focus:ring-2 focus:ring-primary/20`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-2 font-light">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-light text-foreground mb-2 tracking-wide">
                        Postal Code <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border-2 transition-all duration-300 ${
                          errors.postalCode 
                            ? 'border-destructive focus:border-destructive' 
                            : 'border-primary/20 focus:border-primary/60'
                        } text-foreground font-light focus:outline-none focus:ring-2 focus:ring-primary/20`}
                        placeholder="Postal Code"
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive mt-2 font-light">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-primary/10 shadow-luxury transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-light text-foreground">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Cash on Delivery - Only Option */}
                  <label className={`flex items-start p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                    formData === initialFormData 
                      ? 'border-primary/40 bg-gradient-to-r from-primary/10 to-transparent shadow-lg shadow-primary/20' 
                      : 'border-primary/30 bg-white/30'
                  }`}>
                    <div className="relative w-6 h-6 mt-1 flex-shrink-0">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={true}
                        readOnly
                        className="w-6 h-6 appearance-none border-2 border-primary rounded-full checked:bg-primary cursor-pointer"
                      />
                      <Check className="absolute w-4 h-4 text-white top-1 left-1" />
                    </div>
                    <div className="ml-5">
                      <p className="font-light text-foreground text-lg">Cash on Delivery (COD)</p>
                      <p className="text-sm font-light text-foreground/70 mt-2">
                        Pay securely when you receive your order at your doorstep. No hidden charges, full transparency.
                      </p>
                      <div className="flex gap-4 mt-4 text-xs font-light text-primary">
                        <span className="flex items-center gap-1">✓ Safe & Secure</span>
                        <span className="flex items-center gap-1">✓ Easy Returns</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {errors.submit && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-light">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-4 rounded-xl font-light tracking-wide text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500"></div>
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Your Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 text-center text-sm font-light text-foreground/60">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Secure & Encrypted
                </div>
                <div className="w-1 h-1 rounded-full bg-primary/30"></div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  Fast Delivery
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-8 rounded-3xl bg-gradient-to-b from-primary/5 to-primary/2 border border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-sm">
              <h2 className="text-2xl font-light text-foreground mb-8 text-balance">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-8 pb-8 border-b border-primary/20">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 group">
                    <div className="flex-grow">
                      <p className="font-light text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs font-light text-foreground/60 mt-1">
                        Qty: <span className="text-primary font-semibold">{item.quantity}</span>
                      </p>
                    </div>
                    <p className="font-light text-foreground whitespace-nowrap">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-8 pb-8 border-b border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-light text-foreground/70 text-sm">Subtotal</span>
                  <span className="font-light text-foreground">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-light text-foreground/70 text-sm">Shipping</span>
                  <span className="font-light text-foreground">
                    Rs. {shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                  <span className="font-light text-foreground">Discount</span>
                  <span className="font-light text-primary">-Rs. 0</span>
                </div>
              </div>

              {/* Total Price - Highlighted */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 mb-8">
                <p className="text-sm font-light text-foreground/70 mb-2">Total Amount</p>
                <p className="text-4xl font-light text-primary">
                  Rs. {total.toLocaleString()}
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-xs font-light text-foreground/70 text-center">
                  Your order will be confirmed after payment upon delivery.
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
