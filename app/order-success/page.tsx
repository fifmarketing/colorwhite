'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowRight, CheckCircle, Truck, Gift, Phone } from 'lucide-react'

export default function OrderSuccessPage() {
  const orderNumber = Math.floor(100000 + Math.random() * 900000)
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-background to-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Success Animation */}
        <div className="text-center mb-16 space-y-8">
          {/* Animated Checkmark */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 animate-pulse">
                <div className="w-full h-full rounded-full bg-green-400/30"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-light text-foreground text-balance">
              Order Confirmed!
            </h1>
            <p className="text-xl font-light text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Thank you for your purchase! Your luxury skincare order has been successfully placed and is being prepared for delivery.
            </p>
          </div>

          {/* Order Number */}
          <div className="inline-block p-6 rounded-2xl bg-gradient-to-r from-green-100 to-green-50 border border-green-200">
            <p className="text-sm font-light text-green-700 mb-2">Order Number</p>
            <p className="text-3xl font-light text-green-600 font-semibold tracking-wider">
              #{orderNumber}
            </p>
          </div>
        </div>

        {/* Order Details Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Delivery Card */}
          <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-light text-foreground">Estimated Delivery</h3>
            </div>
            <p className="text-2xl font-light text-primary">
              {estimatedDelivery}
            </p>
            <p className="text-sm font-light text-foreground/60 mt-2">
              Your order will be delivered to your address
            </p>
          </div>

          {/* Payment Card */}
          <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-light text-foreground">Payment Method</h3>
            </div>
            <p className="text-2xl font-light text-primary">
              Cash on Delivery
            </p>
            <p className="text-sm font-light text-foreground/60 mt-2">
              Pay when you receive your order
            </p>
          </div>

          {/* Support Card */}
          <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-light text-foreground">Need Help?</h3>
            </div>
            <p className="text-2xl font-light text-primary">
              24/7 Support
            </p>
            <p className="text-sm font-light text-foreground/60 mt-2">
              Contact us anytime with questions
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-xl">
          <h2 className="text-2xl font-light text-foreground mb-6">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-light">
                1
              </div>
              <div>
                <p className="font-light text-foreground">
                  <span className="font-semibold">Confirmation Email</span> - You&apos;ll receive an order confirmation with all details
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-light">
                2
              </div>
              <div>
                <p className="font-light text-foreground">
                  <span className="font-semibold">Order Processing</span> - We&apos;ll carefully prepare your luxury skincare items
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-light">
                3
              </div>
              <div>
                <p className="font-light text-foreground">
                  <span className="font-semibold">Shipment Dispatch</span> - Your package will be dispatched with tracking information
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-light">
                4
              </div>
              <div>
                <p className="font-light text-foreground">
                  <span className="font-semibold">Delivery</span> - Receive your order and pay upon delivery with full satisfaction guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl font-semibold tracking-wider text-lg bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="relative">Continue Shopping</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl font-semibold tracking-wider text-lg bg-white/60 backdrop-blur-md text-foreground border-2 border-primary/40 hover:border-primary/70 hover:bg-white/90 hover:shadow-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95"
          >
            Return to Home
          </Link>
        </div>

        {/* Info Banner */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-center">
          <p className="text-sm font-light text-blue-900 leading-relaxed">
            A confirmation email has been sent to your email address with your order details and tracking information. Please check your inbox and spam folder.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
