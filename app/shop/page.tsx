import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

const allProducts = [
  {
    id: 7,
    name: 'Soft & Glow Hand & Foot Beauty Cream',
    category: 'HAND & FOOT CARE',
    price: 899,
    originalPrice: 1099,
    image: '/clour.jpg',
    rating: 4.9,
    reviews: 1245,
    discount: 18,
  },
  {
    id: 9,
    name: 'Beauty Cream & Bright Complexion Serum',
    category: '5-DAY CHALLENGE PACK',
    price: 2799,
    originalPrice: 3299,
    image: '/com.png',
    rating: 4.95,
    reviews: 3120,
    discount: 15,
  },
  {
    id: 10,
    name: 'Bright Complexion Serum',
    category: 'VITAMIN C & PEARL EXTRACT',
    price: 1599,
    originalPrice: 1899,
    image: '/foutrh.jpg',
    rating: 4.91,
    reviews: 1876,
    discount: 16,
  },
  {
    id: 8,
    name: 'Bright Complexion Cream with Serum',
    category: 'COMPLEXION DUO SET',
    price: 2499,
    originalPrice: 2899,
    image: '/bri.png',
    rating: 4.93,
    reviews: 2087,
    discount: 14,
  },
  {
    id: 89,
    name: 'Bright Complexion Face Wash',
    category: 'COMPLEXION DUO SET',
    price: 2499,
    originalPrice: 2899,
    image: '/face-wash-product.jpg',
    rating: 4.93,
    reviews: 2087,
    discount: 14,
  },
  {
    id: 1,
    name: 'Whitening Body Lotion Pack',
    category: 'COMPLETE BODY CARE',
    price: 2070,
    originalPrice: 2300,
    image: '/fifth.png',
    rating: 4.95,
    reviews: 1434,
    discount: 10,
  },
  {
    id: 2,
    name: 'Urgent Whitening Serum',
    category: 'ADVANCED SERUM TREATMENT',
    price: 1499,
    originalPrice: 1699,
    image: '/comsix.png',
    rating: 4.95,
    reviews: 9243,
    discount: 12,
  },
  {
    id: 3,
    name: 'Bright Complexion Beauty Face Wash',
    category: 'GENTLE CLEANSING',
    price: 799,
    originalPrice: 899,
    image: '/face-wash-pink.jpg',
    rating: 4.95,
    reviews: 6665,
    discount: 11,
  },
  {
    id: 4,
    name: 'Natural Moisture Care Beauty Soap',
    category: 'LUXURIOUS SOAP SET',
    price: 1299,
    originalPrice: 1499,
    image: '/soap-pack.jpg',
    rating: 4.88,
    reviews: 3421,
    discount: 13,
  },
  {
    id: 5,
    name: 'Beauty Cream & Face Wash Combo',
    category: 'COMPLETE SKINCARE SET',
    price: 1899,
    originalPrice: 2199,
    image: '/face-wash-cream.jpg',
    rating: 4.92,
    reviews: 2156,
    discount: 14,
  },
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
