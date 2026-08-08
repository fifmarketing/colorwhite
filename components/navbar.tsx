'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import useSWR from 'swr'
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { TopBar } from '@/components/top-bar'

interface NavCategory {
  slug: string
  name: string
  count: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const { getItemCount } = useCart()
  const itemCount = getItemCount()
  const { data } = useSWR('/api/categories', fetcher, { revalidateOnFocus: false })
  const categories: NavCategory[] = Array.isArray(data?.categories) ? data.categories : []

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <TopBar />

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-luxury-sm">
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
              <div key={link.href} className="flex items-center gap-8">
                <Link
                  href={link.href}
                  className="text-sm font-light tracking-wide text-foreground hover:text-primary transition-all duration-300 ease-out relative group cursor-pointer"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* Categories dropdown sits right after Shop */}
                {link.href === '/shop' && categories.length > 0 && (
                  <div
                    className="relative"
                    onMouseEnter={() => setCategoriesOpen(true)}
                    onMouseLeave={() => setCategoriesOpen(false)}
                  >
                    <Link
                      href="/categories"
                      className="flex items-center gap-1 text-sm font-light tracking-wide text-foreground hover:text-primary transition-colors cursor-pointer"
                      aria-expanded={categoriesOpen}
                    >
                      Categories
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    {categoriesOpen && (
                      <div className="absolute left-0 top-full pt-4 w-64 animate-in fade-in slide-in-from-top-1">
                        <ul className="bg-background border border-border rounded-xl shadow-luxury-sm py-2">
                          {categories.map((category) => (
                            <li key={category.slug}>
                              <Link
                                href={`/category/${category.slug}`}
                                className="flex items-center justify-between gap-3 px-4 py-2 text-sm font-light text-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
                                onClick={() => setCategoriesOpen(false)}
                              >
                                <span className="truncate">{category.name}</span>
                                <span className="text-xs text-foreground/50">{category.count}</span>
                              </Link>
                            </li>
                          ))}
                          <li className="border-t border-border mt-2 pt-2">
                            <Link
                              href="/categories"
                              className="block px-4 py-2 text-sm font-light text-primary hover:bg-secondary transition-colors cursor-pointer"
                              onClick={() => setCategoriesOpen(false)}
                            >
                              View all categories
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
        
            
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
          <div className="md:hidden pb-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
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

            {categories.length > 0 && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  aria-expanded={categoriesOpen}
                  className="flex items-center justify-between px-4 py-2 text-sm font-light text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                >
                  Categories
                  <ChevronDown
                    className={
                      categoriesOpen ? 'w-4 h-4 rotate-180 transition-transform' : 'w-4 h-4 transition-transform'
                    }
                    aria-hidden="true"
                  />
                </button>
                {categoriesOpen && (
                  <ul className="flex flex-col gap-1 pl-4 border-l border-border ml-4">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2 text-sm font-light text-foreground/80 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                          onClick={() => {
                            setIsOpen(false)
                            setCategoriesOpen(false)
                          }}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/categories"
                        className="block px-4 py-2 text-sm font-light text-primary hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          setIsOpen(false)
                          setCategoriesOpen(false)
                        }}
                      >
                        View all categories
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
    </>
  )
}
