import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { TestimonialCard } from '@/components/testimonial-card'
import { ArrowRight } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Radiant White Moisture Cream',
    price: 1999,
    image: '/images/cream-jar-1.jpg',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Luxury Face Serum',
    price: 1499,
    image: '/images/cream-jar-2.jpg',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Premium Night Treatment',
    price: 2299,
    image: '/images/cream-jar-3.jpg',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Brightening Day Cream',
    price: 1799,
    image: '/images/cream-jar-1.jpg',
    rating: 4.9,
  },
  {
    id: 5,
    name: 'Intensive Eye Contour',
    price: 1599,
    image: '/images/cream-jar-2.jpg',
    rating: 4.8,
  },
  {
    id: 6,
    name: 'Nourishing Body Lotion',
    price: 1299,
    image: '/images/cream-jar-3.jpg',
    rating: 4.7,
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

              <button className="bg-primary text-white px-10 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                Shop Now
              </button>

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
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-img-1536x1014-ZoR28h1lFA7WAMjnneCtf3bq8JUVu4.png"
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
            {products.slice(0, 6).map((product) => (
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
          <button className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-light tracking-wide hover:shadow-2xl transition-all duration-300 ease-out group hover-lift">
            Explore Full Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
