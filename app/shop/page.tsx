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

      {/* Newsletter */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Subscribe for Exclusive Offers
            </h2>
            <p className="text-lg font-light text-foreground/70">
              Join our community and receive 15% off your first order, plus insider tips and new product launches.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-card border border-border font-light outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-out"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-light tracking-wide hover:shadow-2xl transition-all duration-300 ease-out"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
