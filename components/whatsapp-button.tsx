'use client'

import { MessageCircle, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export function WhatsAppButton() {
  const phoneNumber = '+923404476857'
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 rounded-full bg-slate-900 border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group cursor-pointer relative overflow-hidden transform ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-600 to-slate-800 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        
        {/* Icon */}
        <ArrowUp className="w-5 h-5 text-slate-300 relative z-10 group-hover:text-white transition-colors duration-300 group-hover:scale-110 transform" />
      </button>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full cursor-pointer group relative overflow-hidden inline-flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Chat with us on WhatsApp"
      >
        {/* Outer glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Main button background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-full transition-all duration-300"></div>

        {/* Pulsing ring for hover state */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-100 animate-pulse"></div>
        
        {/* Icon */}
        <MessageCircle className="w-6 h-6 text-primary-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </a>
    </div>
  )
}
