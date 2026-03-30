import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import Image from 'next/image'

const favoriteProducts = [
  { 
    id: 1, 
    name: 'Urgent Whitening Serum', 
    price: 1499, 
    originalPrice: 1799,
    image: '/serum.jpg', 
    rating: 4.95,
    reviews: 2156,
    discount: 17,
    category: 'ADVANCED SERUM TREATMENT'
  },
  { 
    id: 2, 
    name: 'Bright Complexion Beauty Face Wash', 
    price: 799, 
    originalPrice: 899,
    image: '/face-wash-pink.jpg', 
    rating: 4.95,
    reviews: 1892,
    discount: 11,
    category: 'GENTLE CLEANSING'
  },
  { 
    id: 3, 
    name: 'Natural Moisture Care Beauty Soap', 
    price: 1299, 
    originalPrice: 1499,
    image: '/soap-pack.jpg', 
    rating: 4.92,
    reviews: 3421,
    discount: 13,
    category: 'LUXURIOUS SOAP SET'
  },
  { 
    id: 4, 
    name: 'Bright Complexion Beauty Cream', 
    price: 1599, 
    originalPrice: 1899,
    image: '/beauty-cream.jpg', 
    rating: 4.9,
    reviews: 2534,
    discount: 16,
    category: 'PREMIUM CREAM TREATMENT'
  },
  { 
    id: 5, 
    name: 'Whitening Body Lotion Pack', 
    price: 2070, 
    originalPrice: 2300,
    image: '/lotion-pack.jpg', 
    rating: 4.88,
    reviews: 1745,
    discount: 10,
    category: 'COMPLETE BODY CARE'
  },
  { 
    id: 6, 
    name: 'Premium Bridal Pack', 
    price: 1599, 
    originalPrice: 1899,
    image: '/bridal-pack.jpg', 
    rating: 4.87,
    reviews: 892,
    discount: 16,
    category: 'SPECIAL COLLECTION'
  },
]

export default function Favorites() {
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
              Best Sellers & <span className="gradient-gold">Trending</span> Products
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              Discover the most loved Color White Beauty products trusted by thousands of satisfied customers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-12 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-light text-foreground">Top Customer Choice</h2>
              <p className="text-lg font-light text-foreground/70">
                Our most-loved Urgent Whitening Serum delivers visible results in just days. Formulated with natural ingredients and advanced brightening technology.
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span> Fast-acting whitening formula
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span> Natural ingredients
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary">✓</span> Dermatologist tested
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-xs h-80">
                <Image
                  src="/serum.jpg"
                  alt="Urgent Whitening Serum - Top Choice"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <ProductCard key={product.id} {...product} />
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
                <span className="text-2xl text-primary">✨</span>
              </div>
              <h3 className="text-xl font-light text-foreground">Premium Quality</h3>
              <p className="text-foreground/70">Luxury skincare products formulated with natural ingredients and advanced technology.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-primary">🎯</span>
              </div>
              <h3 className="text-xl font-light text-foreground">Proven Results</h3>
              <p className="text-foreground/70">Thousands of satisfied customers report visible results within weeks of use.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-primary">💯</span>
              </div>
              <h3 className="text-xl font-light text-foreground">Customer Trusted</h3>
              <p className="text-foreground/70">4.8+ average rating with thousands of verified reviews from real customers.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
