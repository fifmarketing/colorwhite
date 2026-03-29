import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

const allProducts = [
  { id: 1, name: 'Radiant White Moisture Cream', price: 1999, image: '/images/cream-jar-1.jpg', rating: 4.9 },
  { id: 2, name: 'Luxury Face Serum', price: 1499, image: '/images/cream-jar-2.jpg', rating: 4.8 },
  { id: 3, name: 'Premium Night Treatment', price: 2299, image: '/images/cream-jar-3.jpg', rating: 4.7 },
  { id: 4, name: 'Brightening Day Cream', price: 1799, image: '/images/cream-jar-1.jpg', rating: 4.9 },
  { id: 5, name: 'Intensive Eye Contour', price: 1599, image: '/images/cream-jar-2.jpg', rating: 4.8 },
  { id: 6, name: 'Nourishing Body Lotion', price: 1299, image: '/images/cream-jar-3.jpg', rating: 4.7 },
  { id: 7, name: 'Hydrating Face Mask', price: 1399, image: '/images/cream-jar-1.jpg', rating: 4.9 },
  { id: 8, name: 'Anti-Aging Neck Cream', price: 1699, image: '/images/cream-jar-2.jpg', rating: 4.8 },
  { id: 9, name: 'Brightening Cleanser', price: 999, image: '/images/cream-jar-3.jpg', rating: 4.7 },
]

export default function Shop() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              Discover
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              Our <span className="gradient-gold">Complete</span> Collection
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              Explore our full range of premium skincare products, each crafted to deliver visible results.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </main>
  )
}
