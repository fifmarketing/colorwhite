import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { HeroSlider } from '@/components/hero-slider'
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
  const { heroSlides, homeSections, promoBanner, footer } = settings

  return (
    <main className="min-h-screen bg-background">
      <PromoBanner {...promoBanner} />
      <Navbar />

      {/* Hero Slider */}
      <HeroSlider slides={heroSlides.slides} autoplaySeconds={heroSlides.autoplaySeconds} />

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
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 mt-6 text-sm font-light tracking-wide text-primary hover:gap-3 transition-all cursor-pointer"
            >
              View all reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                name={testimonial.name}
                text={testimonial.text}
                rating={testimonial.rating}
                image={testimonial.image}
                city={testimonial.city}
                verified={testimonial.verified}
                dateLabel={testimonial.dateLabel}
                source={testimonial.source}
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
