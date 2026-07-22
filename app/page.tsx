import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { TestimonialCard } from '@/components/testimonial-card'
import { PromoBanner } from '@/components/promo-banner'
import { ArrowRight } from 'lucide-react'
import { getProducts, getTestimonials, getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [products, testimonials, settings] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getSettings(),
  ])

  const featuredProducts = products.filter((p) => p.featured)
  const { hero, homeSections, promoBanner, footer } = settings

  return (
    <main className="min-h-screen bg-background">
      <PromoBanner {...promoBanner} />
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
                  {hero.title}
                </h1>
                <p className="text-lg font-light text-foreground/80 leading-relaxed max-w-md">
                  {hero.description}
                </p>
              </div>

              <a href={hero.buttonLink} className="inline-block bg-primary text-white px-10 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer">
                {hero.buttonText}
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
                  src={hero.image || '/hero-img.jpg'}
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
              {homeSections.featuredEyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4 text-balance">
              {homeSections.featuredTitle}
            </h2>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              {homeSections.featuredSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product.productId}
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

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-light tracking-widest uppercase text-sm mb-4">
              {homeSections.testimonialsEyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4 text-balance">
              {homeSections.testimonialsTitle}
            </h2>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              {homeSections.testimonialsSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                name={testimonial.name}
                text={testimonial.text}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground text-balance">
            {homeSections.ctaTitle}
          </h2>
          <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto">
            {homeSections.ctaSubtitle}
          </p>
          <a href={homeSections.ctaButtonLink} className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-light tracking-wide hover:shadow-2xl transition-all duration-300 ease-out group hover-lift cursor-pointer">
            {homeSections.ctaButtonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      <Footer {...footer} />
    </main>
  )
}
