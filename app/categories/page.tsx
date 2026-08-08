import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HighlightedText } from '@/components/highlighted-text'
import { getSettings } from '@/lib/data'
import { getCategories } from '@/lib/categories'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()])
  const { categoriesPage, footer } = settings

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              {categoriesPage.eyebrow}
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              <HighlightedText text={categoriesPage.title} />
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              {categoriesPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length === 0 ? (
            <p className="text-center text-foreground/60 font-light">
              No categories yet. Add a category label to your products to see them here.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-3xl aspect-square bg-gradient-to-br from-secondary to-primary/5 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                    <Image
                      src={category.image || '/placeholder.svg'}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex items-start justify-between gap-4 mt-6">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-xl font-light tracking-wide text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-sm font-light text-foreground/60">
                        {category.count} {category.count === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary mt-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer {...footer} />
    </main>
  )
}
