import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { getSettings } from '@/lib/data'
import { getCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/categories'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found | Color White Beauty' }
  return {
    title: `${category.name} | Color White Beauty`,
    description: `Shop ${category.name} products from Color White Cosmetics with Cash on Delivery across Pakistan.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, products, categories, settings] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
    getCategories(),
    getSettings(),
  ])

  if (!category) notFound()

  const { footer } = settings

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-light mb-6">
            <Link href="/" className="text-primary hover:underline cursor-pointer">
              Home
            </Link>
            <span className="text-foreground/40">/</span>
            <Link href="/categories" className="text-primary hover:underline cursor-pointer">
              Categories
            </Link>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground/70">{category.name}</span>
          </nav>
          <div className="space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">Category</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground text-balance">
              {category.name}
            </h1>
            <p className="text-lg font-light text-foreground/70">
              {category.count} {category.count === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>
      </section>

      {/* Other categories */}
      {categories.length > 1 && (
        <section className="pt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-wrap gap-3">
              {categories.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/category/${item.slug}`}
                    aria-current={item.slug === slug ? 'page' : undefined}
                    className={
                      item.slug === slug
                        ? 'inline-flex items-center px-4 py-2 rounded-full text-sm font-light bg-primary text-primary-foreground cursor-pointer'
                        : 'inline-flex items-center px-4 py-2 rounded-full text-sm font-light bg-secondary text-foreground hover:bg-primary/10 transition-colors cursor-pointer'
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <p className="text-center text-foreground/60 font-light">
              No products in this category yet.{' '}
              <Link href="/shop" className="text-primary hover:underline cursor-pointer">
                Browse all products
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
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
          )}
        </div>
      </section>

      <Footer {...footer} />
    </main>
  )
}
