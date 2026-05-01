import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

const allProducts = [
  { id: 10, name: 'Soft & Glow Hand & Foot Beauty Cream', price: 899, image: '/hand-foot-cream.png', rating: 4.9 },
  { id: 11, name: 'Bright Complexion Cream with Serum', price: 2499, image: '/bright-cream-serum.png', rating: 4.9 },
  { id: 12, name: 'Beauty Cream & Bright Complexion Serum', price: 2799, image: '/beauty-cream-serum.png', rating: 5.0 },
  { id: 13, name: 'Bright Complexion Serum', price: 1599, image: '/bright-serum.png', rating: 4.9 },
  { id: 1, name: 'Radiant White Moisture Cream', price: 1999, image: '/beauty-cream.jpg', rating: 4.9 },
  { id: 2, name: 'Urgent Whitening Serum', price: 1499, image: '/serum.jpg', rating: 4.8 },
  { id: 3, name: 'Whitening Body Lotion Pack', price: 2299, image: '/lotion-pack.jpg', rating: 4.7 },
  { id: 4, name: 'Bright Complexion Face Wash', price: 1799, image: '/face-wash-pink.jpg', rating: 4.9 },
  { id: 5, name: 'Premium Bridal Pack', price: 1599, image: '/bridal-pack.jpg', rating: 4.8 },
  { id: 6, name: 'Natural Moisture Care Soap', price: 1299, image: '/soap-pack.jpg', rating: 4.7 },
  { id: 7, name: 'Beauty Cream & Face Wash', price: 1399, image: '/face-wash-cream.jpg', rating: 4.9 },
  { id: 8, name: 'Complete Skincare Set', price: 1699, image: '/product-display.jpg', rating: 4.8 },
  { id: 9, name: 'Beauty Soap Bar Set', price: 999, image: '/beauty-soap.jpg', rating: 4.7 },
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
