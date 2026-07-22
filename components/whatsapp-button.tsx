'use client'

import { ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function WhatsAppButton({
  phoneNumber = '+923404476857',
}: {
  phoneNumber?: string
}) {
  const pathname = usePathname()
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Hide the floating buttons inside the admin panel
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">

      {/* 🔼 Scroll Button */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 rounded-full bg-black border border-yellow-600 flex items-center justify-center transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-yellow-400" />
      </button>

      {/* 💬 WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 flex items-center justify-center rounded-full group transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        {/* Golden Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700"></div>

        {/* Glow */}
        <div className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-70 bg-yellow-400 transition duration-300"></div>

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 text-white relative z-10"
          fill="currentColor"
        >
          <path d="M12 2a10 10 0 00-8.94 14.47L2 22l5.72-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.13l-.3-.18-3.4.9.9-3.32-.2-.34A8 8 0 1112 20zm4.3-5.7c-.23-.12-1.36-.67-1.57-.74-.21-.08-.36-.12-.51.12s-.59.74-.72.9c-.13.16-.26.18-.49.06-.23-.12-.97-.36-1.85-1.14-.68-.6-1.14-1.34-1.27-1.57-.13-.23-.01-.35.1-.47.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.16.04-.3-.02-.42-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39h-.43c-.15 0-.39.06-.6.3-.21.23-.8.78-.8 1.9 0 1.12.82 2.2.93 2.36.11.16 1.6 2.44 3.88 3.42.54.23.96.36 1.29.46.54.17 1.03.15 1.42.09.43-.06 1.36-.55 1.55-1.08.19-.53.19-.98.13-1.08-.06-.1-.21-.16-.44-.28z"/>
        </svg>
      </a>
    </div>
  )
}
