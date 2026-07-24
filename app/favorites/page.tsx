import Image from 'next/image'
import Link from 'next/link'
import { Check, Sparkles, Target, BadgeCheck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { getProducts, getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Favorites() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()])

  // Best sellers = the products our customers review the most.
  const favoriteProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 6)
  const topChoice = favoriteProducts[0]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              Customer Favorites
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              Best Sellers &amp; <span className="gradient-gold">Trending</span> Products
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              Discover the most loved Color White Beauty products trusted by thousands of satisfied
              customers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      {topChoice && (
        <section className="py-12 bg-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-primary font-light tracking-widest uppercase text-sm">
                  Top Customer Choice
                </p>
                <h2 className="text-3xl md:text-4xl font-light text-foreground text-balance">
                  {topChoice.name}
                </h2>
                <p className="text-lg font-light text-foreground/70 text-pretty">
                  {topChoice.shortDescription || topChoice.tagline}
                </p>
                <ul className="space-y-2 text-foreground/80">
                  {topChoice.benefits.slice(0, 3).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="font-light">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/product/${topChoice.slug}`}
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-light tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                >
                  View Product Details
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-xs h-80">
                  <Image
                    src={topChoice.image || '/placeholder.svg'}
                    alt={`${topChoice.name} - top customer choice`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Favorites Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4 text-balance">
              Customer Favorites
            </h2>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto">
              Handpicked best sellers that have earned 4.8+ star ratings from our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product.productId}
                slug={product.slug}
                name={product.name}
                category={product.category}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                discount={product.discount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why They're Favorites */}
      <section className="py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4 text-balance">
              Why Choose Color White
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-light text-foreground">Premium Quality</h3>
              <p className="text-foreground/70 font-light">
                Luxury skincare products formulated with natural ingredients and advanced
                technology.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-light text-foreground">Proven Results</h3>
              <p className="text-foreground/70 font-light">
                Thousands of satisfied customers report visible results within weeks of use.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BadgeCheck className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-light text-foreground">Customer Trusted</h3>
              <p className="text-foreground/70 font-light">
                4.8+ average rating with thousands of verified reviews from real customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer {...settings.footer} />
    </main>
  )
}
