'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingCart, Mail, Facebook, Instagram, Twitter } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  // ✅ Auto hide banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setBannerVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Shipping Promo Banner */}
      {bannerVisible && (
        <div className="sticky top-0 z-40 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-3">
              <div className="text-sm font-light tracking-wide text-center">
                Free Shipping on orders above Rs. 2000 –{' '}
                <Link href="/shop" className="font-semibold hover:underline cursor-pointer">
                  Shop Now!
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-luxury-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer hover:text-primary transition-colors">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/colorwhite-logo-4cppKifpTCGggDWzJxy2cgkR3MJiY6.png"
                  alt="Color White Beauty Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  loading="eager"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-light tracking-wide text-foreground hover:text-primary transition-all duration-300 ease-out relative group cursor-pointer"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              
              {/* Cart */}
              <Link href="/cart" className="p-2 hover:bg-secondary rounded-full transition-all duration-300 ease-out relative group cursor-pointer">
                <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-secondary rounded-full transition-all duration-300 ease-out cursor-pointer"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-light text-foreground hover:bg-secondary rounded-lg transition-all duration-300 ease-out cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}