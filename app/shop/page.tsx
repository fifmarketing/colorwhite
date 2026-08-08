import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { HighlightedText } from '@/components/highlighted-text'
import { getProducts, getSettings } from '@/lib/data'
import { deriveCategories } from '@/lib/categories'

export const dynamic = 'force-dynamic'

export default async function Shop() {
  const [allProducts, settings] = await Promise.all([getProducts(), getSettings()])
  const { shopPage, footer } = settings
  const categories = deriveCategories(allProducts)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              {shopPage.eyebrow}
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              <HighlightedText text={shopPage.title} />
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              {shopPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 0 && (
            <div className="flex flex-col gap-4 mb-12">
              <p className="text-sm font-light tracking-widest uppercase text-foreground/60">
                Shop by category
              </p>
              <ul className="flex flex-wrap gap-3">
                <li>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-light bg-primary text-primary-foreground">
                    All Products
                  </span>
                </li>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light bg-secondary text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      {category.name}
                      <span className="text-xs text-foreground/50">{category.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product) => (
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


      <Footer {...footer} />
    </main>
  )
}
