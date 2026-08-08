import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ChevronRight, Star, Check, Droplets, Leaf, Truck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { ProductGallery } from '@/components/product-gallery'
import { ProductPurchase } from '@/components/product-purchase'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { TestimonialCard } from '@/components/testimonial-card'
import {
  getProductBySlug,
  getRelatedProducts,
  getSettings,
  getTestimonialsForProduct,
} from '@/lib/data'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found | Color White Beauty' }
  return {
    title: `${product.name} | Color White Beauty`,
    description:
      product.shortDescription || `Shop ${product.name} from the Color White Beauty collection.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [settings, related, productReviews] = await Promise.all([
    getSettings(),
    getRelatedProducts(product, 3),
    getTestimonialsForProduct(product.slug),
  ])

  const galleryImages = Array.from(new Set([product.image, ...product.gallery])).filter(Boolean)
  const paragraphs = product.longDescription
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)
  const savings = product.originalPrice - product.price

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-secondary/20">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm font-light sm:px-6 lg:px-8">
          <Link href="/" className="text-foreground/60 transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-foreground/40" aria-hidden="true" />
          <Link href="/shop" className="text-foreground/60 transition-colors hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4 text-foreground/40" aria-hidden="true" />
          <span className="truncate text-foreground">{product.name}</span>
        </div>
      </nav>

      {/* Product overview */}
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery
              name={product.name}
              images={galleryImages}
              discount={product.discount}
            />

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                {product.category && (
                  <p className="text-xs font-light uppercase tracking-widest text-primary">
                    {product.category}
                  </p>
                )}
                <h1 className="text-3xl font-light tracking-tight text-foreground text-balance md:text-5xl">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="text-lg font-light leading-relaxed text-foreground/70 text-pretty">
                    {product.tagline}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-light text-foreground">{product.rating}</span>
                {product.reviews > 0 && (
                  <span className="text-sm font-light text-foreground/60">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-4xl font-light text-primary">
                  Rs. {product.price.toLocaleString()}
                </p>
                {product.originalPrice > product.price && (
                  <>
                    <p className="text-xl font-light text-foreground/50 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </p>
                    <p className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                      Save Rs. {savings.toLocaleString()}
                    </p>
                  </>
                )}
              </div>

              {product.shortDescription && (
                <p className="text-base font-light leading-relaxed text-foreground/80 text-pretty">
                  {product.shortDescription}
                </p>
              )}

              {/* Top benefits */}
              {product.benefits.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {product.benefits.slice(0, 4).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="font-light leading-relaxed text-foreground/80">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <ProductPurchase
                id={product.productId}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
              />

              {/* Spec strip */}
              <dl className="grid grid-cols-1 gap-3 rounded-3xl border border-border bg-card p-5 sm:grid-cols-3">
                {product.size && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50">
                      <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
                      Size
                    </dt>
                    <dd className="text-sm font-light text-foreground">{product.size}</dd>
                  </div>
                )}
                {product.skinType && (
                  <div className="flex flex-col gap-1">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50">
                      <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                      Skin Type
                    </dt>
                    <dd className="text-sm font-light text-foreground">{product.skinType}</dd>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50">
                    <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                    Delivery
                  </dt>
                  <dd className="text-sm font-light text-foreground">
                    Cash on delivery across Pakistan
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      {paragraphs.length > 0 && (
        <section className="border-y border-border bg-secondary/20 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-light tracking-tight text-foreground md:text-4xl">
              About This Product
            </h2>
            <div className="flex flex-col gap-5">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg font-light leading-relaxed text-foreground/80 text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {product.features.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-light uppercase tracking-widest text-primary">
                What Makes It Work
              </p>
              <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl text-balance">
                Key Features &amp; Ingredients
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {product.features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-7 hover-lift"
                >
                  <h3 className="text-xl font-light tracking-wide text-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-light leading-relaxed text-foreground/70 text-pretty">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits + How to use */}
      {(product.benefits.length > 0 || product.howToUse.length > 0) && (
        <section className="border-y border-border bg-secondary/20 py-16">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {product.benefits.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
                  Benefits
                </h2>
                <ul className="flex flex-col gap-4">
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      </span>
                      <span className="font-light leading-relaxed text-foreground/80 text-pretty">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.howToUse.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
                  How to Use
                </h2>
                <ol className="flex flex-col gap-4">
                  {product.howToUse.map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="font-light leading-relaxed text-foreground/80 text-pretty">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Ingredients */}
      {product.ingredients && (
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-5 text-3xl font-light tracking-tight text-foreground md:text-4xl">
              Full Ingredients
            </h2>
            <p className="rounded-3xl border border-border bg-card p-7 text-sm font-light leading-relaxed text-foreground/70">
              {product.ingredients}
            </p>
          </div>
        </section>
      )}

      {/* FAQs */}
      {product.faqs.length > 0 && (
        <section className="border-y border-border bg-secondary/20 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-light uppercase tracking-widest text-primary">
                Good to Know
              </p>
              <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl text-balance">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="flex flex-col gap-3">
              {product.faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${i}`}
                  className="rounded-3xl border border-border bg-card px-6 last:border-b"
                >
                  <AccordionTrigger className="text-left text-base font-light text-foreground hover:no-underline cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-light leading-relaxed text-foreground/70 text-pretty">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Customer reviews for this product */}
      {productReviews.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-light uppercase tracking-widest text-primary">
                Real Feedback
              </p>
              <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl text-balance">
                What Customers Say About {product.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
              {productReviews.map((review) => (
                <TestimonialCard
                  key={review._id}
                  name={review.name}
                  text={review.text}
                  rating={review.rating}
                  image={review.image}
                  city={review.city}
                  verified={review.verified}
                  dateLabel={review.dateLabel}
                  source={review.source}
                />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 text-sm font-light tracking-wide text-primary transition-all hover:gap-3 cursor-pointer"
              >
                See all customer reviews
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-light uppercase tracking-widest text-primary">
                Complete Your Routine
              </p>
              <h2 className="text-3xl font-light tracking-tight text-foreground md:text-4xl text-balance">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard
                  key={item._id}
                  id={item.productId}
                  slug={item.slug}
                  name={item.name}
                  category={item.category}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  image={item.image}
                  rating={item.rating}
                  reviews={item.reviews}
                  discount={item.discount}
                />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 rounded-full border border-primary/40 px-8 py-4 font-light tracking-wide text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer {...settings.footer} />
    </main>
  )
}
