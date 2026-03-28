import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-light tracking-widest">Color White Beauty</span>
            </div>
            <p className="text-sm font-light text-background/80">
              Premium skincare crafted for your most radiant self.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-light tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">Home</Link></li>
              <li><Link href="/about" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">About</Link></li>
              <li><Link href="/shop" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">Shop</Link></li>
              <li><Link href="/contact" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-light tracking-wide mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">Shipping Info</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">Returns</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">FAQ</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-light tracking-wide mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:hello@colorwhite.pk" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">
                  hello@colorwhite.pk
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+923001234567" className="text-background/80 hover:text-primary transition-all duration-300 ease-out">
                  +92 300 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-background/60 font-light">
              &copy; 2024 Color White Beauty. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-background/60 hover:text-primary transition-all duration-300 ease-out">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-all duration-300 ease-out">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-all duration-300 ease-out">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
