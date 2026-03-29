'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const phoneNumber = '+923296512101'
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat with us on WhatsApp"
    >
      {/* Button */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 cursor-pointer relative">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 animate-pulse"></div>
        
        {/* Icon */}
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-xs sm:text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        Message us on WhatsApp
      </div>
    </a>
  )
}
