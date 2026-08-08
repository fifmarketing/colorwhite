import { Info, MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HighlightedText } from '@/components/highlighted-text'
import { TestimonialCard } from '@/components/testimonial-card'
import { getSettings, getTestimonials } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Customer Reviews | Color White Cosmetics',
  description:
    'Real WhatsApp messages and reviews from Color White Cosmetics customers across Pakistan.',
}

export default async function ReviewsPage() {
  const [testimonials, settings] = await Promise.all([getTestimonials(), getSettings()])
  const { reviewsPage, footer, whatsapp } = settings

  // Screenshot reviews lead, written reviews follow.
  const sorted = [...testimonials].sort(
    (a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image))
  )
  const screenshotCount = sorted.filter((t) => t.image).length

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-primary font-light tracking-widest uppercase text-sm">
              {reviewsPage.eyebrow}
            </p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground text-balance">
              <HighlightedText text={reviewsPage.title} />
            </h1>
            <p className="text-lg font-light text-foreground/70 max-w-2xl mx-auto text-balance">
              {reviewsPage.subtitle}
            </p>

            {screenshotCount > 0 && (
              <p className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-light text-foreground/70 shadow-luxury">
                <MessageCircle className="w-4 h-4 text-primary" aria-hidden="true" />
                {screenshotCount} WhatsApp {screenshotCount === 1 ? 'screenshot' : 'screenshots'}{' '}
                shared by customers
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {reviewsPage.note && (
            <p className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-5 text-sm font-light leading-relaxed text-foreground/70">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              {reviewsPage.note}
            </p>
          )}

          {sorted.length === 0 ? (
            <p className="text-center text-foreground/60 font-light">
              No reviews published yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {sorted.map((testimonial) => (
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
          )}

          {/* Share your own */}
          <div className="rounded-3xl bg-card p-8 sm:p-12 shadow-luxury text-center flex flex-col items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground text-balance">
              Used our products? We would love to hear from you.
            </h2>
            <p className="text-foreground/70 font-light max-w-xl text-balance">
              Send us your feedback or before and after photos on WhatsApp and we may feature it on
              this page.
            </p>
            <a
              href={`https://wa.me/${whatsapp.phoneNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-light tracking-wide hover:shadow-2xl transition-all duration-300 ease-out hover-lift cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Share your review on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer {...footer} />
    </main>
  )
}
