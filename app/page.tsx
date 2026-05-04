import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { TestimonialCard } from '@/components/testimonial-card'
import { PromoBanner } from '@/components/promo-banner'
import { ArrowRight } from 'lucide-react'

const products = [
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

const testimonials = [
  {
    name: 'Ayesha Khan',
    text: 'This cream transformed my skin completely. After just two weeks, my complexion looks brighter and my skin feels incredibly soft and hydrated.',
    rating: 5,
  },
  {
    name: 'Fatima Ahmed',
    text: 'I love how lightweight yet effective this product is. The luxurious feel and amazing results make it worth every penny.',
    rating: 5,
  },
  {
    name: 'Maria Malik',
    text: 'Best skincare investment I&apos;ve made. The quality is premium, and you can feel the difference in your skin immediately.',
    rating: 5,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <PromoBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        {/* Subtle background gradient with yellow tones */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 order-1">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
Color White Beauty Cream                </h1>
                <p className="text-lg font-light text-foreground/80 leading-relaxed max-w-md">
                 Color White Beauty Cream is a skin brightening cream that helps to reduce dark spots and uneven skin tone. Infused with natural avocado and milk, it nourishes and moisturizes the skin for a radiant complexion.
                </p>
              </div>

              <a href="/shop" className="inline-block bg-primary text-white px-10 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer">
                Shop Now
              </a>

              {/* Floating animation effect */}
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                }
              `}</style>
            </div>

            {/* Right: Product Image */}
            <div className="order-2 flex justify-center">
              <div className="relative w-full max-w-md h-96">
                <Image
                  src="/hero-img.jpg"
                  alt="Color White Beauty Cream - Product and Woman"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-light tracking-widest uppercase text-sm mb-4">
              Our Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4 text-balance">
              Featured Products
            </h2>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              Carefully curated skincare solutions designed to transform your routine and elevate your natural beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-light tracking-widest uppercase text-sm mb-4">
              Loved by thousands
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4 text-balance">
              Customer Reviews
            </h2>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              See what our customers are saying about their experience with Color White Beauty.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground text-balance">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the luxury of premium skincare.
          </p>
          <a href="/shop" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-light tracking-wide hover:shadow-2xl transition-all duration-300 ease-out group hover-lift cursor-pointer">
            Explore Full Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
